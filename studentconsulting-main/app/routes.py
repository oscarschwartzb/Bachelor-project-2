from flask import jsonify, request, render_template, url_for
from werkzeug.exceptions import abort
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token

import stripe
import os
import time

from app import app
from app.database import (
    User,
    Company,
    Listingorder,
    Joblisting,
    Period,
    Location,
    bcrypt,
    Student,
    db,
    Resume,
)

YOUR_DOMAIN = "http://localhost:5000"
stripe.api_key = "sk_test_51IfhsnIyy0hEGyMVuSVpG7skqR7QUv0vLcE3Yq9fZ1CnrpHVFd7RC2LmNTfHf9I2laBnVFkj91hjasAcF1DemgDO00vKUDz9Qn"


# Skapar en checkout-session som används vid betalning
@app.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    try:
        info = request.get_json()
        user_id = info["user_id"]
        jobtopay = (
            Listingorder.query.filter(Listingorder.companyid == user_id)
            .order_by(Listingorder.id.desc())
            .first()
            .id
        )
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price": "price_1Ij1bSIyy0hEGyMVpZqbMrdi",
                    "quantity": 1,
                    "tax_rates": ["txr_1Ij1PUIyy0hEGyMVeT1JLsMc"],
                }
            ],
            metadata={"jobtopay": jobtopay, "user_id": user_id},
            mode="payment",
            success_url=url_for("success", _external=True)
            + "?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=YOUR_DOMAIN + "/",
        )
        return jsonify({"id": checkout_session.id})
    except Exception as e:
        return jsonify(error=str(e)), 403


# Route om betalning går igenom
@app.route("/success", methods=["GET"])
def success():
    return render_template("success.html")


# Route om betalning misslyckas
@app.route("/cancelled", methods=["GET"])
def cancelled():
    return render_template("cancelled.html")


# Webhook för att kunna avgöra om användaren betalat eller ej
@app.route("/stripe_webhook", methods=["POST", "DELETE"])
def stripe_webhook():
    print("WEBHOOK CALLED")

    if request.content_length > 1024 * 1024:
        print("REQUEST TOO BIG")
        abort(400)
    payload = request.get_data()
    sig_header = request.environ.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = "whsec_y8TAwNJ8UYBcZIDPSZ4hDCKbvecMBp2n"
    event = None

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError as e:
        # Invalid payload
        print("INVALID PAYLOAD")
        for order in Listingorder.query.all():
            db.session.delete(order)
        db.session.commit()
        return {}, 400
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        print("INVALID SIGNATURE")
        for order in Listingorder.query.all():
            db.session.delete(order)
        db.session.commit()
        return {}, 400

    # Hanterar checkout.session.completed eventet och lägger till jobbannons till databasen
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        jobtopay = session.metadata.jobtopay
        pricetopay = (int(session.amount_total)) // 100
        jobinfo = Listingorder.query.get(jobtopay)
        data = jobinfo.serialize()
        job = Joblisting(
            companyid=session.metadata.user_id,
            title=data["title"],
            description=data["description"],
            transactionid=session.payment_intent,
            price=pricetopay,
        )
        if "location" in data:
            locationname = data["location"]
            if Location.query.filter(Location.name == locationname).first():
                locationid = (
                    Location.query.filter(Location.name == locationname).first().id
                )
                job.locationid = locationid
            else:
                location = Location(name=locationname)
                db.session.add(location)
                locationid = (
                    Location.query.filter(Location.name == locationname).first().id
                )
                job.locationid = locationid
        if "periods" in data:
            for period in data["periods"]:
                if Period.query.filter(Period.periodname == period).first():
                    old_period = Period.query.filter(
                        Period.periodname == period
                    ).first()
                    job.hasperiods.append(old_period)
                else:
                    new_period = Period(periodname=period)
                    job.hasperiods.append(new_period)
        db.session.add(job)
        for order in Listingorder.query.all():
            db.session.delete(order)
        db.session.commit()
    return {}


# Skickar med antal studenter och jobb i databasen
@app.route("/", methods=["GET"])
def home():
    numberofjobs = db.session.query(Joblisting.id).count()
    numberofstudents = db.session.query(Student.id).count()
    return render_template(
        "index.html", numberofjobs=numberofjobs, numberofstudents=numberofstudents
    )


# Hämta alla jobb för alla företag
@app.route("/jobpage", methods=["GET"])  # Används för att få fram jobbsidan
def jobpage():
    if request.method == "GET":
        if not Joblisting:
            return jsonify("No joblistings available!")
        jobs = []
        for job in Joblisting.query.filter(Joblisting.isactive):
            jobs.append(job.serialize())
        return jsonify(jobs), 200


# Presenterar ett specifikt jobb med relevant information
@app.route("/jobpage/<int:job_id>", methods=["GET"])
def jobpage_job_id(job_id):
    if request.method == "GET":
        job = Joblisting.query.get(job_id)
        companyid = job.companyid
        company = Company.query.get(companyid)
        student_list = job.hasstudents
        students = []
        if student_list:
            for student in job.hasstudents:
                students.append(student.serialize())
        return jsonify(
            dict(company=company.serialize(), job=job.serialize(), student=students)
        )


# Ändrar statusen på ett aktivt jobb till false och tar bort annonsen från tillgängliga uppdrag
@app.route("/jobpage/<int:job_id>/changestatus", methods=["PUT"])
def changestatus(job_id):
    if request.method == "PUT":
        job = Joblisting.query.get(job_id)
        job.isactive = False
        db.session.commit()
    return jsonify(dict(success=True)), 200


# Logga in som student eller företag
@app.route("/login", methods=["POST"])
def login_company():
    if request.method == "POST":
        data = dict(request.get_json(force=True))
        email = data["email"]
        password = data["password"]
        user = Student.query.filter(Student.email == email).first()
        # Följande if-satser kollar om användaren är student eller företag
        if user is not None:
            user_type = "student"
        else:
            user = Company.query.filter(Company.email == email).first()
            if user is not None:
                user_type = "company"
            else:
                return jsonify(msg="Epost-adressen finns inte"), 401

        if bcrypt.check_password_hash(user.hashed_password, password):
            access_token = create_access_token(identity=email)
            if user_type == "student":
                user = Student.serialize(user)
            else:
                user = Company.serialize(user)
            return jsonify(token=access_token, data=user, user_type=user_type), 200
    return jsonify(msg="Felaktigt lösenord"), 401


# Registrerar ett ny student
@app.route("/signup/student", methods=["POST"])
def signup_student():
    if request.method == "POST":  # Skapar en ny student-användare
        data = request.get_json(force=True)
        if User.query.filter(data["email"] == User.email).first():
            return jsonify(msg="Denna epost-adress är redan registrerad"), 401
        else:
            student = Student(
                email=data["email"],
                firstname=data["firstname"],
                lastname=data["lastname"],
                education=data["education"],
            )
        student.set_password(data["password"])
        if "location" in data:
            locationname = data["location"]
            # Location finns sparat i location-tabellen
            if Location.query.filter(Location.name == locationname).first():
                locationid = (
                    Location.query.filter(Location.name == locationname).first().id
                )
                student.locationid = locationid
            else:
                # Location finns inte sparat i location-tabellen
                location = Location(name=locationname)
                db.session.add(location)
                # Kopierade nedanstående två rader föra att få in id om location inte finns
                locationid = (
                    Location.query.filter(Location.name == locationname).first().id
                )
                student.locationid = locationid
        db.session.add(student)
        db.session.commit()
        return jsonify(student.serialize()), 200
    abort(404)


# Registrerar ett nytt företag
@app.route("/signup/company", methods=["POST"])  # Registrera sig som företag
def signup_company():

    if request.method == "POST":  # Skapar en ny företags-användare
        data = request.get_json(force=True)
        if User.query.filter(data["email"] == User.email).first():
            return jsonify(msg="Denna epost-adress är redan registrerad"), 401
        else:
            company = Company(
                email=data["email"],
                companyname=data["companyname"],
                contactfirstname=data["contactfirstname"],
                contactlastname=data["contactlastname"],
            )
        company.set_password(data["password"])
        if "location" in data:
            locationname = data["location"]
            # Location finns sparat i location-tabellen
            if Location.query.filter(Location.name == locationname).first():
                locationid = (
                    Location.query.filter(Location.name == locationname).first().id
                )
                company.locationid = locationid
            else:
                # Location finns inte sparat i location-tabellen
                location = Location(name=locationname)
                db.session.add(location)
                # Kopierade nedanstående två rader föra att få in id om location inte finns
                locationid = (
                    Location.query.filter(Location.name == locationname).first().id
                )
                company.locationid = locationid
        db.session.add(company)
        db.session.commit()
        return jsonify(company.serialize()), 200
    abort(404)


# Hanterar ett specifikt företags information
@app.route("/company/<int:company_id>", methods=["GET", "PUT", "DELETE", "POST"])
def company_company_id(company_id):
    if request.method == "GET":  # Hämta rätt företagsprofil baserat på company_id
        company = Company.query.get(company_id)
        return jsonify(company.serialize()), 200
    elif request.method == "POST":
        data = dict(request.get_json(force=True))
        job = Listingorder(
            companyid=company_id, title=data["title"], description=data["description"]
        )
        if "location" in data:
            locationname = data["location"]
            job.locationname = locationname

        if "periods" in data:
            job.hasperiods = []
            for period in data["periods"]:
                job.hasperiods.append(period)
        db.session.add(job)
        db.session.commit()
        return jsonify(job.serialize(), 200)
    elif request.method == "PUT":  # Redigera uppgifter om befintligt företag
        data = request.get_json(force=True)
        company = Company.query.get(company_id)
        new_email = data["email"]
        company.companyname = data["companyname"]
        locationname = data["location"]

        # Nedanstående kollar om den nya eposten redan är registrerad
        if company.email != new_email:
            if User.query.filter(new_email == User.email).first():
                return jsonify(msg="Denna epost-adress är redan registrerad"), 401
            else:
                company.email = new_email

        if Location.query.filter(Location.name == locationname).first():
            locationid = Location.query.filter(Location.name == locationname).first().id
            company.locationid = locationid
        else:
            location = Location(name=locationname)
            db.session.add(location)        
            locationid = Location.query.filter(Location.name == locationname).first().id
            company.locationid = locationid
        db.session.commit()
        return jsonify(data=company.serialize(), user_type="company"), 200
    elif request.method == "DELETE":  # Radera företagsprofil baserat på company_id
        if Company.query.get(company_id):
            db.session.delete(Company.query.get(company_id))
            db.session.commit()
        return jsonify(dict(success=True)), 200


# Hämtar in ett företags orderhistorik
@app.route("/company/<int:company_id>/orderhistory", methods=["GET"])
def company_orders(company_id):
    if request.method == "GET":  # Hämta rätt företagsprofil baserat på company_id
        jobs = []        
        for job in Company.query.get(company_id).joblistings:
            jobs.append(job.serialize())
        return jsonify(jobs), 200


# Hanterar ett specifikt företags information
@app.route("/student/<int:student_id>", methods=["GET", "PUT"])
def student_student_id(student_id):
    if request.method == "GET":  # Hämta rätt företagsprofil baserat på company_id
        student = Student.query.get(student_id)
        return jsonify(student.serialize()), 200
    elif request.method == "PUT":  # Redigera info student
        data = request.get_json(force=True)
        student = Student.query.get(student_id)
        student.education = data["education"]
        new_email = data["email"]
        student.firstname = data["firstname"]
        student.lastname = data["lastname"]
        locationname = data["location"]

        if student.email != new_email:
            if User.query.filter(new_email == User.email).first():
                return jsonify(msg="Denna epost-adress är redan registrerad"), 401
            else:
                student.email = new_email

        if Location.query.filter(Location.name == locationname).first():
            locationid = Location.query.filter(Location.name == locationname).first().id
            student.locationid = locationid
        else:
            location = Location(name=locationname)
            db.session.add(location)
            locationid = Location.query.filter(Location.name == locationname).first().id
            student.locationid = locationid
        db.session.commit()

        return jsonify(data=student.serialize(), user_type="student"), 200


# Lägga till jobb i studentprofil
@app.route("/student/<int:student_id>/<int:job_id>", methods=["PUT"])
def apply_for_job_student(student_id, job_id):
    if request.method == "PUT":
        student = Student.query.get(student_id)

        if Joblisting.query.get(job_id):
            job = Joblisting.query.get(job_id)

        for item in student.hasapplied:
            if job.id == item.id:                
                student.hasapplied.remove(job)
                db.session.commit()
                return jsonify(student.serialize()), 200

        student.hasapplied.append(job)
        db.session.commit()
        return jsonify(student.serialize()), 200


# Checks if valid filename and extension
def allowed_pdf_file(filename):

    if "." not in filename:
        return False

    ext = filename.rsplit(".", 1)[1]

    if ext.upper() in app.config["ALLOWED_PDF_FILE_EXTENSIONS"]:
        return True
    else:
        return False


# Checks if valid filesize
def allowed_pdf_file_filesize(filesize):

    if int(filesize) <= app.config["MAX_PDF_FILE_FILESIZE"]:
        return True
    else:
        return False


# Recieves pdf-files and stores them to /app/resumes as resume<id>.pdf
# Configurations for path, allowed file-extension and filesize can be found in __init__.py
@app.route("/upload-pdf/<int:student_id>", methods=["GET", "POST", "DELETE"])
def upload_file(student_id):
    if request.method == "POST":

        if request.files:

            if "filesize" in request.cookies:

                if not allowed_pdf_file_filesize(request.cookies["filesize"]):
                    print("Filesize exceeded maximum limit")
                    return jsonify(401)

                pdf_file = request.files["pdf"]

                if pdf_file.filename == "":
                    print("No filename")
                    return jsonify(401)

                if allowed_pdf_file(pdf_file.filename):
                    filename = secure_filename(
                        f'{"resume"}{student_id}{time.strftime("%Y%m%d%H%M%S")}{".pdf"}'
                    )
                    newFile = Resume(filename=filename, studentid=student_id)
                    res = Resume.query.get(student_id)
                    if res is None:
                        db.session.add(newFile)
                    else:
                        path = os.path.join(
                            app.config["PDF_FILE_UPLOADS"], res.filename
                        )
                        os.remove(path)
                        res.filename = filename

                    db.session.commit()
                    pdf_file.save(
                        os.path.join(app.config["PDF_FILE_UPLOADS"], filename)
                    )
                    print("PDF-file saved " + filename)
                    return jsonify(200)

                else:
                    print("That file extension is not allowed")
                    return jsonify(401)

    elif request.method == "DELETE":

        res = Resume.query.get(student_id)

        if res is None:
            print("No Resume found in db")
            return jsonify(401)
        else:
            filename = res.filename
            db.session.delete(res)
            db.session.commit()

        path = os.path.join(app.config["PDF_FILE_UPLOADS"], filename)

        if os.path.isfile(path):
            os.remove(path)
            print("Deleted file at path: " + path)
            return jsonify(200)
        else:
            print("No valid file at path: " + path)
            return jsonify(401)

    elif request.method == "GET":

        res = Resume.query.get(student_id)
        if res is None:
            return jsonify(res_uri="resumes/placeholdercv.pdf")
        else:
            return jsonify(res_uri=f'{"resumes/"}{res.filename}')

    return jsonify(200)

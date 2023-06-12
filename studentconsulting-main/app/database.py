from flask_bcrypt import Bcrypt
from app import db

bcrypt = Bcrypt()


# Tabel som hanterar many-2-many relationen mellan joblisting (jobbannonser) och perioder
hasjobperiod_table = db.Table(
    "association2",
    db.Model.metadata,
    db.Column("periodid", db.Integer, db.ForeignKey("period.periodid")),
    db.Column("jobid", db.Integer, db.ForeignKey("joblisting.id")),
)


# Tabel som hanterar many-2-many relationen mellan joblisting (jobbannonser) och om en student ansökt
hasapplied_table = db.Table(
    "association3",
    db.Model.metadata,
    db.Column("studentid", db.Integer, db.ForeignKey("student.id")),
    db.Column("jobid", db.Integer, db.ForeignKey("joblisting.id")),
)


# Klass som de två användartyperna student och företag bygger på
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    hashed_password = db.Column(db.String, nullable=False)
    numberOfJobs = db.Column(db.Integer, nullable=False, default=0)
    locationid = db.Column(
        db.Integer, db.ForeignKey("location.id", ondelete="SET NULL"), nullable=True
    )
    picture = db.relationship(
        "UserPicture", backref="student", uselist=False, lazy=True
    )

    def __repr__(self):
        return "<User {}: {} {}>".format(self.id, self.email, self.numberOfJobs)

    def serialize(self):
        return dict(id=self.id, email=self.email)

    # Sätter ett hashat lösenord för användaren
    def set_password(self, password):
        self.hashed_password = bcrypt.generate_password_hash(password).decode("utf8")


# Ärver av User och är en av de två användartyperna
class Company(User):
    __tablename__ = "company"
    id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    companyname = db.Column(db.String(45), nullable=False)
    contactfirstname = db.Column(db.String(45), nullable=False)
    contactlastname = db.Column(db.String(45), nullable=False)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)
    listingorder = db.relationship(
        "Listingorder", backref="company", lazy=True, cascade="all, delete-orphan"
    )
    joblistings = db.relationship(
        "Joblisting", backref="company", lazy=True, cascade="all, delete-orphan"
    )

    def serialize(self):
        send = dict(
            id=self.id,
            email=self.email,
            companyname=self.companyname,
            contactfirstname=self.contactfirstname,
            contactlastname=self.contactlastname,
            is_admin=self.is_admin,
        )
        if self.joblistings:
            joblistings = Joblisting.query.filter(Joblisting.companyid == self.id)
            joblistings_id = []
            for job in joblistings:
                job_id = job.id
                joblistings_id.append(job_id)
            send["jobs"] = joblistings_id
        if self.locationid:
            locationname = Location.query.get(self.locationid).name
            send["location"] = locationname
        return send


# Ärver av User och är en av de två användartyperna
class Student(User):
    __tablename__ = "student"
    id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    firstname = db.Column(db.String(45), nullable=False)
    lastname = db.Column(db.String(45), nullable=False)
    education = db.Column(db.String(45), nullable=False)
    completed = db.relationship("Joblisting", backref="completedby", lazy=True)
    resume = db.relationship("Resume", backref="student", uselist=False, lazy=True)
    hasapplied = db.relationship(
        "Joblisting", secondary=hasapplied_table, back_populates="hasstudents"
    )

    def serialize(self):
        send = dict(
            id=self.id,
            email=self.email,
            firstname=self.firstname,
            lastname=self.lastname,
            education=self.education,
        )
        if self.locationid:
            locationname = Location.query.get(self.locationid).name
            send["location"] = locationname
        if self.hasapplied:
            jobs = Joblisting.query.filter(Joblisting.hasstudents.contains(self))
            jobs_id = []
            for job in jobs:
                job_id = job.id
                jobs_id.append(job_id)
            send["jobs"] = jobs_id
        return send


# Order på jobbannons, används för att lagra information om en jobbannons innan betalning
class Listingorder(db.Model):
    __tablename__ = "listingorder"
    id = db.Column(db.Integer, primary_key=True)
    companyid = db.Column(db.Integer, db.ForeignKey("company.id", ondelete="CASCADE"))
    title = db.Column(db.String, nullable=True)
    description = db.Column(db.String(400), nullable=True)
    locationname = db.Column(db.String, nullable=True)
    hasperiods = db.Column(db.PickleType, nullable=True)

    def __repr__(self):
        return "<Listingorder {}: {} {}>".format(self.id, self.companyid, self.title)

    def serialize(self):
        companyname = Company.query.get(self.companyid).companyname
        send = dict(
            id=self.id,
            company=companyname,
            title=self.title,
            description=self.description,
        ) 
        if self.locationname:
            send["location"] = self.locationname
        if self.hasperiods:
            send["periods"] = self.hasperiods
        return send


# Innehåller all relevant information om en jobbannons med relationer till företag, platser, perioder och studenter
class Joblisting(db.Model):
    __tablename__ = "joblisting"
    id = db.Column(db.Integer, primary_key=True)
    isactive = db.Column(db.Boolean, nullable=False, default=True)
    transactionid = db.Column(db.String, nullable=False)
    price = db.Column(db.String, nullable=False)
    companyid = db.Column(db.Integer, db.ForeignKey("company.id", ondelete="CASCADE"))
    studentid = db.Column(db.Integer, db.ForeignKey("student.id"), nullable=True)
    title = db.Column(db.String, nullable=True)
    description = db.Column(db.String(400), nullable=True)
    locationid = db.Column(db.Integer, db.ForeignKey("location.id"), nullable=True)
    hasperiods = db.relationship(
        "Period", secondary=hasjobperiod_table, back_populates="hasjobs"
    )
    hasstudents = db.relationship(
        "Student", secondary=hasapplied_table, back_populates="hasapplied"
    )

    def __repr__(self):
        return "<Joblisting {}: {} {}>".format(self.id, self.companyid, self.title)

    def serialize(self):
        companyname = Company.query.get(self.companyid).companyname
        send = dict(
            id=self.id,
            studentid=self.studentid,
            company=companyname,
            companyid=self.companyid,
            title=self.title,
            description=self.description,
            isactive=self.isactive,
            price=self.price,
        )  # Vi la till id i dictionary för att kunna hämta i jobpage i uppdragen
        if self.locationid:
            locationname = Location.query.get(self.locationid).name
            send["location"] = locationname
        if self.hasperiods:
            periods = Period.query.filter(Period.hasjobs.contains(self))
            periods_name = []
            for period in periods:
                periodname = period.periodname
                periods_name.append(periodname)
            send["periods"] = periods_name
        return send


# Period-entity, möjliggör filtrering på period för jobbannonserna
class Period(db.Model):
    __tablename__ = "period"
    periodid = db.Column(db.Integer, primary_key=True)
    periodname = db.Column(db.String, nullable=True)
    hasjobs = db.relationship(
        "Joblisting", secondary=hasjobperiod_table, back_populates="hasperiods"
    )

    def serialize(self):
        return dict(name=self.periodname)


# Location-entity, möjliggör filtrering på location för jobbannonserna
class Location(db.Model):
    __tablename__ = "location"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(45), nullable=False)
    users = db.relationship("User", backref="location", lazy=True)
    joblistings = db.relationship("Joblisting", backref="location", lazy=True)

    def __repr__(self):
        return "<Location {}: {} {} {}>".format(
            self.id, self.name, self.users, self.joblistings
        )

    def serialize(self):
        return dict(id=self.id, name=self.name)


# Klass för att hantera filer (lär ändras)
class Resume(db.Model):
    __tablename__ = "resume"
    filename = db.Column(db.String)
    studentid = db.Column(
        db.Integer,
        db.ForeignKey("student.id", ondelete="cascade"),
        unique=True,
        primary_key=True,
    )


# Klass för att hantera filer (lär ändras)
class UserPicture(db.Model):
    __tablename__ = "userpicture"
    filename = db.Column(db.String, primary_key=True)
    elementid = db.Column(
        db.Integer, db.ForeignKey("user.id", ondelete="cascade"), primary_key=True
    )


# Klass för att hantera filer (lär ändras)
class JobPicture(db.Model):
    __tablename__ = "jobpicture"
    filename = db.Column(db.String, primary_key=True)
    elementid = db.Column(
        db.Integer, db.ForeignKey("joblisting.id", ondelete="cascade"), primary_key=True
    )

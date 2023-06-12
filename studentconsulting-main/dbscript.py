from app import db
from app.database import (
    Company,
    Joblisting,
    Period,
    Location,
    Student,
    Jobcategory
)

db.drop_all()
db.create_all()

# student1 = Student(
#     email="student@student.se",
#     firstname="Studfirst",
#     lastname="Studlast",
#     education="Basic",
# )
# student1.set_password("student")
# db.session.add(student1)

# company1 = Company(
#     email="company@company.se",
#     companyname="Company",
#     contactfirstname="Companyfirst",
#     contactlastname="Companylast",
# )
# company1.set_password("company")
# db.session.add(company1)

# student2 = Student(
#     email="john.doe@student.se", firstname="John", lastname="Doe", education="Wizardry"
# )
# student2.set_password("john")
# db.session.add(student2)

# student3 = Student(
#     email="jane.doe@student", firstname="Jane", lastname="Doe", education="Life"
# )
# student3.set_password("jane")
# db.session.add(student3)

# company2 = Company(
#     email="evil.corp@comapny.se",
#     companyname="Evil Corp",
#     contactfirstname="Mark",
#     contactlastname="Zuckerberg",
# )
# company2.set_password("mightyzuck")
# db.session.add(company2)

# company3 = Company(
#     email="good.corp@comapny.se",
#     companyname="Good Corp",
#     contactfirstname="Satoshi",
#     contactlastname="Nakamoto",
# )
# company3.set_password("bitcoin")
# db.session.add(company3)

# db.session.commit()

# joblisting1 = Joblisting(
#      companyid=company2.id,
#      studentid=student2.id,
#      title="Fancy programmer wanted",
#      description="In this job you will need to manipulate our users with crazy algorithms, programmers with knowledge "
#      "of C++, SQL and the opposite sex preferable.",
#  )
# db.session.add(joblisting1)

# joblisting2 = Joblisting(
#      companyid=company3.id,
#      title="Modern time wizard wanted",
#      description="In this job you will perform magic beyond your wildest dreams, "
#      "even Voldemort would have been envious. Due to the nature of the job "
#      "details cannot be shared in great detail. A teaser is that we will teach "
#      "you how to split your soul into 13 pieces where each one of them has a "
#      "work life balance",
# )
# db.session.add(joblisting2)

# db.session.commit()

# location1 = Location(
#     name="Hogwarts"
# )

# db.session.add(location1)

# location2 = Location(
#     name="Nirvana"
# )
# db.session.add(location2)

# db.session.commit()

# student2.locationid = location1.id
# company2.locationid = location1.id
# joblisting1.locationid = location1.id
# company3.locationid = location2.id
# student3.locationid = location2.id
# joblisting2.locationid = location2.id

# db.session.add(student2)

# db.session.commit()

# period1 = Period(
#     periodname="Vår"
# )
# db.session.add(period1)

# period2 = Period(
#     periodname="Höst"
# )
# db.session.add(period2)

# joblisting1.hasperiods.append(period1)

# joblisting2.hasperiods.append(period2)

# jobcategory1 = Jobcategory(
#     categoryname="Data"
# )
# db.session.add(jobcategory1)

# jobcategory2 = Jobcategory(
#     categoryname="Filosofi"
# )
# db.session.add(jobcategory2)

db.session.commit()

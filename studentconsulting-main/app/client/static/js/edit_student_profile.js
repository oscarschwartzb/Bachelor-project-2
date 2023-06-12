var host = "http://localhost:5000";

// Fyller i namn, email, utbildning och studieort på studentens min sida
function getStudentData(in_studentID) {
    email = "Email: ".bold();
    education = "Utbildning: ".bold();
    stud_location = "Studieort: ".bold();
    student_data = JSON.parse(sessionStorage.getItem('user'));
    student_firstname = student_data.firstname;
    student_lastname = student_data.lastname;
    student_email = student_data.email;
    student_education = student_data.education;
    student_location = student_data.location;
    student_is_admin = student_data.is_admin;
    student_fullname = student_firstname.concat(" ").concat(student_lastname);
    if (!student_is_admin) {
        student_fullname = student_firstname.concat(" ").concat(student_lastname);
    }else{
        student_fullname = student_firstname.concat(" ").concat(student_lastname).concat(" (ADMINISTRATÖR)");
    }

    // document.getElementById("student_name").innerHTML = student_firstname.concat(" ").concat(student_lastname);
    document.getElementById("student_name").innerHTML = student_fullname; 
    document.getElementById("student_email").innerHTML = email.concat(student_email);
    document.getElementById("student_education").innerHTML = education.concat(student_education);
    document.getElementById("student_location").innerHTML = stud_location.concat(student_location);

    $.ajax({
        url: host + '/student/' + in_studentID,
        type: 'GET',
        success: function (data) {
            loadSpecificJobs(data);

        }
    });

}

// Förhandsfyller informationen i fälten när en student ska redigera sina uppgifter
function updateEditForm() {
    student_data = JSON.parse(sessionStorage.getItem('user'));
    document.getElementById("student_name").innerHTML = student_firstname.concat(" ").concat(student_lastname)
    document.getElementById('fistname_edit_student').value = student_data.firstname;
    document.getElementById('lastname_edit_student').value = student_data.lastname;
    document.getElementById('studieort_edit_student').value = student_data.location;
    document.getElementById('email_edit_student').value = student_data.email;
    document.getElementById('utbildning_edit_student').value = student_data.education;
}

// Uppdaterar databasen med den nya informationen användaren uppdaterat med redigeringsformuläret
function updateStudentProfile() {
    new_firstname = document.getElementById("fistname_edit_student").value;
    new_lastname = document.getElementById("lastname_edit_student").value;
    new_email = document.getElementById("email_edit_student").value;
    new_education = document.getElementById("utbildning_edit_student").value;
    new_location = document.getElementById("studieort_edit_student").value;
    student_id = JSON.parse(sessionStorage.getItem('user')).id;

    if (new_firstname == '') {
        alert("Namet får inte vara tomt.");
    } else if (new_lastname == '') {
        alert("Efternamnet får inte vara tomt.");
    } else if (new_email == '') {
        alert("Eposten får inte vara tomt.");
    } else if (new_education == '') {
        alert("Utbildning får inte vara tomt.");
    } else if (new_location == '') {
        alert("Ort får inte vara tomt.");
    }else{
        $.ajax({
            url: 'http://localhost:5000' + '/student/' + student_id,
            type: 'PUT',
            data: JSON.stringify({ email: new_email, education: new_education, location: new_location, firstname: new_firstname, lastname: new_lastname }),
            success: function (data) {
                sessionStorage.setItem('user', JSON.stringify(data.data));
                myPage();

            },
            error: function (data) {
                message = data.responseJSON.msg;
                alert(message);
            }
        });
    }

}


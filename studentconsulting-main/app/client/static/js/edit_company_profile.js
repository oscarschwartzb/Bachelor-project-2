var host = "http://localhost:5000";

// Hämtar information om företaget och presenterar den i min sida för företaget
function getCompanyData(in_companyID){
    email = "Email: ".bold();
    ort = "Ort: ".bold();
    company_data = JSON.parse(sessionStorage.getItem('user'));
    if(!company_data.is_admin){
        company_name = company_data.companyname;
    }else{
        company_name = company_data.companyname.concat(" (ADMINISTRATÖR)");
    }
    document.getElementById("company_name").innerHTML = company_name;
    document.getElementById("ort_edit").innerHTML = ort.concat(company_data.location);
    document.getElementById("email_company").innerHTML = email.concat(company_data.email);
}

    // Uppdaterar informationen i fälten när en company ska redigera sina uppgifter
function updateEditFormCompany(){
    company_name = JSON.parse(sessionStorage.getItem('user')).companyname;
    company_location = JSON.parse(sessionStorage.getItem('user')).location;
    company_email = JSON.parse(sessionStorage.getItem('user')).email;
    
    document.getElementById('company_name').innerHTML = company_name;
    document.getElementById('edit_companyname').value = company_name;
    document.getElementById('edit_location').value = company_location;
    document.getElementById('edit_email').value = company_email;

}



// Kod som uppdaterar jobben på ett företags min sida. Visar de jobben ett företag laggt upp
// Hämtar alla jobb från db och visar de jobben som det inloggade företaget skapat 
function loadSpecificJobsCompany_edit_profile() {

    $.ajax({
        url: 'http://localhost:5000' + '/jobpage',
        type: 'GET',
        success: function (jobsin) {

            var companyjob = JSON.parse(sessionStorage.getItem('jobs'));
            jobstodisplay = new Array();

            if (companyjob != null) {
                for (i = 0; i < jobsin.length; i++) {
                    if (companyjob.includes(jobsin[i].id)) {
                        jobstodisplay.push(jobsin[i]);
                    }
                }
            }
            // Kallar på funktionen som skapar jobbkort och lägger dem i rätt div 
            createjobcard_no_press(jobstodisplay, "#company-job-card-div"); 


        }
    });


}


// Uppdaterar databasen med den information användaren redigerat på min sida
function updateCompanyProfile() {
    document.getElementById("company_email_edit_text").innerHTML = "Var god och fyll i din email."
    company_id = JSON.parse(sessionStorage.getItem('user')).id;
    new_companyname = document.getElementById("edit_companyname").value;
    new_location = document.getElementById("edit_location").value;
    new_email = document.getElementById("edit_email").value;
    email_ok = validateEmail(new_email);
    alert("EMAIL_OK", email_ok);
    if(new_companyname == ''){
        alert("Namnet får inte vara tomt.")
    }else if(new_location == ''){
        alert("Ort får inte vara tomt.")
    }else if(new_email == '' || !email_ok){
        alert("Ogiltig epost")
        $("#company_email_edit_text").show();
    }else{
    $.ajax({
        url: 'http://localhost:5000' + '/company/' + company_id,
        type: 'PUT',
        data: JSON.stringify({ email: new_email, location: new_location, companyname: new_companyname}),
        success: function (data) {
            sessionStorage.setItem('user', JSON.stringify(data.data));
            myPage();
        },
        error: function (data){
            message = data.responseJSON.msg;
            document.getElementById("company_email_edit_text").innerHTML = message;
            $("#company_email_edit_text").show();
            // message = data.responseJSON.msg;
            // alert(message);
        }
    });    
}

}

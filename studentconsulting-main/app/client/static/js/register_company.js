var host = "http://localhost:5000";

// GÖr det möjligt för användaren att logga in med enter-knappen
function enterRegisterCompany(){
    document.getElementById("c_password_r").addEventListener("keyup", function(e) {
        //   // Number 13 is the "Enter" key on the keyboard
           if (e.keyCode == 13) {
             // Cancel the default action, if needed
             e.preventDefault();
             // Trigger the button element with a click
             registercompany();
             // document.getElementById("myBtn").click();
           }
         });

}


// Hämtar data från registreringsformuläret och registrerar företaget 
function registercompany(){
    // Hämtar data från formuläret
    document.getElementById("company_email_text").innerHTML = "Var god och fyll i din Email."
    company_name=document.getElementById("c_name").value;
    company_firstname=document.getElementById("c_firstname").value;
    company_lastname=document.getElementById("c_lastname").value;
    company_email=document.getElementById("c_email").value;
    company_password=document.getElementById("c_password").value;
    company_password_rep=document.getElementById("c_password_r").value;
    company_location = document.getElementById("c_location").value; 
    var correct_input =false;
    email_ok = validateEmail(company_email);
    // Kontrollerar att alla fält är ifyllda
    if(company_name == ''){
        $("#company_name_text").show();
    }else{
        $("#company_name_text").hide();
    }
    
    if(company_firstname == '' ){
        $("#company_firstname_text").show();
    }else{
        $("#company_firstname_text").hide();
    }
    
    if(company_lastname == ''){
        $("#company_lastname_text").show();
    }else{
        $("#company_lastname_text").hide();
    }
    
    if(company_email == '' || !email_ok){
        $("#company_email_text").show();
    }else{
        $("#company_email_text").hide();
    }

    if(company_location == ''){
        $("#company_location_text").show();
    }else{
        $("#company_location_text").hide();
    }
    
    if(company_password == '' ||  company_password !=company_password_rep){
        $("#company_password_text").show();
    }else{
        $("#company_password_text").hide();
    }
    
    if(company_name != ''&& company_firstname != '' && company_lastname!= '' && company_email != '' && company_location != '' &&  company_password != '' && company_password == company_password_rep && email_ok){
        correct_input=true;
    }
    

    
    
    if(correct_input==true){
        $.ajax({
            url: host + "/signup/company",
            type: 'POST',
            data: JSON.stringify({email: company_email , companyname: company_name, contactfirstname: company_firstname, contactlastname: company_lastname, password: company_password, location: company_location}),
            success: function (data) {
                loginCompany();
                $('#page6Link').hide();
            },
            error: function (data) {
                message = data.responseJSON.msg;
                document.getElementById("company_email_text").innerHTML = message;
                $("#company_email_text").show();

                // message = data.responseJSON.msg;
                // alert(message);
            }
        });
    }
}


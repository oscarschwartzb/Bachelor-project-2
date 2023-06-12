var host = "http://localhost:5000";

// Gör det möjligt för användaren att registrera sig genom att använda enterknappen
function enterRegisterStudent(){
    document.getElementById("s_password_r").addEventListener("keyup", function(e) {
               // Number 13 är enterknappen
           if (e.keyCode == 13) {
             e.preventDefault();
             registerstudent();
           }
         });
}

//Registrerar studenten samt loggar in användaren efter registering
function registerstudent(){
    // Hämtar data från formuläret
    document.getElementById("s_email_text").innerHTML = "Var god och fyll i din Email."
    s_firstname=document.getElementById("s_firstname").value;
    s_lastname=document.getElementById("s_lastname").value;
    s_email=document.getElementById("s_email").value;
    s_education= document.getElementById("s_education").value;
    s_location=document.getElementById("s_location").value;
    s_password=document.getElementById("s_password").value;
    s_password_rep=document.getElementById("s_password_r").value;
    var correct_input =false;

    if(s_firstname == ''){
        $("#s_firstname_text").show(); 
    }else{
        $("#s_firstname_text").hide();
    }

    if(s_lastname == ''){
        $("#s_lastname_text").show();
    }else{
        $("#s_lastname_text").hide();   
    }

    if(s_education == ''){
        // alert("Var god och fyll i utbildning")
        $("#s_education_text").show();
    }else{
        $("#s_education_text").hide();
    }
    
    if(s_location == ''){
        
        $("#s_location_text").show()
    }else{
        $("#s_location_text").hide();
    }
    email_ok = validateEmail(s_email);
    if(s_email == '' || !email_ok){
        $("#s_email_text").show();
    }else{
        $("#s_email_text").hide();
    }
    
    if(s_password == '' ||  s_password != s_password_rep){
        // alert("Lösenorden stämmer inte överens, försök igen")
         $("#s_password_text").show();
        }else{
            $("#s_password_text").hide();
        }


    if(s_firstname != '' && s_lastname != '' && s_education != '' && s_location != '' && s_email != '' && s_password != '' && s_password == s_password_rep && email_ok){
        correct_input=true;
    }
if(correct_input==true){



        $.ajax({
            url: host + "/signup/student",
            type: 'POST',
            data: JSON.stringify({email: s_email , firstname: s_firstname, lastname: s_lastname, password: s_password, location: s_location, education: s_education}),
            success: function (data) {
                //loggar in användaren
                loginUser(false);
                $('#page6Link').hide();
            },
            error: function (data) {
                message = data.responseJSON.msg;
                document.getElementById("s_email_text").innerHTML = message;
                $("#s_email_text").show();

            }
        });

        
    }



    
}
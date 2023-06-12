// Uppdaterar "hem"- sidan med användarens namn om denne är inloggad
function updateHompageButtons(){
    var signedIn = (sessionStorage.getItem('auth') == null);  
    if(!signedIn){
        data = JSON.parse(sessionStorage.getItem('user'));
        user_type = JSON.parse(sessionStorage.getItem('user_type'));
        if(user_type == 'student'){
            student_name = data.firstname;
            document.getElementById("welcome-header").innerHTML = "Välkommen ".concat(student_name);
        }else{
            company_name = data.companyname;
            document.getElementById("welcome-header").innerHTML = "Välkommen ".concat(company_name);
        }
        $('#show_not_login').hide();
        $('#show_login').show();
    }else{
       
        $('#show_not_login').show()
        $('#show_login').hide() 
        
        }       
    }
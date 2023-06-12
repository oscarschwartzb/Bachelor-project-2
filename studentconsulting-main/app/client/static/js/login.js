var host = "http://localhost:5000";

// GÖr det möjligt för användaren att logga in med enter-knappen
function activateEnterLogin(){
  document.getElementById("password_login").addEventListener("keyup", function(e) {
    //   Nummer 13 är enterknappen
       if (e.keyCode == 13) {
         e.preventDefault();
         loginUser(true);
       }
     });
}



// Loggar in användaren, register_or_login=false när användaren kommer från registrera student, true
// om användaren kommer från logga in- viewn
function loginUser(register_or_login) {

  if (register_or_login) {
    email = document.getElementById('email_login').value;
    password = document.getElementById('password_login').value;
    loaded = true;
  } else {
    email = document.getElementById('s_email').value;
    password = document.getElementById('s_password').value;
  }

  if(!validateEmail(email)){
    document.getElementById("login_message").innerHTML = "Ogiltigt epost-format"
    $("#login_message").show();
  }else{
  $.ajax({  
    url: host + '/login',
    type: 'POST',
    data: JSON.stringify({ email: email, password: password }),
    success: function (loginResponse) {
      sessionStorage.setItem('auth', JSON.stringify(loginResponse.token));
      sessionStorage.setItem('user_type', JSON.stringify(loginResponse.user_type));
      sessionStorage.setItem('user', JSON.stringify(loginResponse.data));

      user_type = JSON.parse(sessionStorage.getItem('user_type'))

        if (loginResponse.data.jobs) {
          sessionStorage.setItem('jobs', JSON.stringify(loginResponse.data.jobs));
         } else {
          sessionStorage.setItem('jobs', JSON.stringify([]));
        }
      
      $('#page4Link').hide();
      $('#page6Link').hide();
      $('#page5Link').show();
      $('#my_page').show();
      $('#show_not_login').hide();
      $('#show_login').show();
      myPage();
     

    },
    error: function (data) {
      message = data.responseJSON.msg;
      document.getElementById("login_message").innerHTML = message;
      $("#login_message").show();
    }
  });

  document.getElementById("page1Link").style.borderBottom = "none";
  document.getElementById("page2Link").style.borderBottom = "none";
  document.getElementById("page3Link").style.borderBottom = "none";
  document.getElementById("page4Link").style.borderBottom = "none";
  document.getElementById("page5Link").style.borderBottom = "none";
  document.getElementById("page6Link").style.borderBottom = "none";
  document.getElementById("my_page").style.borderBottom = "thin solid #4682B4";  
}
}

  // Tar bort innehåll från sessionStorage och loggar ut användaren
function logoutUser() {
  sessionStorage.removeItem('auth');
  sessionStorage.removeItem('user_type');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('jobs');

  $("#containerReal").html($("#view-index").html());
  $('#page5Link').hide();
  $('#my_page').hide();
  $('#page4Link').show();
  $('#page6Link').show();
  $('#show_not_login').show()
  $('#show_login').hide()


}

// Tar fram rätt min sida baserat på user_type
function myPage() {
  user_type = JSON.parse(sessionStorage.getItem('user_type'))
  user_id = JSON.parse(sessionStorage.getItem('user')).id;
  if (user_type == "company") {
    companyprofile(user_id);
  } else {
    studentprofil(user_id);
  }
  loadUserPreviewResume();

}
// Loggar in företagsanvändare, sparar relevant data i session storage
function loginCompany() {
  email = document.getElementById('c_email').value;
  password = document.getElementById('c_password').value;

  $.ajax({
    url: host + '/login',
    type: 'POST',
    data: JSON.stringify({ email: email, password: password }),
    success: function (loginResponse) {
      sessionStorage.setItem('auth', JSON.stringify(loginResponse.token));
      sessionStorage.setItem('user', JSON.stringify(loginResponse.data));
      sessionStorage.setItem('user_type', JSON.stringify(loginResponse.user_type));
      $('#page4Link').hide();
      $('#page5Link').show();
      $('#my_page').show();
      if (loginResponse.data.jobs) {
        sessionStorage.setItem('jobs', JSON.stringify(loginResponse.data.jobs));
      } else {
        sessionStorage.setItem('jobs', JSON.stringify([]));
      }
      myPage();
    },
    error: function (data) {
      message = data.responseJSON.msg;
      document.getElementById("login_message").innerHTML = message;
      $("#login_message").show();
    }
  });
}

function validateEmail(mail){
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)){
    return (true)
  }
    return (false)
}



// Här under ligger alla funktioner för att navigera på nav-bar:en


// Väljer information som ska presenteras på "Hem"-sidan. Om envändare är inloggad visas dess namn
$(document).ready(function() {


    var signedIn = (sessionStorage.getItem('auth') == null);
    if (signedIn) {
        $("#containerReal").html($("#view-index").html());
        updateHompageButtons();
        document.getElementById("page1Link").style.borderBottom = "thin solid #AA0000";
        $('#page5Link').hide();
        $('#my_page').hide();
        $('#show_not_login').show()
        $('#show_login').hide()
    } else {
        $("#containerReal").html($("#view-index").html());
        updateHompageButtons();
        document.getElementById("page1Link").style.borderBottom = "thin solid #AA0000";
        $('#page4Link').hide();
        $('#page5Link').show();
        $('#page6Link').hide(); //----------------------
        $('#my_page').show();
        $('#show_not_login').hide();
        $('#show_login').show();
    }

    viewJobsHomePage();
    document.getElementById("page1Link").style.borderBottom = "thin solid #4682B4";
    $(page1Link).bind("click", function() {
        //$("#containerReal").html($("#view-index").html());
        viewJobsHomePage();
        $("#containerReal").html($("#view-index").html());
        updateHompageButtons();
        document.getElementById("page1Link").style.borderBottom = "thin solid #AA0000";
        document.getElementById("page2Link").style.borderBottom = "none";
        document.getElementById("page3Link").style.borderBottom = "none";
        document.getElementById("page4Link").style.borderBottom = "none";
        document.getElementById("page5Link").style.borderBottom = "none";
        document.getElementById("page6Link").style.borderBottom = "none";
        document.getElementById("my_page").style.borderBottom = "none";
        hideNavbar();

    });
    $(page2Link).bind("click", function(color) {
        $("#containerReal").html($("#view-about").html());

        document.getElementById("page1Link").style.borderBottom = "none";
        document.getElementById("page2Link").style.borderBottom = "thin solid #4682B4";
        document.getElementById("page3Link").style.borderBottom = "none";
        document.getElementById("page4Link").style.borderBottom = "none";
        document.getElementById("page5Link").style.borderBottom = "none";
        document.getElementById("page6Link").style.borderBottom = "none";
        document.getElementById("my_page").style.borderBottom = "none";
        hideNavbar();





    });
    $(page3Link).bind("click", function() {
        // $("#containerReal").html($("#view-jobpage").html());   
        jobbviewInitiate();
        document.getElementById("page1Link").style.borderBottom = "none";
        document.getElementById("page2Link").style.borderBottom = "none";
        document.getElementById("page3Link").style.borderBottom = "thin solid #4682B4";
        document.getElementById("page4Link").style.borderBottom = "none";
        document.getElementById("page5Link").style.borderBottom = "none";
        document.getElementById("page6Link").style.borderBottom = "none";
        document.getElementById("my_page").style.borderBottom = "none";
        hideNavbar();




    });
    // Login
    $(page4Link).bind("click", function() {
        $("#containerReal").html($("#view-login").html());
        document.getElementById("page1Link").style.borderBottom = "none";
        document.getElementById("page2Link").style.borderBottom = "none";
        document.getElementById("page3Link").style.borderBottom = "none";
        document.getElementById("page4Link").style.borderBottom = "thin solid #4682B4";
        document.getElementById("page5Link").style.borderBottom = "none";
        document.getElementById("page6Link").style.borderBottom = "none";
        document.getElementById("my_page").style.borderBottom = "none";
        hideNavbar();
        activateEnterLogin();
    });

    // Logout
    $(page5Link).bind("click", function() {
        viewJobsHomePage();
        document.getElementById("page1Link").style.borderBottom = "none";
        document.getElementById("page2Link").style.borderBottom = "none";
        document.getElementById("page3Link").style.borderBottom = "none";
        document.getElementById("page4Link").style.borderBottom = "none";
        document.getElementById("page5Link").style.borderBottom = "thin solid #4682B4";
        document.getElementById("page6Link").style.borderBottom = "none";
        document.getElementById("my_page").style.borderBottom = "none";
        hideNavbar();


    });

    // Min sida
    $(my_page).bind("click", function() {
        document.getElementById("page1Link").style.borderBottom = "none";
        document.getElementById("page2Link").style.borderBottom = "none";
        document.getElementById("page3Link").style.borderBottom = "none";
        document.getElementById("page4Link").style.borderBottom = "none";
        document.getElementById("page5Link").style.borderBottom = "none";
        document.getElementById("page6Link").style.borderBottom = "none";
        document.getElementById("my_page").style.borderBottom = "thin solid #4682B4";
        hideNavbar();

    });

       // Registrera
       $(page6Link).bind("click", function(){
        document.getElementById("page1Link").style.borderBottom = "none";
        document.getElementById("page2Link").style.borderBottom = "none";
        document.getElementById("page3Link").style.borderBottom = "none";
        document.getElementById("page4Link").style.borderBottom = "none";
        document.getElementById("page5Link").style.borderBottom = "none";
        document.getElementById("page6Link").style.borderBottom = "thin solid #4682B4";  
        document.getElementById("my_page").style.borderBottom = "none";   
    });






});

function hideNavbar() {
    if ($(window).width() < 768) {
        $("#navbar_icon_button").click()
    }

}

function highlight_navbar_button(button) {
    document.getElementById("button").style.borderBottom = "thin solid #AA0000";

}


//denna funktion är till för att nu testa så vi kan använda oss av svaren i redigerandet av studentprofilen inför att vi börjar 
//lägga in i databasen
function alert_edit_studentprofile() {

    const testrad = new String(document.getElementById("studieort_edit_student").value);
    const testrad1 = new String(document.getElementById("email_edit_student").value);
    const testrad2 = new String(document.getElementById("utbildning_edit_student").value);
    alert(testrad + "\n" + testrad1 + "\n" + testrad2);
    studentprofil();
}

function alert_edit_companyprofile() {

    const testrad = new String(document.getElementById("company_ort_edit").value);
    const testrad1 = new String(document.getElementById("email_edit_company").value);
    const testrad2 = new String(document.getElementById("bransch_edit_company").value);
    alert(testrad + "\n" + testrad1 + "\n" + testrad2);
    companyprofile();
}


//OBS: viktigt att använda sig av funktioner för att ta sig in i views för laggar om man gör det direkt inne i en annan funktion
//dvs t.ex. i alert_edit_studentprofile() så kallas studentprofil()

//HÄR FINNS FUNKTIONER FÖR ATT BYTA VIEWER
function login() {
    document.getElementById("page4Link").click();
}
// Byter vy till hem-sidan genom att aktivera click på knappen i navbaren
function home() {
    document.getElementById("page1Link").click();
}


function editprofilestudent() {
    $("#containerReal").html($("#view-edit_my_profile").html());
    // $("#containerReal").html($("#view-editstudentprofile").html());
}

function editprofilecompany() {
    $("#containerReal").html($("#view-editcompanyprofile").html());
    loadSpecificJobsCompany_edit_profile();
}

function studentlogin() {
    $("#containerReal").html($("#view-login").html());
}

function studentprofil(in_studentID) {
    $("#containerReal").html($("#view-studentprofil").html());
    getStudentData(in_studentID);
}


function register_student_function() {
    $("#containerReal").html($("#view-registerstudent").html());
    enterRegisterStudent();
}

function register_company_function() {
    $("#containerReal").html($("#view-register_company").html());
    enterRegisterCompany();
}

function companyprofile(in_companyID) {
    $("#containerReal").html($("#view-companyprofile").html());
    loadSpecificJobsCompany();
    getCompanyData(in_companyID);
}


function paymentview() {
    $("#containerReal").html($("#view-payment").html());
}

//Används inte
function paymentconfirmation() {
    $("#containerReal").html($("#view-paymentconfirm").html());
}


// OBS! Skulle vara möjligt att flytta det som står i doceument ready och ha det som onclick funktioner istället då skulle vi kunna använda samma funktionsanrop nedanför.. 
function footerCompany() {
    $("#containerReal").html($("#view-about").html());
}

function footerJobpage() {
    $("#containerReal").html($("#view-jobpage").html());
    viewJobsHomePage();

    document.getElementById("page3Link").click();

}


function create_job_company() {
    $("#containerReal").html($("#view-create_job_company").html());
}

function popFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

// Avbryter betalning
function abortpayment() {
    companyprofile();
    remove_new_job();
}
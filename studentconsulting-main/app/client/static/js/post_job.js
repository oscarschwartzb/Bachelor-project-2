var host = "http://localhost:5000";
// Inte så bra lösning att deklarera globala variabler men hittar ej något annat sätt.
var job_title, job_description, job_location, job_autumn, job_spring, job_summer, periods;

// Raderar informationen om jobbet om betalningen avbryts
function remove_new_job() {
    job_title = job_description = job_location = '';
    periods = null;
}

// Skickar jobbet till databasen för förvaring
function postjob() {
    company_id = JSON.parse(sessionStorage.getItem('user')).id;
    $.post(host + "/company/" + company_id, JSON.stringify({ title: job_title, description: job_description, location: job_location, periods: periods }), function (item) {
        pay_job()
    });
}

// Sparar data om jobbet under tiden användaren betalar för sig
function savejob() {
    periods = new Array();
    // Hämtar data från formuläret
    job_title = document.getElementById("new_job_title").value;
    job_description = document.getElementById("new_job_description").value;
    job_location = document.getElementById("new_job_location").value;

    job_autumn = document.getElementById("new_job_autumn").value;
    job_spring = document.getElementById("new_job_spring").value;
    job_summer = document.getElementById("new_job_summer").value;

    // Följande if-satser tar hand om perioderna
    if (document.getElementById("new_job_autumn").checked) {
        periods.push("Höst"); // alice och oscar har ändrat till svenska för att få filtreringen att funka 
    }
    if (document.getElementById("new_job_spring").checked) {
        periods.push("Vår"); // alice och oscar har ändrat till svenska för att få filtreringen att funka 
    }
    if (document.getElementById("new_job_summer").checked) {
        periods.push("Sommar"); // alice och oscar har ändrat till svenska för att få filtreringen att funka 
    }
    // Kikar om allt är ifyllt, om ej dyker alert upp.
    if (job_title == '') {
        alert("Var vänlig och fyll i titel")
    } else if (job_description == '') {
        alert("Var vänlig och fyll i arbetsbeskrivning")
    } else if (job_location == '') {
        alert("Var vänlig och fyll i plats")
    }else if(periods.length < 1){
        alert("Var vänlig och fyll i tidsperiod") 
    }else {
    /* Skickar vidare till jsfilen: payment och kör funktionen pay_job() som hanterar Stripe */ 
    postjob()    
        
    }



}
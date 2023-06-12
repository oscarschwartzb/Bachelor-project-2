var host = "http://localhost:5000";
var locations = new Array();
var dbjobs = new Array();
var reload;

// funktion son kallas på med en Array av jobb som skapar jobkort av denna och lägger in i en div på jobbpage
function createjobcard(jobs, appendto) {

    if (JSON.parse(sessionStorage.getItem('user_type')) == "company") {
        var company_id = JSON.parse(sessionStorage.getItem('user')).id;
        var jobsid = Array(); 
    }

    for (i = 0; i < jobs.length; i++) {

        var html = `
        <div class="col-6" id = "Jobview_jobcard">
            <div class="card card-block" id= "roundedsinglejobcard" style = " height: 250px;">
                <div id = "roundedsinglejobcard-img" style = "margin-left: 0px; margin-top: 0px;">
                </div>
                <div id = "roundedsinglejobcard-text" style = "margin-left: 0px; margin-top: 0px;">
                    <h2 style="color: var(--black); margin-left: 10px; font-weight: 400;">${jobs[i].title}</h2>
                    <P style="color: var(--black); ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#007BFF" class="bi bi-calendar-week-fill" viewBox="0 0 16 16" style = "margin-top: -3px;">
                    <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zM9.5 7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm3 0h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zM2 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                    ${jobs[i].periods}
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#007BFF" class="bi bi-geo-alt-fill" viewBox="0 0 16 16" style = "margin-top: -3px;">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                    ${jobs[i].location}
                    </p>
                    <a href="#" class="stretched-link" id = "${jobs[i].id}" onclick="alert_application(${jobs[i].id})"></a>
                </div>
            </div>
         </div>
    `
            // Den diven jobbkorten läggs in i: 
        // nedanstående löser problemet som uppstår om användaren dubbelklickar på "Min sida". Problemet
        // är att jobben laddas in två gånger
        // $(appendto).html("");
        $(appendto).append(html);
        // Lägger till vilka platser som finns i db när tillgängliga uppdrag sidan uppdateras
        if (!locations.includes(jobs[i].location)) {
            locations.push(jobs[i].location);
        }
        if (JSON.parse(sessionStorage.getItem('user_type')) == "company") {
            if (company_id == jobs[i].companyid) {
                jobsid.push(jobs[i].id);
            }

        }
    }
    if (JSON.parse(sessionStorage.getItem('user_type')) == "company") {
        sessionStorage.setItem('jobs', JSON.stringify(jobsid));
    }

}


// funktion son kallas på med en Array av jobb som skapar jobkort av denna och lägger in i en div på jobbpage
function createjobcard_no_press(jobs, appendto) {
    for (i = 0; i < jobs.length; i++) {

        var html = `
        <div class="col-6" id = "Jobview_jobcard_editprofile">
            <div class="card card-block" id= "roundedsinglejobcard" style = " height: 250px;filter: blur(2px); ">
                <div id = "roundedsinglejobcard-img" style = "margin-left: 0px; margin-top: 0px;">
                </div>
                <div id = "roundedsinglejobcard-text" style = "margin-left: 0px; margin-top: 0px;">
                    <h2 style="color: var(--black); margin-left: 10px; font-weight: 400;">${jobs[i].title}</h2>
                    <P style="color: var(--black); ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#007BFF" class="bi bi-calendar-week-fill" viewBox="0 0 16 16" style = "margin-top: -3px;">
                    <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zM9.5 7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm3 0h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zM2 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                    ${jobs[i].periods}
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#007BFF" class="bi bi-geo-alt-fill" viewBox="0 0 16 16" style = "margin-top: -3px;">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                    ${jobs[i].location}
                    </p>
                    
                </div>
            </div>
         </div>
    `
            // Den diven jobbkorten läggs in i: 
        $(appendto).append(html);
        // Lägger till vilka platser som finns i db när tillgängliga uppdrag sidan uppdateras
        if (!locations.includes(jobs[i].location)) {
            locations.push(jobs[i].location);
        }
    }

}







// Kallas på från spaclient.js, hämtar jobb från databasen och sparar dessa i en global variabel för att slippa hämta upprepade gånger från db
//Nästkommande två metoder kan kombineras till en metod.
function jobbviewInitiate() {
    $.ajax({
        url: 'http://localhost:5000' + '/jobpage',
        type: 'GET',
        success: function(jobsin) { 
            dbjobs = jobsin;
            $("#containerReal").html($("#view-jobpage").html());
            locations = []; 
            createjobcard(jobsin, "#annonserdiv");
            reload = true;
        }
    });
}
 // Laddar in jobbkort på "Tillgängliga uppdrag "
function viewJobsHomePage() {
    $.ajax({
        url: 'http://localhost:5000' + '/jobpage',
        type: 'GET',
        success: function(jobsin) {

            dbjobs = jobsin;
            //$("#containerReal").html($("#view-index").html());
            createjobcard(jobsin, "#jobs-homepage");
            reload = true;
        }
    });
}

// Triggas när man klickar på "visa/döjl filter" och visar filterknappar
function showfilter() {
    // Gör så att alla check rutot är tomma när man visar filter 
    // document.getElementById('CheckSummer').checked = false;
    // document.getElementById('CheckAutumn').checked = false;
    // document.getElementById('CheckSpring').checked = false;

    // Gör så att alla platser i db visas som alternativ i checklistan 
    if (reload) {
        for (i = 0; i < locations.length; i++) {
            var html =
                `<div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="${locations[i]}">
            <label class="form-check-label" for="flexCheckDefault">
              ${locations[i]}
            </label>
          </div>`
            $("#location-div").append(html);
        }
        reload = false;
    }
}

// Triggas när användaren klickar på filtrera och kallar på create jobcard med en lista som innehåller de önskade jobben
function filterjobs() {
    var wantedseasons = new Array();
    var wantedlocations = new Array();
    var selectedjobs = new Array();
    reload = true;

    // Kollar vilka filter som är valda och 
    if (document.getElementById('CheckSummer').checked == true) {
        wantedseasons.push("Sommar");
    }
    if (document.getElementById('CheckAutumn').checked == true) {
        wantedseasons.push("Höst");
    } 
    if (document.getElementById('CheckSpring').checked == true) {
        wantedseasons.push("Vår");
    } 

    for (i = 0; i < locations.length; i++) {
        if (document.getElementById(locations[i]).checked == true) {
            wantedlocations.push(locations[i]);
        }
    }


    // Utifrån valda filter sorteras de matchande jobben ut från den globala listan och läggs in i selectedjob arrayn
    if (wantedseasons.length > 0 && wantedlocations.length == 0) { //Sorterar ut de önskade terminerna om bara terminer är valda
        var tempperiods = new Array();
        for (i = 0; i < dbjobs.length; i++) {
            tempperiods = dbjobs[i].periods;
            if (tempperiods.length > 0) {
                for (j = 0; j < tempperiods.length; j++) {
                    if (wantedseasons.includes(tempperiods[j])) {
                        selectedjobs.push(dbjobs[i]);
                    }
                }
            }
        }
    } else if (wantedlocations.length > 0 && wantedseasons.length == 0) { //Sorterar ut de önskade platserna om bara platser är valda 
        for (i = 0; i < dbjobs.length; i++) {
            if (wantedlocations.includes(dbjobs[i].location)) {
                selectedjobs.push(dbjobs[i]);
            }
        }

    } else if (wantedseasons.length > 0 && wantedlocations.length > 0) { //sorterar ut valda terminer och platser om båda filter kolumner är aktiva 
        var tempperiods = new Array();
        for (i = 0; i < dbjobs.length; i++) {
            tempperiods = dbjobs[i].periods;
            if (tempperiods.length > 0) {
                for (j = 0; j < tempperiods.length; j++) {
                    if (wantedseasons.includes(tempperiods[j])) {
                        if (wantedlocations.includes(dbjobs[i].location)) {
                            selectedjobs.push(dbjobs[i]);
                        }
                    }
                }
            }
        }
    } else { //Returnerar alla jobben som finns om inga filter är valda 
        selectedjobs = dbjobs;
    }

    if (selectedjobs.length == 0) { //Alert om det inte finns några jobb som matchar de filter användaren valt 
        alert("Dina filter matchar inga lediga uppdrag.");
    }
    // Tömmer diven och laddar in de uppdragen i listan 
    reload = false;
    document.getElementById("annonserdiv").innerHTML = " ";
    createjobcard(selectedjobs, "#annonserdiv");

}
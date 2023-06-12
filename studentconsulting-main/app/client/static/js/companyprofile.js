// Kod som uppdaterar jobben på ett företags min sida. Visar de jobben ett företag laggt upp
// Hämtar alla jobb från db och visar de jobben som det inloggade företaget skapat 
function loadSpecificJobsCompany() {

    $.ajax({
        url: 'http://localhost:5000' + '/jobpage',
        type: 'GET',
        success: function (jobsin) {

            var company_id = JSON.parse(sessionStorage.getItem('user')).id;
            var jobsid = Array(); 
            jobstodisplay = new Array();

                for (i = 0; i < jobsin.length; i++) {
                    if (company_id == jobsin[i].companyid) {
                        jobstodisplay.push(jobsin[i]);
                        jobsid.push(jobsin[i].id);
                    }
                }

            // Kallar på funktionen som skapar jobbkort och lägger dem i rätt div 
            sessionStorage.setItem('jobs', JSON.stringify(jobsid));
            createjobcard(jobstodisplay, "#company-job-card-div"); 
            document.getElementById("amount-jobs").innerHTML = "Antal uppdrag: ".bold() + JSON.parse(sessionStorage.getItem('jobs')).length;


        }
    });


}



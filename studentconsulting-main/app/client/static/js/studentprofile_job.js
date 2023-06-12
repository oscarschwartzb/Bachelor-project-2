// Funktion som laddar in de jobb en student har ansökt till på des min sida
// hämtar alla jobb ur db och ser vilka som den inloggade studenten har ansökt om 
function loadSpecificJobs(student) {

    $.ajax({
        url: 'http://localhost:5000' + '/jobpage',
        type: 'GET',
        success: function (jobsin) {

            jobs = student.jobs;
            jobstodisplay = new Array();

            if (jobs != null) {
                for (i = 0; i < jobsin.length; i++) {
                    if (jobs.includes(jobsin[i].id)) {
                        jobstodisplay.push(jobsin[i]);
                    }
                }
            }
            // Använder funktionen som skapar jobbkort i jobwiev.js och skickar in rätt div där de ska skapas i 
            createjobcard(jobstodisplay, "#studentAppliedJobs");
        }
    });


}
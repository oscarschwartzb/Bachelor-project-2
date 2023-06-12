function showorderhistory() {

    company_id = JSON.parse(sessionStorage.getItem('user')).id;

    $.ajax({
        url: 'http://localhost:5000' + '/company/' + company_id + '/orderhistory',
        type: 'GET',
        success: function (jobsin) {

            createorderhistorymodal(jobsin); 

        }
    });


}

function createorderhistorymodal(jobsin){
    $('#orderhistorymodal').modal('show');
    document.getElementById("orderhistory-body").innerHTML = " ";

    var html = `
         <div class= "orderhistory-job">
            `

    for (job in jobsin.reverse()) {
      html +=
        `
        <div class= "orderhistory-single-job">
        <div class= "orderhistory-single-job-inner">
        <h6> <strong>${jobsin[job].title}</strong>
        `
        if (jobsin[job].isactive){
            html +=
        `<i> (aktiv annons)</i>`

        } else {
            html +=
            `<i> (inaktiv annons)</i>`
        }
        html +=

        `
        </h6>
        <strong>Plats:</strong> ${jobsin[job].location}<br>
        <strong>Termin:</strong> ${jobsin[job].periods}<br>
        <strong>Pris:</strong> ${jobsin[job].price} SEK<P>
        </div>    
        </div>   
              `

    }



     html +=
            `
            </div>
                        `
    // document.getElementById("orderhistory-body").innerHTML = " ";
    $("#orderhistory-body").append(html);

}



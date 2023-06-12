var host = "http://localhost:5000";

// När man klickat på ett jobkort i jobview får man med sig det aktuella id:t och jobbet hämtas in 
function alert_application(id) {
    $("#containerReal").html($("#view-jobcard").html());
    myJob = false;

    $.ajax({
        url: 'http://localhost:5000' + '/jobpage/' + id,
        type: 'GET',

        success: function (jobin) {

            job = jobin.job;
            company = jobin.company;
            student_list = jobin.student;
            document.getElementById("")
            // Skapar html kod för det aktuella jobbet och dess atributer och returnerar det till en yttre div i jobcard.html
            var html = `
            <div id="single-jobcard">
               <!--  <img src="img/pexels-fauxels-3183183.jpg" style="opacity: 0.6;" class="card-img" alt="..."> -->
                <div id="overlay">
                <div id="outer-text-company">
                    <div id ="outertextbox">
                        <div id ="innertextbox">

                    <div id="jobcard-header">
                        <div id="text-jobcard-header">
                            <h1 id = "first-header" style="color:black; text-align: start;">${job.title}</h1>
                            `

            // om student är inloggad visas: ansök
            // om student är inloggad och har sökt jobbet visas: ta bort
            // om student inte är inloggad visas registrera

            if (JSON.parse(sessionStorage.getItem('user_type')) == null) {

                html += `
                             </p><button class="btn btn-primary btn-lg" id="apply-button-jobcard" style="background-color:#9ca4aa; border-color:white" type="button" onclick="register_student_function()"> Registrera dig </button>
                             `

            } else {
                if (JSON.parse(sessionStorage.getItem('user_type')) == "student") {
                    userjobs = new Array();


                    userjobs = JSON.parse(sessionStorage.getItem('jobs'));

                    // om företag är inloggad och det inte är dess jobb visas: inget
                    // om företag är inloggad och det är dess jobb visas: ta bort
                    if (userjobs == null) {
                        returntext = "Ansök";
                        functiontext = "applyapp";
                    } else {

                        returntext = "Ansök";
                        functiontext = "applyapp";
                        for (studentjobid in userjobs) {

                            // OBS: Om man tar bort ett uppdrag så ändras ej användarens token

                            if (userjobs[studentjobid] == job.id) {
                                returntext = "Ta bort ansökan";
                                functiontext = "deleteapp";
                                break;
                            }
                        }


                    }
                    html += `
                             </p><button class="btn btn-primary btn-lg" id="apply-button-jobcard" style="background-color:#9ca4aa; border-color:white" type="button" onclick="${functiontext}(${job.id})"> ${returntext} </button>
                             `

                } else {
                    companyjobs = new Array();
                    companyjobs = JSON.parse(sessionStorage.getItem('jobs'));
                    admin =  JSON.parse(sessionStorage.getItem('user')).is_admin;

                    if (admin){
                        html += `
                        </p><button class="btn btn-primary btn-lg" id="apply-button-jobcard" style="background-color:#9ca4aa; border-color:white" type="button" onclick="showdeletemodal(${job.id})">Ta bort annons</button>
                        `
                    }else{

                        for (companyjobid in companyjobs) {

                        if (companyjobs[companyjobid] == job.id) {
                            myJob = true;
                            html += `
                                            </p><button class="btn btn-primary btn-lg" id="apply-button-jobcard" style="background-color:#9ca4aa; border-color:white" type="button" onclick="showdeletemodal(${job.id})">Ta bort annons</button>
                                            `
                            break;
                        }


                    }


                }
            }
            html += `
                        </div>
                    </div>
                    <div id="jobdescriptiontext">
                        <p style="margin:15px">
                        ${job.description}
                        </p>
                        </div>
                        </div>
                        `
                        if(!myJob){
                        html += `
                        <div id ="companyinfo">
                            <div id = "companyinfoinner" style = "margin: 10px; color:black" >
                                <div id= "company_info_header_icon">
                                <h2 style="color:black">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#29648A" class="bi bi-building" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694 1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z"/>
                                    <path d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z"/>
                                    </svg>
                                  Företagsinfo:</h2>
                                </div>
                                <div style="margin-left: 30px; margin-right: 30px;">
                                <P><strong>Företag:</strong> ${company.companyname}<P>
                                <P><strong>Ort:</strong> ${job.location}<P>
                                <P><strong>Kontakt:</strong> ${company.email}<P>
                                <P><strong>Termin:</strong> ${job.periods}<P>
                                </div>
                            </div>
                        </div>`
                    }else{
                    html += `
                         <div id ="appliedinfo">
                         <div id = "companyinfoinner" style = "margin: 10px; color:black" >
                             <div id= "company_info_header_icon">
                             <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#29648A" class="bi bi-inboxes-fill" viewBox="0 0 16 16" style="margin-right: 7px">
                             <path d="M4.98 1a.5.5 0 0 0-.39.188L1.54 5H6a.5.5 0 0 1 .5.5 1.5 1.5 0 0 0 3 0A.5.5 0 0 1 10 5h4.46l-3.05-3.812A.5.5 0 0 0 11.02 1H4.98zM3.81.563A1.5 1.5 0 0 1 4.98 0h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .106.374l-.39 3.124A1.5 1.5 0 0 1 14.117 10H1.883A1.5 1.5 0 0 1 .394 8.686l-.39-3.124a.5.5 0 0 1 .106-.374L3.81.563zM.125 11.17A.5.5 0 0 1 .5 11H6a.5.5 0 0 1 .5.5 1.5 1.5 0 0 0 3 0 .5.5 0 0 1 .5-.5h5.5a.5.5 0 0 1 .496.562l-.39 3.124A1.5 1.5 0 0 1 14.117 16H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .121-.393z"/>
                             </svg>
                             <h2 style="color:black">
                               Ansökningar</h2>
                             </div>
                             <div id="applied-div" style="margin-left: 30px; margin-right: 10px; padding-right: 20px;">`

                for (student in student_list) {
                    html += `   <div style="border-bottom: 1px solid black">
                                <P><strong>Namn:</strong> ${student_list[student].firstname} ${student_list[student].lastname}<P>
                                <P><strong>E-post:</strong> ${student_list[student].email}<P>
                                <button
                                type="button"
                                class="btn btn-primary"
                                data-toggle="modal"
                                data-target="#myModal"
                                onclick = "applicantsCV(${student_list[student].id})"
                                id="upload-pdf-modal-button"
                              >
                                Visa CV
                              </button>
                              </div>`
                }

                html += `
                             </div>
                         </div>
                    </div>`
            }
            html += `
                    </div>
                    </div>
                    </div>
                    <div id = "jobcard-bottomdiv">
                </div>
                </div>
          
             </div>


             <div id="myModal" class="modal fade" role="dialog" data-backdrop="false">
                  <div class="modal-dialog modal-lg">
                    <!-- Modal content-->
                    <div class="modal-content">
                      <div class="modal-header">
                        <button
                          type="button"
                          class="close"
                          data-dismiss="modal"
                        >
                          &times;
                        </button>
                      </div>
                      <div class="modal-body" id="preview-pdf-modal">
                        <!-- embed file goes here, done done with updateUserPreviewModal() in file_handle.js -->
                      </div>
                  </div>
                </div>
        `
            // lägger till skapad html kod i på jobcard sidan i diven men id outer-single-jobcard. 
            $("#outer-single-jobcard").append(html);

        }
    }
    });
}



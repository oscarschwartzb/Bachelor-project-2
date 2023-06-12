// Funktion som kallas på när den inloggade studenten ska ansöka om ett jobb 
function applyapp(id1) {
    apply_delete_job(id1)
}

// Funktion som kallas på när den inloggade studenten ska ta bort sin ansökan och triggar modalen som här till handlingen
function deleteapp(id2) {
    $('#deleteappModal').modal('show');
    document.getElementById("modal_delete_application_button").onclick = function () { apply_delete_job(id2); }
}


function apply_delete_job(id) {

    $.ajax({
        url: 'http://localhost:5000/' + 'student/' + JSON.parse(sessionStorage.getItem('user')).id + '/' + id,
        type: 'PUT',
        success: function (student) {

            if (student.jobs) {
                sessionStorage.setItem('jobs', JSON.stringify(student.jobs));
            } else {
                sessionStorage.setItem('jobs', JSON.stringify([]));
            }

            // Kod som ändrar testen på knappen i en specifik annons, ligger jobbet i studentens lista visas istället texten "ta bort ansökan" 
            buttontext = "Ansök";

            for (job in student.jobs) {
                if (student.jobs[job] == id) {
                    // bekräftelse modal 
                    $('#applymodal').modal('show');
                    buttontext = "Ta bort ansökan";

                    break;
                } else {
                    $('#deleteappModal').modal('hide');
                }
                buttontext = "Ansök";
            }

            // Ändrar funktionsanropp i knappen och skikar med rätt id 
            document.getElementById("apply-button-jobcard").innerHTML = buttontext;
            if (buttontext == "Ansök") {
                document.getElementById("apply-button-jobcard").onclick = function () { applyapp(parseInt(id)); }
                $('#deleteappModal').modal('hide');
            } else if (buttontext == "Ta bort ansökan") {
                document.getElementById("apply-button-jobcard").onclick = function () { deleteapp(parseInt(id)); }
            }

        }
    })

}
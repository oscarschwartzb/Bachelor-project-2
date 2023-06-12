//Modal som visas innan där ett företag måste godkänna en extra gång innan jobb tas bort 
function showdeletemodal(id){
    $('#deleteModal').modal('show');
    // skickar med rätt id till funktionen remove_job i modalen 
    document.getElementById("modal_delete_job_button").onclick = function () {remove_job(id); }
}

// Funktion som låter företag ta bort de jobben de laggt upp
// Tar bort jobbet i db och tar bort det aktuella jobbet ur företagets session storage job lista 
function remove_job(id) {

    $.ajax({
        url: 'http://localhost:5000/' + 'jobpage/' + id +'/changestatus',
        type: 'PUT',

        success: function (student) {
            var companyjobsold = JSON.parse(sessionStorage.getItem('jobs'));
            var companyjobsnew = new Array();

            for (idold in companyjobsold) {
                if (companyjobsold[idold] != id) {
                    companyjobsnew.push(companyjobsold[idold]);
                }
            }
            sessionStorage.setItem('jobs', JSON.stringify(companyjobsnew));
            // gömmer modalen innan man kommer tillbaka till min sida 
            $('#deleteModal').modal('hide');
            myPage();

        }
    })

    // Kolla vidare på detta

    document.getElementById("page1Link").style.borderBottom = "none";
    document.getElementById("page2Link").style.borderBottom = "none";
    document.getElementById("page3Link").style.borderBottom = "none";
    document.getElementById("page4Link").style.borderBottom = "none";
    document.getElementById("page5Link").style.borderBottom = "none";
    document.getElementById("page6Link").style.borderBottom = "none";
    document.getElementById("my_page").style.borderBottom = "thin solid #4682B4";  

}
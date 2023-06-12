// saves flesize as a cookie to be used for filesize validation
function filesize(elem) {
  document.cookie = `filesize=${elem.files[0].size}`;
}


function showUploadFilename(elem) {
  document.getElementById(
    "file-name-input"
  ).innerHTML = `${elem.files[0].name}`;
}


//deletes current pdf-file
function deleteFile() {
  
  var user_id = JSON.parse(sessionStorage.getItem("user")).id;
  var url = "upload-pdf/" + user_id;
  
  $.ajax({
    url: url,
    type: "DELETE",
    success: function () {
      updateUserPreviewModal();
      $("#upload-pdf-modal-button").delay(100).fadeOut().fadeIn("Slow");
    },

  });
}


// embeds the file to be loaded with modal as <embed../>
function updateUserPreviewModal() {
  var user_id = JSON.parse(sessionStorage.getItem("user")).id;
  
  $.get("upload-pdf/" + user_id, function (data) {
    $("#preview-pdf-modal").html(
      '<embed frameborder="0" width="100%" height="800px" src=' +
        data.res_uri +
        "/>"
    );

  });
}


function loadUserPreviewResume(){
  var user_id = JSON.parse(sessionStorage.getItem("user")).id;
  
  $.get("upload-pdf/" + user_id, function (data) {
    $("#cv-container").html(
      '<embed id="cv-embed" src=' +
        data.res_uri + '#toolbar=0&navpanes=0' +
        "/>"
    );

  });


} 

// binds POST-function to executed upon "submit".
function bindSubmitPDF() {
  $("form#upload-pdf-form").unbind("submit");

  $("form#upload-pdf-form").submit(function (e) {
    e.preventDefault();
    var user_id = JSON.parse(sessionStorage.getItem("user")).id;
    var formData = new FormData(this);
    
    $.ajax({
      url: "upload-pdf/" + user_id,
      type: "POST",
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function () {
        updateUserPreviewModal();
        $("#file-name-input").text("Ingen fil vald");
        $("#upload-pdf-modal-button").delay(100).fadeOut().fadeIn("Slow");
        $("form#upload-pdf-form").unbind("submit");
      },
    });

  });
}
 // hämtar studentens CV till ansökta jobb
function applicantsCV(user_id) {
  
  $.get("upload-pdf/" + user_id, function (data) {
    $("#preview-pdf-modal").html(
      '<embed frameborder="0" width="100%" height="800px" src=' +
        data.res_uri +
        "/>"
    );

  });
}

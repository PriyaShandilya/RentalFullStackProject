// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
form.addEventListener('submit', function (event) {
    // Select the textarea
    let textarea = form.querySelector('textarea');
    if(textarea) {
        // Manually trim the value in the browser
        textarea.value = textarea.value.trim();
    }

    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
}, false);
    })
})()
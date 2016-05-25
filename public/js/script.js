'use strict';
$("#header").load("/includes/header.html");
$("#footer").load("/includes/footer.html");

$(document).ready(function() {
  $('#loginTrigger').click(function() {
    $('#loginModal').openModal();
  });
});

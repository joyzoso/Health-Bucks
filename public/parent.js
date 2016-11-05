function addCredit() {
  $.ajax({
    type: "put",
    data: {"add": true},
    url: "/credit",
    success: function(data) { console.log('points added!');}
 });
}

$(document).ready(function() {
  $(".target").on('click', function() {
    addCredit();
  });
});

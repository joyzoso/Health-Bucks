function addCredit() {
  $.ajax({
    type: "put",
    data: {"add": true},
    url: "/credit",
    success: function(data) { alert('success!');}
 });
}

$(document).ready(function() {
  $(".target").on('click', function() {
    addCredit();
  });
});

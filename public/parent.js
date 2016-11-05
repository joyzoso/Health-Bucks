var credit = 250;

function addCredit() {
  $.ajax({
    type: "put",
    data: {"add": true},
    url: "/credit",
    success: function(data) { console.log('points added!');}
  });
}

function getCredit() {
  $.ajax({
    type: "get",
    url: "/credit",
    success: function(data) {
      console.log('got credits!');
      credit = data.credit;
      document.getElementById("earned").innerHTML = credit;
    }
 });
}

$(document).ready(function() {
  getCredit();
  document.getElementById("earned").innerHTML = credit;
  $(".target").on('click', function() {
    addCredit();
    getCredit();
    document.getElementById("earned").innerHTML = credit;
  });
});

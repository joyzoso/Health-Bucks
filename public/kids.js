let user = {"parent":"","username":"","credit":0,"minecraftTime":{"available":0,"total":0}};


function saveUser(user) {
  $.ajax({
    url: "/credit", type: 'PUT', data: user, success: function(res) { }
  })
}

var mcBuyTime = function() {
  if (user.credit >= 1) {
    user.credit -= 1;
    document.getElementById("earned").innerHTML = user.credit
    saveUser({'checkoutCredit': 1})
  }
}
var buyNike = function() {
  if (user.credit >= 100) {
    user.credit -= 100;
    document.getElementById("earned").innerHTML = user.credit
    saveUser({'checkoutCredit': 100})
  }
}

$(document).ready(function() {
  $.ajax({
    url: "/credit", success: function(res) {
      user = res.user;
      document.getElementById("earned").innerHTML = res.user.credit;

    }
  })



})

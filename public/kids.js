$(document).ready(function() {
  $.ajax({
    url: "/credit", success: function(res) {
      console.log(res)
    }
  })
})

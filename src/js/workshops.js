$("body").delegate('#workshop-form', 'submit', function() {
  var name = $('#workshop-form #name').val();
  var mail = $('#workshop-form #mail').val();
  var phone = $('#workshop-form #phone').val();
  var address = $('#workshop-form #city').val();
  var check = $('#workshop-form #agreed:checked').length;
  
  $.ajax({
    type: 'post',
    dataType: 'json',
    url: 'workshop.php',
    data: {
      'name': name,
      'mail': mail,
      'phone': phone,
      'city': address,
      'check' : check
    },
    success: function(msg) {
      // $('#workshop-form #submit').addClass('btn-success');
      $("#register").find( "#workshop-form #submit" ).addClass( "btn-success" );
      console.log(msg.content);
    }
  });
  
  return false;
});

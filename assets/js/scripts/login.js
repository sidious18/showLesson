$( document ).ready(function() {

 	$(".need-registration").click(function(){
 		$('.form-signin').hide();
 		$('.form-create-user').show();
	});

	$(".have-account").click(function(){
  		$('.form-create-user').hide();
  		$('.form-signin').show();
  	});


  	$('.login-account').click(function(){

		$.ajax({ 
  			type: "POST",
  	    	url: '/login/create',
	    	data: {
		  		email: $(".login-user-name").val(),
		  		password: $(".login-user-password").val(),
		  		_csrf: $(".csrf").val()
		  	}
		}).done(function(){
			window.location.replace("/");
		}).error(function(error){
			$(".error-notification").remove();
			$("body").append("<div class='error-notification'></div>");
			$(".error-notification").append(error.responseText);
			setTimeout(function(){
			 	$(".error-notification").fadeOut(1000);
			},3000);
		});

	});

	$('.create-account').click(function(){
		$.ajax({ 
  			type: "POST",
  	    	url: '/user/create',
	    	data: {
		  		name: $(".create-user-name").val(),
		  		email: $(".create-user-email").val(),
		  		password: $(".create-user-password").val(),
		  		confirmation: $(".create-user-confirmation").val(),
		  		_csrf: $(".csrf").val()
		  	}
		}).done(function(){
			window.location.replace("/");
		}).error(function(error){
			$(".error-notification").remove();
			$("body").append("<div class='error-notification'></div>");
			$(".error-notification").append(error.responseText);
			setTimeout(function(){
			 	$(".error-notification").fadeOut(1000);
			},3000);
		});

	});

});


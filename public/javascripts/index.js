$(function() {

	// Initial hide of signup
	$("#signup").hide();
	$("#login-butn").hide();

	// Show signup page hide everything else
	$("#signup-butn").on('click', function(){
		$(this).hide();
		$("#login").hide();

		$("#signup").show();
		$("#login-butn").show();
	});

	// Show login page hide everything else
	$("#login-butn").on('click', function(){
		$(this).hide();
		$("#signup").hide();
		
		$("#login").show();
		$("#signup-butn").show();
	});
});
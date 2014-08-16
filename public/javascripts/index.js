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

	$("#buy-butn").on('click', function(){
		console.log("pressed");
	});
});

buy = function(listing){
	console.log("listing id: " + listing._id);
}

$('#container h3').click(function(e) {

    //Close all <div> but the <div> right after the clicked <a>
    $(e.target).next('div').siblings('div').slideUp('fast');
});



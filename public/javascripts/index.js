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

	$('form.acceptMeet').submit(function (e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        tID = $(this)[0].childNodes[1].value;

        console.log("fd: " + fd);
        $.ajax({
            url: '/transaction/acceptLT',
            data : {trans : tID},
            processData: false,
            contentType: false,
            type: 'POST',
            params: {trans : tID},
            success: function(data){
                console.log(data);
            }
        });
	});
});

buy = function(listing){
	console.log("listing id: " + listing._id);
}

$('#container h3').click(function(e) {

    //Close all <div> but the <div> right after the clicked <a>
    $(e.target).next('div').siblings('div').slideUp('fast');
});

// acceptMeet = function(conv){
// 	$.ajax({
//     type: 'POST',
//     headers: {'var': "variable"},
//     url : '/transaction/acceptLT', // or whatever
//         success : function (response) {
//             console.log(response);
//         }
// });
// }





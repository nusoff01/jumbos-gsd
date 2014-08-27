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


	//Page: profile, Section: transaction
	//this event occurs when the accept button is pressed when 
	//a user wants to finalize a meetup. 


	$('div.del-listing').on('click', function(){
		var id = $(this)[0].childNodes[1].childNodes[1].value;
		data = JSON.stringify({id : id});
		div = $(this)[0].parentNode;
		$.ajax({
			type: 'POST',
			url: '/listing/delete',
			data: data,
			processData: false,
			contentType: 'application/json',
			success: function(data){
				console.log(JSON.stringify(data));
				div.parentNode.removeChild(div);
				var mes = document.getElementById("alert-message");
				mes.value = "listing deleted";
			}
		})
	});

	$('form.acceptMeet').submit(function (e) {
		
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        tID = $(this)[0].childNodes[1].value;

        data = JSON.stringify({trans : tID});
        $.ajax({
        	type: 'POST',
            url: '/transaction/acceptLT',
            data : data,
            processData: false,
            contentType: 'application/json',					
            success: function(data) {
            	// add a message to the transaction page, emmit an alert to 
            	// the other person in the transaction
                console.log('success');
                console.log(JSON.stringify(data));
            }
        });
	});


	//Page: profile, Section: transaction
	//this event occurs when the send 

	$('form.sendM').submit(function (e) {
		e.preventDefault();

		mContent = $(this)[0].childNodes[1].childNodes[1].value;
		$(this)[0].childNodes[1].childNodes[1].value = "";
		mTrans = $(this)[0].childNodes[1].childNodes[3].value;
		
		data = JSON.stringify({content: mContent, transID: mTrans});
		$.ajax({
			type: 'POST',
			url: '/transaction/addM',
			data: data,
			processData: false, 
			dataType: 'text',
			contentType: 'application/json',
			success: function(data) {
				$(mTrans).hide().fadeIn('fast');
				var text = data;
				var node = document.createTextNode(text);
				var h3 = document.createElement("h3");
				h3.appendChild(node);
				var chatLog = document.getElementById(mTrans);
				chatLog.appendChild(h3);

				//$("home-box").append( "<h3>Hello</h3>" );
				//$(this).parentNode().hide();
			}
		});
	});


	//Page: add listing
	//occurs when a person presses submit to add a listing
	$('form.addL').submit(function (e) {
		e.preventDefault();
	});

	$('button.alert-delete').on('click', function(){
		$(this).closest('h3').remove();
	});

});

buy = function(listing){
	console.log("listing id: " + listing._id);
}

$('#container h3').click(function(e) {
	console.log("this one");
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

//click on the chat button for a transaction on the profile page
toggleChat = function(divID, chatID){
	//console.log(id);
	divTag = "#" + divID;
	chatTag = "#" + chatID;
	console.log(chatTag);

	$(divTag).toggle();
	console.log($(divTag).is(":visible"));
	if($(divTag).is(":visible") ){
		$('html, body').animate({
	        scrollTop: $(chatTag).offset().top
	    }, 1000);
	}
}

// $('.chat').on('click', function(){
// 			$(this).closest('div').siblings().toggle();
// 			div = $(this).closest('div').next('div');
// 			$(this).closest('div').next('div').scrollTop($(this).closest('div').next('div').height());
// 			//div.animate({ scrollTop: div.height()}, 1000);
// 			console.log($(this).closest('div').next('div').height());
// 		});





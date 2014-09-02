$(function() {

	// Initial hide of signup
	$("#login").hide();
	$("#signup-butn").hide();
	$('.tContent').hide();
	$('.setLT').hide();
	$('.l-dropdown').hide();

	// Show signup page hide everything else
	$("#signup-butn").on('click', showSignUp);
		
	

	// Show login page hide everything else
	$("#login-butn").on('click', showLogin);



	// $("#buy-butn").on('click', function(){
	// 	console.log("pressed");
	// });


	//Page: profile, Section: transaction
	//this event occurs when the accept button is pressed when 
	//a user wants to finalize a meetup. 


	//user deleted an alert

	$('button.del-alert').on('click', function(){
		$(this).closest('h3').remove();
		var id = $(this)[0].childNodes[1].value;
		deleteAlert(id);
	});

	$('button.goto-alert').on('click', function(){
		$(this).closest('h3').remove();
		var id = $(this)[0].childNodes[1].value;
		var del = $(this)[0].childNodes[3].value;
		goToTrans(id, del);
	});


	//user deleted their own listing

	$('div.del-listing').on('click', function(){
		
		var id = $(this)[0].childNodes[1].value;
		data = JSON.stringify({id : id});
		div = $(this)[0].parentNode;
		$.ajax({
			type: 'POST',
			url: '/listing/delete',
			data: data,
			processData: false,
			contentType: 'application/json',
			success: function(data){
				// console.log(JSON.stringify(data));
				div.parentNode.removeChild(div);
				var mes = document.getElementById("alert-message");
				mes.value = "listing deleted";
			}
		});
	});

	//buyinf a 

	// $('div.l-button').on('click', function(){
	// 	var id = $(this)[0].childNodes[1].value;
	// 	console.log(id);
	// 	data = JSON.stringify({listing : id});
	// 	$.ajax({
	// 		type: 'POST',
	// 		url: '/transaction/postT',
	// 		data: data,
	// 		processData: false,
	// 		contentType: 'application/json',
	// 		success: function(data){
	// 			link = JSON.stringify(data);
	// 			window.location = link;
	// 		}

	// 	});
	// });

	// $('form.acceptMeet').submit(function (e) {
		
 //        e.preventDefault();
 //        var fd = new FormData($(this)[0]);
 //        tID = $(this)[0].childNodes[1].value;

 //        data = JSON.stringify({trans : tID});
 //        $.ajax({
 //        	type: 'POST',
 //            url: '/transaction/acceptLT',
 //            data : data,
 //            processData: false,
 //            contentType: 'application/json',					
 //            success: function(data) {
 //            	// add a message to the transaction page, emmit an alert to 
 //            	// the other person in the transaction
 //                console.log('success');
 //                console.log(JSON.stringify(data));
 //            }
 //        });
	// });


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

	$('form.deleteT').submit(function (e){
		e.preventDefault();

		tID = $(this)[0].childNodes[1].value;
		data = JSON.stringify({tID: tID});
		// console.log($(this).parent().parent().parent());
		$(this).parent().parent().parent().hide();
		$.ajax({
			type: 'POST',
			url: '/transaction/delT',
			data: data,
			processData: false,
			dataType: 'text',
			contentType: 'application/json',
			success: function(data){
				if(data == "OK"){
					$(this).parent().parent().parent().hide();
				} 
			}
		});
	});
	$('form.finishT').submit(function (e){
		e.preventDefault();

		tID = $(this)[0].childNodes[1].value;
		console.log(tID);
		data = JSON.stringify({tID: tID});
		// console.log($(this).parent().parent().parent());
		$(this).parent().parent().parent().hide();
		$.ajax({
			type: 'POST',
			url: '/transaction/finishT',
			data: data,
			processData: false,
			dataType: 'text',
			contentType: 'application/json',
			success: function(data){
				if(data == "OK"){
					$(this).parent().parent().parent().hide();
				} 
			}
		});
	});

	$('#plus-course').on('click', function(){

		var courseNum = ++($(this)[0].parentNode.parentNode.childNodes[1].value);
		
		var appendage = "<div class='form-container'><h3>[Add Course]</h3>\
					<div class='pure-control-group'><label>Course Department</label>\
            			<input type='text' class='form-control' name='department" + courseNum + "'/>\
            		</div>\
            		<div class='pure-control-group'>\
            			<label>Course Number</label>\
            			<input type='number' class='form-control' name='number" + courseNum + "'/>\
            		</div></div>";
        $(this).parent().prepend(appendage);
	})

	//Page: add listing
	//occurs when a person presses submit to add a listing
	// $('form.addL').submit(function (e) {
	// 	e.preventDefault();
	// });

	

});

// buy = function(listing){
// 	console.log("listing id: " + listing._id);
// }

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

//click on the chat button for a transaction on the profile page

toggleChat = function(divID, chatID){
	//console.log(id);
	divTag = "#" + divID;
	chatTag = "#" + chatID;
	// console.log(chatTag);

	$(divTag).toggle();
	// console.log($(divTag).is(":visible"));
	if($(divTag).is(":visible") ){
		$('html, body').animate({
	        scrollTop: $(chatTag).offset().top - 200
	    }, 1000);
	}
}

showSignUp = function(){
		$("#login").hide();
		$("#signup-butn").hide();
		$("#signup").show();
		$("#login-butn").show();
	}

showLogin = function(){
	$("#login-butn").hide();
	$("#signup").hide();
	
	$("#login").show();
	$("#signup-butn").show();
}

//click on the "more" button for a listing
togglelDrop = function(divID, toggleID){
	var divTag = "#" + divID;
	var tTag = "#" + toggleID;
	$(divTag).toggle();
	if($(divTag).is(":visible")){
		$(tTag).html("less &#x25B2;")
	} else {
		$(tTag).html("more &#9660;")
	}
}

//click on the goto button for an alert

goToTrans = function(id, delID){
	divTag = "#c" + id;
	chatTag = "#s" + id;
	$(divTag).show();
	$('html, body').animate({
	    scrollTop: $(chatTag).offset().top
	}, 1000);
	deleteAlert(delID);
}

//delete an alert given an index

deleteAlert = function(index){
	data = JSON.stringify({index: index});
		$.ajax({
			type: 'POST',
			url: '/user/deleteAlert',
			data: data,
			processData: false, 
			dataType: 'text',
			contentType: 'application/json',
			success: function(response) {
				if(response == "OK"){
				}
			}
		});
}

findCoursesByT = function(title){
	console.log("function call");
	data = JSON.stringify({title: title});
	retString = ""
		$.ajax({
			type: 'POST',
			url: '/book/findCourses',
			data: data,
			processData: false, 
			dataType: 'text',
			async: false,
			contentType: 'application/json',
			success: function(response) {
				retString += response;
			}
		});
		return retString;
}
addCouseByT = function(bookTitle, dept, num){y
	data = JSON.stringify()
}

displayCorrect = function(sOrL){
	console.log(sOrL);
}



// $('.chat').on('click', function(){
// 			$(this).closest('div').siblings().toggle();
// 			div = $(this).closest('div').next('div');
// 			$(this).closest('div').next('div').scrollTop($(this).closest('div').next('div').height());
// 			//div.animate({ scrollTop: div.height()}, 1000);
// 			console.log($(this).closest('div').next('div').height());
// 		});





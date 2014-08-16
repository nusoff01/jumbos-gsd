// create a new instance of the Mandrill class with your API key
var m = new mandrill.Mandrill('ovXi-s2-ZO06GrWdxGcfBg');

// create a variable for the API call parameters
var sender = "tehusoff@gmail.com";
var name = ".";
var input = "";

function getSender(){
    return document.getElementById('email').value;
}

function getContent(){
    name = document.getElementById('name').value;
    comments = document.getElementById('comments').value;
    console.log(comments);
    message = "Message from" + name + ": " + comments;
    return message;
}

getReceiver = new function(){
    return 
}

function sendTheMail() {
// Send the email!
    
    sender = getSender();
    content = getContent();
    params["message"]["from_email"] = sender;
    params["message"]["html"] = content;
    if(validateEmail(sender)){
        m.messages.send(params, function(res) {
            userResponse(res);
        }, function(err) {
            userResponse(err);
        });
    }
    else
        console.log("invalid email address");
}

// email validation before input is sent
function validateEmail(email) {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  if( !emailReg.test(email) ) {
    return false;
  } else {
    return true;
  }
}

function userResponse(obj){
    responseText = "";
    status = obj[0].status;
    reason = obj[0].reject_reason;
    console.log(obj[0]);

    if(status == "sent"){
        responseText = "Thank you for getting in touch!";
    }
    else if (status == "rejected" && reason == "invalid-sender"){
        responseText = "Please use a valid email address";
    }
    else{
         responseText = "Sorry, something's wrong on my part. Shoot me an email at nicholas.usoff@tufts.edu to get in touch";
    }
    comments = document.getElementById('contact');
    response = "<h3>" + responseText + "</h3>";
    formResponse.innerHTML = response;
}

//response to user if email address is valid 


var params = {
    "message": {
        "from_email":sender,
        "to":[{"email":"tehusoff@gmail.com"}],
        "subject": "Message from nickusoff.com",
        "html": "<p>Hello Catherine...</p>",
        "autotext": true,
        "track_opens": true,
        "track_clicks": true
    }
};
var restify = require('restify');
var builder = require('botbuilder');
var fs = require('fs');

// Setup Restify Server
var https_options = {
  key: fs.readFileSync('xbot.key'),
  certificate: fs.readFileSync('xbot.crt')
};
var server = restify.createServer(https_options);
server.listen(process.env.port || process.env.PORT || 443 , function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "9226329b-90fd-45ba-8d04-ae0f09504e1c",
    appPassword: "zdqwigMV192$|lMOYFC42+]"
});

// Listen for messages from users
server.post('/API/Messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    /*
    if(typeof(session.userData.login)=='undefined') {
        session.send("resp: please type login first");
    } else {
        session.send("resp: %s ", session.userData.login);
    }
    */
    if(session.message.text.startsWith('login')) {
        login(session);
    } else if(typeof(session.userData.login)=='undefined') {
        session.send("resp: please type login first");
    } else if(session.message.text === 'show_faq_list'){
        showFaqList(session);
    } else {
        session.send("resp: your userid is %d", session.userData.login);
    }
});

function login(session) {
    var userId = session.message.text.replace('login','').replace(' ','');
    session.userData.login=parseInt(userId)
    session.send("resp: login successfully , your userid is %s", userId);
}


function showFaqList(session) {
    var request=require('request');
    var userId = session.userData.login
    var options = {
        headers: {"Connection": "close"},
        url: 'http://40.125.209.166/admin/show_faq_list',
        method: 'POST',
        json:true,
        body: {'currentClient':userId}
    };
    function callback(error, response, data) {
        if (!error && response.statusCode == 200) {
            console.log('----info------',data);
            session.send("resp: faq_list [%s]", JSON.stringify(data));
        } else {
            session.send("resp: error userId");
        }
    }
    var rtn = request(options, callback)
    
}

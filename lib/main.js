/*
Client ID: 737302378245.apps.googleusercontent.com
Client secret:  rcWgBDcdt9PuVnrKGXz81Hf7
Redirect URIs: 	urn:ietf:wg:oauth:2.0:oob 
http://localhost
*/

var tabs = require("sdk/tabs");

var data = require("sdk/self").data;
var Request = require("sdk/request").Request;
/* OAUTH CONSTANTS */
var CLIENT_ID = '737302378245.apps.googleusercontent.com';
var CLIENT_SECRET = 'rcWgBDcdt9PuVnrKGXz81Hf7';
var REDIRECT_URI_URN = 'urn:ietf:wg:oauth:2.0:oob';
var REDIRECT_URI_LOCAL = 'http://localhost';
var URL = 'https://accounts.google.com/o/oauth2/auth?'+'scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&'+'redirect_uri=' + REDIRECT_URI_URN + '&'+ 'client_id=' + CLIENT_ID+'&'+'response_type=code';
console.log(URL);

var myPanel = require("sdk/panel").Panel({
	width:500,
	height:500,
	contentScriptFile: data.url("drive-test.js"),
	contentURL: data.url("quickstart.html")
});

var myWidget = require("sdk/widget").Widget({
	id: "my-widget",
	label: "My Widget",
	content: "Tabs!",
	width: 50,
	panel: myPanel,
	onClick: auth
});

/*
tabs.on('activate', function(tab) {
  tab.attach({
    contentScript: 'self.postMessage(document.body.innerHTML);',
    onMessage: function (message) {
      console.log(message);
    }
  });
});
*/
/*
function auth(){

	
	tabs.on('ready',function(tab){
		tab.url = URL;
		var tabWorker = tab.attach({
			contentScriptFile: data.url('tab-access.js')	
		});
		tabWorekr.port.on('close',function(msg){
			tab.close();		
		});
			
	});
	
}
/*
https://accounts.google.com/o/oauth2/auth?
scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&
redirect_uri=urn:ietf:wg:oauth:2.0:oob&
response_type=code&
client_id=812741506391-h38jh0j4fv0ce1krdkiq0hfvt6n5amrf.apps.googleusercontent.com*/



function auth(){	
	var authenticate = Request({
	  	url: URL,/*'https://accounts.google.com/o/oauth2/auth?'+'scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&'+'redirect_uri=' + REDIRECT_URI_URN + '&'+ 'client_id=' + CLIENT_ID,*/
	 	onComplete: function (response) {
	    		//var answer = response.json[0];
	    		
	    		
	    		myPanel.port.emit('response',response.text);
	    		//console.log(response.text);
	    		//console.log("Tweet: " + tweet.text);
	    		//console.log(response.text);
  		}
	});
	authenticate.get();

};


/*
POST /o/oauth2/token HTTP/1.1
Host: accounts.google.com
Content-Type: application/x-www-form-urlencoded

code=4/v6xr77ewYqhvHSyW6UJ1w7jKwAzu&
client_id=8819981768.apps.googleusercontent.com&
client_secret={client_secret}&
redirect_uri=https://oauth2-login-demo.appspot.com/code&
grant_type=authorization_code

*/

myPanel.port.on('takeCode',function(myCode){
	//var toPost = 'code='+myCode+'&client_id='+CLIENT_ID+'&client_secret={'+CLIENT_SECRET+'}&redirect_uri'+REDIRECT_URI_URN+'&grant_type=authorization_code';
	var getAccess = Request({		
		url: 'https://accounts.google.com/o/oauth2/token',
		contentType: 'application/x-www-form-urlencoded',
		content: {'code': myCode,'client_id':CLIENT_ID,'client_secret':CLIENT_SECRET,'redirect_uri':REDIRECT_URI_URN,'grant_type':'authorization_code'},
		onComplete: function(response){
			console.log('STATUS ' + response.statusText);
			if(response.statusText =='OK'){
				//myPanel.contentURL = 'about:blank';
				myPanel.contentURL = data.url('signedIn.html');
				myPanel.contentScriptFile = data.url('signedIn.js');
				//myPanel.contentURL = data.url('quickstart.html');
				console.log(response.json);
			}
			myPanel.port.emit('getAccess',response);
			
		
		}
	});
	getAccess.post();
	



});


	







 


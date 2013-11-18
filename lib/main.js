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
var CLIENT_ID = 
var CLIENT_SECRET = 
var REDIRECT_URI_URN = 
var REDIRECT_URI_LOCAL = 'http://localhost';
var SCOPE = 'https://www.googleapis.com/auth/drive+';
var URL = 'https://accounts.google.com/o/oauth2/auth?'+'scope='+SCOPE+'https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&'+'redirect_uri=' + REDIRECT_URI_URN + '&'+ 'client_id=' + CLIENT_ID+'&'+'response_type=code';
console.log(URL);


var access_token;
var token_type;
var expires_in;
var id_token;
var refresh_token;


var myPanel = require("sdk/panel").Panel({
	width:500,
	height:500,
	contentScriptFile: [data.url("drive-test.js"),data.url("signedIn.js")],
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
var theCode;
myPanel.port.on('takeCode',function(myCode){
	//var toPost = 'code='+myCode+'&client_id='+CLIENT_ID+'&client_secret={'+CLIENT_SECRET+'}&redirect_uri'+REDIRECT_URI_URN+'&grant_type=authorization_code';
	theCode = myCode;
	var getAccess = Request({		
		url: 'https://accounts.google.com/o/oauth2/token',
		contentType: 'application/x-www-form-urlencoded',
		content: {'code': myCode,'client_id':CLIENT_ID,'client_secret':CLIENT_SECRET,'redirect_uri':REDIRECT_URI_URN,'grant_type':'authorization_code'},
		onComplete: function(response){
			console.log('STATUS ' + response.statusText);
			if(response.statusText =='OK'){
				/*
				The response format will be:
				 {
				  "access_token" : string,
				  "token_type" : string,
				  "expires_in" : 3600,
				  "id_token" : string,
				  "refresh_token" : string
				}
				To access this; response.json.access_token, etc
				*/
				//myPanel.contentURL = 'about:blank';
				myPanel.contentURL = data.url('signedIn.html');
				//console.log(JSON.stringify(response.json));
				//myPanel.contentScriptFile = data.url('signedIn.js');
				//var str = JSON.stringify(response.json);
				//console.log(str);
				
				//console.log(myPanel.contentScriptFile);
				//myPanel.contentURL = data.url('quickstart.html');
				access_token = response.json.access_token;
				token_type = response.json.token_type;
				expires_in = response.json.expires_in;
				id_token = response.json.id_token;
				refresh_token = response.json.refresh_token;
				console.log('Access completed!');
				uploadFile();
				//myPanel.port.emit('getAccess',response.json);
				//console.log(response.json.access_token);
			}
			
			
		
		}
	});
	getAccess.post();
	console.log('Posted!');
	
});

/*Upload a file*/

function uploadFile(){
	/*
	POST /upload/drive/v2/files?uploadType=resumable HTTP/1.1
	Host: www.googleapis.com
	Authorization: your_auth_token
	Content-Length: 38
	Content-Type: application/json; charset=UTF-8
	X-Upload-Content-Type: image/jpeg
	X-Upload-Content-Length: 2000000

	{
	  "title": "My File"
	}
	
	*/
	
	//First step: Start a resumable session:
	//console.log('Access token = ' + access_token);
	var session = Request({
		
		url: 'https://www.googleapis.com/upload/drive/v2/files?uploadType=resumable',
		//contentType: 'application/json; charset=UTF-8',
		headers: {'Host':'www.googleapis.com','Authorization': 'Bearer '+ access_token,'Content-Length':38,'Content-Type':'application/json; charset=UTF-8','X-Upload-Content-Type':'image/jpeg','X-Upload-Content-Length':2000000,'title':'testFile'},
		//content: {'title':'testFile'},
		onComplete: function(response){
			console.log('Upload file = ' + response.text);
			console.log('Upload file status = ' + response.status);
			console.log('Upload File status text = ' + response.statusText);
			console.log('Headers = ' + JSON.stringify(response.headers));
		
		}
	
	});
	session.post();

	

}



	







 


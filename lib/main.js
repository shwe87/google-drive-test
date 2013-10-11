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
var SCOPE = /*'https://www.googleapis.com/auth/drive+*/'https://www.googleapis.com/auth/drive.appdata+';
var URL = 'https://accounts.google.com/o/oauth2/auth?'+'scope='+SCOPE+'https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&'+'redirect_uri=' + REDIRECT_URI_URN + '&'+ 'client_id=' + CLIENT_ID+'&'+'response_type=code';
console.log(URL);


var access_token;
var token_type;
var expires_in;
var id_token;
var refresh_token;
var resumable_sesion_uri;


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
https://accounts.google.com/o/oauth2/auth?
scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&
redirect_uri=urn:ietf:wg:oauth:2.0:oob&
response_type=code&
client_id=812741506391-h38jh0j4fv0ce1krdkiq0hfvt6n5amrf.apps.googleusercontent.com
*/



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
				listFolder();
				//updateData();
				//searchFolder();
				//updateData();
				//startUploadFile();
				//myPanel.port.emit('getAccess',response.json);
				//console.log(response.json.access_token);
			}
			
			
		
		}
	});
	getAccess.post();
	console.log('Posted!');
	
});

/*Upload a file*/

function startUploadFile(){
	/*
	POST /upload/drive/v2/files?uploadType=resumable HTTP/1.1
	Host: www.googleapis.com
	Authorization: your_auth_token
	Content-Length: 38
	Content-Type: application/json; charset=UTF-8
	X-Upload-Content-Type: image/jpeg
	X-Upload-Content-Length: 2000000

	{
	  "title": "My File",
	  "parents": [{'id':'appdata'}]
	}
	To save the file in the appdata folder.
	*/
	
	//First step: Start a resumable session:
	//console.log('Access token = ' + access_token);
	var parents = [{'id':'appdata'}];
	var j = {'title': 'appFile.json','parents':parents};
	var str = JSON.stringify(j);
	var session = Request({		
		url: 'https://www.googleapis.com/upload/drive/v2/files?uploadType=resumable',
		//contentType: 'application/json; charset=UTF-8',
		headers: {'Host':'www.googleapis.com','Authorization': 'Bearer '+ access_token,'Content-Length':38,'Content-Type':'application/json; charset=UTF-8','X-Upload-Content-Type':'application/json'/*,'X-Upload-Content-Length':2000000*/},
		content: str,
		onComplete: function(response){
			console.log('Start Upload file = ' + response.text+'\r\n\r\n');
			console.log('Start Upload file status = ' + response.status+'\r\n\r\n');
			console.log('Start Upload File status text = ' + response.statusText+'\r\n\r\n');
			console.log('Start Headers = ' + JSON.stringify(response.headers+'\r\n\r\n'));
			resumable_sesion_uri = response.headers.Location;
			uploadFile();		
		}	
	});
	session.post();


}

function uploadFile(){
	var j = {'title':'new','author':'nobody'};
	var str = JSON.stringify(j);
	var session = Request({		
		url: resumable_sesion_uri,
		//contentType: 'application/json; charset=UTF-8',
		headers: {'Authorization': 'Bearer '+ access_token/*'Content-Length':38*/,'Content-Type':'application/json; charset=UTF-8'},
		content: str,
		onComplete: function(response){
			console.log('Upload file = ' + response.text);
			console.log('Upload file status = ' + response.status);
			console.log('Upload File status text = ' + response.statusText);
			console.log('Headers = ' + JSON.stringify(response.headers));
			resumable_sesion_uri = response.headers.Location;
		}
	
	});
	session.put();

}

/*
POST https://www.googleapis.com/drive/v2/files
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
...
{
  "title": "pets",
  "parents": [{"id":"0ADK06pfg"}]
  "mimeType": "application/vnd.google-apps.folder"
}




*/


/*
Don't have to create any folders. Creates automatically.
function createFolder(){

	var parents = [{'kind': 'drive#parentReference','id':'appdata'}];
	var toSend = {'title':'AppData','mimeType':'application/vnd.google-apps.folder','parents':parents};
	var str = JSON.stringify(toSend);
	var create = Request({
		url: 'https://www.googleapis.com/drive/v2/files',
		headers: {'Authorization': 'Bearer '+ access_token,'Content-Type':'application/json; charset=UTF-8'},
		content: str,
		onComplete: function(response){
			console.log(response.text);
			searchFolder();
		}	
	});
	create.post();	
}
*/

var fileId = '';
var downloadURL='';
//Get all the files from the appdata folder.
function listFolder(){
	//var items;
	var request = "https://www.googleapis.com/drive/v2/files?q='appdata'+in+parents";
	var searchFor = Request({
		url: request,
		headers: {'Host':'www.googleapis.com','Authorization': 'Bearer '+ access_token},
		onComplete: function(response){
			//console.log(JSON.stringify(response.json.items));
			console.log('LIST ' + response.text);
			//console.log(response.json.items[0].id);
			fileId = response.json.items[0].id;
			downloadURL = response.json.items[0].downloadUrl;
			//readFile(fileId);
			//downloadFile(response.json.items[0].downloadUrl);
			//console.log(response.status);
			//console.log(JSON.stringify(response.headers));	
			//console.log(response.json.items);
			//return response.json.items	
			//var items = response.json.items;
			//Handle things depending on the items
			/*if (items.length == 0){
				//No items created yet, so create one
				//startUploadFile();
				console.log('No files!'+'\r\n\r\n');
				startUploadFile();
			}
			else{
				console.log(response.text);
				//console.log(JSON.stringify(items));
			}*/
			//listFolder();
			downloadFile();
			//console.log("Now update");
			//startUpdateFile();
			
		}
	});
	searchFor.get();
	//return items;
}

function readFile(){
	//console.log(fileId);
	var request = 'https://www.googleapis.com/drive/v2/files/'+fileId;
	var read = Request({
		url: request,
		headers: {'Host':'www.googleapis.com','Authorization': 'Bearer '+ access_token},
		onComplete: function(response){
			console.log(response.text);
		}
	
	});
	read.get();

}

function downloadFile(){
	//console.log(downloadURL);
	//var request = 'https://www.googleapis.com/drive/v2/files/'+fileId;
	var download = Request({
		url: downloadURL,
		headers: {'Authorization': 'Bearer '+ access_token},
		onComplete: function(response){
			console.log(response.text);
		}
	
	});
	download.get();
}

function startUpdateFile(){
	/*var items = listFolder();
	if (items.length == 0){
		//No items created yet, so create one
		startUploadFile();		
	}
	items = listFolder();
	console.log(items);
	*/
	
	//Try to just add lines, not upload a new file.
	//First step: Start a resumable session:
	var u = 'https://www.googleapis.com/upload/drive/v2/files/'+fileId+'?uploadType=resumable';
	//console.log('URL ' + u);
	//var parents = [{'id':'appdata'}];
	//var j = {'title': 'appFile.json','parents':parents};
	//https://www.googleapis.com/upload/drive/v2/files/fileId
	//var str = JSON.stringify(j);
	var session = Request({		
		url: 'https://www.googleapis.com/upload/drive/v2/files/'+fileId+'?uploadType=resumable',
		//contentType: 'application/json; charset=UTF-8',
		headers: {'Host':'www.googleapis.com','Authorization': 'Bearer '+ access_token/*,'Content-Length':38,'Content-Type':'application/json; charset=UTF-8','X-Upload-Content-Type':'application/json'/*,'X-Upload-Content-Length':2000000*/},
		//content: str,
		onComplete: function(response){
			//console.log('Start Upload file = ' + response.text+'\r\n\r\n');
			console.log('Start Upload file status = ' + response.status+'\r\n\r\n');
			console.log('Start Upload File status text = ' + response.statusText+'\r\n\r\n');
			console.log('Start Headers = ' + JSON.stringify(response.headers)+'\r\n\r\n');
			resumable_sesion_uri = response.headers.Location;
			updateFile();		
		}	
	});
	session.put();

}


function updateFile(){
	var j = {'Data':'new data','bookmarks':'nobody'};
	var str = JSON.stringify(j);
	var session = Request({		
		url: resumable_sesion_uri,
		//contentType: 'application/json; charset=UTF-8',
		headers: {'Authorization': 'Bearer '+ access_token/*'Content-Length':38*/,'Content-Type':'application/json; charset=UTF-8'},
		content: str,
		onComplete: function(response){
			//console.log('Upload file = ' + response.text);
			console.log('Upload file status = ' + response.status);
			console.log('Upload File status text = ' + response.statusText);
			console.log('Headers = ' + JSON.stringify(response.headers));
			resumable_sesion_uri = response.headers.Location;
			downloadFile();
		}
	
	});
	session.put();

}



	







 


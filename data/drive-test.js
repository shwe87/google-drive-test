//Everytime the html changes, this code runs.

/*var SCOPES = 'https://www.googleapis.com/auth/drive';
/*let { Loader, Require, unload } = Components.utils.import('resouce://https://apis.google.com/js/client.js?onload=handleClientLoad');*/


/*
self.port.on('auth',function checkAuth(CLIENT_ID) {
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
            handleAuthResult);
});




function handleAuthResult(authResult) {
        var authButton = document.getElementById('authorizeButton');
        var filePicker = document.getElementById('filePicker');
        authButton.style.display = 'none';
        filePicker.style.display = 'none';
        if (authResult && !authResult.error) {
          // Access token has been successfully retrieved, requests can be sent to the API.
          filePicker.style.display = 'block';
          filePicker.onchange = uploadFile;
        } else {
          // No access token could be retrieved, show the button to start the authorization flow.
          authButton.style.display = 'block';
          authButton.onclick = function() {
              gapi.auth.authorize(
                  {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
                  handleAuthResult);
          };
        }
}


function uploadFile(evt) {
        gapi.client.load('drive', 'v2', function() {
          var file = evt.target.files[0];
          insertFile(file);
        });
}


function insertFile(fileData, callback) {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        var reader = new FileReader();
        reader.readAsBinaryString(fileData);
        reader.onload = function(e) {
          var contentType = fileData.type || 'application/octet-stream';
          var metadata = {
            'title': fileData.name,
            'mimeType': contentType
          };

          var base64Data = btoa(reader.result);
          var multipartRequestBody =
              delimiter +
              'Content-Type: application/json\r\n\r\n' +
              JSON.stringify(metadata) +
              delimiter +
              'Content-Type: ' + contentType + '\r\n' +
              'Content-Transfer-Encoding: base64\r\n' +
              '\r\n' +
              base64Data +
              close_delim;

          var request = gapi.client.request({
              'path': '/upload/drive/v2/files',
              'method': 'POST',
              'params': {'uploadType': 'multipart'},
              'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
              },
              'body': multipartRequestBody});
          if (!callback) {
            callback = function(file) {
              console.log(file)
            };
          }
          request.execute(callback);
        }
      }
function handleClientLoad() {
        window.setTimeout(checkAuth, 1);
      }

*/



self.port.on('response',function(response){
	var body = document.getElementById('body');
	body.innerHTML = response;
});



var signIn = document.getElementById('signIn');
if(signIn != null){
	document.addEventListener('click',function(event){
		console.log("Clicked!!!!");	
	});
}

var code = document.getElementById('code');
if (code != null){
	self.port.emit('takeCode',code.value);
	console.log(code.value);
}

/*



self.port.on('getAccess',function(response){
	//var title = document.getElementById('title');
	//if (title == 'My page'){
	console.log("here");
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
	
	
	
	/*var str = JSON.stringify(response);
	console.log(str);
	console.log(str + ": " + str.length + " characters, " +
  Buffer.byteLength(str, 'utf8') + " bytes");
	//console.log(document.title);
	/*var body = document.getElementById('body');
	if(body!=null){
		console.log(response.text);
		body.innerHTML = response.text;
	}*/
	//}

//});

console.log(document.title);


/*Uploading a file*/







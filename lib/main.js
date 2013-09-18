var data = require("sdk/self").data;
 
var myPanel = require("sdk/panel").Panel({
  width:500,
  height:500,
  contentScriptFile: data.url("drive-test.js"),
  contentURL: data.url("quickstart.html")
});

require("sdk/widget").Widget({
  id: "my-widget",
  label: "My Widget",
  content: "Tabs!",
  width: 50,
  panel: myPanel,
  onClick: auth
});

function auth(){
	var CLIENT_ID = "1068871491500.apps.googleusercontent.com";
	myPanel.port.emit('auth',CLIENT_ID);

};

 


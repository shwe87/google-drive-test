self.port.on('getAccess',function(response){
	//var title = document.getElementById('title');
	//if (title == 'My page'){
	console.log(document.title);
	var body = document.getElementById('body');
	if(body!=null){
		console.log(response.text);
		body.innerHTML = response.text;
	}
	//}

});

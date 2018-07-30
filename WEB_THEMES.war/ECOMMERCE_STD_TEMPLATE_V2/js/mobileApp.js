$(window).trigger("homefeaturepage");
getcookiefromdocument()
function diplayJavaMsg(msg){
	alert(msg);
}
function callTojavaFn(){
	var msg = "scan";
	try {
		Android.startscaning();
	}
	catch(err) {
		webkit.messageHandlers.callbackHandler.postMessage(msg);
		console.log('The native context does not exist yet');
	}
}
function callToDb(){
	var msg = "gotooffline";
	try {
		Android.gotoofflineActivity();
	}
	catch(err) {
		webkit.messageHandlers.callbackHandler.postMessage(msg);
		console.log('The native context does not exist yet');
	}
}
function btnTakepicClick(){
	JsHandler.Takepic();
}
function callToVisionapi(){
	var msg="goToVisionapi";
	try{Android.goToVisionapi();}
	catch(err){
		webkit.messageHandlers.callbackHandler.postMessage(msg);
		console.log('The native context does not exist yet');
	}
}
function getcookiefromdocument(){
	var msg="passsessionid:";
	var cookie = document.cookie;
	var session = cookie.split(";");
	try{Android.passSessionid(session);}
	catch(err){
		msg = msg+session;
		webkit.messageHandlers.callbackHandler.postMessage(msg);
		console.log('The native context does not exist yet');
	}
}
function fingerPrint(userName, password){
	var unps = {"credentials":""+ userName+" "+ password };
	try{Android.getusernameandpassword(userName, password)}
	catch(err){
	webkit.messageHandlers.callbackHandler.postMessage(unps);
	console.log('The native context does not exist yet');
	}
}
function fingerPrintpopup(){
	var unps = "FPauthenticationpopup";
	try {
		Android.fingerprintpopup();
	}
	catch(err){
		webkit.messageHandlers.callbackHandler.postMessage(unps);
	console.log('The native context does not exist yet');
	}
}
function prodGrpCpnPopup(){
	var unps = "prodGrpCpnPopup";
	try {
		Android.prodGrpCpnPopup();
	}
	catch(err){
		webkit.messageHandlers.callbackHandler.postMessage(unps);
		console.log('The native context does not exist yet');
	}
}
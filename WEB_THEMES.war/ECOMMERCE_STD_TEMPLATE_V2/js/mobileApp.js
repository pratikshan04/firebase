jQuery(window).load(function(){
	   
    $('#loginModal.modal').on('shown.bs.modal', function(){
        var unps = "callFingerAuth";
        console.log('Inside Fingerprint');
         sessionStorage.setItem("currentCustomerSU","");
        try {
            Android.callFingerAuth();
        }
        catch(err){
            webkit.messageHandlers.callbackHandler.postMessage(unps);
            console.log('The native context does not exist yet');
        }
    });
   
});

function mob_log(){
	$.post("doLogin.action", $this.serialize() + "&loginType=popup", function(data,status) {
        try {
                sessionStorage.setItem("salesUserSelected","Y");
                sessionStorage.setItem("currentCustomerSU","");
          var afterLoginUrl = window.location.href;
          if($("#layoutName").val()!='CMSStaticPage'){
          if ($.trim(data) == "") {
            if (
              afterLoginUrl != "" &&
              (afterLoginUrl.indexOf("Register") <= -1 &&
                afterLoginUrl.indexOf("Forgot") <= -1 &&
                afterLoginUrl.indexOf("Login") <= -1)
            ) {
              setCookie("afterLoginUrl", afterLoginUrl, 7);
            } else {
              setCookie("afterLoginUrl", "", 1);
            }
            $(".loginWindow").toggle();
						
                        closelogin();
            loadShippingInfo();
            if($("#isWebview").val() == "WEBVIEW"){
                                fingerPrint(un, ps);
                        }
          } else if ($.trim(data) == "EcpliseDown") {
            window.location.href =
              $("base").attr("href") + "eclipseDown.action";
          } else if (data.indexOf("!DOCTYPE html") != -1) {
            window.location.href = "/Login";
          } else if($.trim(data) && $.trim(data).indexOf("{") == 0){
                  var responseDetails = JSON.parse(data);
                  if(responseDetails && responseDetails['salesUser'] == 'Y'){
					if($("#isWebview").val() == "WEBVIEW"){
                        fingerPrint(un, ps);
                    }
                    loadCustomForSalesUser(responseDetails);          
                  }
                          /*if($("#isWebview").val() == "WEBVIEW"){
                                        fingerPrint(un, ps);
                                        }*/
                          
          } else {
            unblock();
            if ($this.find("#pLoginErr").length > 0) {
              $this.find("#pLoginErr").html(data);
            } else {
              showNotificationDiv("Error", data);
            }
            $this
              .find("[type='submit']")
              .html("Login")
              .removeAttr("disabled");
          }
          }
        } catch (e) {
          console.log(e);
        }
      }).fail(function(xhr, status, error) {
        bootAlert(
          "small",
          "error",
          "Error",
          "Something went wrong please try again"
        );
      });

	
}


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
function voiceSearch(){
	var msg = "voicesearchforios"
	try{
		Android.voicesearchforandroid();
	}catch(err){
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
	var cookie = document.getElementById("appID").value;
	//var session = cookie.split(";");
	try{Android.passSessionid(cookie);}
	catch(err){
		msg = msg+cookie;
		webkit.messageHandlers.callbackHandler.postMessage(msg);
		console.log('The native context does not exist yet');
	}
}

function fingerPrintpopup(){
	var unps = "FPauthenticationpopup";
	try{Android.enablefpauthentication()}
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

function speechRecognitionpopup(){
	var unps = "speechRecogPopup";
	try{Android.speechRecognitionpopup()}
	catch(err){
	webkit.messageHandlers.callbackHandler.postMessage(unps);
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

function getCartCount(cartCount){
	var unps = {"cartBadgeCount":"" + cartCount };
	try{Android.getcartBadgeCount(parseInt(cartCount))}
	catch(err){
	webkit.messageHandlers.callbackHandler.postMessage(unps);
	console.log('The native context does not exist yet');
	}
}
function profilePic(profilePicUrl){
	var unps = {"profilePic":"" + profilePicUrl };
	try{Android.getprofilePic(profilePicUrl)}
	catch(err){
	webkit.messageHandlers.callbackHandler.postMessage(unps);
	console.log('The native context does not exist yet');
	}
}
function userLoggedInStatus(isLoggedInFlag){
	var unps = {"userLoginStatus":""+ isLoggedInFlag };
	try{Android.userLoggedInStatus(isLoggedInFlag)}
	catch(err){
	webkit.messageHandlers.callbackHandler.postMessage(unps);
	console.log('The native context does not exist yet');
	}
}

function accountStmtDwnload(accountStmtStr){ 
	var unps = {"accountStmtDwnload":"" + accountStmtStr }; 
	//var base64 = Uint8Array.from(atob(accountStmtStr),c=>c.charCodeAt(0))  
	var base64 = Uint8Array.from(atob(accountStmtStr),function(c){ return c.charCodeAt(0) })  
	try{Android.accountStmtDwnload(base64)}       
	catch(err){  
		webkit.messageHandlers.callbackHandler.postMessage(unps);         
		console.log('The native context does not exist yet'); 
	}  
}
$(".sp-form").submit(function(){
	/* Add Participant Script : It will be applied to the pages which have the ability to add the participants dynamically by the user. The below script will store the email recipients info.*/
	if($(this).is('[data-participants-count]')){
		var parCount = parseInt($(this).attr('data-participants-count'));
		var emailIds ='';
		for(var tempI=1;tempI<=parCount;tempI++){
			emailIds += ',';
			emailIds += $(':text[name=email' + tempI +']').val();
		}
		 emailIds = emailIds.replace(/,\s*$/, "");
		 if(emailRecipients != '')
			 emailIds = emailRecipients + emailIds;
		 else
			 emailIds = emailIds.substr(1);
		 $('#toEmail').val(emailIds);
	}
	/* Add Participant Script*/
	/* Shearer Specific */
	var chkArr = $('[name="hotelAccommodations"]:checked');
	if($(chkArr[0]).is(':checked') && $(chkArr[1]).is(':checked') && flag == true){
		var resultant = $(chkArr[0]).val() + ' || ' + $(chkArr[1]).val();
		$('[name="hotelAccommodations"]').val(resultant);
		flag = false;
	}
	/* Shearer Specific */
	
	var sendMailToUser=$("#sendMailToUser").val();
	if(typeof sendMailToUser!="undefined" && sendMailToUser=='Y'){
		var emailArray=$("#toEmail").val().split(",");
		if(emailArray.length>1){
			var toEmail=emailArray[0];
		}else{
			var toEmail=$("#toEmail").val();
		}	
		if($("#toEmail").val()!=$("#email").val()){
			   $("#toEmail").val($("#toEmail").val()+","+$("#email").val());
		}
		}
	$(this).find('.requiredField span.required').remove();
	$(this).find('.requiredField').removeClass('requiredField');
	var i, j, k, submitForm = this;
	var eachElement, formElements = submitForm.elements, errorMessages = [];
	for(i = 0; i < formElements.length; i++){
		eachElement = formElements[i];
		if(eachElement.classList.contains('sp-required')){
			var classList = eachElement.classList;
			for(var j = 0; j < classList.length; j++){
				validateFormElementsByClassName(classList[j], eachElement, errorMessages);
			}
		}else if(eachElement.classList.contains('check-or-radio')){
			if(!isElementChecked(eachElement)){
				if(!(errorMessages.indexOf(eachElement.attributes['data-error'].value) >= 0)){
					$(eachElement).parent().addClass('requiredField').append("<span class='required'>ERROR: "+eachElement.attributes['data-error'].value+"</span>");
					errorMessages.push(eachElement.attributes['data-error'].value);
				}
			}
		}
	}
	if(errorMessages.length > 0){
		//notifyValidation(errorMessages.join("<br>"));
		if(typeof sendMailToUser!="undefined" && sendMailToUser=='Y'){
			$("#toEmail").val(toEmail);
		}
	}else{
		submitFormToServer($(this).serialize());
	}
	return false;
});
function Loadrfqvalues(data){
    console.log(data);
	var RFQData = data;
	var strobj = RFQData["rfqJsonString"]

	if($("#userLogin").val() != "true"){
		$("#rfnpName").val("");
		$("#rfnpName2").val("")
		$("#rfnpEmail").val("");
		$("#rfnpPhone").val("");
		$("#rfnpAddr1").val("");
	}

$.each(strobj, function(index, value) {
if(index>2){
	addRow()
}
    $("#PN"+index).val(value["itemid"])
    $("#QTY"+index).val(value["qty"])

});
}
function detailPageLoaded(){
	var unps = "detailPageLoaded";
	try{Android.detailPageLoaded()}
	catch(err){
	webkit.messageHandlers.callbackHandler.postMessage(unps);
	console.log('The native context does not exist yet');
	}
}

function toggleAppLeftMenu()
{
if($('#mobileNavigationTrigger').hasClass('active'))
{
    closeSlide();
} else {
    openSlide();
}
}

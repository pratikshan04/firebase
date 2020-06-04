if($("#countrySelect").length>0){
	var countrySelect = new initCountry({
		country: "US",
		selectorID: "countrySelect",
		defaultSelect: true
	});
}
if($("#countrySelectShip").length>0){
	var countrySelectShip = new initCountry({
		country: "US",
		selectorID: "countrySelectShip",
		defaultSelect: true
	});
}
function eventFormClear(){
	$('#eventForm').clearForm();
}
function validateEventReg(userLogin){
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	var result="";
	$("#errMsg").html("");
	var f_name=$.trim($("#contactFirstName").val());
	var l_name=$.trim($("#contactLastName").val());
	//var title=$.trim($("#jobTitle").val());
	var captcha = $("#jcaptcha").val();
	var company_name=$.trim($("#companyName").val());
	var address1=$.trim($("#contactAddress1").val());
	var city=$.trim($("#contactCity").val());
	var zip=$.trim($("#contactPoBox").val());
	var country=$.trim($("#countrySelect").val());
	var state=$.trim($("#stateSelect").val());
	var email=$.trim($("#contactemailAddress").val());
	var phone=$.trim($("#contactPhone").val());
	var mobilePhone=$.trim($("#contactMobilePhone").val());
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	var isPhone=/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
	//var fax=$.trim($("#faxNumber").val());
	var payMentMethod = $.trim($("select[name='paymentOption']").val());

	if(f_name==""||f_name==null)
		result=result+"<p>Please Enter First Name</p>";
	if(l_name==""||l_name==null)
		result=result+"<p>Please Enter Last Name</p>";
	/* if(title==""||title==null)
			result=result+"<p>Please Enter Title</p>";*/
	if(company_name==""||company_name==null)
		result=result+"<p>Please Enter Company Name</p>";
	if(address1==""||address1==null)
		result=result+"<p>Please Enter Street Address</p>";
	if(city==""||city==null)
		result=result+"<p>Please Enter City</p>";
	if(country==""||country==null)
		result=result+"<p>Please Select Country</p>";
	if(state==""||state==null)
		result=result+"<p>Please Select State</p>";
	if(zip==""||zip==null)
		result=result+"<p>Please Enter Zip/Postal Code</p>";
	if(phone==""||phone==null)
		result=result+"<p>Please Enter Company Main Phone Number</p>";
	else if(!isPhone.test(phone)){result=result+"<p>Please Enter Valid Company Main Phone Number</p>";}		
	if(mobilePhone==""||mobilePhone==null)
		result=result+"<p>Please Enter Contact/Mobile Phone Number</p>";
	else if(!isPhone.test(mobilePhone)){result=result+"<p>Please Enter Valid Contact/Mobile Phone Number</p>";}	
	if(email==""||email==null)
		result=result+"<p>Please Enter Email</p>";
	else  if(!emailReg.test(email)) {result=result+"<p>Please Enter Valid Email Address</p>";}		
	/*if(fax==""||fax==null)
		result=result+"<p>Please Enter Fax Number</p>";*/

	if(payMentMethod=="--Select Payment Mode--"||payMentMethod==null)
		result=result+"<p>Please Select Method of Payment</p>";
	if(payMentMethod=="Purchase Order"){
		var poNum = $("#purchaseOrderNumber").val();
		if(poNum==""||poNum==null)
			result=result+"<p>Please Enter Purchase Order Number</p>";
	}
	if(captcha==""||captcha==null && !userLogin)
		result=result+"<p>Please Enter Captcha</p>";


	var conct = "";
	if($("#contactMail").is(':checked')){
		conct = conct+$("#contactMail").val();
	}
	if($("#contactPhoneCheck").is(':checked')){
		conct = conct+$("#contactPhoneCheck").val();
	}
	$("#howToCntct").val(conct);

	if($("#checkStatus").is(':checked')){
		$("#add_info").val("1");
		var addF_name=$.trim($("#addFirstName").val());
		var addL_name=$.trim($("#addLastName").val());
		var addCompany_name=$.trim($("#addCompany").val());
		var addStreet=$.trim($("#addStreetAddr").val());
		var addCity=$.trim($("#addCity").val());
		var addZip=$.trim($("#addPostal").val());
		var addCountry=$.trim($("#countrySelectShip").val());
		var addState=$.trim($("#stateSelectShip").val());
		var addEmail=$.trim($("#addEmail").val());
		var addPhone=$.trim($("#addWorkPhone").val());
		var addMobilePhone=$.trim($("#addContactMobilePhone").val());

		if(addF_name==""||addF_name==null)
			result=result+"<p>Please Enter First Name for Additional Information</p>";
		if(addL_name==""||addL_name==null)
			result=result+"<p>Please Enter Last Name for Additional Information</p>";
		if(addCompany_name==""||addCompany_name==null)
			result=result+"<p>Please Enter Company Name for Additional Information</p>";
		if(addStreet==""||addStreet==null)
			result=result+"<p>Please Enter Street Address for Additional Information</p>";
		if(addCity==""||addCity==null)
			result=result+"<p>Please Enter City for Additional Information</p>";
		if(addCountry==""||addCountry==null)
			result=result+"<p>Please Enter Country for Additional Information</p>";
		if(addState==""||addState==null)
			result=result+"<p>Please Enter State for Additional Information</p>";
		if(addZip==""||addZip==null)
			result=result+"<p>Please Enter Zip/Postal Code for Additional Information</p>";
		if(addPhone==""||addPhone==null)
			result=result+"<p>Please Enter Company Main Phone Number for Additional Information</p>";
		else if(!isPhone.test(addPhone)){result=result+"<p>Please Enter Valid Phone Number</p>";}	
		if(addMobilePhone==""||addMobilePhone==null)
			result=result+"<p>Please Enter Contact/Mobile Phone Number for Additional Information</p>";
		else if(!isPhone.test(addMobilePhone)){result=result+"<p>Please Enter Valid Phone Number</p>";}	
		if(addEmail==""||addEmail==null)
			result=result+"<p>Please Enter Email for Additional Information</p>";
		else  if(!emailReg.test(addEmail)) {result=result+"<p>Please Enter Valid Email Address for Additional Information</p>";}	
	}

	if (result!=""){
		showNotificationDiv("", result);
		if($("#enableStickyHeader").val() == "Y" && $("#layoutName").val()!= "CMSStaticPage"){
			let fixedHead = $("#fixedHead").height();
			$('html, body').animate({scrollTop: $(".alert").offset().top - fixedHead}, 400);
		}else{
			$('html, body').animate({scrollTop: $(".alert").offset().top}, 400);
		}
		return false;

	}else if(result==""){
		$("#eventRegbtn").attr("value","Please Wait...");
		$("#eventRegbtn").attr("disabled","disabled");
		var str = $("#eventForm").serialize();
		block("Please wait");
		$.ajax({
			type: "POST",
			url: "RegisterToEventUnit.action",
			data: str,
			success: function(msg){
				var arrRes = msg.split("|");
				if (arrRes[0]==0){
					$.ajax({
						type: "POST",
						url: "SaveAndSendMail.action",
						data: str,
						success: function(msg){
							var arrRes = msg.split("|");
							if (arrRes[0]=="1"){
								bootAlert("small","success","Success","Thank you for registering to this event.");
								$("[data-bb-handler='ok']").click(function(){
									 location.href="/EventCalendar";
								 }); 
								$("#popup_cancel").hide();
								$("#popup_canc").hide();
								$("#popup_content.confirm").attr("style","background-image:none");

							}else{
							bootAlert("small","error","Information",arrRes[1]);
							$("[data-bb-handler='ok']").click(function(){
								 location.href="/EventCalendar";
							 }); 
							}
							unblock();
						}
					});

				}else {
					unblock();
					bootAlert("small","error","Information",arrRes[1]);

				}
			}
		});
		return false;
	}
}

function showPOText(){
	var val = $("#paymentOption").val();
	if(val!=null && val == "Purchase Order"){
		$("#radioTrigger").show();
	}else{
		$("#radioTrigger").hide();
	}
}
/*function showPOText(){
	var payMentMethod = $.trim($("select[name='paymentOption']").val());
	if(payMentMethod == "Purchase Order"){
		$("#radioTrigger").show();
	}else{
		$("#radioTrigger").hide();
	}
}*/

$(document).ready(function(){
	$("#additionalInfo").on("hide.bs.collapse", function(){
		$("#checkStatus").attr('checked', false);
	});
	$("#additionalInfo").on("show.bs.collapse", function(){
		$("#checkStatus").attr('checked', true);
	});
});
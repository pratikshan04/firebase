var webThemes = $("#webThemePath").val();
var cdnSiteJsPath = $("#cdnSiteJsPath").val();
var cdnModuleJsPath = $("#cdnModuleJsPath").val();
var cdnPluginJsPath = $("#cdnPluginJsPath").val();
$.getScript(cdnPluginJsPath+'/multiTab.min.js', function(){
	$('#cimm_tabBlock').multiTab({
		   tabHeading: '.multiTabHeading',
		   contentWrap: '.multiTabContent',
		   transitionEffect: "fade",
		   accordion:true
	});
});
var date = new Date();
var milliSec = date.getMilliseconds();
enqueue('/getPromotedProductGroupsPage.action?reqType=GP&AjaxRequest=Y',function(data){
	$("#promotedProductsTable").html(data);
});
enqueue('/OrderHistory?AjaxRequest=Y&dt='+milliSec,function(data){
	$("#orderHistory").html(data);
});
enqueue('/OpenOrderSale.action?reqType=webOrder&orderStatus=Open&AjaxRequest=Y&dt='+milliSec,function(data){
	$("#openOrderTable").html(data);
});
$(document).ready(function(){
enqueue('/AccountInquiryUnit.action?AjaxRequest=Y',function(data){
	var fillData = JSON.parse(data);
	var testFill = fillData.fillRateHistory;
	testFill[0].fillRateDesc ? $("#fillFirst").html(testFill[0].fillRateDesc) : $("#fillFirst").html('');
	testFill[1].fillRateDesc ? $("#fillSec").html(testFill[1].fillRateDesc) : $("#fillSec").html('');
	testFill[2].fillRateDesc ? $("#fillThree").html(testFill[2].fillRateDesc) : $("#fillThree").html('');
	testFill[3].fillRateDesc ? $("#fillFour").html(testFill[3].fillRateDesc) : $("#fillFour").html('');
	testFill[4].fillRateDesc ? $("#fillFive").html(testFill[4].fillRateDesc) : $("#fillFive").html('');
	testFill[5].fillRateDesc ? $("#fillSix").html(testFill[5].fillRateDesc) : $("#fillSix").html('');

	testFill[0].fillRatePercent ? $("#fillPerFirst").html(testFill[0].fillRatePercent+"%") : $("#fillPerFirst").html('');
	testFill[1].fillRatePercent ? $("#fillPerSec").html(testFill[1].fillRatePercent+"%") : $("#fillPerSec").html('');
	testFill[2].fillRatePercent ? $("#fillPerThree").html(testFill[2].fillRatePercent+"%") : $("#fillPerThree").html('');
	testFill[3].fillRatePercent ? $("#fillPerFour").html(testFill[3].fillRatePercent+"%") : $("#fillPerFour").html('');
	testFill[4].fillRatePercent ? $("#fillPerFive").html(testFill[4].fillRatePercent+"%") : $("#fillPerFive").html('');
	testFill[5].fillRatePercent ? $("#fillPerSix").html(testFill[5].fillRatePercent+"%") : $("#fillPerSix").html('');

	var filltotal = 0;
	var fillAvg;
   	for (var i  = 0; i < testFill.length; i++){
		filltotal  += parseFloat(testFill[i].fillRatePercent);
   	}
	fillAvg = parseFloat(filltotal/testFill.length);
	$("#fillAvgs").html(fillAvg.toFixed(2)+"%");

});
});
function validateImageUpload(){
	if($('#profileImage').length>0){
		var fileExt =  $('#profileImage').val();
		if(fileExt != null && fileExt.trim()!=''){
			fileExt = fileExt.substring($('#profileImage').val().lastIndexOf(".")+1).toLowerCase();
			if(fileExt != "jpg" && fileExt != "png" && fileExt != "jpeg"){
				bootAlert("small","error","Error","Please upload image file.");
				return false;
			}else{
				if(navigator.onLine){
					return true;
				}else{
					bootAlert("small","error","Error",locale("internert.connectivity.error"));
					return false;
				}
			}
		}else{
			bootAlert("small","error","Error","Please choose a image file to upload.");
			$("[data-bb-handler='ok']").click(function(){
				$('#profileImage').trigger("click");
			});
			return false;
		}
	}else{
		bootAlert("small","error","Error", locale('label.quickOrder.problemWhileUpload'));
		return false;
	}
}

$( "#cimm_customImageUpload > input").change(function() {
	var fileName = $(this)[0].files[0];
	var Filesize= this.files[0].size/1024/1024;
	if(Filesize >5){
		bootAlert("small","error","Error","Please upload file which is less than 5MB.");
		return false;
	}
	fileName = fileName.name
	$('#cimm_customImageUpload > span').text(fileName);
});
function clearImage(){		
	$.ajax({
		type: "GET",
			url:"clearProfileImageUnit.action",
			async: false,
			success: function(msg){
				$("#profilePicture").attr('src','')
			}
	});
}
$(document).ready(function() {
	$('#ship_table').DataTable({
		"language": {
			"url": "https://cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json",
			"search":"_INPUT_",
	        "searchPlaceholder": locale('label.searchShipAddress'),
	        "sLengthMenu" :"Show _MENU_",
	        "oPaginate" : {
	        	"sPrevious" :"Prev",
	            "sNext" :"Next"
	        }
	    }
	});
	var options = {
	    beforeSend: function(){block('Espere por favor');},
		uploadProgress: function(event, position, total, percentComplete){},
		success: function(data){
			if(data ==''){
				location.reload();
			}
		},
		complete: function(response){
			var userProfileImagePath = $('#userProfileImagePath').val();
			var pathNew = userProfileImagePath+response.responseText;
			var chooseProfilePicture = locale('product.heading.chooseProfilePicture');
		    unblock();
		    $('#profilePicture').attr("src",pathNew+"?dt="+milliSec);
		    $('#profilePictureThumbnail').attr("src",pathNew+"?dt="+milliSec);
		    enqueue('sessionValueLink.action?crud=s&keyValue=userProfileImage&insertValue='+response.responseText+'&dt='+milliSec)
		    $('#profileImage').attr({ value: ""});
		    $('#cimm_customImageUpload > span').text(chooseProfilePicture);
		},
		error: function(){
	        bootAlert("small","error","Error",locale('label.notUpload.image'));

		}
	}; 
	$("#profileImageForm").ajaxForm(options);
	
	if($('#recentorders').length>0){
		var recentorders = 3;
		if($('#recentorders > li').length<3){
			recentorders = $('#recentorders > li').length
		}
		  $('#recentorders').slick({
			  infinite: true,
			  slidesToShow: recentorders,
			  slidesToScroll: 1,
			  pauseOnHover:true,
			  vertical:true,
			  responsive: [
			               {
			                 breakpoint: 1024,
			                 settings: {
			                   slidesToShow: 3,
			                   vertical: false
			                 }
			               },{
								breakpoint: 600,
								settings: {
									slidesToShow: 3,
									 vertical: false
								}
							},{
								breakpoint: 500,
								settings: {
									slidesToShow: 2,
									 vertical: false
								}
							},
							{
								breakpoint: 400,
								settings: {
									slidesToShow: 1,
									 vertical: false
								}
							}
			             ]
		});
	}
	var lastLogin = document.getElementById('divUTC').value;
	var divLocal = $('#divLocal'); 
	var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var dateTimeParts = lastLogin.split(' ');
	var timeParts = dateTimeParts[1].split(':');
	var dateParts = dateTimeParts[0].split('/');
	var rawDate = months[parseInt(dateParts[1])-1]+" "+dateParts[0]+", "+dateParts[2];
	
	now1 = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1],timeParts[2]);
	var currentdate=((now1.getMonth() + 1) + '/' + now1.getDate() + '/' +  now1.getFullYear() + '  '+ now1.getHours() + ':' +now1.getMinutes()+ ':'+now1.getSeconds() );
	var currenttime=new Date();
	var locdat = new Date(now1 + "UTC");
	var loginDay = days[ locdat.getDay() ],
	loginDate = ('0' + locdat.getDate()).slice(-2),
	loginMonth = months[ locdat.getMonth() ],
	loginYear = locdat.getFullYear(),
	loginHour = locdat.getHours(),
	loginMinutes = (locdat.getMinutes()<10?'0':'') + locdat.getMinutes(),
	loginSeconds = (locdat.getSeconds()<10?'0':'') + locdat.getSeconds();
	var loginTime = loginMonth+" "+loginDate+", "+loginYear+" "+loginHour+":"+loginMinutes+":"+loginSeconds;
	
	console.log(loginTime);
	if((loginTime).toLowerCase().indexOf("undefined")>= 0 || (loginTime).toLowerCase().indexOf("NaN")>= 0){
		loginTime = rawDate+" "+dateTimeParts[1];
	}
	divLocal.text(loginTime);
});
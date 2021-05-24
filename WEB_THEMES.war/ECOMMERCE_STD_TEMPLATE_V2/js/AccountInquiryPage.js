$.ajax({
    type: "GET",
        url:"/OutStandingPaymentListSale.action?pageSize=10&isAjaxRequest=Y",
        async: false,
        success: function (msg) {
            $("#accountTable").html(msg)
        }
});
$(document).ready(function() {
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
$(document).ready(function(){
	$('#DisablePurchaseAgent').DataTable({
		"sPaginationType":"simple_numbers",
		"order" : [[0, 'desc']],
		"columnDefs": [{ orderable: false, targets: -1 }],
		"language": {
			"search":"_INPUT_",
	        "searchPlaceholder":"Search Users",
	        "sLengthMenu" :"Show _MENU_",
	        "oPaginate" : {
	        	"sPrevious" :"Prev",
	            "sNext" :"Next"
	        }
	    }
	});
});
function disableAuthorization(userID){
	bootbox.confirm({
		size: "small",
		closeButton:false,
		message: "Are you sure you want to Disable Authorized Purchase Agent for this User?",
		title: "<span class='text-warning'>Advertencia &nbsp;&nbsp;<em class='glyphicon glyphicon-alert'></em></span>",
		callback: function(result){
			if(result){
				block("Espere por favor");
				$.post('DisableAgentAuthorizationUnit.action?userId='+userID ,function(data,status){
					unblock();
					if(data=="sessionexpired"){
						window.location.href="doLogOff.action";
					}else{
						showNotificationDiv("success",data);
						setTimeout(function(){window.location.reload();} ,1000);
					}
				});
			}
		}
	});
}
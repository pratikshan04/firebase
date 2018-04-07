$(document).ready(function(){		
	var selectedTopMenu = jQuery("#topStaticSeletedMenu").val();
	$("#L1_"+selectedTopMenu).addClass( "selected");
});

$('#eventCategoryList, #accountList, .cimm_EventsCategoryList, .cimm_EventsLocationWrap').click(function(e){
	e.stopPropagation();
});

jQuery(document).ready(function() {
	var oTable;
    var table = jQuery('#example').DataTable({
        "columnDefs": [
            { "visible": false, "targets": 0 }
        ],
        "order": [[ 0, 'asc' ]],
        "displayLength": 25,
		"sDom": "<'eventSortTop hideForPrint'<'eventsNavigation'><'eventTopPagination pull-right'p><'clear'>r><'tabWrap't><'eventSortTop hideForPrint'<'eventsNavigation'><'eventBottomPagination pull-right'p><'clear'>>",
		"bDestroy": true,
		"aLengthMenu": [[12, 24, 48], [12, 24, 48]],
        "iDisplayLength": 12,
        "drawCallback": function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;
 
            api.column(0, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    jQuery(rows).eq(i).before('<tr class="group"><td>'+group+'</td></tr>');
                    last = group;
                }
            });
        }
    });
    oTable = $('#example').dataTable();
 	jQuery("div.eventsNavigation").html(jQuery(".eventsNavigationControls").html())

	var t = jQuery('#example').dataTable();
	jQuery('.changeIlength').click( function () {
		jQuery(".changeIlength").removeClass("selected");
		jQuery(".perPage_"+this.id).addClass("selected");
		redrawWithNewCount(t, this.id);
	});
});
function redrawWithNewCount(t, row_count){
	//Lifted more or less right out of the DataTables source
	var oSettings = t.fnSettings();
	oSettings._iDisplayLength = parseInt(row_count, 10);
	t._fnCalculateEnd( oSettings );
	/* If we have space to show extra rows (backing up from the end point - then do so */
	if (oSettings.fnDisplayEnd() == oSettings.fnRecordsDisplay()){
		oSettings._iDisplayStart = oSettings.fnDisplayEnd() - oSettings._iDisplayLength;
		if ( oSettings._iDisplayStart < 0 ) {
			oSettings._iDisplayStart = 0;
		}
	}
	if ( oSettings._iDisplayLength == -1 ) {
		oSettings._iDisplayStart = 0;
	}
	t.fnDraw( oSettings );
	return t;
}
function filterCat(val,locval,obj){
	if(obj.checked) {
		window.location.href="eventsUnit.action?eventsCategoryFilter="+val+"&eventsLocationFilter="+locval;
	} else {
		window.location.href="eventsUnit.action?eventsCategoryFilter=&eventsLocationFilter="+locval;
	}
}
function filter(val,catval,obj){
	if(obj.checked) {
		window.location.href="eventsUnit.action?eventsLocationFilter="+val+"&eventsCategoryFilter="+catval;
	} else {
		window.location.href="eventsUnit.action?eventsLocationFilter=&eventsCategoryFilter="+catval;
	}
}
/*function filter(val,catval,obj){
	var selecLoc="", selecCat="";
//	if(obj.checked) {
//		setCookie(val, obj.checked,  14 );
//	} else {
//		setCookie(val, obj.checked,  -1 );
//	}
	$('input:checkbox[name="eventsLocationFilter"]').each(function(){
		if(this.checked) {
			selecLoc= selecLoc+this.value+",";
		}
	});
	$('input:checkbox[name="eventsCategoryFilter"]').each(function(){
		if(this.checked) {
			selecCat= selecCat+this.value+",";
		}
	});
	var url="";
	selecLoc=selecLoc.replace(/&/g, "%26");
	selecCat=selecCat.replace(/&/g, "%26");
	if(selecLoc!=""){
		url= "eventsUnit.action?eventsLocationFilter="+selecLoc;
	}
	if(selecCat!=""){
		url= "eventsUnit.action?eventsCategoryFilter="+selecCat;
	}
	if(selecLoc!="" && selecCat!=""){
		url="eventsUnit.action?eventsLocationFilter="+selecLoc+"&eventsCategoryFilter="+selecCat;
	}
	if(url=="" || url==" "){
		url= "Events";
	}
	window.location.href=url;
}
function filterCat(val,locval,obj){
	var selecLoc="", selecCat="";
//	if(obj.checked) {
//		setCookie(val, obj.checked,  14 );
//	} else {
//		setCookie(val, obj.checked,  -1 );
//	}
	$('input:checkbox[name="eventsLocationFilter"]').each(function(){
		if(this.checked) {
			selecLoc= selecLoc+this.id+",";
		}
	});
	$('input:checkbox[name="eventsCategoryFilter"]').each(function(){
		if(this.checked) {
			selecCat= selecCat+this.id+",";
		}
	});
	var url="";
	selecLoc=selecLoc.replace(/&/g, "%26");
	selecCat=selecCat.replace(/&/g, "%26");
	if(selecLoc!=""){
		url= "eventsUnit.action?eventsLocationFilter="+selecLoc;
	}
	if(selecCat!=""){
		url= "eventsUnit.action?eventsCategoryFilter="+selecCat;
	}
	if(selecLoc!="" && selecCat!=""){
		url="eventsUnit.action?eventsLocationFilter="+selecLoc+"&eventsCategoryFilter="+selecCat;
	}
	if(url=="" || url==" "){
		url= "Events";
	}
	window.location.href=url;
}*/

function sendEventListPage() {
	var content="";
	var siteName=$("#siteName").val();
	var sendTable = $("#printSendEvents").html();
	localStorage.setItem("emailFriendItem", sendTable);
	localStorage.setItem("emailFriendlink", location.href);
	localStorage.setItem("itemName",'<a href="'+location.href+'">Training And Events</a>');
	location.href="/SendThisPageLink.action";
}

/*var x=window.location.href;
if(x.indexOf('%25') != -1)
	window.location.href=x.replace(/%25/g,'%');
$(document).ready(function(){		
	if (!String.prototype.endsWith) {		
		String.prototype.endsWith = function(searchString, position) {		
			var subjectString = this.toString();		
				if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {		
				position = subjectString.length;		
			}
			position -= searchString.length;		
			var lastIndex = subjectString.indexOf(searchString, position);		
			return lastIndex !== -1 && lastIndex === position;		
		};		
	}
	var selectedTopMenu = jQuery("#topStaticSeletedMenu").val();
	$("#L1_"+selectedTopMenu).addClass( "selected");
	var prevPage =  document.referrer;
	var currentPage =window.location.href;
	console.log("previous page:"+prevPage);
	console.log("current page:"+currentPage);
	var iseventsPrevPage=false;
	if(prevPage.indexOf('?')>-1){
		var x=prevPage.substr(0, prevPage.indexOf('?')); 
		var y=x.substr(x.lastIndexOf('/'),x.length);
		console.log("last index"+y);
		if(x.endsWith("/eventsUnit.action")) {
			iseventsPrevPage=true;
		}
	}
	var y=currentPage.substr(0, currentPage.indexOf('?')); 
	if(currentPage.endsWith("/Events") && !iseventsPrevPage) {
		$('input:checkbox[name="eventsLocationFilter"]').each(function(){
			var locationValue = getCookie(this.id);
			deleteCookie(this.id);
		});
		$('input:checkbox[name="eventsCategoryFilter"]').each(function(){
			var CategoryValue = getCookie(this.id);
			deleteCookie(this.id);
		});
	}
	if(currentPage.endsWith("/Events") && iseventsPrevPage) {
		console.log("from Event to Traning");
		$('input:checkbox[name="eventsLocationFilter"]').each(function(){
			var locationValue = getCookie(this.id);
			if (locationValue == 'true') {
				$(this).attr('checked', true);
			}
			else {
				$(this).attr('checked', false);
			}
		});
		$('input:checkbox[name="eventsCategoryFilter"]').each(function(){
			var CategoryValue = getCookie(this.id);
			if (CategoryValue == 'true') {
				$(this).attr('checked', true);
			}
			else {
				$(this).attr('checked', false);
			}
		});
	}

	if(prevPage.indexOf('?')==-1 ){
		if(prevPage != currentPage){
			if(prevPage.endsWith("/Events")) {
				if(currentPage.indexOf('?')>-1){
					var x=prevPage.substr(0, prevPage.indexOf('?')); 
					var y=currentPage.substr(0, currentPage.indexOf('?')); 
					if(y.endsWith("/eventsUnit.action")){
						$('input:checkbox[name="eventsLocationFilter"]').each(function(){
							var locationValue = getCookie(this.id);
							if (locationValue == 'true') {
								$(this).attr('checked', true);
							}
							else{
								$(this).attr('checked', false);
							}
						}); 
						$('input:checkbox[name="eventsCategoryFilter"]').each(function(){
							var CategoryValue = getCookie(this.id);
							if (CategoryValue == 'true') {
								$(this).attr('checked', true);
							}else{
								$(this).attr('checked', false);
							}
						});
					}
				}
			}
		}
	} else{
		var x=prevPage.substr(0, prevPage.indexOf('?')); 
		if(currentPage.indexOf('?')>-1){
			var y=currentPage.substr(0, currentPage.indexOf('?')); 
		}
		if(x == y) {
			$('input:checkbox[name="eventsLocationFilter"]').each(function(){
				var locationValue = getCookie(this.id);
				if (locationValue == 'true') {
					$(this).attr('checked', true);
				} else {
					$(this).attr('checked', false);
				}
			});
			$('input:checkbox[name="eventsCategoryFilter"]').each(function(){
				var CategoryValue = getCookie(this.id);
				if (CategoryValue == 'true') {
					$(this).attr('checked', true);
				}
				else {
					$(this).attr('checked', false);
				}
			});
			console.log(x);
		}
	}
	var selectedTopMenu = jQuery("#topStaticSeletedMenu").val();
	$("#L1_"+selectedTopMenu).addClass( "selected");
});*/
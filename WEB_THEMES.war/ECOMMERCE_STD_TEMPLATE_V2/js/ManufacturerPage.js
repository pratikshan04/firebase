$(document).ready(function(){
	$("#inputSearch").keyup(function(){
		var valThis = $(this).val().toLowerCase();
		var len = valThis.length;
		if(len==1){
			$(".mfgListRow h2").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
			$(".sBlack").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
		}else if(len>1){
			$(".mfgListRow h2").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.split("")[0].toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
			$(".sBlack").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
		}else{
			$(".mfgListRow h2").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
			$(".sBlack").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
		}
	});
	$("#searchGrid").keyup(function(){
		$(".grid").css({'opacity':'0'});
		var valThis = $(this).val().toLowerCase();
		var len = valThis.length;
		if(len==1){
			$(".mfgListRow h2").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
			$(".sBlack").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
		}else if(len>1){
			var thatVal = valThis.substr(0,1);
			$(".mfgListRow h2").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(thatVal.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
			
			$(".sBlack").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
		}else{
			$(".mfgListRow h2").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
			$(".sBlack").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
		}
		setTimeout(function() {
			var msnry = new Masonry( '.grid', {
				columnWidth: 272,
				itemSelector: '.grid-item'
			});
			$(".grid").css({'opacity':'1'});
		}, 500);
	});
	if($('#featuredmfg').length>0){
		$('#featuredmfg').slick({
			  infinite: true,
			  slidesToShow: 5,
			  slidesToScroll: 1,
			  pauseOnHover:true,
			  responsive: [
			               {
			                 breakpoint: 1024,
			                 settings: {
			                   slidesToShow: 4,
			                 }
			               },
			               {
			                 breakpoint: 600,
			                 settings: {
			                   slidesToShow: 3,
			                 }
			               },
			               {
			                 breakpoint: 480,
			                 settings: {
			                   slidesToShow: 2,
			                 }
			               }
			             ]
		  });
	}
});
$(window).load(function(){
	if($(".grid").length > 0){
		var msnry = new Masonry( '.grid', {
			columnWidth: 272,
			itemSelector: '.grid-item'
		});
	}
});

var fixHeadHeight = $(".cimm_brandAtoZletters").height();
var stickyHeadHeight = $(".cimm_header").height() + $(".navbar").height();
if($( window ).width() > 768) {
	var fixBlockHeadHeight = fixHeadHeight + stickyHeadHeight;
}
else {
	var fixBlockHeadHeight = fixHeadHeight;
}
function manufacturerListScroll(val){
	var fixHeight = $('.cimm_brandAtoZletters').height();
	$('html, body').animate({
           scrollTop: $("#displayBrand_"+val).offset().top-fixBlockHeadHeight
       }, 1000);
}
var fixHeight = $(".cimm_brandAtoZletters").offset().top;
var fixBlockHeight = $(".cimm_brandAtoZletters").height();
$(window).scroll(function() {
    var currentScroll = $(window).scrollTop(); 
    if (currentScroll >= fixHeight) {
    		var stickyHeadHeightA = $("#fixedHead .cimm_header").height() + $("#fixedHead .navbar-default").height();
        	if(!$(".cimm_brandAtoZletters").hasClass("fixIt")){
    			$(".cimm_brandAtoZletters").addClass("fixIt").css({'top': stickyHeadHeightA });
    			$(".hiddenDiv").height(fixBlockHeadHeight- stickyHeadHeightA);
		}
    } else {
    	if($(".cimm_brandAtoZletters").hasClass("fixIt")){
			$(".cimm_brandAtoZletters").removeClass("fixIt");
			$(".hiddenDiv").height(0);
		}
    }
});
function ManufacturerList(val){
	var siteName = $("#siteName").val();
	$("#displayManufacturer").html("<img class='log-shopBrand-loader' src='"+assets+"/WEB_THEMES/"+siteName+"/images/brandloading.gif' alt='Brand Loading'/>");
	enqueue('ManufacturerListPage.action?idx='+val+'&dt='+new Date(), processManufacturer);
}
function processManufacturer(val){
	var result = "";
	var strAry = val.split("~");
	for(var i=0; i<strAry.length; i++){
		var manfArry = strAry[i].split("|");
		var urlString = manfArry[1]+locale("website.url.ShopByManufacturer")+javascriptReplaceAll(manfArry[0]," ","_");
		result = result+"<li><a style=\"background:none; \" href='"+urlString+"'>"+manfArry[0]+"</a></li>";
	}
	$("#displayManufacturer").html("<ul>"+result+"<div class='clear'></ul></div>");
}
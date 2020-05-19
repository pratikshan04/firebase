$(document).ready(function(){
	$("#inputSearch").keyup(function(){
		var valThis = $(this).val().toLowerCase();
		var len = valThis.length;
		if(len==1){
			$(".brandsListRow h2").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
			$(".sBlack").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
		}else if(len>1){
			$(".brandsListRow h2").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.split("")[0].toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
			$(".sBlack").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
		}else{
			$(".brandsListRow h2").each(function(){
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
		var valThis = $(this).val().toLowerCase();
		var len = valThis.length;
		if(len==1){
			$(".brandsListRow h2").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
			$(".sBlack").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
		}else if(len>1){
			$(".sBlack").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
		}else{
			$(".brandsListRow h2").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
			$(".sBlack").each(function(){
				var text = jQuery(this).text().substr(0,len).toLowerCase();
				(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().fadeIn() : jQuery(this).parent().fadeOut(); 
			});
		}
		initMasonry();
	});
	if($('#featuredBrands').length>0){
		$('#featuredBrands').slick({
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
	initMasonry();
});
function initMasonry(){
	if($(".grid").length > 0){
		$('.grid').masonry({
			  itemSelector: '.grid-item',
			  columnWidth: 220,
			  gutter: 16,
			  fitWidth: true
		});
	}
}
/*var fixHeadHeight = $(".cimm_brandAtoZletters").height();
var stickyHeadHeight = $(".cimm_header").height() + $(".navbar").height();
if($( window ).width() > 768) {
	var fixBlockHeadHeight = fixHeadHeight + stickyHeadHeight;
}
else {
	var fixBlockHeadHeight = fixHeadHeight;
}*/

var fixHeight = $(".cimm_brandAtoZletters").height();
var headerHeight = 0;
if ($("#enableStickyHeader").val() == "Y") {
    headerHeight = $('#normalHead').height();
}
if($( window ).width() > 768) {
    var fixHeadHeight = fixHeight + headerHeight;
}


function brandListScroll(val){
	$('html, body').animate({
           scrollTop: $("#displayBrand_"+val).offset().top-fixHeadHeight
       }, 1000);
}

$(window).scroll(function() {
    var currentScroll = $(window).scrollTop(); 
    if (currentScroll >= fixHeight) {
    	if(!$(".cimm_brandAtoZletters").hasClass("fixIt")){
			$(".cimm_brandAtoZletters").addClass("fixIt").css({'top': headerHeight });
			$(".hiddenDiv").height(fixHeight - headerHeight);
		}
    } else {
    	if($(".cimm_brandAtoZletters").hasClass("fixIt")){
			$(".cimm_brandAtoZletters").removeClass("fixIt");
			$(".hiddenDiv").height(0);
		}
    }
});


function brandList(val){
	var siteName = $("#siteName").val();
	$("#displayBrand").html("<img class='log-shopBrand-loader' src='"+assets+"/WEB_THEMES/"+siteName+"/images/brandloading.gif' />");
	enqueue('BrandListPage.action?idx='+val+'&dt='+new Date(), processBrand);
}
function processBrand(val){
	var result = "";
	var strAry = val.split("~");
	for(var i=0; i<strAry.length; i++){
		var brandArry = strAry[i].split("|");
		var urlString = brandArry[1]+locale("website.url.ShopByBrand")+javascriptReplaceAll(brandArry[0]," ","_");
		result = result+'<li><a style="background:none;" href="'+urlString+'">'+brandArry[0]+'</a></li>';
	}
	$("#displayBrand").html("<ul>"+result+"</ul><div class='clear-fix'></div>");
}
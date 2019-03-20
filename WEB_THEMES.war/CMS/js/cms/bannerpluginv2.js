var blockId='';
var json = {};
var list = '';
var output = {};
var outputID = {};
var bannerNameID = {};
var bannerWidth = window.top.bannerWidth;
var bannerHeight = window.top.bannerHeight;
console.log("list : " + list.length);
console.log("console : " + window.top.bannerWidth);


var getBannerImageList = function(bannerId){

	var bannerList = output[bannerId];

	var parsedBannerList = JSON.parse(JSON.stringify(bannerList));

	var pasrsed  = parsedBannerList;
	
	return pasrsed[0].bannersDetails;
};

var getBannerIdByName = function(bannerId){
	
	var bannerListId = bannerNameID[bannerId];
	
	
	return bannerListId;
};

var getBannerImageListById = function(bannerId){

	
};





var closeBannerPopup = function (){
	window.parent.jQuery.colorbox.close();
	
};
var getBannerList = function(id){
	
	console.log("block id assigned : " + id);
	var listBlock = jQuery("#bannerSelectList");
	var bannerSelected = false;
	var checked = "";
	var bannerListId;
	jQuery("#selectedBanner").html("");
	listBlock.html("");
	
	
	    
	/*for(var k in output){
		checked = "";
		if(jQuery.trim(k)==jQuery.trim(id)){
			checked = "";
			bannerSelected = true;
		}
		 bannerListId = getBannerIdByName(k); 
		
		 
		listBlock.append(jQuery("<li/>").html('<img src="../images/small/viewItems.png"  title="Preview" style="cursor:pointer;margin:-8px 25px 0 0;" onclick="bannerPreview(\''+k+'\')" /> <label><input type="radio" '+checked+'value="'+k+'" name="bannerGroup" />  <i class="fa fa-check fa-2x" title="Selected Banner List"></i></label><a href="EditBanner.jsp?bannerListId='+bannerListId+'&bannerName='+escape(k)+'"><img src="../images/small/edit.png"  title="Edit Banner List" style="cursor:pointer;margin:-10px 25px 0 0;" onclick="bannerPreview(\''+k+'\')" /></a><img src="../images/small/delete.png"  title="Delete Banner List" style="cursor:pointer;margin:-8px 20px 0 0;height:16px;" onclick="deleteBanner(\''+k+'\')" /><span style="vertical-align:super;">' + k+'</span>'));
		console.log("Getting Key - Id: " + k + " - " + bannerListId);
		
	}
	if(bannerSelected){
		console.log("Selecting : " + id)
		 var radios = jQuery('input:radio[name=bannerGroup]');
		 radios.filter('[value='+id+']').prop('checked', true);
		scrollToSelected();
		bannerPreview(id);
		
	}*/
	
};

var editBannerInfo = function(bannerId){
	
	//$('div[data-divNumber="' + number + '"]');

	  

};

var bannerPreview = function(bannerId){

var silderContainer = jQuery("#previewContainer");
silderContainer.html(window.parent.jQuery("#slidercontainer").html());

$.getJSON("bannerDataTemplateCms.action?bannerListId=" + bannerId, function(data) {
	console.log("data : ");
	console.log(data);

	if(data.hasOwnProperty('bannerTemplate')){
		var dynamicProperties = data.dynamicProperties;
		var bannerType = dynamicProperties.bannerType;
		var transistion = "";
		var transistionDelay = "";
		var transistionAutoPlay = "";
		var carouselSetting = "";
		
		if(typeof dynamicProperties.bannerTransistion!='undefined'){
			transistion = dynamicProperties.bannerTransistion;
		}
		if(typeof dynamicProperties.bannerTransistionDelay!='undefined'){
			transistionDelay = dynamicProperties.bannerTransistionDelay;
		}
		if(typeof dynamicProperties.bannerTransistionAutoPlay!='undefined'){
			transistionAutoPlay = dynamicProperties.bannerTransistionAutoPlay;
		}
		if(typeof dynamicProperties.carouselSetting!='undefined'){
			carouselSetting = dynamicProperties.carouselSetting;
		}
		silderContainer.html(data.bannerTemplate);
		if(typeof bannerType=="undefined"){
			bannerType="slider";
		}
		if(bannerType=="slider"){
			initJssorSlides("slidercontainer",transistion, transistionDelay, transistionAutoPlay);
			}else if(bannerType=="carousel"){
				initCarousel("slidercontainer",carouselSetting);
			}
	}
	
});


};

var scrollToSelected = function(){
var radioInput = $("input[name=bannerGroup]:checked") ;
	$('#bannerSelectList').animate({
        scrollTop: radioInput.offset().top
    }, 100);
};


var useThisBanner = function(){
	
	var selectedBanner = jQuery("input[name=bannerGroup]:checked").val();
	var bannerBlockId = window.parent.bannerBlockId;
	console.log("BlockId + "+bannerBlockId + " - " + selectedBanner);

	if(typeof selectedBanner!='undefined' && selectedBanner!=""){
		var templateName = jQuery("#templateName_"+selectedBanner).val();
		var bannerWrapper = window.parent.jQuery("#"+bannerBlockId);
		
		if(!bannerBlockId.match("_Wrapper$")){
			bannerWrapper = window.parent.jQuery("#"+bannerBlockId+"_Wrapper");
			  }
		
		
		
		$.getJSON("bannerDataTemplateCms.action?bannerListId=" + selectedBanner, function(data) {
			if(data.hasOwnProperty('bannerTemplate')){
				var bannerTemplate = data.bannerTemplate;
				var dynamicProperties = data.dynamicProperties;
				var bannerType = dynamicProperties.bannerType;
				var transistion = "";
				var transistionDelay = "";
				var transistionAutoPlay = "";
				var carouselSetting = "";
				
				if(typeof dynamicProperties.bannerTransistion!='undefined'){
					transistion = dynamicProperties.bannerTransistion;
				}
				if(typeof dynamicProperties.bannerTransistionDelay!='undefined'){
					transistionDelay = dynamicProperties.bannerTransistionDelay;
				}
				if(typeof dynamicProperties.bannerTransistionAutoPlay!='undefined'){
					transistionAutoPlay = dynamicProperties.bannerTransistionAutoPlay;
				}
				if(typeof dynamicProperties.carouselSetting!='undefined'){
					carouselSetting = dynamicProperties.carouselSetting;
				}
				bannerTemplate = bannerTemplate.replace("slidercontainer",bannerBlockId);
				bannerWrapper.attr("data-bannerid",selectedBanner);
				bannerWrapper.attr("data-bannertype",bannerType);
				bannerWrapper.attr("data-bannertemplate",templateName);
				bannerWrapper.attr("data-select","bannerBlock");
				bannerWrapper.html(bannerTemplate);
				if(typeof bannerType=="undefined"){
					bannerType="slider";
					
				}
				if(bannerType=="slider"){
				window.parent.initJssorSlides(bannerBlockId,transistion,transistionDelay,transistionAutoPlay);
				}else if(bannerType=="carousel"){
					window.parent.jQuery.colorbox.close();
					window.parent.initCarousel(bannerBlockId,carouselSetting);
					//window.parent.jQuery.colorbox.close();
				}else{
					
					window.parent.initContextMenu("#"+bannerBlockId); 
	            	
					window.parent.jQuery("#"+bannerBlockId).closest('.gm-content').attr({"data-name": "bannerBlock"});
				}
			}
			
			window.parent.jQuery.colorbox.close();
			
		});
		
			
	}else{alert("Please select banner to use.");}

};

var refreshBanner = function(bannerId){
	console.log("bannerId : " + bannerId);
	var bannerWrapper = window.parent.jQuery("[data-bannerid='"+bannerId+"']");
	
	var bannerContainer = bannerWrapper.find(".Widget_slideJssor")
	console.log(window.parent.jQuery(bannerContainer).attr("id"));
	console.log(bannerContainer.attr("id"));
	
	jQuery.getJSON("bannerDataTemplateCms.action?bannerListId=" + bannerId+"&reload=true", function(data) {
		if(data.hasOwnProperty('bannerTemplate')){
			var bannerData = "";
			var bannerTemplate = data.bannerTemplate;
			var dynamicProperties = data.dynamicProperties;
			var bannerType = dynamicProperties.bannerType;
			var transistion = "";
			var transistionDelay = "";
			var transistionAutoPlay = "";
			var carouselSetting = "";
			
			if(typeof dynamicProperties.bannerTransistion!='undefined'){
				transistion = dynamicProperties.bannerTransistion;
			}
			if(typeof dynamicProperties.bannerTransistionDelay!='undefined'){
				transistionDelay = dynamicProperties.bannerTransistionDelay;
			}
			if(typeof dynamicProperties.bannerTransistionAutoPlay!='undefined'){
				transistionAutoPlay = dynamicProperties.bannerTransistionAutoPlay;
			}
			if(typeof dynamicProperties.carouselSetting!='undefined'){
				carouselSetting = dynamicProperties.carouselSetting;
			}
			
			window.parent.jQuery("[data-bannerid='"+bannerId+"']").each(function(){
				bannerData = data.bannerTemplate;
				var sliderId = window.parent.jQuery(this).attr("id").replace("_Wrapper","");
				console.log(sliderId);
				if(typeof sliderId!=undefined && sliderId!=""){
				 bannerData = bannerData.replace("slidercontainer",sliderId);
				 window.parent.jQuery(this).html(bannerData);
				 if(bannerType=="slider"){
					 window.parent.initJssorSlides(sliderId,transistion,transistionDelay,transistionAutoPlay);
						}else if(bannerType=="carousel"){
							 window.parent.initCarousel(sliderId,carouselSetting);
						}
				
				}
				
			});
		}
		
	
		
	});

};

var filterBanners =  function (input,id){
	var valThis = jQuery(input).val().toLowerCase();
	
	jQuery('#'+id+' > li').each(function(){
		var text = jQuery(this).find('span').text().toLowerCase();
		console.log(text);
		(text.indexOf(valThis) == 0) ? jQuery(this).show() : jQuery(this).hide();            
	});

};

var deleteBanner = function(bannerListId,bannerListName){
	var currentLocation = parent.document.location.toString();
	console.log(currentLocation);
	var excetUrl= currentLocation.substr(0, currentLocation.indexOf('cimm/')); 
	console.log(excetUrl);
	console.log(bannerListName);
	console.log(bannerListId);

    var r = confirm('Are you sure you want to delete this '+bannerListName+' banner?');
    if (r == true) {
    	console.log("Delete Confirmed!");
    	   var str = bannerListName;
           var str1=bannerListId;   
		  jQuery.ajax({
			   type: "POST",
			   url: excetUrl+"filemanager/DeleteBannerList.jsp",
			   data:{bannerListId:str1,bannerListName :str},
			   success: function(msg){
				   
	   
			   if(msg.indexOf("success")!=-1){
				   alert("selected banner list deleted successfully");
				   window.location.href="bannerListCms.action";
				   
				   //window.location.reload();
				   
			   }else{
			   jQuery("#errMsg").html(msg);
			   }
 			}
		  
		 });
    } else {
    	console.log("Delete Cancelled!");
    }
	 return false;
}

/*var deleteBanner = function(bannerListName,siteId){
	
	console.log(bannerListName);
	alert('Are you sure you want to delete this '+bannerListName+' banner?');
		var str = "bannerListName="+bannerListName;
		  jQuery.ajax({
			   type: "POST",
			   url: "DeleteBannerList.jsp",
			   data: str,
			   success: function(msg){
				   
	   
			   if(msg.indexOf("success")!=-1){
				   window.location.href="bannermanagement.jsp?reloadBanner=Y&bannerName="+escape(jQuery.trim(jQuery("#bannerListName").val()));
				   alert("selected banner list deleted successfully");
				   window.location.reload();
				   
			   }else{
			   jQuery("#errMsg").html(msg);
			   }
   			}
		  
 		 });
	
	 return false;
}

function paginationScript(n_pages,page_link,iindex,pgno){
	
	var n_links=5;
	//page_link = page_link.replace(/[%]/g,"%25");
	var s_fileName=page_link;
	pageno=pgno;
	n_index=(iindex/pageno)+1;
	var jump=n_pages/5;
	var mod=n_pages%5;
	var skipstep=parseInt(jump);
	if(mod>0){
		skipstep=skipstep+1;
	}
	var start=1;
	var ss=n_index/n_links;
	var change=parseInt(ss);
	if((n_index%n_links)>0){
		change=change+1;}
	n_links=n_links*change;
	start=(n_links-5)+1;
	var prevpage=pageno*5*(change-2);
	var pagenumber=0;
	document.write('<div class="pagebarUTH">');
	if((n_index)>=6)
		document.write('<a href="'+page_link+prevpage+'">Previous</a>\n');

	if(n_links){
		var n_sideLinks=1,n_firstLink,n_lastLink;
		if(n_index>=n_pages){
			n_firstLink=start;
			n_lastLink=n_pages;
		}
		else if(n_index<=0)
		{
			n_firstLink=start;
			n_lastLink=5;
		}
		else
		{
			n_firstLink=start;
			if(n_links>n_pages)
				n_lastLink=n_pages;
			else
				n_lastLink=n_firstLink+5-1;
		}
		for(var i=n_firstLink;i<=n_lastLink;i++)
		{
			pagenumber=(i*pageno)-pageno;
			if(i==(n_index))
			{
				var nexpage=pagenumber+pageno;nexpage=pageno*n_lastLink;
			}
			document.write(i==(n_index)?'<span class="this-page">'+i+'</span>\n':'<a href="'+page_link+pagenumber+'" title="Go to page '+i+'">'+i+'</a>\n');
		}
	}

	if((n_lastLink)!=n_pages)
		document.write('<a href="'+page_link+nexpage+'">Next</a><span class="total" style="background:none;margin-left:2px;border-radius: 3px 3px 0px 0px;padding: 2px 2px 2px 0px;"> of '+n_pages+'</span>');

	document.write('  </div>');
}*/
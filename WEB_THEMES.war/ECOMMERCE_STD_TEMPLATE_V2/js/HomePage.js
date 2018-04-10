$(document).ready(function(){
	var jssor_1_options = {
			$AutoPlay: 1,
            $DragOrientation: 2,
            $PlayOrientation: 2,
            $FillMode:2,
            $Idle:5000,
            $BulletNavigatorOptions: {
            	$Class: $JssorBulletNavigator$,
            	$Orientation: 2
            }
	};

    var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);
    function ScaleSlider() {
    	try{
    		var parentWidth = jssor_1_slider.$Elmt.parentNode.clientWidth;
      		if (parentWidth)
      			jssor_1_slider.$ScaleWidth(Math.min(parentWidth));
      		else
      			window.setTimeout(ScaleSlider, 30);
      		}catch(e){
      			console.log(e);
      		}
    }
    ScaleSlider();
    $(window).bind("load", ScaleSlider);
    $(window).bind("resize", ScaleSlider);
    $(window).bind("orientationchange", ScaleSlider);
    /*#endregion responsive code end*/
    
    if($('#featuredProductList').length>0){
    	$('#featuredProductList').slick({
    		infinite: true,
    		slidesToShow: 3,
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
    if($('#featuredManufacturers').length>0){
    	$('#featuredManufacturers').slick({
    		infinite: true,
    		slidesToShow: 5,
    		slidesToScroll: 1,
    		pauseOnHover:true,
    		autoplay: true,
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
    
    $('#probwesolve').on('afterChange init', function(event, slick, direction){
        
        slick.$slides.removeClass('center_prevdiv').removeClass('center_nextdiv');
        for (var i = 0; i < slick.$slides.length; i++)
        {
            var $slide = $(slick.$slides[i]);
            if ($slide.hasClass('slick-current')) {
                $slide.prev().addClass('center_prevdiv');
                $slide.next().addClass('center_nextdiv');
                break;
            }
        }
      }
    ).on('beforeChange', function(event, slick) {
        slick.$slides.removeClass('center_prevdiv').removeClass('center_nextdiv');
    }).slick({
		centerMode: true,
    	centerPadding: '240px',
    	slidesToShow: 1,
    	autoplay: true,
    	asNavFor: '#probwesolve_cont'
    });
    
    $('#probwesolve_cont').slick({
    	infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		pauseOnHover:true,
		autoplay: true,
		arrows: false,
		infinite: true,
		cssEase: 'linear',
		asNavFor: '#probwesolve'
    });

	if($('#shopByCategory').length>0){
		$('#shopByCategory').slick({
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
	
	$("#historyheadline_slide").slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		pauseOnHover:true,
		arrows: false,
		vertical: true,
		autoplay: true,
	});
	
	$("#success_story-slider").slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		pauseOnHover:true,
		arrows: false,
		autoplay: true,
		dots: true,
		infinite: true,
		fade: true,
		cssEase: 'linear'
	});
	
	$('[data-action="capabilities"]').on('hover', function(){
		var img_src="/ASSETS/WEB_THEMES//TURTLE_AND_HUGHES/images/";
		//var img_src="/WEB_THEMES//TURTLE_AND_HUGHES/images/";
		if($(this).hasClass("capabilities_blue")){
			$(".capabilities_orange").removeClass("active");
			$(".capabilities_green").removeClass("active");
			$(this).addClass("active");
			$(".capabilities_image").find('img').attr('src', img_src+'hover_electricalconstruction.png')
		} else if($(this).hasClass("capabilities_orange")){
			$(".capabilities_blue").removeClass("active");
			$(".capabilities_green").removeClass("active");
			$(this).addClass("active");
			$(".capabilities_image").find('img').attr('src', img_src+'hover_lightingapplications.png')
		} else if($(this).hasClass("capabilities_green")){
			$(".capabilities_blue").removeClass("active");
			$(".capabilities_orange").removeClass("active");
			$(this).addClass("active");
			$(".capabilities_image").find('img').attr('src', img_src+'hover_infastructure.png')
		} else {
			$(".capabilities_blue").removeClass("active");
			$(".capabilities_green").removeClass("active");
			$(this).addClass("active");
			$(".capabilities_image").find('img').attr('src', img_src+'hover_lightingapplications.png')
		}
	})
});
getNewSectionForHomePage();
jQuery(function(){
	priceLoadMainFunction();
});
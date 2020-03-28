function initJssorSlides(sliderId, transistion, slideDelay, autoPlay) {
    var jssor_1_SlideoTransitions = [{
        $Duration: 1200,
        x: 0.3,
        $During: {
            $Left: [0.3, 0.7]
        },
        $Easing: {
            $Left: $JssorEasing$.$EaseInCubic,
            $Opacity: $JssorEasing$.$EaseLinear
        },
        $Opacity: 2
    }];
    var _CaptionTransitions = [];
    _CaptionTransitions["CLIP|LR"] = {
        $Duration: 900,
        $Clip: 3,
        $Easing: $JssorEasing$.$EaseInOutCubic
    };
    var data = "";
    if (jQuery.trim(transistion) != "") {
        data = transistion;
        var obj = eval("([" + data + "])");
        console.log(obj);
        jssor_1_SlideoTransitions = obj;
    }
    var dataSlideDelay = 2000;
    if (jQuery.trim(slideDelay) != "") {
    	dataSlideDelay = parseInt(slideDelay);
    }
    var dataAutoPlay = 1;
    if (jQuery.trim(autoPlay) != "") {
    	dataAutoPlay = parseInt(autoPlay);
    }
    var jssor_1_options = {
        $AutoPlay: dataAutoPlay,
        $Idle: dataSlideDelay,
        $FillMode: 5,
        $SlideshowOptions: {
            $Class: $JssorSlideshowRunner$,
            $Transitions: jssor_1_SlideoTransitions,
            $TransitionsOrder: 1,
            $ShowLink: true
        },
        $CaptionSliderOptions: {
            $Class: $JssorCaptionSlideo$,
            $CaptionTransitions: _CaptionTransitions,
            $PlayInMode: 1,
            $PlayOutMode: 3
        },
        $ArrowNavigatorOptions: {
            $Class: $JssorArrowNavigator$
        },
        $BulletNavigatorOptions: {
            $Class: $JssorBulletNavigator$
        }
    };
    var jssor_slider1 = new $JssorSlider$(sliderId, jssor_1_options);

    function ScaleSlider() {
        try {
            var parentWidth = jssor_slider1.$Elmt.parentNode.clientWidth;
            if (parentWidth) jssor_slider1.$ScaleWidth(Math.min(parentWidth));
            else
                window.setTimeout(ScaleSlider, 30);
        } catch (e) {
            console.log(e);
        }
    }
    ScaleSlider();
    jQuery(window).bind('resize', ScaleSlider);
}

function initCarousel(sliderId, settings) {
    var jssor_1_options = {
        $AutoPlay: true,
        $AutoPlaySteps: 4,
        $SlideDuration: 160,
        $SlideWidth: 200,
        $SlideSpacing: 3,
        $Cols: 4,
        $ArrowNavigatorOptions: {
            $Class: $JssorArrowNavigator$,
            $Steps: 4
        },
        $BulletNavigatorOptions: {
            $Class: $JssorBulletNavigator$,
            $SpacingX: 1,
            $SpacingY: 1
        }
    };
    var data = "";
    if (jQuery.trim(settings) != "") {
        var defaultSettings = jssor_1_options;
        try {
            data = settings;
            var obj = eval("(" + data + ")");
            console.log(obj);
            jssor_1_options = obj;
        } catch (err) {
            jssor_1_options = defaultSettings;
        }
    }
    var jssor_1_slider = new $JssorSlider$(sliderId, jssor_1_options);

    function ScaleSlider() {
        var refSize = jssor_1_slider.$Elmt.parentNode.clientWidth;
        if (refSize) {
            refSize = Math.min(refSize, refSize);
            jssor_1_slider.$ScaleWidth(refSize);
        } else {
            window.setTimeout(ScaleSlider, 30);
        }
    }
    ScaleSlider();
    $Jssor$.$AddEvent(window, "load", ScaleSlider);
    $Jssor$.$AddEvent(window, "resize", ScaleSlider);
    $Jssor$.$AddEvent(window, "orientationchange", ScaleSlider);
}
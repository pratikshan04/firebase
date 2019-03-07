/*! gridmanager - v0.3.1 - 2014-09-22
* http://neokoenig.github.io/jQuery-gridmanager/
* Copyright (c) 2014 Tom King; Licensed MIT */
(function($  ){

      /**
      * Main Gridmanager function
      * @method gridmanager
      * @returns gridmanager
     * @class gridmanager
     * @memberOf jQuery.fn
     */
    $.gridmanager = function(el, options){
        var gm = this;
        gm.$el = $(el);
        gm.el = el;
        gm.$el.data("gridmanager", gm);
        var editor;
         /**
         * API
         * @method appendHTMLSelectedCols
         * @param {string} html - HTML to append to selected columns
         * @returns null
         */
        gm.appendHTMLSelectedCols = function(html) {
          var canvas=gm.$el.find("#" + gm.options.canvasId);
          var cols = canvas.find(gm.options.colSelector);
          $.each(cols, function(){
            if($(this).hasClass(gm.options.gmEditClassSelected)) {
              $('.'+gm.options.gmEditRegion, this).append(html);
            }
          });
        };
         /**
         * INIT - Main initialising function to create the canvas, controls and initialise all click handlers
         * @method init
         * @returns null
         */
        gm.init = function(){	 
            gm.options = $.extend({},$.gridmanager.defaultOptions, options);
            gm.log("INIT");
            gm.addCSS(gm.options.cssInclude);
            gm.rteControl("init");
            gm.createCanvas();
            gm.createControls();
            gm.initControls();
            gm.initDefaultButtons();
            gm.initCanvas();
            gm.log("FINISHED");
            
			
        };

/*------------------------------------------ Canvas & Controls ---------------------------------------*/


        /**
         * Build and append the canvas, making sure existing HTML in the user's div is wrapped. Will also trigger Responsive classes to existing markup if specified
         * @method createCanvas
         * @returns null
         */
        gm.createCanvas = function(){
          gm.log("+ Create Canvas");
           var html=gm.$el.html();
                gm.$el.html("");
                $('<div/>', {'id': gm.options.canvasId, 'html':html }).appendTo(gm.$el);
                // Add responsive classes after initial loading of HTML, otherwise we lose the rows
                if(gm.options.addResponsiveClasses) {
                   gm.addResponsiveness(gm.$el.find("#" + gm.options.canvasId));
                }
                // Add default editable regions: we try and do this early on, as then we don't need to replicate logic to add regions
                if(gm.options.autoEdit){
                   gm.initMarkup(
                   gm.$el.find("#" + gm.options.canvasId)
                         .find("."+gm.options.colClass)
                         .not("."+gm.options.rowClass)
                      );
                }

        };

        /**
         * Looks for and wraps non gm commented markup
         * @method initMarkup
         * @returns null
         */
        gm.initMarkup = function(cols){
        var cTagOpen = '<!--'+gm.options.gmEditRegion+'-->',
            cTagClose = '<!--\/'+gm.options.gmEditRegion+'-->';

               // Loop over each column
               $.each(cols, function(i, col){
                    var hasGmComment = false,
                        hasNested = $(col).children().hasClass(gm.options.rowClass);

                      // Search for comments within column contents
                      // NB, at the moment this is just finding "any" comment for testing, but should search for <!--gm-*
                      $.each($(col).contents(), function(x, node){
                        if($(node)[0].nodeType === 8){
                            hasGmComment = true;
                        }
                      });

                    // Apply default commenting markup
                    if(!hasGmComment){
                        if(hasNested){
                           // Apply nested wrap
                           $.each($(col).contents(), function(i, val){
                             if($(val).hasClass(gm.options.rowClass)){
                                try{
                                	var prev=Array.prototype.reverse.call($(val).prevUntil("."+gm.options.rowClass)),
                                    after=$(val).nextUntil("."+gm.options.rowClass);

                                if(!$(prev).hasClass(gm.options.gmEditRegion)){
                                    $(prev).first().before(cTagOpen).end()
                                           .last().after(cTagClose);
                                }
                                if(!$(after).hasClass(gm.options.gmEditRegion)){
                                    $(after).first().before(cTagOpen).end()
                                            .last().after(cTagClose);
                                }
                                }catch(err){
                                	gm.log(err.message);
                                }
                             }
                           });

                        }
                        else {
                           // Is there anything to wrap?
                            if($(col).contents().length !== 0){
                              // Apply default comment wrap
                              $(col).html(cTagOpen+$(col).html()+cTagClose);
                            }
                        }
                      }
                  });
                  gm.log("initMarkup ran");
            };

        /*
          Init global default buttons on cols, rows or both
         */

        gm.initDefaultButtons = function(){
         /* if(gm.options.colSelectEnabled) {
            gm.options.customControls.global_col.push({callback: gm.selectColClick, loc: 'top', iconClass: 'fa fa-square-o', title: 'Select Column'});
          }*/
          if(gm.options.editableRegionEnabled) {
            gm.options.customControls.global_col.push({callback: gm.addEditableAreaClick,iconClass: 'cmsEditable', title: 'Add Editable Region', btnClass: 'cmsEditRegion',iconClass: "fa fa-lg fa-edit"});
          }
        };


        /**
         * Add missing reponsive classes to existing HTML
         * @method addResponsiveness
         * @param {} html
         * @returns CallExpression
         */
        gm.addResponsiveness = function(html) {
          if(html === '') { return; }
          var desktopRegex = gm.options.colDesktopClass+'(\\d+)',
              tabletRegex = gm.options.colTabletClass+'(\\d+)',
              phoneRegex = gm.options.colPhoneClass+'(\\d+)',
              desktopRegexObj = new RegExp(desktopRegex,'i'),
              tabletRegexObj = new RegExp(tabletRegex, 'i'),
              phoneRegexObj = new RegExp(phoneRegex, 'i');
              //new_html = '';
          return $(html).find(':regex(class,'+desktopRegex+'|'+tabletRegex+'|'+phoneRegex+')').each(function(i, el) {
            var elClasses = $(this).attr('class'), colNum = 2;
            var hasDesktop = desktopRegexObj.test(elClasses), hasPhone = phoneRegexObj.test(elClasses), hasTablet = tabletRegexObj.test(elClasses);

            colNum = (colNum = desktopRegexObj.exec(elClasses))? colNum[1] : ( (colNum = tabletRegexObj.exec(elClasses))? colNum[1] : phoneRegexObj.exec(elClasses)[1] );

            if(!hasDesktop) {
              $(this).addClass(gm.options.colDesktopClass+colNum);
            }
            if(!hasPhone) {
              $(this).addClass(gm.options.colPhoneClass+colNum);
            }
            if(!hasTablet) {
              $(this).addClass(gm.options.colTabletClass+colNum);
            }
            // Adds default column classes - probably shouldn't go here, but since we're doing an expensive search to add the responsive classes, it'll do for now.
            if(gm.options.addDefaultColumnClass){
              if(!$(this).hasClass(gm.options.colClass)){
                $(this).addClass(gm.options.colClass);
              }
            }
          });
        };

        /**
         * Build and prepend the control panel
         * @method createControls
         * @returns null
         */
        gm.createControls = function(){
          gm.log("+ Create Controls");
            
		   var buttons=[];
            // Dynamically generated row template buttons
		   var deviseSelection = '<div class="deviseSelection active"><label>Modify Layout For :</label><label for="sel_desktop" class="cms_RadioBtn"><input type="radio" name="deviceCol" id="sel_desktop" value="desktop" checked /><span>Desktop <i class="fa fa-lg fa-desktop" aria-hidden="true"></i></span></label> <label for="sel_tablet" class="cms_RadioBtn"><input type="radio" id="sel_tablet" name="deviceCol" value="tablet" /><span>Tablet <i class="fa fa-lg fa-tablet" aria-hidden="true"></i></span></label> <label for="sel_mobile" class="cms_RadioBtn"><input type="radio" id="sel_mobile" name="deviceCol" value="mobile" /><span>Mobile <i class="fa fa-lg fa-mobile" aria-hidden="true"></i></span></label> </div>';
			buttons.push(deviseSelection + '<div class="layoutSelectionBlock active clearfix"><div class="layoutCarousel-wrap"><label>Select a container:</label><div id="layoutCarousel" class="layoutCarousel-block">');
			buttons.push('<span u="arrowleft" class="layout03l" style="width: 55px; height: 55px; top: 123px; left: 8px;"></span>'); 
			//buttons.push('<div u="arrowleft" class="left-arrow1" style="position:relative;top:14px !important;left:0px !important;display:block;"></div>'); 
			//buttons.push('<img u="arrowleft" src="../ASSETS/WEB_THEMES/CMS/images/cms_images/left-arrow.png" style="position:relative;top:14px !important;left:0px !important;"></img>');
			buttons.push('<div u="slides" style="cursor: move; position: absolute; left:25px; top: 5px; width: 470px; height: 34px; overflow: hidden;">');
           
            $.each(gm.options.controlButtons, function(i, val){
              var _class=gm.generateButtonClass(val);
              buttons.push("<div><a title='Add Row " + _class + "' class='" + gm.options.controlButtonClass + " add" + _class + "'><img u=\"image\" src=\"../ASSETS/WEB_THEMES/CMS/images/cms_images/col_"+_class+".png\" width=\"40px\" height=\"25px\"  /></a></div>");
              gm.generateClickHandler(val);
            });
			buttons.push('</div>');
			buttons.push('<span u="arrowright" class="layout03r" style="width: 55px; height: 55px; top: 123px; right: 8px"></span>');	
			//buttons.push('<img u="arrowright" src="../ASSETS/WEB_THEMES/CMS/images/cms_images/right-arrow.png" style="position:relative;top:10px;left:100px;"></img>');
			buttons.push('</div>'+selectFullWidthContainer+'</div></div>');

         /*
          Generate the control bar markup
        */
	gm.$el.prepend(
		$('<div/>', {'id': gm.options.controlId, 'class': gm.options.gmClearClass + " " + "gmControlsCustomClass"}).prepend(
			$('<div/>', {'id': 'gm-addnew'}).addClass(gm.options.gmBtnGroup).html(
				buttons.join("")
			).append(gm.options.controlAppend)
		)
	);
	$('.readyTemplatesForm').detach().appendTo("#gm-addnew .layoutSelectionBlock");
	$("input[type=radio][name='deviceCol']").change(function(){
		var selectedDevice = $(this).val();
		if(selectedDevice === "tablet"){
			gm.switchLayoutMode(768, 'reInit')
		}else if(selectedDevice === "mobile"){
			gm.switchLayoutMode(640, 'reInit')
		}else{
			gm.switchLayoutMode('auto', 'reInit')
		}
	});
};

        /**
         * Adds a CSS file or CSS Framework required for specific customizations
         * @method addCSS
         * @param {} myStylesLocation
         * @returns string
         */
        gm.addCSS = function(myStylesLocation) {
          if(myStylesLocation !== '') {
            $('<link rel="stylesheet" href="'+myStylesLocation+'">').appendTo("head");
          }
        };

        /**
         * Clean all occurrences of a substring
         * @method cleanSubstring
         * @param {} regex
         * @param {} source
         * @param {} replacement
         * @returns CallExpression
         */
        gm.cleanSubstring = function(regex, source, replacement) {
          return source.replace(new RegExp(regex, 'g'), replacement);
        };

        /**
         * Switches the layout mode for Desktop, Tablets or Mobile Phones
         * @method switchLayoutMode
         * @param {} mode
         * @returns null
         */
        gm.switchLayoutMode = function(mode, reInit) {
          var canvas=gm.$el.find("#" + gm.options.canvasId), temp_html = canvas.html(), regex1 = '', regex2 = '', uimode = '';
          // Reset previous changes
          temp_html = gm.cleanSubstring(gm.options.classRenameSuffix, temp_html, '');
          uimode = $('div.gm-layout-mode > button > span');
          // Do replacements]
         // mode = 786;
          switch (mode) {
            case 768:
              regex1 = '(' + gm.options.colDesktopClass  + '\\d+)';
              regex2 = '(' + gm.options.colPhoneClass + '\\d+)';
              gm.options.currentClassMode = gm.options.colTabletClass;
              gm.options.colSelector = gm.options.colTabletSelector;
              $(uimode).attr('class', 'fa fa-tablet').attr('title', 'Tablet');
              break;
            case 640:
              regex1 = '(' + gm.options.colDesktopClass  + '\\d+)';
              regex2 = '(' + gm.options.colTabletClass + '\\d+)';
              gm.options.currentClassMode = gm.options.colPhoneClass;
              gm.options.colSelector = gm.options.colPhoneSelector;
              $(uimode).attr('class', 'fa fa-mobile-phone').attr('title', 'Phone');
              break;
            default:
              regex1 = '(' + gm.options.colPhoneClass  + '\\d+)';
              regex2 = '(' + gm.options.colTabletClass + '\\d+)';
              gm.options.currentClassMode = gm.options.colDesktopClass;
              gm.options.colSelector = gm.options.colDesktopSelector;
              $(uimode).attr('class', 'fa fa-desktop').attr('title', 'Desktop');
          }
          gm.options.layoutDefaultMode = mode;
          temp_html = temp_html.replace(new RegExp((regex1+'(?=[^"]*">)'), 'gm'), '$1'+gm.options.classRenameSuffix);
          temp_html = temp_html.replace(new RegExp((regex2+'(?=[^"]*">)'), 'gm'), '$1'+gm.options.classRenameSuffix);
          canvas.html(temp_html);
          if(reInit){
        	  canvas.find('[data-type="widget"]').html("");
        	  gm.deinitCanvas();
              gm.initCanvas();
          }
        };



        /**
         * Add click functionality to the buttons
         * @method initControls
         * @returns null
         */
		 gm.showEditor = function(){
		  var canvas=gm.$el.find("#" + gm.options.canvasId);
		  if(gm.mode === "visual"){
                 gm.deinitCanvas();
                 canvas.html($('<textarea/>').attr("cols", 130).attr("rows", 25).val(canvas.html()));
                 gm.mode="html";
                // $(this).parent().find(".gm-preview, .gm-layout-mode > button").prop('disabled', true);
              } else {
                var editedSource=canvas.find("textarea").val();
                 canvas.html(editedSource);
                 gm.initCanvas();
                 gm.mode="visual";                
                 //$(this).parent().find(".gm-preview, .gm-layout-mode > button").prop('disabled', false);
              }
			  
		 };
		 
		 gm.reinitBanner = function(banner,bannerObj){
			 var bannersDetails = getBannerImageList(banner);
			 var imgName = '',sliderContent='';
			 console.log("Banners Length : " + bannersDetails.length);
			 for(i=0;i<bannersDetails.length;i++){
			 	
			 	imgName = bannersDetails[i].bannerImageName;
			 	sliderContent = '<div>'+
			 	'<a u="image" href="#"><img src="'+bannerLogoPath+imgName+'" class="img-responsive"></a>'+
			 	'<div u="caption" t="*" class="captionOrange" style="position:absolute; left:20px; top: 30px; width:300px; height:30px;"> '+
			 	'caption1'+
			 	'</div>'+
			 '</div>';
			 	bannerObj.find('div[u="slides"]').append(sliderContent);
			 	
			 	console.log("Image Name :" +bannersDetails[i].bannerImageName);
			 }
			 	  

		 };
gm.initControls = function(){
	var canvas=gm.$el.find("#" + gm.options.canvasId);
	gm.log("+ InitControls Running");
	// Turn editing on or off
	gm.$el.on("click", ".gm-preview", function(){
		if(gm.status){
			hideActionIcons('preview');
			$(this).html("<span class='action-icon'><i class='fas fa-2x fa-undo-alt'></i></span><span class='action-text'>Back</span>").attr('title', 'Back');
			gm.deinitCanvas();
			$(this).parent().find(".gm-edit-mode").prop('disabled', true);
			gm.reBuildBanner(false);
			gm.switchLayoutMode(gm.options.layoutDefaultMode);
		} else {
			showActionIcons('preview');
			$(this).html("<span class='action-icon'><i class='fa fa-2x fa-file'></i><sup class='fas fa fa-eye'></sup></span><span class='action-text'>Page Preview</span>").attr('title', 'Preview');
			gm.initCanvas();
			$(this).parent().find(".gm-edit-mode").prop('disabled', false);
		}
		//$(this).toggleClass(gm.options.gmDangerClass);
		
	}).on("click", ".gm-edit-mode", function(){
		
		if(gm.mode === "visual"){
			hideActionIcons('edit');
			gm.deinitCanvas();
			$(this).html("<span class='action-icon'><i class='fas fa-2x fa-undo-alt'></i></span><span class='action-text'>Back</span>").attr('title', 'Back');
			canvas.html($('<textarea/>').attr("id","sourceEditor").attr("cols", 130).attr("rows", 25).val(canvas.html()));
			gm.mode="html";
			editor =  CodeMirror.fromTextArea(document.getElementById("sourceEditor"), {
				lineNumbers: true,
				mode: "text/html",
				matchBrackets: true	,
				lineWrapping: true,
				matchtags:true,
				foldGutter: true, 
				gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
				extraKeys: {
					"F11": function(cm) {
						cm.setOption("fullScreen", !cm.getOption("fullScreen"));
					},
					"Esc": function(cm) {
						if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
					}
				}
			});
			var totalLines = editor.lineCount();
			var totalChars = editor.getTextArea().value.length;
			editor.autoFormatRange({line:0, ch:0}, {line:totalLines, ch:totalChars});
			CodeMirror.commands["goLineStart"](editor); 
			$(this).parent().find(".gm-preview, .gm-layout-mode > button").prop('disabled', true);
		} else {
			showActionIcons('edit');
			$(this).html("<span class='action-icon'><i class='fa fa-2x fa-file-code'></i></span><span class='action-text'>Source Code</span>").attr('title', 'Edit Source Code');
			//CodeMirror.toTextArea();
			document.getElementById("sourceEditor").value = editor.getValue();
			var editedSource=canvas.find("textarea").val().replace(/\n/g, "").replace(/  /g, '');
			canvas.html(editedSource);
			canvas.find('[data-type="widget"]').html("");
			gm.initCanvas();
			gm.mode="visual";
			$(this).parent().find(".gm-preview, .gm-layout-mode > button").prop('disabled', false);
		}
		
	}).on("click", "." + gm.options.gmEditRegion + ' .'+gm.options.gmContentRegion, function(){
		//$(".gm-controls-element").hide();
		$(this).prev("div").show();
		if(!$(this).attr("contenteditable")){
			$(this).attr("contenteditable", true);
			gm.rteControl("attach", $(this) );
		}
// Save Function
}).on("click", "a.gm-save", function(){
console.log("save function called");
 var pageName = $("#pageName").val();
 var lang = "1";
var errMsg = "";
var isValid = true;
 if(pageName == '' || pageName == null){
   errMsg = "Page Name Required\n";
   isValid = false;
 }
 if(typeof lang == undefined ||lang == '' || lang == null || lang == -1){
 errMsg = errMsg + "Language Required\n";
 isValid = false;
 }
 if(!isValid)
 {
 alert(errMsg);
 jQuery(".common-box-design-wrap").show();
 return false;
 }
 
 
 gm.deinitCanvas();

 jQuery("[data-select='bannerBlock']").each(function(i){
 jQuery(this).html("");
 });
 jQuery("[data-select='widget']").each(function(i){
 jQuery(this).html("");
 });
 jQuery("[data-select='form']").each(function(i){
 jQuery(this).html("");
 });
// $(this).parent().find(".gm-edit-mode").prop('disabled', true);
 
//$(this).parent().find(".gm-edit-mode").prop('disabled', true);
//document.getElementById("previewBtnId").click();
 //jQuery("#previewBtnId").trigger("click");
//responsivefunct();

 saveContent();
// $(this).parent().find(".gm-edit-mode").prop('disabled', true);

gm.saveremote();

/* Row settings */
}).on("click", "a.gm-rowSettings", function(){
 var row=$(this).closest(gm.options.rowSelector);
 var drawer=row.find(".gm-rowSettingsDrawer");
if(drawer.length > 0){
  drawer.remove();
// jQuery("#gm-canvas .row.gm-editing>.gm-tools").css("margin","35px 0 0 0");
} else {
  row.prepend(gm.generateRowSettings(row));
  //jQuery("#gm-canvas .row.gm-editing>.gm-tools").css("margin","25px 0 0 0");
}

// Change Row ID via rowsettings
}).on("blur", "input.gm-rowSettingsID", function(){
var row=$(this).closest(gm.options.rowSelector);
    row.css("background", $(this).val());

// Remove a class from a row via rowsettings
}).on("click", ".gm-toggleRowClass", function(){
    var row=$(this).closest(gm.options.rowSelector);
    var theClass=$(this).text().trim();
        row.toggleClass(theClass);
        if(row.hasClass(theClass)){
            $(this).addClass(gm.options.gmDangerClass);
        } else {
            $(this).removeClass(gm.options.gmDangerClass);
        }

 /* Col settings */
}).on("click", "a.gm-colSettings", function(){
 var col=$(this).closest(gm.options.colSelector);
 var drawer=col.find(".gm-colSettingsDrawer");
        if(drawer.length > 0){
          drawer.remove();
        } else {
          col.prepend(gm.generateColSettings(col));
        }

  // Change Col ID via colsettings
}).on("blur", "input.gm-colSettingsID", function(){
 var col=$(this).closest(gm.options.colSelector);
    col.attr("id", $(this).val());

// Remove a class from a row via rowsettings
}).on("click", ".gm-togglecolClass", function(){
 var col=$(this).closest(gm.options.colSelector);
var theClass=$(this).text().trim();
    col.toggleClass(theClass);
    if(col.hasClass(theClass)){
        $(this).addClass(gm.options.gmDangerClass);
    } else {
        $(this).removeClass(gm.options.gmDangerClass);
    }

// Add new column to existing row
}).on("click", "a.gm-addColumn", function(){
//$("a.gm-addColumn").style.background = "url('')";
$(this).parent().after(gm.createCol(3));
gm.switchLayoutMode(gm.options.layoutDefaultMode);
$("a.gm-addColumn").removeClass("cmsAddCol");
gm.reset();
$("a.gm-addColumn").addClass("cmsAddColActive");

// Add a nested row
}).on("click", "a.gm-addRow", function(){
   gm.log("Adding nested row");
   $(this).closest("." +gm.options.gmEditClass).append(
  $("<div>").addClass(gm.options.rowClass)
            .html(gm.createCol(6))
            .append(gm.createCol(6)));
$("a.gm-addRow").removeClass("cmsAddRow");
   gm.reset();
   $("a.gm-addRow").addClass("cmsAddRowActive");

// Decrease Column Size
}).on("click", "a.gm-colDecrease", function(){	
  var col = $(this).closest("." +gm.options.gmEditClass);
  var t=gm.getColClass(col);
  if(t.colWidth > parseInt(gm.options.colResizeStep, 10)){
           t.colWidth=(parseInt(t.colWidth, 10) - parseInt(gm.options.colResizeStep, 10));
		   //col.switchClass(t.colClass, gm.options.currentClassMode + t.colWidth, 200,triggerRize); //comment for device resize changes
   col.removeClass(t.colClass).addClass(gm.options.currentClassMode + t.colWidth);
   canvas.find(gm.options.colSelector)
      .find("img")
  .addClass("img-responsive");
       }
 
// Increase Column Size
}).on("click", "a.gm-colIncrease", function(){
   var col = $(this).closest("." +gm.options.gmEditClass);
   var t=gm.getColClass(col);
    if(t.colWidth < gm.options.colMax){
        t.colWidth=(parseInt(t.colWidth, 10) + parseInt(gm.options.colResizeStep, 10));
		//col.switchClass(t.colClass, gm.options.currentClassMode + t.colWidth, 200,triggerRize); //comment for device resize changes
col.removeClass(t.colClass).addClass(gm.options.currentClassMode + t.colWidth);
// $("a.gm-colIncrease").removeClass("cmsColWider");
// $("a.gm-colIncrease").addClass("cmsColWiderActive");
}

// Reset all teh things
}).on("click", "a.gm-moveRow", function(){
   console.log("wow Move clicked");
/*  $("[data-tool='editorTools']").each(function(i){
        $(this).toggle();
});*/

// Remove a col or row
}).on("click", ".gm-moveCol", function(){

   console.log("wow Move clicked");
   var idx = $(this).closest(".gm-editing");
   console.log($(idx).children("div.gm-tools").find("a[data-tool1='editorTools']").length);
   console.log("Length : " + $(this).closest(".gm-editing").children("div.gm-tools").find("a[data-tool1='editorTools']").length);
   // var prevElem = $(idx).prevAll('.gm-tools').last();
//console.log("visible Length : " + $("[data-tool1='editorTools']:visible").length);
//$("[data-tool1='editorTools']:visible").hide();
//console.log($(prevElem).attr("class"));
//$(prevElem).find("a[data-tool1='editorTools']").toggle();
 /* $(this).closest(".gm-editing").children("div.gm-tools").find("a[data-tool1='editorTools']").each(function(i){
                $(this).toggle();
        });*/
   
    }).on("click", "a.gm-resetgrid", function(){
canvas.html("");
gm.reset();

// Remove a col or row
}).on("click", "a.gm-removeCol", function(){
   $("a.gm-removeCol").removeClass("cmsColRmv");
$("a.gm-removeCol").addClass("cmsColRmvActive");
   $(this).closest("." +gm.options.gmEditClass).animate({opacity: 'hide', width: 'hide', height: 'hide'}, 400, function(){$(this).remove();});
 gm.log("Column Removed");
}).on("click", "a.gm-removeRow", function(){
   gm.log($(this).closest("." +gm.options.colSelector));
   $(this).closest("." +gm.options.gmEditClass).animate({opacity: 'hide', height: 'hide'}, 400, function(){
   $(this).remove();
   checkForContent();
 // Check for multiple editable regions and merge?
});
 gm.log("Row Removed");

// For all the above, prevent default.
}).on("click", "a.gm-resetgrid, a.gm-remove, a.gm-removeRow, a.gm-save, button.gm-preview, a.gm-viewsource, a.gm-addColumn, a.gm-colDecrease, a.gm-colIncrease", function(e){
   gm.log("Clicked: "   + $.grep((this).className.split(" "), function(v){
 return v.indexOf('gm-') === 0;
   }).join());
   e.preventDefault();
});

};

        /**
         * Add any custom buttons globally on all rows / cols
         * returns void
         * @method initGlobalCustomControls
         * @returns null
         */
        gm.initGlobalCustomControls=function(){
          var canvas=gm.$el.find("#" + gm.options.canvasId),
              elems=[],
              callback = null,
              btnClass = '';

          $.each(['row','col'], function(i, control_type) {
		  
            if(typeof gm.options.customControls['global_'+control_type] !== 'undefined') {
              elems=canvas.find(gm.options[control_type+'Selector']);
              $.each(gm.options.customControls['global_'+control_type], function(i, curr_control) {
                // controls with no valid callbacks set are skipped
                if(typeof curr_control.callback === 'undefined') { return; }

                if(typeof curr_control.loc === 'undefined') {
                  curr_control.loc = 'top';
                }
                if(typeof curr_control.iconClass === 'undefined') {
                  curr_control.iconClass = 'fa fa-file-code-o';
                }
                if(typeof curr_control.btnLabel === 'undefined') {
                  curr_control.btnLabel = '';
                }
                if(typeof curr_control.title === 'undefined') {
                  curr_control.title = '';
                }
				curr_control.dataToolElement = (typeof curr_control.dataToolElement === 'undefined')? '' : curr_control.dataToolElement;
			curr_control.dataToolVal = (typeof curr_control.dataToolVal === 'undefined')? '' : curr_control.dataToolVal;
			
console.log("Custom : "+curr_control.dataToolElement);
                btnClass = (typeof curr_control.callback === 'function')? (i+'_btn') : (curr_control.callback);

                btnObj = {
                  element: 'a',
                  btnClass: 'gm-'+btnClass,
                  iconClass: curr_control.iconClass,
                  btnLabel: curr_control.btnLabel,
                  title: curr_control.title,
				  dataToolElement: curr_control.dataToolElement,
				  dataToolVal: curr_control.dataToolVal
                };

                $.each(elems, function(i, current_elem) {
                  gm.setupCustomBtn(current_elem, curr_control.loc, 'window', curr_control.callback, btnObj);
                });
              });
            }
          });
        };

        /**
         * Add any custom buttons configured on the data attributes
         * returns void
         * @method initCustomControls
         * @returns null
         */
        gm.initCustomControls=function(){
          var canvas=gm.$el.find("#" + gm.options.canvasId),
              callbackParams = '',
              callbackScp = '',
              callbackFunc = '',
              btnLoc = '',
              btnObj = {},
              iconClass = '',
              btnLabel = '';

          $( ('.'+gm.options.colClass+':data,'+' .'+gm.options.rowClass+':data'), canvas).each(function(){
            for(prop in $(this).data()) {
              if(prop.indexOf('gmButton') === 0) {
                callbackFunc = prop.replace('gmButton','');
                callbackParams = $(this).data()[prop].split('|');
                // Cannot accept 0 params or empty callback function name
                if(callbackParams.length === 0 || callbackFunc === '') { break; }

                btnLoc =    (typeof callbackParams[3] !== 'undefined')? callbackParams[3] : 'top';
                iconClass = (typeof callbackParams[2] !== 'undefined')? callbackParams[2] : 'fa fa-file-code-o';
                btnLabel =  (typeof callbackParams[1] !== 'undefined')? callbackParams[1] : '';
                callbackScp = callbackParams[0];
                btnObj = {
                  element: 'a',
                  btnClass: ('gm-'+callbackFunc),
                  iconClass:  iconClass,
                  btnLabel: btnLabel
                };
                gm.setupCustomBtn(this, btnLoc, callbackScp, callbackFunc, btnObj);
                break;
              }
            }
          });
        };



        /**
         * Configures custom button click callback function
         * returns bool, true on success false on failure
         * @container - container element that wraps the toolbar
         * @btnLoc - button location: "top" for the upper toolbar and "bottom" for the lower one
         * @callbackScp - function scope to use. "window" for global scope
         * @callbackFunc - function name to call when the user clicks the custom button
         * @btnObj - button object that contains properties for: tag name, title, icon class, button class and label
         * @method setupCustomBtn
         * @param {} container
         * @param {} btnLoc
         * @param {} callbackScp
         * @param {} callbackFunc
         * @param {} btnObj
         * @returns Literal
         */
        gm.setupCustomBtn=function(container, btnLoc, callbackScp, callbackFunc, btnObj) {
          var callback = null;

          // Ensure we have a valid callback, if not skip
          if(typeof callbackFunc === 'string') {
            callback = gm.isValidCallback(callbackScp, callbackFunc.toLowerCase());
          } else if(typeof callbackFunc === 'function') {
            callback = callbackFunc;
          } else {
            return false;
          }
          // Set default button location to the top toolbar
          btnLoc = (btnLoc === 'bottom')? ':last' : ':first';

          // Add the button to the selected toolbar
          $( ('.'+gm.options.gmToolClass+btnLoc), container).append(gm.buttonFactory([btnObj])).find(':last').on('click', function(e) {
            callback(container, this);
            e.preventDefault();
          });
          return true;
        };

        /*
          Clears any comments inside a given element

          @elem - element to clear html comments on

          returns void
         */

        gm.clearComments = function(elem) {
          $(elem, '#'+gm.options.canvasId).contents().filter(function() {
            return this.nodeType === 8;
          }).remove();
        };

        /**
         * Checks that a callback exists and returns it if available
         * returns function
         * @callbackScp - function scope to use. "window" for global scope
         * @callbackFunc - function name to call when the user clicks the custom button
         * @method isValidCallback
         * @param {} callbackScp
         * @param {} callbackFunc
         * @returns callback
         */
        gm.isValidCallback=function(callbackScp, callbackFunc){
          var callback = null;

          if(callbackScp === 'window') {
            if(typeof window[callbackFunc] === 'function') {
              callback = window[callbackFunc];
            } else { // If the global function is not valid there is nothing to do
              return false;
            }
          } else if(typeof window[callbackScp][callbackFunc] === 'function') {
            callback = window[callbackScp][callbackFunc];
          } else { // If there is no valid callback there is nothing to do
            return false;
          }
          return callback;
        };

      /**
         * Get the col-md-6 class, returning 6 as well from column
         * returns colDesktopClass: the full col-md-6 class
         * colWidth: just the last integer of classname
         * @col - column to look at
         * @method getColClass
         * @param {} col
         * @return ObjectExpression
         */
        gm.getColClass=function(col){
            var colClass=$.grep(col.attr("class").split(" "), function(v){
                return v.indexOf(gm.options.currentClassMode) === 0;
                }).join();
            var colWidth=colClass.replace(gm.options.currentClassMode, "");
                return {colClass:colClass, colWidth:colWidth};
        };

        /*
          Run (if set) any custom init/deinit filters on the gridmanager canvas
            @canvasElem - canvas wrapper container with the entire layout html
            @isInit - flag that indicates if the method is running during init or deinit.
                      true - if its running during the init process, or false - during the deinit (cleanup) process

            returns void
         */

        gm.runFilter=function(canvasElem, isInit){
          if(typeof gm.options.filterCallback === 'function') {
            gm.options.filterCallback(canvasElem, isInit);
          }
          if(gm.options.editableRegionEnabled) {
            gm.editableAreaFilter(canvasElem, isInit);
          }
        };
		

        /**
         * Turns canvas into gm-editing mode - does most of the hard work here
         * @method initCanvas
         * @returns null
         */
        gm.initCanvas = function(){
          // cache canvas
          var canvas=gm.$el.find("#" + gm.options.canvasId);
          gm.switchLayoutMode(gm.options.layoutDefaultMode);
          var cols=canvas.find(gm.options.colSelector);
          var rows=canvas.find(gm.options.rowSelector);
           gm.log("+ InitCanvas Running");
              // Show the template controls
             // gm.$el.find("#gm-addnew").show();
              $(".deviseSelection").addClass('active');
            $(".layoutSelectionBlock").addClass('active');
              // Sort Rows First
			  gm.activateContainer();
              gm.activateRows(rows);
              // Now Columns
              gm.activateCols(cols);
              // Run custom init callback filter
              gm.runFilter(canvas, true);
              // Get cols & rows again after filter execution
              cols=canvas.find(gm.options.colSelector);
              rows=canvas.find(gm.options.rowSelector);
             $('.container-fluid, .container').sortable({
				containment: "document",
				items: rows,
				connectWith: '.container-fluid, .container',
				axis: 'y',
                placeholder: gm.options.rowSortingClass,
                handle: ".gm-moveRow",
                forcePlaceholderSize: true,   opacity: 0.7,  revert: true,
                cursor: "move"
			});
              // Make Rows sortable
              canvas.sortable({
			//	containment: "parent",
                items: '.container-fluid, .container',
                //axis: 'y',
               // placeholder: gm.options.rowSortingClass,
                handle: ".gm-moveRow",
               // forcePlaceholderSize: true,   opacity: 0.7,  revert: true,
                //tolerance: "pointer",
                //cursor: "move"
               });
              /*
              Make columns sortable
              This needs to be applied to each element, otherwise containment leaks
              */
              $.each(rows, function(i, val){
                  $(val).sortable({
                  items: $(val).find(gm.options.colSelector),
                  axis: 'x',
				   helper: function(event, ui){
                	    var $clone =  $(ui).clone();
                	    $clone .css('position','absolute');
                	    return $clone.get(0);
                	  },
                  handle: ".gm-moveCol",
                  forcePlaceholderSize: true,   opacity: 0.7,  revert: true,
                  tolerance: "pointer",
                  containment: $(val),
                  cursor: "move"
                });
              });
              /* Make rows sortable
              cols.sortable({
                items: gm.options.rowSelector,
                axis: 'y',
                handle: ".gm-moveRow",
                forcePlaceholderSize: true,   opacity: 0.7,  revert: true,
                tolerance: "pointer",
                cursor: "move"
              }); */
            gm.status=true;
            gm.mode="visual";
            gm.initCustomControls();
            gm.initGlobalCustomControls();
            gm.initNewContentElem();
            gm.reBuildBanner(true);
            $("#mycanvas a[href]").click(function(e) {
            	e.preventDefault();
				if($(this).attr("href").indexOf('cmsStaticPageByPageNameCms') >= 0){
					var url = $(this).attr("href");
					$.ajax({
						type: "GET",
						url: url,
						success: function(msg){
							var dataHTML = $(msg).find("#mycanvas").html();
							$("#gm-canvas").html(dataHTML);
							gm.initCanvas();
						}
					});
				}
            });
        };

        /**
         * Removes canvas editing mode
         * @method deinitCanvas
         * @returns null
         */
        gm.deinitCanvas = function(){
          // cache canvas
          var canvas=gm.$el.find("#" + gm.options.canvasId);
          var cols=canvas.find(gm.options.colSelector);
          var rows=canvas.find(gm.options.rowSelector);

           gm.log("- deInitCanvas Running");
              // Hide template control
              //gm.$el.find("#gm-addnew").hide();
             $(".deviseSelection").removeClass('active');
           	 $(".layoutSelectionBlock").removeClass('active');
              // Sort Rows First
              gm.deactivateRows(rows);
              // Now Columns
              gm.deactivateCols(cols);
              // Clean markup
              gm.cleanup();
              gm.runFilter(canvas, false);
              gm.status=false;
        };

        /**
         * Push cleaned div content somewhere to save it
         * @method saveremote
         * @returns null
         */
        gm.saveremote =  function(){
        var canvas=gm.$el.find("#" + gm.options.canvasId);
            $.ajax({
              type: "POST",
              url:  gm.options.remoteURL,
              data: {content: canvas.html()}
            });
            gm.log("Save Function Called");
        };


/*------------------------------------------ ROWS ---------------------------------------*/
        /**
         * Look for pre-existing rows and add editing tools as appropriate
         * @rows: elements to act on
         * @method activateRows
         * @param {object} rows - rows to act on
         * @returns null
         */
        gm.activateRows = function(rows){
           gm.log("++ Activate Rows");
           rows.addClass(gm.options.gmEditClass)
               .prepend(gm.toolFactory(gm.options.rowButtonsPrepend));
               //.append(gm.toolFactory(gm.options.rowButtonsAppend));
        };
		gm.activateContainer = function(){
           $('#mycanvas .container-fluid, #mycanvas  .container').addClass(gm.options.gmEditClass).prepend(gm.toolFactory(gm.options.containerButtonsPrepend));
        };
         /**
         * Look for pre-existing rows and remove editing classes as appropriate
         * @rows: elements to act on
         * @method deactivateRows
         * @param {object} rows - rows to act on
         * @returns null
         */
        gm.deactivateRows = function(rows){
           gm.log("-- DeActivate Rows");
           rows.removeClass(gm.options.gmEditClass)
               .removeClass("ui-sortable").css({ 'z-index' : '', 'opacity' : '' });
               //.removeAttr("style");
        };

        /**
         * Create a single row with appropriate editing tools & nested columns
         * @method createRow
         * @param {array} colWidths - array of css class integers, i.e [2,4,5]
         * @returns row
         */
        gm.createRow = function(colWidths){
          var canvas=gm.$el.find("#" + gm.options.canvasId);
			row = $("<div/>", {"class": gm.options.rowClass + " " + gm.options.gmEditClass});
			var row= $("<div/>", {"class": gm.options.rowClass + " " + gm.options.gmEditClass});
			$.each(colWidths, function(i, val){
				row.append(gm.createCol(val));
			});
			if($('#containFluid').is(':checked') && !$(canvas[0].lastElementChild).hasClass('container-fluid')){
				containerFluid = $("<div/>", {"class": 'container-fluid'});
				row = containerFluid.append(row).prepend(gm.toolFactory(gm.options.containerButtonsPrepend));
			}else if(!$('#containFluid').is(':checked') && !$(canvas[0].lastElementChild).hasClass('container')){
				container = $("<div/>", {"class": 'container'});
				row = container.append(row).prepend(gm.toolFactory(gm.options.containerButtonsPrepend));
			}
            gm.log("++ Created Row");
          return row;
        };

        /**
         * Create the row specific settings box
         * @method generateRowSettings
         * @param {object} row - row to act on
         * @return MemberExpression
         */
        gm.generateRowSettings = function(row){
         // Row class toggle buttons
          var classBtns=[];
             /* $.each(gm.options.rowCustomClasses, function(i, val){
                  var btn=$("<button/>")
                  .addClass("gm-toggleRowClass")
                  .addClass(gm.options.controlButtonClass)
                  .append(
                    $("<span/>")
                    .addClass(gm.options.controlButtonSpanClass)
                  ).append(" " + val);

                   if(row.hasClass(val)){
                       btn.addClass(gm.options.gmDangerClass);
                    }
                   classBtns.push(btn[0].outerHTML);
             });*/
          // Row settings drawer
          var html=$("<div/>")
              .addClass("gm-rowSettingsDrawer")
              //.addClass(gm.options.gmToolClass)
              //.addClass(gm.options.gmClearClass)
              .prepend($("<div />")
                .addClass(gm.options.gmBtnGroup)
                .addClass(gm.options.gmFloatLeft)
                .html(classBtns.join("")))
              .append($("<div />").addClass("bgColor").html(
                $("<label />").html("Row Background: ").append(
                $("<input>").addClass("gm-rowSettingsID").attr({type: 'text', placeholder: 'Background Color', value: row.attr("id")})
                )
              ));

          return html[0].outerHTML;
        };

         /**
         * Create the col specific settings box
         * @method generateColSettings
         * @param {object} col - Column to act on
         * @return MemberExpression
         */
        gm.generateColSettings = function(col){
         // Col class toggle buttons
          var classBtns=[];
              $.each(gm.options.colCustomClasses, function(i, val){
                  var btn=$("<button/>")
                  .addClass("gm-togglecolClass")
                  .addClass(gm.options.controlButtonClass)
                  .append(
                    $("<span/>")
                    .addClass(gm.options.controlButtonSpanClass)
                  ).append(" " + val);
                   if(col.hasClass(val)){
                       btn.addClass(gm.options.gmDangerClass);
                    }
                   classBtns.push(btn[0].outerHTML);
             });
          // col settings drawer
          var html=$("<div/>")
              .addClass("gm-colSettingsDrawer")
              .addClass(gm.options.gmToolClass)
              .addClass(gm.options.gmClearClass)
              .prepend($("<div />")
                .addClass(gm.options.gmBtnGroup)
                .addClass(gm.options.gmFloatLeft)
                .html(classBtns.join("")))
              .append($("<div />").addClass("pull-right").html(
                $("<label />").html("col ID ").append(
                $("<input>")
                  .addClass("gm-colSettingsID")
                  .attr({type: 'text', placeholder: 'col ID', value: col.attr("id")})
                )
              ));

          return html[0].outerHTML;
        };

/*------------------------------------------ COLS ---------------------------------------*/



        /**
         * Look for pre-existing columns and add editing tools as appropriate
         * @method activateCols
         * @param {object} cols - elements to act on
         * @returns null
         */
        gm.activateCols = function(cols){
         cols.addClass(gm.options.gmEditClass);
            // For each column,
            $.each(cols, function(i, column){
              $(column).prepend(gm.toolFactory(gm.options.colButtonsPrepend));
              $(column).append(gm.toolFactory(gm.options.colButtonsAppend));
            });
           gm.log("++ Activate Cols Ran");
        };

        /**
         * Look for pre-existing columns and removeediting tools as appropriate
         * @method deactivateCols
         * @param {object} cols - elements to act on
         * @returns null
         */
        gm.deactivateCols = function(cols){
           cols.removeClass(gm.options.gmEditClass)
               .removeClass(gm.options.gmEditClassSelected)
               .removeClass("ui-sortable");
           $.each(cols.children(), function(i, val){
            // Grab contents of editable regions and unwrap
            if($(val).hasClass(gm.options.gmEditRegion)){
              if($(val).html() !== ''){
                $(val).contents().unwrap();
              } else {
                // Deals with empty editable regions
                $(val).remove();
              }
            }
           });
           gm.log("-- deActivate Cols Ran");
        };

        /**
          * Create a single column with appropriate editing tools
          * @method createCol
          * @param {integer} size - width of the column to create, i.e 6
          * @returns null
          */
         gm.createCol =  function(size){
         var col= $("<div/>")
            .addClass(gm.options.colClass)
            .addClass(gm.options.colDesktopClass + size)
            .addClass(gm.options.colTabletClass + 12)
            .addClass(gm.options.colPhoneClass + 12)
            .addClass(gm.options.gmEditClass)
            .addClass(gm.options.colAdditionalClass)
            .html(gm.toolFactory(gm.options.colButtonsPrepend))
            .prepend(gm.toolFactory(gm.options.colButtonsPrepend))
            .append(gm.toolFactory(gm.options.colButtonsAppend));
            gm.log("++ Created Column " + size);
            return col;
        };


/*------------------------------------------ Editable Regions ---------------------------------------*/

        /*
          Callback called when a the new editable area button is clicked

            @container - container element that wraps the select button
            @btn       - button element that was clicked

            returns void
         */
        gm.addEditableAreaClick = function(container, btn) {
          var cTagOpen = '<!--'+gm.options.gmEditRegion+'-->',
              cTagClose = '<!--\/'+gm.options.gmEditRegion+'-->',
              elem = null;
          $(('.'+gm.options.gmToolClass+':last'),container)
          .before(elem = $('<div>').addClass(gm.options.gmEditRegion+' '+gm.options.contentDraggableClass)
            .append(gm.options.controlContentElem+'<div class="'+gm.options.gmContentRegion+'"><p>Enter Content Here</p></div>')).before(cTagClose).prev().before(cTagOpen);
          gm.initNewContentElem(elem);
          showAllIcons();
        };

          /*
          Prepares any new content element inside columns so inner toolbars buttons work
          and any drag & drop functionality.
            @newElem  - Container of the new content element added into a col
            returns void
         */
        function showAllIcons(){
        	jQuery('.cimm_saveIcon,.cimm_publishIcon,.cimm_addNewIcon,.cimm_cmsResetIcon,.cimm_previewIcon,.cimm_srcCodeIcon').css({'pointer-events':'visible','opacity':'1'});
        }
        gm.initNewContentElem = function(newElem) {
          var parentCols = null;
          
          var dropOpts ={
        		    
        		   
    		        drop: function (event, ui) {
						window.tinymce.remove();
						console.log('tinymceremoved');
    		        	var content =$(ui.draggable).clone().find('div.hiddenContent').html();
    		         	var target = $(this).find('.'+gm.options.gmContentRegion);
    		         	if(target.children("p").text()!=null && typeof target.children("p").text()!='undefined' && jQuery.trim(target.children("p").text())=="Enter Content Here")
    		         		target.children("p").remove();
    		        	//check to make sure the this is an ediatble div
    		        	//alert($(target).html());
						console.log("Content : " +  content);
						var loadSlider = false;
		        	/*Jssor Multi Slider Support*/
		        	var sliderVar="";
		        	var sliderWrapper = "";
		        	var contentDataAttr = jQuery(content).data("type");
		        	console.log("contentDataAttr : " + contentDataAttr);
		        	if(typeof content!='undefined' && content.indexOf("slidercontainer")!=-1)
		        		{
		        		$(this).find('.'+gm.options.gmContentRegion).attr({"data-name": "bannerBlock"});
		        		$(this).find('.'+gm.options.gmContentRegion).addClass("bannerBlock");
		        		var slideCounter = $("div[id$='_Wrapper']").length;
		        		sliderVar = "slider"+slideCounter+"_container";
		        		sliderWrapper =  sliderVar+"_Wrapper";
		        		console.log("true");
		        		initContextMenu("#"+sliderVar); 
		        		content = content.replace("slidercontainer","slider"+slideCounter+"_container");
		        		content = "<div id='"+sliderWrapper+"'>"+content+"</div>";
		        		loadSlider=true;
		        		// $("#slideCounter").val(parseInt(slideCounter)+1);		        		
		        		}
		        	
		        		if(contentDataAttr=="widget"){
		        			$(this).find('.'+gm.options.gmContentRegion).attr({"data-name": "widgetBlock"});
		        			jQuery(content).data('select', 'widget');
		        			jQuery(content).attr('data-select', 'widget');
		        			content = content.replace("data-widget-id","data-widget");
		        		}
		        		if(contentDataAttr=="form"){
		        			$(this).find('.'+gm.options.gmContentRegion).attr({"data-name": "formBlock"});
		        			jQuery(content).data('select', 'form');
		        			jQuery(content).attr('data-select', 'form');
		        			
		        		}
		        		
    		        	$(content).appendTo(target);
    		        	if(contentDataAttr=="widget"){
    		        		var widgetId = jQuery(content).data("widget");
    		        		jQuery("[data-widget='"+widgetId+"']").attr({'data-select':'widget'});
    		        		generateWidget(widgetId);
    		        		homeCarousels();
    		        	}
    		        	if(contentDataAttr=="form"){
    		        		var formId = jQuery(content).data("widget");
    		        		jQuery("[data-widget='"+formId+"']").attr({'data-select':'form'});
    		        		generateForm(formId);
    		        		
    		        	}
						if(loadSlider)
		        		{
						console.log($("div[id$='_container']").length);
		        		console.log("Slide Var : " + sliderVar);
		        		initJssorSlides(sliderVar);
		        		}
						$("#mycanvas a[href]").click(function(e) {
							e.preventDefault();
							if($(this).attr("href").indexOf('cmsStaticPageByPageNameCms') >= 0){
								var url = $(this).attr("href");
								$.ajax({
									type: "GET",
									url: url,
									success: function(msg){
										var dataHTML = $(msg).find("#mycanvas").html();
										$("#gm-canvas").html(dataHTML);
										gm.initCanvas();
									}
								});
							}
						});
                    },tolerance: 'pointer'
            };
          
          
          var sortOpts ={
        		  items: '.'+gm.options.contentDraggableClass + ' .'+gm.options.contentDroppableClass,
                  axis: 'y',
                  placeholder: gm.options.rowSortingClass,
                  handle: "."+gm.options.controlMove,
                  forcePlaceholderSize: true, opacity: 0.7, revert: true,
                  tolerance: "pointer",
                  cursor: "move",
                  stop: function(e, ui) {
                    gm.resetCommentTags($(ui.item).parent());
                  }  		  
          };

          if(typeof newElem === 'undefined') {
            parentCols = gm.$el.find('.'+gm.options.colClass);
          } else {
            parentCols = newElem.closest('.'+gm.options.colClass);
          }

          
         $(".gm-editable-region").droppable(dropOpts);
          
          $.each(parentCols, function(i, col) {
            $(col).on('click', '.gm-delete', function(e) {
              $(this).closest('.'+gm.options.gmEditRegion).remove();
              gm.resetCommentTags(col);
              e.preventDefault();
            });
            
            $(col).sortable({
              items: '.'+gm.options.contentDraggableClass,
              axis: 'y',
              placeholder: gm.options.rowSortingClass,
              handle: "."+gm.options.controlMove,
              forcePlaceholderSize: true, opacity: 0.7, revert: true,
              tolerance: "pointer",
              cursor: "move",
              stop: function(e, ui) {
                gm.resetCommentTags($(ui.item).parent());
              }
             });
            
          });

        };

        /*
          Resets the comment tags for editable elements
          @elem - Element to reset the editable comments on
          returns void
         */

        gm.resetCommentTags = function(elem) {
          var cTagOpen = '<!--'+gm.options.gmEditRegion+'-->',
              cTagClose = '<!--\/'+gm.options.gmEditRegion+'-->';
          // First remove all existing comments
          gm.clearComments(elem);
          // Now replace these comment tags
          $('.'+gm.options.gmEditRegion, elem).before(cTagOpen).after(cTagClose);
        };

        /*
          Callback called when a the column selection button is clicked
            @container - container element that wraps the select button
            @btn       - button element that was clicked
            returns void
         */

        gm.selectColClick = function(container, btn) {
          $(btn).toggleClass('fa fa-square-o fa fa-check-square-o');
          if($(btn).hasClass('fa-check-square-o')) {
            $(container).addClass(gm.options.gmEditClassSelected);
          } else {
            $(container).removeClass(gm.options.gmEditClassSelected);
          }
        };


        /*
          Filter method to restore editable regions in edit mode.
         */
        gm.editableAreaFilter = function(canvasElem, isInit) {
          if(isInit) {
            var cTagOpen = '<!--'+gm.options.gmEditRegion+'-->',
                cTagClose = '<!--\/'+gm.options.gmEditRegion+'-->',
                regex = new RegExp('(?:'+cTagOpen+')\\s*([\\s\\S]+?)\\s*(?:'+cTagClose+')', 'g'),
                html = $(canvasElem).html(),
                rep = cTagOpen+'<div class="'+gm.options.gmEditRegion+' '+gm.options.contentDraggableClass+'">'+gm.options.controlContentElem +'<div class="'+gm.options.gmContentRegion+'">$1</div></div>'+cTagClose;

            html = html.replace(regex, rep);
            $(canvasElem).html(html);
            gm.log("editableAreaFilter init ran");
           
          } else {
            $('.'+gm.options.controlNestedEditable, canvasElem).remove();
            $('.'+gm.options.gmContentRegion).contents().unwrap();

            gm.log("editableAreaFilter deinit ran");
          }
        };

/*------------------------------------------ BTNs ---------------------------------------*/
        /**
         * Returns an editing div with appropriate btns as passed in
         * @method toolFactory
         * @param {array} btns - Array of buttons (see options)
         * @return MemberExpression
         */
        gm.toolFactory=function(btns){
           var tools=$("<div/>")
              .addClass(gm.options.gmToolClass)
              .addClass(gm.options.gmClearClass)
              .html(gm.buttonFactory(btns));
           return tools[0].outerHTML;
        };

        /**
         * Returns html string of buttons
         * @method buttonFactory
         * @param {array} btns - Array of button configurations (see options)
         * @return CallExpression
         */
        gm.buttonFactory=function(btns){
          var buttons=[];
		  var bt = "";
		  var btnClass = "";
          $.each(btns, function(i, val){
            val.btnLabel = (typeof val.btnLabel === 'undefined')? '' : val.btnLabel;
            val.title = (typeof val.title === 'undefined')? '' : val.title;
			val.dataToolElement = (typeof val.dataToolElement === 'undefined')? '' : val.dataToolElement;
			val.dataToolVal = (typeof val.dataToolVal === 'undefined')? '' : val.dataToolVal;
			bt = "";
			btnClass = "";
			if(val.title == "Add Editable Region")
			btnClass = val.btnClass ;
			else
			btnClass = val.btnClass;
			if(val.dataToolElement!="")
			{
			bt = val.dataToolElement+"=\""+val.dataToolVal+"\"";
			}
			console.log("Tool Element : "+bt);
			
            buttons.push("<" + val.element +" "+bt+" title='" + val.title + "' class='" + btnClass + "'><span class='"+val.iconClass+"'></span>&nbsp;" + val.btnLabel + "</" + val.element + "> ");
          });
		  //jQuery(".gm-rowSettings").trigger("click");
          return buttons.join("");
        };

        /**
         * Basically just turns [2,4,6] into 2-4-6
         * @method generateButtonClass
         * @param {array} arr - An array of widths
         * @return string
         */
        gm.generateButtonClass=function(arr){
            var string="";
              $.each(arr, function( i , val ) {
                    string=string + "-" + val;
              });
              return string;
        };

        /**
         * click handlers for dynamic row template buttons
         * @method generateClickHandler
         * @param {array} colWidths - array of column widths, i.e [2,3,2]
         * @returns null
         */
        gm.generateClickHandler= function(colWidths){
          var string="a.add" + gm.generateButtonClass(colWidths);
          var canvas=gm.$el.find("#" + gm.options.canvasId);
              gm.$el.on("click", string, function(e){
                gm.log("Clicked " + string);
                var rowObj = gm.createRow(colWidths);
				if($('#containFluid').is(':checked') && $(canvas[0].lastElementChild).hasClass('container-fluid')){
					$(canvas[0].lastElementChild).append(rowObj);
				}else if(!$('#containFluid').is(':checked') && $(canvas[0].lastElementChild).hasClass('container')){
					$(canvas[0].lastElementChild).append(rowObj);
				}else{
					canvas.append(rowObj);
				}
			//$(canvas[0].firstElementChild).prepend(rowObj);
				canvas.find('[data-type="widget"]').html("");
                gm.reset();
                e.preventDefault();
               
            });
        };

/*------------------------------------------ RTEs ---------------------------------------*/
        /**
         * Starts, stops, looks for and  attaches RTEs
         * @method rteControl
         * @param {string} action  - options are init, attach, stop
         * @param {object} element  - object to attach an RTE to
         * @returns null
         */
        gm.rteControl=function(action, element){
          gm.log("RTE " + gm.options.rte + ' ' +action);

          switch (action) {
            case 'init':
                if(typeof window.CKEDITOR !== 'undefined'){
                    gm.options.rte='ckeditor';
                    gm.log("++ CKEDITOR Found");
                    window.CKEDITOR.disableAutoInline = true;
               }
                if(typeof window.tinymce !== 'undefined'){
                    gm.options.rte='tinymce';
                    gm.log("++ TINYMCE Found");
                }
                break;
             case 'attach':
                switch (gm.options.rte) {
                    case 'tinymce':
                    	var enableEditor = true;
                    	if(element.data("name")=="bannerBlock"){
                    		enableEditor = false;
                    	}
                    	if(element.data("name")=="widgetBlock"){
                    		element.attr('contenteditable','false');
                    		enableEditor = false;
                    	}
                    	if(element.data("name")=="formBlock"){
                    		element.attr('contenteditable','false');
                    		enableEditor = false;
                    	}
                    	if((element).hasClass("mce-content-body")){
                    		enableEditor = false;
                    	}
                    	if(enableEditor){
                    	if(element.children("p").text()!=null && typeof element.children("p").text()!='undefined' && jQuery.trim(element.children("p").text())=="Enter Content Here")
                    	     element.children("p").remove();
                      element.tinymce(gm.options.tinymce.config);
                    }
                    break;

                    case 'ckeditor':
                      $(element).ckeditor(gm.options.ckeditor);

                    break;
                    default:
                        gm.log("No RTE specified for attach");
                }
                break; //end Attach
            case 'stop':
                switch (gm.options.rte) {
                    case 'tinymce':
                      // destroy TinyMCE
                      window.tinymce.remove();
                         gm.log("-- TinyMCE destroyed");
                    break;

                    case 'ckeditor':
                      // destroy ckeditor
                         for(var name in window.CKEDITOR.instances)
                        {
                          window.CKEDITOR.instances[name].destroy();
                        }
                         gm.log("-- CKEDITOR destroyed");
                    break;

                    default:
                        gm.log("No RTE specified for stop");
                }
              break; //end stop

              default:
                  gm.log("No RTE Action specified");
            }
        };


/*------------------------------------------ Useful functions ---------------------------------------*/

        /**
         * Quick reset - deinit & init the canvas
         * @method reset
         * @returns null
         */
        gm.reset=function(){
            gm.log("~~RESET~~");
            gm.deinitCanvas();
            gm.initCanvas();
        };
        
        gm.reBuildBanner = function(loadBanner){
        	console.log("Banner reinit");
        	jQuery("[data-select='bannerBlock']").each(function(i){
        		jQuery(this).closest('.gm-content').attr({"data-name": "bannerBlock"});
				var bannerListId = jQuery(this).data("bannerid");
				if(typeof bannerListId!="undefined" && bannerListId!=""){
					refreshBanner(bannerListId,i);
				}
			 });
        	console.log("Widget Length: "+jQuery("[data-select='widget']").length);
        	jQuery("[data-select='widget']").each(function(i){
        		var widgetId = jQuery(this).data("widget");
        		//console.log("widget find class in page: "+jQuery(this).find('.slick-slider').length);
        	});
        	console.log("Widget reinit");
        	jQuery("[data-select='widget']").each(function(i){
        		var widgetId = jQuery(this).data("widget");
        		//console.log("widget count in page: "+i+" :widget ID:"+widgetId);
        		generateWidget(widgetId);
        	});
        	console.log("Form reinit");
        	jQuery("[data-select='form']").each(function(i){
        		var formId = jQuery(this).data("widget");
        		jQuery(this).closest(".gm-content").attr({"data-name": "formBlock"});
        		generateForm(formId);
        	});
        	homeCarousels();
        	jQuery("[data-type='widget']").click(function(){
        		$(this).parent().attr('contenteditable','false');
        	});
        };

        /**
         * Remove all extraneous markup
         * @method cleanup
         * @returns null
         */

        gm.cleanup =  function(){
        	
          var canvas,
              content;

              // cache canvas
              canvas = gm.$el.find("#" + gm.options.canvasId);

              /**
               * Determine the current edit mode and get the content based upon the resultant
               * context to prevent content in source mode from being lost on save, as such:
               *
               * edit mode (source): canvas.find('textarea').val()
               * edit mode (visual): canvas.html()
               */
              content = gm.mode !== "visual" ? canvas.find('textarea').val() : canvas.html();

              // Clean any temp class strings
              canvas.html(gm.cleanSubstring(gm.options.classRenameSuffix, content, ''));

              // Clean column markup
              canvas.find(gm.options.colSelector)
                  .removeAttr("style")
                  .removeAttr("spellcheck")
                  .removeClass("mce-content-body").end()
              // Clean img markup
                  .find("img")
                  .removeAttr("style")
                  .addClass("img-responsive")
                  .removeAttr("data-cke-saved-src")
                  .removeAttr("data-mce-src").end()
              // Remove Tools
                  .find("." + gm.options.gmToolClass).remove();
              // Destroy any RTEs
                  gm.rteControl("stop");
              gm.log("~~Cleanup Ran~~");
        };

        /**
         * Generic logging function
         * @method log
         * @param {object} logvar - The Object or string you want to pass to the console
         * @returns null
         * @property {boolean} gm.options.debug
         */
        gm.log = function(logvar){
          if(gm.options.debug){
            if ((window['console'] !== undefined)) {
              window.console.log(logvar);
              }
            }
        };
        // Run initializer
        gm.init();
    };


    var siteName = $('#siteName').val();
    /**
     Options which can be overridden by the .gridmanager() call on the requesting page------------------------------------------------------
    */
    
    var selectFullWidthContainer = '<div class="select-fullwidth"><label class="cms_customCheckBox"><input type="checkbox" id="containFluid"/><span> Create full width container</span></label></div>';
    var previewDevices = "<a style='display:none;' class='gm-save button tiny' title='Save' href='#'><span class='fa fa-save'></span></a>";
    previewDevices += "<a title='Mobile Portrait' class='iconbutton tiny resPreviewIcon' data-width='640' onclick='changeresponsivefunct(this);'><span class='action-icon'><i class='fa fa-2x fa-mobile'></i></span><span class='action-text'>Mobile Portrait</span></a>";
    previewDevices += "<a title='Mobile Landscape' class='iconbutton tiny resPreviewIcon' data-width='640' onclick='changeresponsivefunct(this);'><span class='action-icon'><i class='fa fa-2x fa-mobile fa-rotate-270'></i></span><span class='action-text'>Mobile Landscape</span></a>";
    previewDevices += "<a title='Tablet Portrait' class='iconbutton tiny resPreviewIcon' data-width='640' onclick='changeresponsivefunct(this);'><span class='action-icon'><i class='fa fa-2x fa-tablet'></i></span><span class='action-text'>Tablet Portrait</span></a>";
    previewDevices += "<a title='Tablet Landscape' class='iconbutton tiny resPreviewIcon' data-width='640' onclick='changeresponsivefunct(this);'><span class='action-icon'><i class='fa fa-2x fa-tablet fa-rotate-270'></i></span><span class='action-text'>Tablet Landscape</span></a>";
    previewDevices += "<a title='Desktop' class='iconbutton tiny resPreviewIcon' data-width='640' onclick='changeresponsivefunct(this);'><span class='action-icon'><i class='fa fa-2x fa-desktop'></i></span><span class='action-text'>Desktop</span></a>";
	
    $.gridmanager.defaultOptions = {
		/*General Options---------------*/
		debug: 0,
		// Are you columns selectable
		colSelectEnabled: true,
		
		// Can add editable regions?
		editableRegionEnabled: true,
		
		// Should we try and automatically create editable regions?
		autoEdit: true,
		
		// URL to save to
		remoteURL: "/replace-with-your-url",
		
		// Custom CSS to load
		//cssInclude: "../WEB_THEMES/"+siteName+"/css/unilogWebLayouts.css",
		
		// Filter callback. Callback receives two params: the template grid element and whether is called from the init or deinit method
		filterCallback: null,
		/* Canvas---------------*/
		// Canvas ID
		canvasId: "gm-canvas",
		
		/*Control Bar---------------*/
		// Top Control Row ID
		controlId:  "gm-controls",
		
		// Move handle class
		controlMove: 'gm-move',
		
		// Editable element toolbar class
		controlNestedEditable: 'gm-controls-element',
		
		// Array of buttons for row templates
		controlButtons: [[12], [6,6], [4,4,4], [3,3,3,3], [2,2,2,2,2,2], [2,8,2], [4,8], [8,4], [12,6,6], [12,4,4,4], [12,3,3,3,3], [12,2,2,2,2,2,2]],
		
		// Custom Global Controls for rows & cols - available props: global_row, global_col
		customControls: { global_row: [], global_col: [] },
		
		// Default control button class
		controlButtonClass: "btn  btn-xs  btn-primary",
		
		// Default control button icon
		controlButtonSpanClass: "fa fa-plus-circle",
		
		// Control bar RH dropdown markup
		/* controlAppend: "<div class='button-group right'><button title='Edit Source Code' type='button' class='tiny gm-edit-mode cmsEditrBtn'><span class='fa fa-code'></span></button><button title='Preview' type='button' class='button tiny gm-preview cmsEditrBtn'><span class='fa fa-eye'></span></button><div class='button-group right gm-layout-mode'><a class='button tiny' data-width='auto' title='Desktop'><span class='fa fa-desktop'></span></a><a class='button tiny'  title='Tablet' data-width='768'><span class='fa fa-tablet'></span></a><a title='Phone' class='button tiny' data-width='640'><span class='fa fa-mobile-phone'></span></a><a  class='gm-save button tiny'  title='Save'  href='#'><span class='fa fa-save'></span></a><a  class='button tiny gm-resetgrid'  title='Reset Grid' href='#'><span class='fa fa-trash-o'></span></a></div>",*/
		/* controlAppend: "<div class='button-group right'><button title='Edit Source Code' type='button' class='tiny gm-edit-mode cmsEditrBtn'><span class='fa fa-code'></span></button><button id='previewBtnId' title='Preview' type='button' class='button tiny gm-preview cmsEditrBtn'><span class='fa fa-eye'></span></button><div class='button-group right gm-layout-mode'><a  class='gm-save button tiny'  title='Save'  href='#'><span class='fa fa-save'></span></a><a  class='button tiny gm-resetgrid'  title='Reset Grid' href='#'><span class='fa fa-trash-o'></span></a><a title='iPhone' class='button tiny active' data-width='640' onclick='javascript:responsivefunct(this);'><span class='fa fa-mobile-phone'></span></a><a title='iPhone landscape' class='button tiny iPhone-l' data-width='640' onclick='javascript:responsivefunct(this);'><span class='fa fa-mobile-phone'></span></a><a title='iPad' class='button tiny' data-width='640' onclick='javascript:responsivefunct(this);'><span class='fa fa-mobile-phone'></span></a><a title='iPad landscape' class='button tiny' data-width='640' onclick='javascript:responsivefunct(this);'><span class='fa fa-mobile-phone iPhone-l'></span></a><a title='Desktop' class='button tiny' data-width='640' onclick='javascript:responsivefunct(this);'><span class='fa fa-laptop'></span></a></div>",*/
		controlAppend: "<div class='button-group clearfix '>"+previewDevices+"<button id='previewBtnId' title='Preview' type='button' class='tiny gm-preview cmsEditrBtn prevBtn'><span class='action-icon'><i class='fa fa-2x fa-file'></i><sup class='fas fa fa-eye'></sup></span><span class='action-text'>Page Preview</span></button><button title='Edit Source Code' type='button' class='tiny gm-edit-mode cmsEditrBtn sorceBtn'><span class='action-icon'><i class='fa fa-2x fa-file-code'></i></span><span class='action-text'>Source Code</span></button></div>",
		
		// Controls for content elements
		controlContentElem: '<div class="gm-controls-element"> <a class="gm-move" title="Move" onclick="javascript:showDelIcon();"><span class="fa fa-lg fa-arrows-alt"></span></a> <a class="gm-delete " href="#" title="Delete"><span class="fa fa-lg fa-times-circle"></span></a> </div>',
		/* General editing classes---------------*/
		// Standard edit class, applied to active elements
		gmEditClass: "gm-editing",
		
		// Applied to the currently selected element
		gmEditClassSelected: "gm-editing-selected",
		
		// Editable region class
		gmEditRegion: "gm-editable-region",
		
		// Editable container class
		gmContentRegion: "gm-content",
		
		// Tool bar class which are inserted dynamically
		gmToolClass: "gm-tools",
		
		// Clearing class, used on most toolbars
		gmClearClass: "clearfix",
		
		// generic float left and right
		gmFloatLeft: "pull-left",
		gmFloatRight: "pull-right",
		gmBtnGroup:  "btn-group",
		gmDangerClass: "btn-danger",
		
		/*Rows---------------*/
		// Generic row class. change to row--fluid for fluid width in Bootstrap
		rowClass:    "row",
		
		// Used to find rows - change to div.row-fluid for fluid width
		rowSelector: "div.row",
		
		// class of background element when sorting rows
		rowSortingClass: "alert-warning",
		
		// Buttons at the top of each row
		rowButtonsPrepend: [{
			title:"Row",
			element: "span",
			btnClass: "cms_cont_title",
			btnLabel: "Row"
		},{
			title:"Move Row",
			element: "a",
			btnClass: "gm-moveRow",
			iconClass: "fa fa-lg fa-arrows-alt"
		},{
		   title:"New Column",
		   element: "a",
		   btnClass: "gm-addColumn",
		   iconClass: "fa fa-lg fa-plus-square",
		   dataToolElement:"data-tool",
		   dataToolVal:"editorTools"
		},{
			title:"Remove row",
			element: "a",
			btnClass: "gm-removeRow",
			iconClass: "fa fa-lg fa-times-circle"
		},{
			title:"Row - Background color",
			element: "a",
			btnClass: "gm-rowSettings",
			iconClass: "fa fa-lg fa-cog"
		}],
		
		containerButtonsPrepend: [{
			title:"Container",
			element: "span",
			btnClass: "cms_cont_title",
			btnLabel: "Container"
		},{
			title:"Move Container",
			element: "a",
			btnClass: "gm-moveRow",
			iconClass: "fa fa-lg fa-arrows-alt"
		}, {
			title:"Remove Container",
			element: "a",
			btnClass: "gm-removeRow",
			iconClass: "fa fa-lg fa-times-circle"
		}],
		
		// Buttons to prepend to each column
		colButtonsPrepend: [{
			title:"Column",
			element: "span",
			btnClass: "cms_cont_title",
			iconClass: "",
			btnLabel: "Column"
		},{
			title:"Move Within Column",
			element: "a",
			btnClass: "gm-moveCol",
			iconClass: "fa fa-lg fa-arrows-alt"
		},/*{
		   title:"Column Settings",
		   element: "a",
		   btnClass: "gm-colSettings",
		   iconClass: "fa fa-lg fa-cog"
		},*/{
			title:"Make Column Narrower",
			element: "a",
			btnClass: "gm-colDecrease cmsColNarrow",
			dataToolElement:"data-tool1",
			dataToolVal:"editorTools",
			iconClass: "fa fa-lg fa-caret-left"
		},{
			title:"Make Column Wider",
			element: "a",
			btnClass: "gm-colIncrease cmsColWider",
			dataToolElement:"data-tool1",
			dataToolVal:"editorTools",
			iconClass: "fa fa-lg fa-caret-right"
		},{
			title:"Add Nested Row",
			element: "a",
			btnClass: "gm-addRow",// pull-left cmsAddRow hideButton
			dataToolElement:"data-tool1",
			dataToolVal:"editorTools",
			iconClass: "fa fa-lg fa-plus-square"
		},{
			title:"Remove Column",
			element: "a",
			btnClass: "gm-removeCol",// pull-left cmsColRmv hideButton
			dataToolElement:"data-tool1",
			dataToolVal:"editorTools",
			iconClass: "fa fa-lg fa-times-circle"
		}],
	
		// Buttons to append to each column
		/*colButtonsAppend: [{
			title:"Add Nested Row",
			element: "a",
			btnClass: "pull-left gm-addRow cmsAddRow hideButton",
			dataToolElement:"data-tool1",
			dataToolVal:"editorTools"
		},{
			title:"Remove Column",
			element: "a",
			btnClass: "pull-left gm-removeCol cmsColRmv hideButton",
			dataToolElement:"data-tool1",
			dataToolVal:"editorTools"
		}],*////this code moved into colButtonsPrepend
		
		// CUstom row classes - add your own to make them available in the row settings
		rowCustomClasses: ["example-class","test-class"],
		/*Columns--------------*/
		// Column Class
		colClass: "column",
		
		// Class to allow content to be draggable
		contentDraggableClass: 'gm-content-draggable',
		
		// Adds any missing classes in columns for muti-device support.
		addResponsiveClasses: true,
		
		// Adds "colClass" to columns if missing: addResponsiveClasses must be true for this to activate
		addDefaultColumnClass: true,
		
		// Generic desktop size layout class
		colDesktopClass: "col-md-",
		
		// Generic tablet size layout class
		colTabletClass: "col-sm-",
		
		// Generic phone size layout class
		colPhoneClass: "col-xs-",
		
		// Wild card column desktop selector
		colDesktopSelector: "div[class*=col-md-]",
		
		// Wildcard column tablet selector
		colTabletSelector: "div[class*=col-sm-]",
		
		// Wildcard column phone selector
		colPhoneSelector: "div[class*=col-xs-]",
		
		// String used to temporarily rename column classes not in use
		classRenameSuffix: "-clsstmp",
		
		// Default layout mode loaded after init
		layoutDefaultMode: "auto",
		
		// Current layout column mode
		currentClassMode: "",
		
		// Additional column class to add (foundation needs columns, bs3 doesn't)
		colAdditionalClass: "",
	
		// CUstom col classes - add your own to make them available in the col settings
		colCustomClasses: ["example-col-class","test-class"],
	
		// Maximum column span value: if you've got a 24 column grid via customised bootstrap, you could set this to 24.
		colMax: 12,
	
		// Column resizing +- value: this is also the colMin value, as columns won't be able to go smaller than this number (otherwise you hit zero and all hell breaks loose)
		colResizeStep: 1,
	
		/* Rich Text Editors--------------- */	
		tinymce: {
			config: {
				inline: true,
				menubar: false,
				table_default_attributes:{
					class: 'table table-striped table-bordered display',
					width: '100%',
					table_tab_navigation: true
				},
				formats : {
					alignleft: [
						{selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li', styles: {textAlign:'left'}},
						{selector: 'img,table', classes: 'alignleft'}
					],
					aligncenter: [
						{selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li', styles: {textAlign:'center'}},
						{selector: 'img,table', classes: 'aligncenter'}
					],
					alignright: [
						{selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li', styles: {textAlign:'right'}},
						{selector: 'img,table', classes: 'alignright'}
				]},
				image_class_list: [
					{title: 'None', value: ''},
					{title: 'Push Image To Left', value: 'pushImgLeft'},
					{title: 'Push Image To Right', value: 'pushImgRight'}
				],
				browser_spellcheck : true,
				toolbar_items_size: 'medium',
				extended_valid_elements:"i[class],iframe[*],img[*]", 
				valid_elements : '*[*]',
				//content_css: "../WEB_THEMES/"+siteName+"/css/unilogWebLayouts.css",
				autosave_ask_before_unload:true,
				plugins: [
					"advlist autolink link image lists charmap print hr anchor pagebreak spellchecker autosave",
					"searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
					"table contextmenu directionality emoticons template textcolor paste colorpicker textpattern fontawesome"
				],
				image_advtab: true,
				file_browser_callback: function(field_name, url, type, win) {
					console.log(field_name);
					var connector = "bannerUploadCms.action?Connector=/connector.slt";
					var enableAutoTypeSelection = true;
				
					var cType;
					tinyfck_field = field_name;
					tinyfck = win;
					type = "image";
					switch (type) {
						case "image":
						cType = "STATIC_IMAGES";
						break;
						case "flash":
						cType = "Flash";
						break;
						case "file":
						cType = "STATIC_DOCUME";
						break;
					}
					var frameSrc = connector;
					jQuery.colorbox({open:true,href:connector,iframe:true, width:"80%", height:"80%"});
					// $('#testFrame').attr("src",frameSrc);
					// window.open(connector, "tinyfck", "modal,width=600,height=400");
				},
				toolbar1: " bold italic underline strikethrough | removeformat |  styleselect formatselect fontselect fontsizeselect  ",
				toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink image media |  table ",
				toolbar3: "insertdatetime | subscript superscript | alignleft aligncenter alignright alignjustify | charmap emoticons | fullscreen |  forecolor backcolor | code | fontawesome | closeBtn",
				setup: function(editor) {
					editor.addButton('closeBtn', {
						text: 'Close',
						icon: 'close',
						onclick: function() {
							window.tinymce.remove();
						}
					});	
				}
			}
		},
		// Path to CK custom comfiguration
		ckeditor: {
			customConfig: ""
		}
	};

    /**
     * Exposes gridmanager as jquery function
     * @method gridmanager
     * @param {object} options
     * @returns CallExpression
     */
    $.fn.gridmanager = function(options){
        return this.each(function(){
          var element = $(this);
          var gridmanager = new $.gridmanager(this, options);
          element.data('gridmanager', gridmanager);
        });
    };

    /**
     * General Utility Regex function used to get custom callback attributes
     * @method regex
     * @param {} elem
     * @param {} index
     * @param {} match
     * @returns CallExpression
     */
    $.expr[':'].regex = function(elem, index, match) {
      var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
        return regex.test(jQuery(elem)[attr.method](attr.property));
    };
	
	showDelIcon = function(){
		jQuery(".gm-delete").show();
	};
	
	 hideActionIcons = function(clickType){
		$(".readyTemplatesForm, #canvasImage").hide();
		$(".cms_leftMenu").css({'left':'-280px'});
		if(window.parent.document.getElementsByClassName('Cimm-Header')[0]){
			window.parent.document.getElementsByClassName('Cimm-Header')[0].style.display = 'none';
			window.parent.document.getElementsByClassName('Cimm-Footer')[0].style.display = 'none';
			window.parent.document.getElementsByClassName('Cimm-MainContent')[0].style.marginTop = '0px';
		}
		window.parent.document.getElementById("iframeId").style.height = window.outerHeight;
		if(clickType == 'preview'){
			$(".resPreviewIcon").addClass('active');
			jQuery('.Cimm-MainContent').addClass('Cimm-MainContenthide').removeClass('Cimm-MainContent');
			$("#gm-canvas").addClass('gm-container');
		}
		$(".cms_staticTable").css({'padding':'0'});
		/*jQuery('#pageTab,#addNewStaticFormId').hide();
		jQuery("#SeoTabs").css('pointer-events', 'none');
		jQuery('#seoTab,.addStaticPage_innerWrap,.cimm_saveIcon,.cimm_publishIcon,.cimm_addNewIcon,.cimm_cmsResetIcon,.cimm_previewIcon').css({'pointer-events':'none','opacity':'0.5'});
		jQuery(".cimm_srcCodeIcon").attr('title','Content View');*/
	};
	showActionIcons = function(clickType){
		$(".readyTemplatesForm, #canvasImage").show();
		$(".cms_leftMenu").css({'left':'0'});
		if(window.parent.document.getElementsByClassName('Cimm-Header')[0]){
			window.parent.document.getElementsByClassName('Cimm-Header')[0].style.display = 'block';
			window.parent.document.getElementsByClassName('Cimm-Footer')[0].style.display = 'block';
			window.parent.document.getElementsByClassName('Cimm-MainContent')[0].style.marginTop = '100px';
		}
		window.parent.document.getElementById("iframeId").style.height = window.outerHeight - 100;
		if(clickType == 'preview'){
			$(".resPreviewIcon").removeClass('active');
			jQuery('.Cimm-MainContenthide').addClass('Cimm-MainContent').removeClass('Cimm-MainContenthide');
			$("#gm-canvas").removeClass('gm-container');
		}
		$(".cms_staticTable").css({'padding':'0 0 0 270px'});
		/*jQuery('#pageTab,#addNewStaticFormId').show();
		jQuery("#SeoTabs").css('pointer-events', 'visible');
		jQuery('#seoTab,.addStaticPage_innerWrap,.cimm_saveIcon,.cimm_publishIcon,.cimm_addNewIcon,.cimm_cmsResetIcon,.cimm_previewIcon').css({'pointer-events':'visible','opacity':'1'});
		jQuery(".cimm_srcCodeIcon").attr('title','Source Code');*/
	};
		 
	checkForContent = function(){
		var canvasContent = jQuery("#gm-canvas").text().trim();
		console.log("canvas content length:"+ canvasContent.length);
		if(canvasContent.length == 0){
			hideAllIcons();
		}
		else{
			showAllIcons();
		}
	};
})(jQuery );

var validationListElement = "";

function generateValidationList() {
    validationListElement = '<select id="validationlist"><option value="">-Select-</option>';
    for (i = 0; i < validationList.length; i++) {
        console.log(validationList[i].name);
        validationListElement = validationListElement + '<option value="' + validationList[i].value + '">' + validationList[i].name + '</option>';
    }
    validationListElement = validationListElement + '</select>';
}
generateValidationList();

$(".save-form").on("click", function() {
	if($.trim($("#formNameMain").val())==""){
		alert("Please enter form name");
		return false;
	}
    var saveToDb = "N";
    var sendEmail = "N";
    if ($("#saveToDBMain").is(":checked")) {
        saveToDb = "Y";
    }

    if ($("#emailSent").is(":checked")) {
        sendEmail = "Y";
    }

    $("#formName").val($("#formNameMain").val());
    $("#notificationName").val($("#formNotification").val());
    $("#subject").val($("#emailSubject").val());
    $("#saveToDB").val(saveToDb);
    $("#sendMail").val(sendEmail);
    $('.dropelement > form').removeAttr('class').addClass($("#formClass").val());

    var formElement = $(".dropelement").html();
    var jFormElement = $(formElement);
    //jFormElement.find("div").not('.form-group').not('.text-content').remove();
    jFormElement.find(".cms_form-btn-block").remove();
    jFormElement.find(".col").removeClass('editing');
   // console.log(jFormElement);
  //  console.log($('<div>').append(jFormElement).html());
    $("#htmlCode").val($('<div>').append(jFormElement).html());
    var str = $("#mainFormBuilder").serialize();
    var isUpdate = false;
    $.ajax({
        type: "POST",
        url: "addUpdateFormDataCms.action",
        data: str,
        success: function(msg) {
        	var result = $.trim(msg);
            if (result.indexOf("success") != -1) {
            	alert("Form  created successfully");
                window.location.href = "formListCms.action";
                //window.parent.buildFormList();
                window.parent.generateFormList();
                window.parent.initDraggable();
            }
            else if(result.indexOf("unique constraint") != -1){
            	alert("Form Name Already Exists");
            }
            else {
                alert("Error while saving form");
            }
        }
    });
    return false;

});


$(".cancel-apply").on("click", function() {
	$(".formBuilderWrap").removeClass("active");
	$('.col').removeClass("editing");
});
$(".apply-changes").on("click", function() {
    var type = $(".editing").data("type");
    var requiredEl = "";
    var obj = $(".editing");
    console.log($("#required").is(":checked"));
    if ($("#required").is(":checked")) {
        requiredEl = '<span class="text-danger"> *</span>';
    }
    if (type == "radio" || type == "checkbox") {
    	obj.empty();
        obj.append("<p>"+ ($("#label").val() + requiredEl)+"</p>");
        obj.append(buildArrayElement($("#radios").val(), $("#radiovalues").val(), $("#id").val(), type,obj));
        obj.find('input').attr("data-error",$("#errortext").val());
        obj.find('input').attr("data-type", $("#validationlist").val() == "" ? "text" : $("#validationlist").val());
        obj.find('input').attr("data-invalid",$("#helptext").val());
        if ($("#required").is(":checked")) {
        	obj.find('input').attr("data-required","Y");
        }
        var el = '<div><a href="javascirpt:void(0);" class="tool-edit">Edit</a> <a href="javascirpt:void(0);" class="tool-delete">Delete</a></div>';
        obj.append(el);
    } else if (type == "select") {
        obj.find("select").html("");
        obj.find("label").html($("#label").val() + requiredEl);
        obj.find("select").html(buildArrayElement($("#radios").val(), $("#radiovalues").val(), $("#id").val(), type,obj));
        obj.find(type).attr("name", $("#id").val());
        obj.find(type).attr("data-error",$("#errortext").val());
        obj.find(type).attr("data-type", $("#validationlist").val() == "" ? "text" : $("#validationlist").val());
        obj.find(type).attr("data-invalid",$("#helptext").val());
        if ($("#required").is(":checked")) {
        	obj.find(type).attr("data-required","Y");
        }
    }else if(type == "text"){
    	obj.find('.text-content').html($('#textarea').val());
    }else if(type == "submitBtn"){
    	var btnObj = obj.find('button');
    	btnObj.html($('#btnText').val());
    	btnObj.removeAttr('class');
    	btnObj.addClass($('#btnClass').val());
    	var className = $("input[name='btnAlign']:checked").val();
        $(obj).removeClass(function (index, css) {
        	return (css.match (/\btext-\S+/g) || []).join(' ');
    	}).addClass('text-'+className).attr('data-align', className);
    } else {
        obj.find("label").html($("#label").val() + requiredEl);
        obj.find(type).removeAttr("data-type");
        if ($("#required").is(":checked")) {
        	obj.find(type).attr("data-required","Y");
            obj.find(type).attr("data-type", $("#validationlist").val() == "" ? "text" : $("#validationlist").val());
            if($("#validationlist option:selected").text()=='Phone'){
            	obj.find(type).addClass('formatPhoneNumber');
            }
        }else{
        	obj.find(type).attr("data-required","N");
        }
        obj.find(type).attr("name", $("#id").val());
        obj.find(type).attr("placeholder", $("#placeholder").val());
        obj.find(type).attr("data-error",$("#errortext").val());
        obj.find(type).attr("data-invalid",$("#helptext").val());
    }
    var $input = $("<input>", {
        'type': 'hidden',
        'name': $("#id").val()+"_Label",
        'value': $("#label").val(),
    });
    //$(obj).append($input);
    alert("Changes applied Successfully.");
});

function buildArrayElement(names, values, name, type,obj) {
    var element = "";
    var nameArr = names.split("\n");
    var valueArr = values.split("\n");
    var c = "";
    var elementName = $('#id').val();
    var className = 'class="form-control"';
    if ($("#required").is(":checked")) {
    	obj.find(type).attr("data-required","Y");
        obj.find(type).attr("data-type", $("#validationlist").val() == "" ? "text" : $("#validationlist").val());
    }else{
    	obj.find(type).removeAttr("data-required");
    	obj.find(type).removeAttr("data-type");
    }
    for (i = 0; i < nameArr.length; i++) {
        var elName = nameArr[i];
        var elValue = nameArr[i];
        var tempName = type == "radio" ? name : elName;
        if (typeof valueArr[i] != 'undefined') {
            elValue = valueArr[i];
        }
        if (type == "select") {
            element = element + '<option value="' + elValue + '">' + elName + '</option>';
        } else {
            var lableClass = "customCheckBox";
            if (type == "radio") {
                lableClass = "customRadioBtn";
            }
            element = element + c + '<label class="' + lableClass + '" style="display:block;"><input type="' + type + '" name="' + elementName + '" ' + className + ' value="' + elValue + '" /><span>' + elName + '</span></label>';
            c = "&nbsp;"
        }
    }
    return element;
}

function initDraggable() {
    jQuery('.dragelement').draggable({
        //containment : "#unilogContainer", //makes sure that it does not flow outside the unilogCMSContainer
        helper: 'clone',
        revert: 'invalid',
        start: function(event, ui) {
            ui.helper.bind("click.prevent",
                function(event) {
                    event.preventDefault();
                });
            jQuery(this).fadeTo('fast', 0.5);
        },
        stop: function(event, ui) {
            jQuery(this).fadeTo(0, 1);
        }
    });
}

initDraggable();

var dropOpts = {
    accept: ":not(.ui-sortable-helper)",
    drop: function(event, ui) {
        $('<div title="Drag to Reorder" class="col col-md-12"></div>').attr("data-type", ui.draggable.data("type")).html(buildElement(ui.draggable.data("type"))).appendTo(this);
    }
};

$(".dropelement form > .row").droppable(dropOpts).sortable({
    //items: ".form-group:not(.ui-state-disabled)",
	items: '.col',
    axis: 'y',
    placeholder: 'placeholder',
    forcePlaceholderSize: true,
    opacity: 0.7,
    revert: true,
    tolerance: "pointer",
    cursor: "move",
    start: function(e, ui) {
        ui.placeholder.height(ui.helper.outerHeight());
    }
}).disableSelection().bind('click.sortable mousedown.sortable', function(e) {
    e.stopImmediatePropagation();
});

$(".dropelement .row").on("click", ".tool-edit", function() {
	$(".dropelement form .row .col,.btnBlock").removeClass("editing");
	$(".formBuilderWrap").addClass("active");
	var colBlock = $(this).parents('.col');
	colBlock.addClass("editing");
	buildEditForm(colBlock.data("type"), colBlock);
}).on("click", ".tool-delete", function() {
    var r = confirm("Are you sure, you want to delete this element?");
    if (r) {
        $(".editelement").html("");
        $(this).parents('.col').remove();
        $(".formBuilderWrap").removeClass("active");
    }
}).on("click", ".colIncrease", function(){
	var col = $(this).closest(".col");
	var t = getColClass(col);
	if(t.colWidth < 12){
		t.colWidth=(parseInt(t.colWidth, 10) + parseInt(1, 10));
		col.removeClass(t.colClass).addClass('col-md-' + t.colWidth);
	}
}).on("click", ".colDecrease", function(){
	var col = $(this).closest(".col");
	var t = getColClass(col);
	if(t.colWidth > parseInt(1, 10)){
		t.colWidth=(parseInt(t.colWidth, 10) - parseInt(1, 10));
		col.removeClass(t.colClass).addClass('col-md-' + t.colWidth);
	}
});

$(".btnBlock").on("click", ".editBtnStyle", function(){
	$(".editelement").html("");
	$(".dropelement form .row .col").removeClass("editing");
	$(".formBuilderWrap").addClass("active");
	$(".btnBlock").addClass("editing");
	buildFormBtnAttr($(".btnBlock"),$(".btnBlock button"))
});
function buildFormBtnAttr(fBlock, formBtn) {
	var formBtnArr = formBtn[0].classList, list = '';
	var alignBtns = '<label class="cms_formBtnRadio" for="btnLeft"><input type="radio" value="left" id="btnLeft" name="btnAlign"><i class="fa fa-lg fa-align-left"></i></label><label class="cms_formBtnRadio" for="btnCenter"><input type="radio" value="center" name="btnAlign" id="btnCenter"><i class="fa fa-lg fa-align-center"></i></label><label class="cms_formBtnRadio" for="btnRight"><input type="radio" value="right" name="btnAlign" id="btnRight"><i class="fa fa-lg fa-align-right"></i></label>';
    list = list + '<li><label>Align Button: </label><span>'+alignBtns+'</span></li>';
    list = list + '<li><label>Button Text: </label><input type="text" id="btnText" value="'+formBtn.html()+'"></li>';
    list = list + '<li><label>Button ClassName</label>:</div><input type="text" id="btnClass" value="'+formBtnArr.value+'"></li>';
    $(".editelement").append($("<ul></ul>").html(list));
    var align = fBlock.attr('data-align');
    var btnRadio = $('.cms_formBtnRadio');
    for(i=0; i < btnRadio.length; i++){
    	if(btnRadio[i].children[i].value == align){
    		btnRadio[i].children[i].checked = true;
    		break;
    	}
    }
}

getColClass = function(col){
    var colClass = $.grep(col.attr("class").split(" "), function(v){
        return v.indexOf('col-md-') === 0;
	}).join();
	var colWidth=colClass.replace('col-md-', "");
	return {colClass:colClass, colWidth:colWidth};
};


function buildElement(type) {
    var el = "";
    if (type == "input") {
        el = '<div class="form-group"><label>Text Input</label><input type="text" value="" class="form-control" placeholder="Input Text"/></div>';
    } else if (type == "text"){
    	el = '<div class="form-group"><div class="text-content">Type your text here.</div>';
    } else if (type == "textarea") {
        el = '<div class="form-group"><label>Text area</label><textarea class="form-control" ></textarea></div>';
    } else if (type == "select") {
        el = '<div class="form-group"><label>Select</label><select name="select1"  class="form-control"><option value="option1">option1</option></select></div>';
    } else if (type == "radio") {
        el = '<div class="form-group"><p>Radios</p><label class="customRadioBtn" style="display:block;"><input type="radio" value="radio" name="radio1" class="form-control" /><span>Radio</span></label></div>';
    } else if (type == "checkbox") {
        el = '<div class="form-group"><p>Checkbox</p><label class="customCheckBox" style="display:block;"><input type="checkbox" name="checkbox1" class="form-control" /><span>checkboxname</span><label></div>';
    }else if (type == "captcha") {
    	var webthemesval=document.getElementById('webthemesval').value+"/CMS/images/active-icons/captcha.png";
        el = '<div class="form-group"><label>Captcha<span class="text-danger"> *</span></label><input type="text" class="form-control" name="jcaptcha" data-required="Y" data-type="text" data-error="Please enter Captcha." data-invalid="" /><div class="captchaWrap form-group"><img src="CaptchaServlet.slt" id="captchaImg" /><a href="javascript:void(0);" id="refreshbtn" onclick="refreshjcaptcha();" class="captchaButton"><i class="fa fa-refresh" aria-hidden="true"></i></a></div></div>';
    }
    var arrows = '<a title="Make Column Narrower" class="colDecrease"><i class="fa fa-lg fa-caret-left"></i></a> <a title="Make Column Wider" class="colIncrease"><i class="fa fa-lg fa-caret-right"></i></a>';
    if(type != "captcha"){
    el = el + '<div class="cms_form-btn-block">'+arrows+'<a href="javascirpt:void(0);" class="tool-edit"><i class="fa fa-lg fa-pencil-alt"></i></a> <a href="javascirpt:void(0);" class="tool-delete"><i class="fa fa-lg fa-trash-alt"></i></a></div>';
    }else{
    	 el = el + '<div class="cms_form-btn-block"><a href="javascirpt:void(0);" class="tool-delete"><i class="fa fa-lg fa-trash-alt"></i></a></div>';
    }
    return el;
}

var radios = "";
var radioValues = "";

function buildEditForm(type, parentObj) {
    radios = "";
    radioValues = "";
    $(".editelement").html("");
    var settings = editSetting[type];
    var list = "";
    console.log(settings.title);
    for (var key in settings.fields) {
        if (settings.fields.hasOwnProperty(key)) {
            console.log(key + " -> " + settings.fields[key]);
            list = list + buildEditElement(key, settings.fields[key].label, settings.fields[key].type, settings.fields[key].value, parentObj);

        }
    }
    if(type!="text"){
    	list = list + '<li><div class="form-group"><label>Validate</label>' + validationListElement + '</div></li>';
    }
    $(".editelement").append($("<ul></ul>").html(list));
    if (type == "select") {
        c = "";
        parentObj.find("select option").each(function() {
            console.log($(this).val() + " - " + $(this).text());
            radios = radios + c + $(this).text();
            radioValues = radioValues + c + $(this).val();
            c = "\n";

        });
    }else if(type=="radio"){
    	 c = "";
    	parentObj.find("label span").each(function(){
    		radios = radios + c + $.trim($(this).text());
            c = "\n";
    	});
    	 c = "";
    	parentObj.find("input").each(function(){
            radioValues = radioValues + c + $(this).val();
            c = "\n";
    	});
    	$('#id').val(parentObj.find("input").attr('name'));
       	$('#label').val(parentObj.find("p").text().replace(/[^a-z0-9\s]/gi, '').replace(/[_]/g, ''));
       	$('#radios').val(radios);
        $('#radiovalues').val(radioValues);
    }
    else if(type=="checkbox"){
   	 c = "";
   	parentObj.find("label span").each(function(){
   		
   		radios = radios + c + $.trim($(this).text());
           c = "\n";
   	});
   	 c = "";
   	parentObj.find("input").each(function(){
           radioValues = radioValues + c + $(this).val();
           c = "\n";

   	});
   	$('#id').val(parentObj.find("input").attr('name'));
   	$('#label').val(parentObj.find("p").text().replace(/[^a-z0-9\s]/gi, '').replace(/[_]/g, ''));
   	$('#radios').val(radios);
    $('#radiovalues').val(radioValues);
   }else if(type=="text"){
	   $('#textarea').val(parentObj.find(".text-content").html());
   }
   if(parentObj.find("input").attr('data-required')=="Y"){
	   $('#required').attr('checked',true);
   }
   if(parentObj.find("input").attr('data-error')!=""){
	   $('#errortext').val(parentObj.find("input").attr('data-error'));
   }
   if(parentObj.find("input").attr('data-invalid')!=""){
	   $('#helptext').val(parentObj.find("input").attr('data-invalid'));
   }
   if(parentObj.find("input").attr('data-type')!=""){
	   $('#validationlist option[value='+parentObj.find("input").attr('data-type')+']').attr('selected','selected');
   }
}

function buildEditElement(key, label, type, value, parentObj) {
    console.log(label + " - " + type + " - " + value);
    var element = "";
    var valuetxt = getValueTxt(key, parentObj, value);
    if (type == "input") {
    	if(key=='id'){
    		if(valuetxt==''){
    			/*var idGen =new Generator();
    			valuetxt =idGen.getId();*/
    		}	
    	}
        element = '<label>' + label + ' :</label> <input type="text" id="' + key + '" value="' + valuetxt + '" />';
    } else if (type == "checkbox") {
        element = '<label class="cms_customCheckBox cms_customCheckBoxRight"><input type="checkbox" id="' + key + '" ' + valuetxt + ' /><span>' + label + ' :</span></label>';
    } else if (type == "textarea") {
        c = "";
        element = '<label>' + label + ' :</label>  <textarea id="' + key + '">';
        if (parentObj.data("type") == "select" || parentObj.data("type") == "radio" || parentObj.data("type") == "checkbox") {
            if (key == "radios") {
                element = element + c + radios;
            } else if (key == "radiovalues") {
                element = element + c + radioValues;
            }
        } else {
            for (i = 0; i < value.length; i++) {
                element = element + c + value[i];
                c = "\n";
            }
        }
        element = element + "</textarea>"
    }

    return "<li>" + element + "</li>";

}

function Generator() {};

Generator.prototype.rand =  Math.floor(Math.random() * 26) + Date.now();

Generator.prototype.getId = function() {
return this.rand++;
};

/*function initHover() {
    $(".dropelement form ul li").mouseover(function() {
        if (!$(this).find("div").data("mode")) {
            $(this).append('<div data-mode="tool">edit</tool>')
        }
    });

    $(".dropelement form ul li").mouseout(function() {
        if ($(this).find("div").data("mode")) {
            $("div[data-mode='tool']").remove();
        }
    });

}*/

function getValueTxt(key, parentObj, value) {
    var valuetxt = "";
    var type = parentObj.data("type");
    if (key == "label") {
        if (type == "checkbox" || type == "radio") {
            valuetxt = parentObj.find("> label").text();
        } else {
            valuetxt = parentObj.find("label").text().replace(/[^a-z0-9\s]/gi, '').replace(/[_]/g, '');
        }

    } else if (key == "id") {
        if (parentObj.data("type") == "textarea") {
            valuetxt = parentObj.find("textarea").attr("name") ? parentObj.find("textarea").attr("name") : "";
        } else if (parentObj.data("type") == "select") {
            valuetxt = parentObj.find("select").attr("name") ? parentObj.find("select").attr("name") : "";
        } else {
            valuetxt = parentObj.find("input").attr("name") ? parentObj.find("input").attr("name") : "";
        }

    } else if (key == "placeholder") {
       if (parentObj.data("type") == "input") {
            valuetxt = parentObj.find("input").attr("placeholder") ? parentObj.find("input").attr("placeholder") : "";
        } else {
            valuetxt = parentObj.find("input").attr("name") ? parentObj.find("input").attr("name") : "";
        }

    }else if (key == "required" && value) {
        valuetxt = "checked";
    }
    return valuetxt;
}
$(".export-form").on("click", function() {
	
	  var formNameVal = document.getElementById('formName').value;
    var formIdVal=document.getElementById('formDataId').value; 
var data1={formName:formNameVal,formId :formIdVal};
  $.ajax({
      type: "POST",
      url: "exportFormContentsCms.action",
      data:data1,
      success: function(response, status, request) {
      	var disp = request.getResponseHeader('Content-Disposition');
          if (disp && disp.search('attachment') != -1) {
              var form = $('<form method="POST" action="exportFormContentsCms.action">');
              $.each(data1, function(k, v) {
                  form.append($('<input type="hidden" name="' + k +
                          '" value="' + v + '">'));
              });
              $('body').append(form);
              form.submit();
          }   
        /*  var result = $.trim(msg);
          if (result.indexOf("success") != -1) {
          	alert("Downloaded successfully");
             
          } else {
              alert("Error while Downloading");
          }*/


      }
  });
  return false;

});
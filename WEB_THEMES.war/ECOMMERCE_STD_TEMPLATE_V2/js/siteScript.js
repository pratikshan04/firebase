var assets = "/ASSETS";
mykeypass = "myPassword";
var specialKeys = new Array();
specialKeys.push(8); //Backspace
//---------------------- global char replace
function javascriptReplaceAll(str, find, replace) {
  return str.replace(new RegExp(find, "g"), replace);
}
//---------------------- global char replace
//---------------------- Email Address validate
function validateEmail(sEmail) {
  var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if (filter.test(sEmail)) {
    return true;
  } else {
    return false;
  }
}
//---------------------- Email Address validate
//---------------------- Phone number validate
function isPhoneNumberValid(strPhone) {
  var phoneRegExp = /^((\+)?[1-9]{1,2})?([-\s\.])?((\(\d{1,4}\))|\d{1,4})(([-\s\.])?[0-9]{1,12}){1,2}$/;
  var phoneVal = strPhone;
  //var numbers = phoneVal.split("").length;
  var numbers = phoneVal.replace(/[^0-9]/g, "").length;
  if (10 <= numbers && numbers <= 14 && phoneRegExp.test(phoneVal)) {
    return true;
  } else {
    return false;
  }
}
//---------------------- Phone number validate
function IsNumeric(e) {
  var keyCode = e.which ? e.which : e.keyCode;
  if ((keyCode > 31 && (keyCode < 48 || keyCode > 57)) || keyCode == 13) {
    return false;
  }
  return true;
}
function isAlfaNumericOnly(val) {
  var Exp = /^[A-Za-z0-9]+$/i;
  if (!val.match(Exp)) {
    return false;
  } else {
    return true;
  }
}
function additionalFreightCharges(val) {
  var r = confirm(val);
  if (r == true) {
    block("Processing order please wait");
    return true;
  } else {
    return false;
  }
}
function showNotificationDiv(type, message) {
  $("#notificationDiv").html("");
  if (type != "" && type == "Success") {
    $("#notificationDiv").append(
      '<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
        message +
        "</div>"
    );
  } else {
    $("#notificationDiv").append(
      '<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
        message +
        "</div>"
    );
  }
  //$('html, body').animate({scrollTop: $(".alert").offset().top}, 400);
}
function replaceNonAscii(s) {
  if (s != undefined)
    s = s.replace(
      /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
      ""
    );
  return s;
}
/* Cart page SavedGroups Page & ProductGroup Page dependent script start */
function changeAction(s, selectId) {
  if (s == 1) {
    $("#productGroupForm").attr("action", "updateGroupItemsPage.action");
  } else if (s == 3) {
    bootbox.confirm({
      size: "small",
      closeButton: false,
      message: "Are you sure you want delete?",
      title:
        "<span class='text-warning'>Warning &nbsp;&nbsp;<em class='glyphicon glyphicon-alert'></em></span>",
      callback: function (result) {
        if (result) {
          $("#productGroupForm").attr("action", "deleteSavedCartPage.action");
        } else {
          return false;
        }
      },
    });
  } else if (s == 4) {
    var chks = $("input:checkbox[name='idList']:checked");
    var chkscount = chks.length;
    var reqType = $("#reqType").val();
    if (chkscount > 0) {
      var answer;
      if (reqType != null && reqType != undefined && $.trim(reqType) != "") {
        if (reqType == "C") {
          bootbox.confirm({
            size: "small",
            closeButton: false,
            message: locale("savedcart.item.delete"),
            title:
              "<span class='text-warning'>Warning &nbsp;&nbsp;<em class='glyphicon glyphicon-alert'></em></span>",
            callback: function (result) {
              deleteSelectedItem(result, selectId);
            },
          });
        } else if (reqType == "P") {
          bootbox.confirm({
            size: "small",
            closeButton: false,
            message: locale("productgroup.item.delete"),
            title:
              "<span class='text-warning'>Warning &nbsp;&nbsp;<em class='glyphicon glyphicon-alert'></em></span>",
            callback: function (result) {
              deleteSelectedItem(result, selectId);
            },
          });
        } else {
          bootbox.confirm({
            size: "small",
            closeButton: false,
            message: "Delete selected items?",
            title:
              "<span class='text-warning'>Warning &nbsp;&nbsp;<em class='glyphicon glyphicon-alert'></em></span>",
            callback: function (result) {
              deleteSelectedItem(result, selectId);
            },
          });
        }
      } else {
        bootbox.confirm({
          size: "small",
          closeButton: false,
          message: "Delete selected items?",
          title:
            "<span class='text-warning'>Warning &nbsp;&nbsp;<em class='glyphicon glyphicon-alert'></em></span>",
          callback: function (result) {
            deleteSelectedItem(result, selectId);
          },
        });
      }
      return false;
    } else {
      bootAlert(
        "small",
        "error",
        "Error",
        "Please select at least one item to delete."
      );
      return false;
    }
  } else if (s == 5) {
    $("#productGroupForm").attr("action", "checkout.action");
  } else if (s == 6) {
    /*var chks = $("input:checkbox[name='idList']:checked");
		var chkscount = chks.length;
		if(chkscount==0){
			bootAlert("small","error","Error","Please select at least one item to approve.");
			return false;
		}
		try{
			groupShipViaCheck();
		}catch(e){
			console.log(e);
		}*/
    $("#productGroupForm")
      .attr("action", "approveAndSubmitCartUnit.action?reqType=A")
      .submit();
    //$("#productGroupForm").attr("action","approveAndSubmitCartUnit.action");
  } else if (s == 7) {
    var reason = $.trim($("#reasonid").val());
    if ($.trim(reason) == "") {
      bootAlert("small", "error", "Error", "Enter User Reason");
      return false;
    } else {
      $("#rejectReason").val($("#reasonid").val());
      $("#ReasonPopDiv").modal("hide");
      block("Please wait");
      var str = $("#productGroupForm").serialize();
      $.ajax({
        type: "POST",
        url: "RejectApprCartPage.action",
        data: str,
        success: function (msg) {
          unblock();
          var result = msg.split("|");
          if (result[0] == 1) {
            bootAlert("small", "success", "Success", "Cart Rejected");
          } else {
            bootAlert(
              "small",
              "error",
              "Error",
              "Cart Rejected Failed. Please try again"
            );
          }
          $("#rejectReason").val("");
          $("#reasonid").val("");
          $("[data-bb-handler='ok']").click(function () {
            window.location.assign("getSavedGroupsPage.action?reqType=A");
          });
          return false;
        },
      });
    }
  } else if (s == 8) {
    var chks = $("input:checkbox[name='quotePartNumberSelected']:checked");
    var chkscount = chks.length;
    if (chkscount > 0) {
      $("#reOrderForm").attr("action", "ReOrderSale.action");
    } else {
      bootAlert(
        "small",
        "error",
        "Error",
        locale("reorder.label.select.at.least.one.item")
      );
      return false;
    }
  } else if (s == 9) {
    var chks = $("input:checkbox[name='quotePartNumberSelected']:checked");
    var chkscount = chks.length;
    if (chkscount > 0) {
      block("Please wait");
      $("#reOrderForm").attr("action", "ReOrderCartPage.action");
    } else {
      bootAlert(
        "small",
        "error",
        "Error",
        locale("reorder.label.select.at.least.one.item")
      );
      return false;
    }
  } else {
    try {
      //groupShipViaCheck();
    } catch (e) {
      console.log(e);
    }
    var invalidQty = false;
    var chks = $("input:checkbox[name='idList']:checked");
    chks.each(function () {
      var partNumber = this.id;
      partNumber = partNumber.replace("chkSelect1", "");

      var itemId = $("#tempItemId_" + partNumber).val();
      var qty = $("#itemTxtQty" + itemId).val();

      if (qty < 1) {
        invalidQty = true;
      }
    });
    var chkscount = chks.length;
    if (chkscount > 0 && !invalidQty) {
      block("Please wait");
      var str = $("#productGroupForm").serialize();
      $.ajax({
        type: "POST",
        url: "checkMinOrderQtyPage.action",
        data: str,
        success: function (msg) {
          var result = $.trim(msg);
          if (result == "") {
            $("#productGroupForm").attr("action", "addGroupToCartPage.action");
            $("#productGroupForm").submit();
          } else {
            var valu = msg.replace(/\|/g, "<br/>");
            $("#notificationDiv").show();
            $("#message").hide();
            $("#errorMsg").html(valu);
            $("html, body").animate({ scrollTop: 0 }, "fast");
            $("#productGroupForm")[0].reset();
            unblock();
          }
          return false;
        },
      });
      return false;
      unblock();
    } else {
      if (invalidQty) {
        bootAlert(
          "small",
          "error",
          "Error",
          "You cannot add items with 0 quantity to cart."
        );
      } else {
        bootAlert(
          "small",
          "error",
          "Error",
          "Please select at least one item to add."
        );
      }
      return false;
    }
  }
  return true;
}
function deleteSelectedItem(answer, selectId) {
  if (answer) {
    localStorage.removeItem("selectedGroupItems");
    $("#productGroupForm").attr("action", "deleteGroupItemPage.action");
    $("#productGroupForm").submit();
  } else {
    $(selectId).val("");
    return false;
  }
}
function editGroup() {
  $("#groupName").hide();
  $("#editBox").show();
}
function cancelEditGroup() {
  $("#editedName").val($("#oldGroupName").val());
  $("#groupName").show();
  $("#editBox").hide();
}
function deleteSavedProductGroup(delProductgroup, reqType) {
  var type = $("#GroupType").val();
  if (reqType) {
    type = reqType;
  }
  var deleteSta = $("#deleteStatus").val();
  if (typeof deleteSta != "undefined" && deleteSta == "N") {
    bootAlert(
      "small",
      "error",
      "Error",
      "Cannot Delete the Cart. There are subgourps"
    );
  } else {
    if (type == "C") {
      bootbox.confirm({
        size: "small",
        closeButton: false,
        message: locale("savedcart.label.delete"),
        title:
          "<span class='text-warning'>Warning &nbsp;&nbsp;<em class='glyphicon glyphicon-alert'></em></span>",
        callback: function (result) {
          if (result) window.location.href = delProductgroup;
        },
      });
    } else if (type == "P") {
      bootbox.confirm({
        size: "small",
        closeButton: false,
        message: locale("productgroup.label.delete"),
        title:
          "<span class='text-warning'>Warning &nbsp;&nbsp;<em class='glyphicon glyphicon-alert'></em></span>",
        callback: function (result) {
          if (result) window.location.href = delProductgroup;
        },
      });
    } else {
      bootbox.confirm({
        size: "small",
        closeButton: false,
        message: locale("savedcart.label.delete"),
        title:
          "<span class='text-warning'>Warning &nbsp;&nbsp;<em class='glyphicon glyphicon-alert'></em></span>",
        callback: function (result) {
          if (result) window.location.href = delProductgroup;
        },
      });
    }
  }
}
function editGroupName() {
  var newName = $.trim($("#editedName").val());
  var oldName = $.trim($("#oldGroupName").val());
  var groupId = $("#GroupId").val();
  var type = $("#GroupType").val();
  if (newName == null || newName == "") {
    if (type == "C") {
      bootAlert("small", "error", "Error", "Please Enter Cart Name");
    } else {
      bootAlert("small", "error", "Error", "Please Enter Group Name");
    }
  } else if (newName == oldName) {
    if (type == "C") {
      bootAlert("small", "error", "Error", "No Changes In Cart Name");
    } else {
      bootAlert("small", "error", "Error", "No Changes In Group Name");
    }
    $("#groupName").show();
    $("#editBox").hide();
  } else {
    var characterReg = /^[-_ a-zA-Z0-9]+$/;
    if (characterReg.test(newName) == false) {
      bootAlert(
        "medium",
        "error",
        "Error",
        "Special characters are not allowed except underscore or hyphen ( _ , - )"
      );
    } else {
      $("#groupNameSaveBtn").val("Please Wait");
      $("#groupNameSaveBtn").attr("disabled", "disabled");
      var str =
        "&newName=" +
        newName +
        "&groupId=" +
        groupId +
        "&oldGroupName=" +
        oldName +
        "&GroupType=" +
        type;
      block("Please Wait");
      $.ajax({
        type: "POST",
        url: "editGroupNamePage.action",
        data: str,
        success: function (msg) {
          unblock();
          if (msg == 1) {
            if (type == "C") {
              bootAlert("small", "success", "Success", "Cart Name Changed");
            } else {
              bootAlert("small", "success", "Success", "Group Name Changed");
              $("[data-bb-handler='ok']").click(function () {
                location.reload();
              });
            }
            $("#groupNameSaveBtn").val("Save");
            $("#oldGroupName").val(newName);
            $("#groupNameSaveBtn").removeAttr("disabled");
            $("#groupName").html(newName);
            $("#groupName").show();
            $("#editBox").hide();
          } else if (msg == 0) {
            bootAlert("small", "error", "Error", "Please try again");
          } else if (msg == 3) {
            $("#groupNameSaveBtn").val("Save");
            $("#groupNameSaveBtn").removeAttr("disabled");
            if (type == "C") {
              bootAlert("small", "error", "Error", "Cart Name Already Exists");
            } else {
              bootAlert("small", "error", "Error", "Group Name Already Exists");
            }
          } else if (msg == -1) {
            location.reload();
          }
        },
      });
    }
  }
}
function updateMyProductGroup() {
  var chks = $("input:checkbox[name='idList']:checked");
  var chkscount = chks.length;
  if (chkscount == 0) {
    bootAlert(
      "small",
      "error",
      "Error",
      "Please select at least one item to update."
    );
    $("#bulkActionSelect").val("");
    return false;
  }
  var str = $("#productGroupForm").serialize();
  var isUpdate = false;
  block("Please Wait");
  $.ajax({
    type: "POST",
    url: "checkMinOrderQtyPage.action",
    data: str,
    success: function (msg) {
      unblock();
      if (msg == "sessionexpired") {
        window.location.href = "doLogOff.action";
      }
      var result = $.trim(msg);
      if (result == "") {
        $("#productGroupForm")
          .attr("action", "updateGroupItemsPage.action")
          .submit();
      } else {
        var valu = msg.replace(/\|/g, "<br/>");
        showNotificationDiv("error", valu);
        $("#productGroupForm")[0].reset();
      }
      localStorage.removeItem("selectedGroupItems");
    },
  });
  return false;
}
/* Cart page SavedGroups Page & ProductGroup & approve cart Page dependent script end */
//----------------Shared Cart User Names and Details Function Start
function validateShare() {
  var keyword = $.trim($("#popkeyword").val());
  if (keyword == "" || keyword == null) {
    bootAlert("small", "error", "Error", "Please Enter Keyword.");
    return false;
  } else {
    block("Please Wait");
    var savedGPID = $("#GroupId").val();
    var savedGPName = $("#oldGroupName").val();
    var str = $("#popShareForm").serialize();
    str += "&savedGroupId=" + savedGPID;
    str += "&savedGroupName=" + savedGPName;
    $.ajax({
      type: "POST",
      url: "getUsersForSharedCartUnit.action",
      data: str,
      success: function (msg) {
        unblock();
        if ($.trim(msg) == "User Not Found") {
          bootAlert(
            "medium",
            "error",
            "Error",
            locale("savedcart.lable.userNotFound")
          );
        } else {
          $("#sharePop").modal("hide");
          $("#sharePopupDiv").html(msg);
          $("#sharePopupDiv").modal("show");
        }
      },
    });
    return false;
  }
}
function performShare() {
  var checked =
    $('#performshare input[name="sharedUserId"]:checked').length > 0;
  if (checked > 0) {
    $("#share").html("Please Wait...");
    $("#share").attr("disabled", "disabled");
    var str = $("#performshare").serialize();
    $.ajax({
      type: "POST",
      url: "performShareCartPage.action",
      data: str,
      success: function (msg) {
        var result = msg.split("|");
        $("#sharePopupDiv .modal-header,#sharePopupDiv .modal-footer").hide();
        $("#sharePopupDiv .modal-body").html(result[0]);
        setTimeout(function () {
          $("#sharePopupDiv").modal("hide");
        }, 5000);
        return false;
      },
    });
  } else {
    bootAlert("small", "error", "Error", "Please Select Users to Share");
  }
  return false;
}
//----------------Shared Cart User Names and Details Function End
//-------------- home page script
function getNewSectionForHomePage() {
  var pageName = $("#newsSection").val();
  if (pageName != null && $.trim(pageName) != "")
    pageName = $.trim($("#newsSection").val());
  enqueue(
    "staticPages.action?pageName=" +
      pageName +
      "&reqType=Body&dt=" +
      new Date(),
    getNewsResponse
  );
}
function getNewsResponse(val) {
  if (val != null && val != "" && val != "$renderContent") {
    $("#news-scroller").html(val);
  } else {
    $("#news-scroller").html("N/A");
  }
}
//-------------- home page script End
//------------------- Search Script Starts ------------------
function performSearch() {
  var s = $("#txtSearch").val();
  var overRideCatId = $("#overRideCatId").val();
  var overRideSearchString = "";
  if (
    typeof overRideCatId != "undefined" &&
    overRideCatId != null &&
    overRideCatId != "" &&
    overRideCatId == "N"
  ) {
    overRideSearchString = "&overRideCatId=N";
  }
  var s = $("#txtSearch").val();
  var searchFormat = $("#searchFormat").val();
  var nSearch = $("#narrowText").val();
  var sType = $("#searchType").val();
  var vpsid = "";
  var keywordText = $.trim($("#keyWordTxtMulti").val());
  var filteredAttr = $.trim($("#attrFilterList").text());
  var conti = true;
  if (s != undefined && s != "") {
    s = $.trim(s);
    s = s.replace(/</g, "<&nbsp;");
    s = replaceNonAscii(s);
    s = escape(s);
    s = s.replace("\u00AE", "&reg;");
    s = s.replace(/#/g, "%23");
    s = s.replace(/&/g, "%26");
    s = s.replace(/;/g, "%3B");
    s = s.replace(/\?/g, "%3F");
    s = s.replace(/=/g, "%3D");
    s = s.replace(/@/g, "%40");
    s = s.replace("*", "");
    s = s.replace(
      /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
      ""
    );
  }

  nSearch = replaceNonAscii(nSearch);

  if (nSearch != undefined && nSearch != "") {
    nSearch = escape(nSearch);
    nSearch = nSearch.replace(/#/g, "%23");
    nSearch = nSearch.replace(/&/g, "%26");
    nSearch = nSearch.replace(/;/g, "%3B");
    nSearch = nSearch.replace(/\?/g, "%3F");
    nSearch = nSearch.replace(/=/g, "%3D");
    nSearch = nSearch.replace(/@/g, "%40");
  }
  if (
    s == "" ||
    s == "Search" ||
    s.toLowerCase().indexOf("search") > -1 ||
    s.toLowerCase().indexOf("enter keyword") > -1 ||
    s.toLowerCase().indexOf("enter%20keyword") > -1 ||
    $.trim(s) == "Product Search" ||
    $.trim(s) == "Product%20Search" ||
    $.trim(s.toUpperCase()) == "ENTER KEYWORD OR PART NUMBER" ||
    $.trim(s.toUpperCase()) == "ENTER%20KEYWORD%20OR%20PART%20NUMBER" ||
    $.trim(s.toUpperCase()) == "SEARCH"
  ) {
    bootAlert("small", "error", "Error", "Enter Search Keyword.");
    return false;
  } else if (
    s.toLowerCase().indexOf("%3c%26nbsp%3bscript%3e") > -1 ||
    s.toLowerCase().indexOf("%3c%26nbsp%3b/script%3e") > -1
  ) {
    bootAlert(
      "medium",
      "error",
      "Error",
      "ERR_BLOCKED_BY_XSS_AUDITOR : Detected unusual code on this page and blocked it to protect your personal information (for example, passwords, phone numbers, and credit cards)."
    );
    return false;
  } else if (typeof keywordText != "undefined" && keywordText != "") {
    var conti = false;
    bootbox.confirm({
      size: "small",
      closeButton: false,
      message: "Selected Inner Search will be cleared.",
      title:
        "<span class='text-warning'>Warning &nbsp;&nbsp;<em class='glyphicon glyphicon-alert'></em></span>",
      callback: function (result) {
        if (result == false) {
          $("#narrowText").val("");
        } else {
          continueSearch(result);
        }
      },
    });
  } else if (typeof filteredAttr != "undefined" && filteredAttr != "") {
    var conti = false;
    bootbox.confirm({
      size: "small",
      closeButton: false,
      message: "Selected Filters will be cleared.",
      title:
        "<span class='text-warning'>Warning &nbsp;&nbsp;<em class='glyphicon glyphicon-alert'></em></span>",
      callback: function (result) {
        continueSearch(result);
      },
    });
  }
  if (conti) {
    if (nSearch != "" && nSearch != undefined) {
      vpsid = $("#psid").val();
      if ($.trim($("#attrFilterList").val()) == "") {
        window.location.href =
          "/searchPage.action?keyWord=" +
          s +
          "&srchTyp=" +
          sType +
          "&keyWordTxt=" +
          nSearch +
          "&vpsid=" +
          vpsid +
          overRideSearchString;
      } else {
        window.location.href =
          "/searchPage.action?keyWord=" +
          s +
          "&srchTyp=" +
          sType +
          "&keyWordTxt=" +
          nSearch +
          "&vpsid=" +
          vpsid +
          "&attrFilterList=" +
          $("#attrFilterList").val() +
          overRideSearchString;
      }
    } else {
      if (typeof searchFormat != "undefined" && searchFormat == "pretty") {
        window.location.href =
          $("base").attr("href") +
          "SearchResult/" +
          s +
          "&overRideSearchByCaregoryId=N";
      } else {
        window.location.href =
          "/searchPage.action?keyWord=" + s + overRideSearchString;
      }
    }
  }
  function continueSearch(conti) {
    if (conti) {
      if (nSearch != "" && nSearch != undefined) {
        vpsid = $("#psid").val();
        if ($.trim($("#attrFilterList").val()) == "") {
          window.location.href =
            $("base").attr("href") +
            "/searchPage.action?keyWord=" +
            s +
            "&srchTyp=" +
            sType +
            "&keyWordTxt=" +
            nSearch +
            "&vpsid=" +
            vpsid +
            overRideSearchString;
        } else {
          window.location.href =
            $("base").attr("href") +
            "/searchPage.action?keyWord=" +
            s +
            "&srchTyp=" +
            sType +
            "&keyWordTxt=" +
            nSearch +
            "&vpsid=" +
            vpsid +
            "&attrFilterList=" +
            $("#attrFilterList").val() +
            overRideSearchString;
        }
      } else {
        if (typeof searchFormat != "undefined" && searchFormat == "pretty") {
          window.location.href =
            $("base").attr("href") +
            "SearchResult/" +
            s +
            "&overRideSearchByCaregoryId=N";
        } else {
          window.location.href =
            $("base").attr("href") +
            "/searchPage.action?keyWord=" +
            s +
            overRideSearchString;
        }
      }
    }
  }
  return false;
}
function performAdvSearch() {
  var overRideCatId = $("#overRideCatId").val();
  var overRideSearchString = "";
  if (
    typeof overRideCatId != "undefined" &&
    overRideCatId != null &&
    overRideCatId != "" &&
    overRideCatId == "N"
  ) {
    overRideSearchString = "&overRideCatId=N";
  }
  var s = $("#txtAdvSearch").val();
  var sType = $("input[name=advSearch]:checked").val();
  if (sType == null || sType == "" || sType == "undefined") {
    sType = $("#advSearchHidden").val();
  }

  //s = replaceNonAscii(s);
  s = $.trim(s);
  s = s.replace(/</g, "<&nbsp;");
  s = s.replace(/\u00AE/g, "&reg;").replace(/\u2122/g, "&trade;");
  s = escape(s);
  s = s.replace(/#/g, "%23");
  s = s.replace(/&/g, "%26");
  s = s.replace(/;/g, "%3B");
  s = s.replace(/\?/g, "%3F");
  s = s.replace(/=/g, "%3D");
  s = s.replace(/@/g, "%40");
  s = s.replace("*", "");
  s = s.replace(
    /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
    ""
  );
  s = replaceNonAscii(s);

  if (
    s == "" ||
    s == "Search" ||
    $.trim(s) == "Product Search" ||
    $.trim(s) == "Product%20Search" ||
    $.trim(s) == "Enter keyword or part number" ||
    $.trim(s) == "Enter%20keyword%20or%20part%20number" ||
    $.trim(s) == "keywords" ||
    $.trim(s) == "%20keywords%20"
  ) {
    bootAlert("small", "error", "Error", "Enter Search Keyword.");
    return false;
  } else if (
    s.toLowerCase().indexOf("%3c%26nbsp%3bscript%3e") > -1 ||
    s.toLowerCase().indexOf("%3c%26nbsp%3b/script%3e") > -1
  ) {
    bootAlert(
      "medium",
      "error",
      "Error",
      "ERR_BLOCKED_BY_XSS_AUDITOR : Detected unusual code on this page and blocked it to protect your personal information (for example, passwords, phone numbers, and credit cards)."
    );
    return false;
  }
  if (sType == -1) {
    sType = $("input[name=advSearchMore]:checked").val();
  }
  //window.location.href = $("base").attr("href")+'Search/Typ'+sType+'/Word'+s;
  if ($("#extSearch").length > 0) {
    var extSearch = $("#extSearch").val();
    window.location.href =
      $("base").attr("href") +
      "/searchPage.action?keyWord=" +
      s +
      "&srchTyp=" +
      sType +
      "&extSearch=" +
      extSearch +
      overRideSearchString;
  } else {
    window.location.href =
      $("base").attr("href") +
      "/searchPage.action?keyWord=" +
      s +
      "&srchTyp=" +
      sType +
      overRideSearchString;
  }
  return false;
}

// ------------ ship sync
var current = 1;
function scynStatus(total) {
  $.ajax({
    type: "POST",
    url: "scynEntityAddressStatusUnit.action",
    data: "test=1",
    success: function (msg) {
      $("#progressBar").html(" " + msg);
      current++;
      if (current <= total && msg != "Completed") {
        scynStatus();
      }
    },
  });
}
function scynInitiate() {
  var total = 500;
  scynStatus(total);
  status = "test=2";
  block("Refreshing shipping information. Please wait");
  $.ajax({
    type: "POST",
    url: "scynEntityAddressUnit.action",
    data: status,
    success: function (msg) {
      unblock();
      $.ajax({
        type: "POST",
        url: "sessionValueLink.action",
        data: "keyValue=scynEntityStatus&crud=r",
        success: function (msg) {
          bootAlert(
            "medium",
            "success",
            "Success",
            "Thank you for your patience while your Ship To/Jobs list is being refreshed. While your list is being refreshed you may proceed to the Web Store by selecting a Ship To from the list below.   Return to view your refreshed Ship To/Job list by clicking on your selected Ship To/Job in the upper right hand corner of the header."
          );
          $("[data-bb-handler='ok']").click(function () {
            location.reload();
          });
        },
      });
    },
  });
}
//------------ ship sync New
function scynInitiateV2() {
  block("Please Wait");
  $.get("getAddressesAddressSync.action?frPage=popLogin&showpopUp=Y", function (
    data,
    status
  ) {
    // $('#generalModel .modal-body').html(data);
    // unblock();
    if (
      status != "" &&
      status != null &&
      typeof status != "undefined" &&
      status == "success"
    ) {
      if (typeof data != "undefined" && data != null && data != "") {
        $("#ShipDiv").html($(data).filter("#ShipDiv").html());
      }
      unblock();
      bootAlert(
        "medium",
        "success",
        "Success",
        " Thank you for your patience while your Ship To/Jobs list is being refreshed."
      );
    } else {
      window.location.href = locale("website.url.ProductCategory");
    }
    //  $('#generalModel').modal({backdrop: 'static', keyboard: false});
    var flag = getCookie("isShipToSelected");
    if (flag != undefined && flag != null && flag != "") {
      setCookie("isShipToSelected", false);
    }
  });
}
//------------ ship sync New

//----------------------------Login Page
$(document).ready(function () {
  var userLogin = $("#userLogin").val();
  if (userLogin != "true") {
    localStorage.removeItem("salesUserSelected");
    localStorage.removeItem("currentCustomerSU");
    var remember = "false";
    var keyflag = localStorage.getItem("F30FB33A2");
    if (keyflag != null && keyflag != undefined && $.trim(keyflag) != "") {
      remember = CryptoJS.AES.decrypt(keyflag, mykeypass).toString(
        CryptoJS.enc.Utf8
      );
    }
    if (remember == "true") {
      var i = localStorage.getItem("F47F4A0F30FB7A75");
      var p = localStorage.getItem("750B2E0333A28C1D");
      if (i != null && i != undefined && $.trim(i) != "") {
        var _dUnme = CryptoJS.AES.decrypt(i, mykeypass).toString(
          CryptoJS.enc.Utf8
        );
        $("[name='loginId']").each(function () {
          $(this).val(_dUnme);
        });
      } else {
        localStorage.removeItem("F30FB33A2");
        remember = "false";
      }
      if (p != null && p != undefined && $.trim(p) != "") {
        var _dPass = CryptoJS.AES.decrypt(p, mykeypass).toString(
          CryptoJS.enc.Utf8
        );
        $("[name='loginPassword']").each(function () {
          $(this).val(_dPass);
        });
      } else {
        localStorage.removeItem("F30FB33A2");
        remember = "false";
      }
      if (
        $("#layoutName").val() != null &&
        $("#layoutName").val() == "LoginPage"
      ) {
        $("input[name='loginId']").focus();
      }
      $("[name='rememberMe']").each(function () {
        $(this).attr("checked", remember);
      });
    }
    $("[data-form='login']").submit(function () {
      var $this = $(this);
      var un = $this.find('input[name="loginId"]').val();
      var ps = $this.find('input[name="loginPassword"]').val();
      var msg = "";

      if ($.trim(un) == "" && $.trim(ps) == "") {
        msg = "Enter User Name & Password";
      } else if ($.trim(un) == "") {
        msg = "Enter User Name";
      } else if ($.trim(ps) == "") {
        msg = "Enter Password";
      } else if (!navigator.onLine) {
        msg = locale("internert.connectivity.error");
      }
      if (msg != "") {
        if ($this.find("#formPageValue").val()) {
          showNotificationDiv("error", msg);
        } else {
          $this.find(".pLoginErr").html(msg);
        }
      } else {
        if ($this.find('input[name="rememberMe"]').is(":checked")) {
          var _eUnme = CryptoJS.AES.encrypt(un, mykeypass);
          var _ePass = CryptoJS.AES.encrypt(ps, mykeypass);
          localStorage.setItem("F47F4A0F30FB7A75", _eUnme);
          localStorage.setItem("750B2E0333A28C1D", _ePass);
          localStorage.setItem(
            "F30FB33A2",
            CryptoJS.AES.encrypt("true", mykeypass)
          );
        } else {
          localStorage.removeItem("F47F4A0F30FB7A75");
          localStorage.removeItem("750B2E0333A28C1D");
          localStorage.removeItem("F30FB33A2");
        }
        block("Please Wait");
        $this.find(".pLoginErr").html("");
        $this
          .find("[type='submit']")
          .html("Please wait")
          .attr("disabled", "disabled");
        $.post(
          "doLogin.action",
          $this.serialize() + "&loginType=popup",
          function (data, status) {
            try {
              localStorage.setItem("salesUserSelected", "Y");
              localStorage.setItem("currentCustomerSU", "");
              var afterLoginUrl = window.location.href;
              var previousPageUrl = document.referrer;
              var currentLayout = $("#layoutName").val();
              if ($.trim(data) == "") {
                if (
                  typeof currentLayout != "undefined" &&
                  currentLayout != null &&
                  currentLayout.toLowerCase().indexOf("loginpage") > -1
                ) {
                  if (
                    typeof previousPageUrl != "undefined" &&
                    previousPageUrl != "" &&
                    previousPageUrl.toLowerCase().indexOf("register") <= -1 &&
                    previousPageUrl.toLowerCase().indexOf("forgot") <= -1 &&
                    previousPageUrl.toLowerCase().indexOf("login") <= -1 &&
                    previousPageUrl.toLowerCase().indexOf("afp") <= -1 &&
                    previousPageUrl.toLowerCase().indexOf("dfp") <= -1
                  ) {
                    setCookie("afterLoginUrl", previousPageUrl, 7);
                  } else {
                    setCookie("afterLoginUrl", "");
                  }
                } else {
                  if (
                    afterLoginUrl != "" &&
                    afterLoginUrl.toLowerCase().indexOf("register") <= -1 &&
                    afterLoginUrl.toLowerCase().indexOf("forgot") <= -1 &&
                    afterLoginUrl.toLowerCase().indexOf("login") <= -1 &&
                    afterLoginUrl.toLowerCase().indexOf("afp") <= -1 &&
                    afterLoginUrl.toLowerCase().indexOf("dfp") <= -1
                  ) {
                    setCookie("afterLoginUrl", afterLoginUrl, 7);
                  } else {
                    setCookie("afterLoginUrl", "");
                  }
                }
                $(".loginWindow").hide();
                $("#loginModal").modal("hide");
                loadShippingInfo();
                if ($("#isWebview").val() == "WEBVIEW") {
                  fingerPrint(un, ps);
                }
              } else if ($.trim(data) == "EcpliseDown") {
                window.location.href =
                  $("base").attr("href") + "eclipseDown.action";
              } else if (data.indexOf("!DOCTYPE html") != -1) {
                window.location.href = "/Login";
              } else if (data.indexOf("/AFP/") != -1) {
                window.location.href = data;
              } else if ($.trim(data) && $.trim(data).indexOf("{") == 0) {
                var responseDetails = JSON.parse(data);
                if (responseDetails && responseDetails["salesUser"] == "Y") {
                  loadCustomForSalesUser(responseDetails);
                }
              } else {
                unblock();
                if ($this.find(".pLoginErr").length > 0) {
                  $this.find(".pLoginErr").html(data);
                } else {
                  showNotificationDiv("Error", data);
                }
                $this
                  .find("[type='submit']")
                  .html("Sign In")
                  .removeAttr("disabled");
              }
            } catch (e) {
              console.log(e);
            }
          }
        ).fail(function (xhr, status, error) {
          bootAlert(
            "small",
            "error",
            "Error",
            "Something went wrong please try again"
          );
        });
      }
      return false;
    });
  }
});
function loadShippingInfo() {
  $.get("getAddresses.action?frPage=popLogin&showpopUp=Y", function (
    data,
    status
  ) {
    $("#generalModel .modal-body").html(data);
    var value = getCookie("afterLoginUrl");
    if (typeof value == "undefined" || value == null || value == "") {
      var afterLoginUrl = window.location.href;
      var previousPageUrl = document.referrer;
      var currentLayout = $("#layoutName").val();
      if (
        typeof currentLayout != "undefined" &&
        currentLayout != null &&
        currentLayout.toLowerCase().indexOf("loginpage") > -1
      ) {
        if (
          typeof previousPageUrl != "undefined" &&
          previousPageUrl != "" &&
          previousPageUrl.toLowerCase().indexOf("register") <= -1 &&
          previousPageUrl.toLowerCase().indexOf("forgot") <= -1 &&
          previousPageUrl.toLowerCase().indexOf("login") <= -1 &&
          previousPageUrl.toLowerCase().indexOf("afp") <= -1 &&
          previousPageUrl.toLowerCase().indexOf("dfp") <= -1
        ) {
          setCookie("afterLoginUrl", previousPageUrl, 7);
        } else {
          setCookie("afterLoginUrl", "");
        }
      } else {
        if (
          afterLoginUrl != "" &&
          afterLoginUrl.toLowerCase().indexOf("register") <= -1 &&
          afterLoginUrl.toLowerCase().indexOf("forgot") <= -1 &&
          afterLoginUrl.toLowerCase().indexOf("login") <= -1 &&
          afterLoginUrl.toLowerCase().indexOf("afp") <= -1 &&
          afterLoginUrl.toLowerCase().indexOf("dfp") <= -1
        ) {
          setCookie("afterLoginUrl", afterLoginUrl, 7);
        } else {
          setCookie("afterLoginUrl", "");
        }
      }
    }
    value = getCookie("afterLoginUrl");
    if (
      $("#example tbody tr").length == 1 ||
      $("#example tbody tr").length == 0
    ) {
      var flag = getCookie("isShipToSelected");
      if (flag != "true") {
        setCookie("isShipToSelected", true);
      }
      if (value != "" && value != null && typeof value != "undefined") {
        window.location.href = value;
        setCookie("afterLoginUrl", "");
      } else {
        window.location.href = locale("website.url.ProductCategory");
      }
    } else {
      $("#generalModel .modal-header").hide();
      unblock();
      $("#generalModel").modal({ backdrop: "static", keyboard: false });
      var flag = getCookie("isShipToSelected");
      if (flag != undefined && flag != null && flag != "")
        setCookie("isShipToSelected", false);
    }
  });
}
function CheckoutValidate(type) {
  $("#shipViaHidden").val($("#shipViaData").find(":selected").text());
  $("#orderNotesHidden").val($("#orderNotesData").val());
  $("#poNumberHidden").val($("#orderNotes").val());
  $("#reqDateHidden").val($("#startDate").val());
  var data = $("#quickCartHiddenInfo").serialize();
  if (type == "1" || type == "12") {
    if (type == "12") {
      block();
    } else {
      pleaseWait("");
    }
    $("#submitBtn").attr("disabled", "disabled");
    $.ajax({
      type: "POST",
      url: "processCheckout.action",
      data: data,
      success: function (msg) {
        window.location.href = "orderConfirmation.action?salesOrderId=" + msg;
      },
    });
  } else if (type == "2") {
    $("#checkoutForm").submit();
  }
  return false;
}
/*function filterAttributes(input,id){
	var valThis = jQuery(input).val().toLowerCase();
	var len = valThis.length;
	jQuery('.navList_'+id+'>li>label>span').each(function(){
		var text = jQuery(this).text().substr(0,len).toLowerCase();
		(text.toLowerCase().indexOf(valThis.toLowerCase()) >= 0) ? jQuery(this).parent().parent().show() : jQuery(this).parent().parent().hide();    
	});
}*/

function filterAttributes(input, id) {
  var valThis = jQuery(input).val().replace(/\s+/g, "").toLowerCase();
  jQuery(".navList_" + id + ">li>label>em").each(function () {
    var text = jQuery(this).text().toLowerCase();
    text.replace(/\s+/g, "").toLowerCase().indexOf(valThis.toLowerCase()) >= 0
      ? jQuery(this).parent().parent().show()
      : jQuery(this).parent().parent().hide();
  });
}

//------------ compare
function checkItem() {
  var list = getCookie("compareList");
  if (list == null) list = "";

  var listArr = list.split(",");
  if (listArr.length > 0) {
    for (i = 0; i < listArr.length; i++) {
      $("#check_" + listArr[i]).attr("checked", "checked");
    }
  }
  if (list != "") {
    $("#compareSpan").html(listArr.length);
    $("#compareSpanBottom").html(listArr.length);
    $("#compareSpanProduct").html(listArr.length);
    $(".compareCountSpanClass").each(function () {
      $(this).html(listArr.length);
    });
  }
}

function compareItemList(obj) {
  var list = "";
  var c = "";
  var listArr = "";
  var obj1 = $(obj).prop("id");
  var obj2 = obj1.split("_");

  if ($(obj).is(":checked")) {
    var compareItemCount = 5;
    if (window.innerWidth < 700) {
      var compareItemCount = 2;
    } else if (window.innerWidth < 1200) {
      var compareItemCount = 3;
    }
    var addToList = 1;
    list = getCookie("compareList");
    if (list == null) {
      list = "";
    }
    listArr = list.split(",");
    if (listArr.length >= compareItemCount) {
      bootAlert(
        "small",
        "error",
        "Error",
        "You cannot compare more than " + compareItemCount + " items at a time"
      );
      $(obj).removeAttr("checked", "checked");
    } else {
      for (i = 0; i < listArr.length; i++) {
        if (listArr[i] == obj2[1]) {
          addToList = 0;
        }
      }
      if (addToList == 1) {
        if (list == "") {
          list = obj2[1];
        } else {
          list = list + "," + obj2[1];
        }
        setCookie("compareList", list, 14);
      }
    }
  } else {
    list = getCookie("compareList");
    if (list == null) {
      list = "";
    }
    listArr = list.split(",");
    for (i = 0; i < listArr.length; i++) {
      if (listArr[i] == obj2[1]) {
        listArr.splice(i, 1);
      }
    }
    list = "";
    for (i = 0; i < listArr.length; i++) {
      list = list + c + listArr[i];
      c = ",";
    }
    setCookie("compareList", list, 14);
  }
  checkCookieSize();
}
function checkCookieSize() {
  list = getCookie("compareList");
  if (list == null) {
    list = "";
  }
  if (list == "") {
    $("#compareSpan").each(function () {
      $(this).html("0");
    });
    $("#compareSpanBottom").each(function () {
      $(this).html("0");
    });
    $("#compareSpanProduct").each(function () {
      $(this).html("0");
    });
    $(".compareCountSpanClass").html("0");

    if ($(".cimm_addcartSlider").length > 0) {
      $(".cimm_addcartSlider").removeClass("cimm_addcartSliderShow");
    }
  } else {
    if (list == null) {
      list = "";
    }
    listArr = list.split(",");
    $("#compareSpan").each(function () {
      $(this).html(listArr.length);
    });
    $("#compareSpanBottom").each(function () {
      $(this).html(listArr.length);
    });
    $("#compareSpanProduct").each(function () {
      $(this).html(listArr.length);
    });
    $(".compareCountSpanClass").html(listArr.length);
    if (listArr.length > 0 && $(".cimm_addcartSlider").length > 0) {
      $(".cimm_addcartSlider").addClass("cimm_addcartSliderShow");
    }
  }
}

function clearCookie() {
  var list = getCookie("compareList");
  if (list == null) {
    bootAlert("small", "error", "Error", "No Item in Compare List.");
    list = "";
    if ($(".cimm_addcartSlider").length > 0) {
      var checkCookieSize = localStorage.getItem("selectedItemsToGroup");
      if (checkCookieSize != "[]" && checkCookieSize != null) {
        $(".cimm_addcartSlider").addClass("cimm_addcartSliderShow");
      } else {
        $(".cimm_addcartSlider").removeClass("cimm_addcartSliderShow");
      }
    }
  } else {
    var listArr = list.split(",");
    //if(listArr.length>1){
    for (i = 0; i < listArr.length; i++) {
      $("#check_" + listArr[i]).removeAttr("checked", "checked");
    }
    setCookie("compareList", "", -1);
    $("#compareSpan").html("0");
    $("#compareSpanBottom").html("0");
    $("#compareSpanProduct").html("0");
    bootAlert("small", "error", "Error", "Item(s) removed from compare list.");
    $(".compareCountSpanClass").html("0");
    //		}
    if ($(".cimm_addcartSlider").length > 0) {
      var checkCookieSize = localStorage.getItem("selectedItemsToGroup");
      if (checkCookieSize != "[]" && checkCookieSize != null) {
        $(".cimm_addcartSlider").addClass("cimm_addcartSliderShow");
      } else {
        $(".cimm_addcartSlider").removeClass("cimm_addcartSliderShow");
      }
    }
  }
}
function removeItems() {
  var chks = $("input:checkbox[name='rptRemove']");
  var s = "";
  var c = "";
  var rem = 0;

  for (i = 0; i < chks.length; i++) {
    if (chks[i].checked == true) {
      rem++;
    } else {
      s = s + c + chks[i].value;
      c = ",";
    }
  }
  var chkerr = chks.length - rem;
  if (rem > 0) {
    if (chkerr < 2) {
      bootAlert(
        "small",
        "error",
        "Error",
        "Please retain at least 2 products to compare"
      );
    } else {
      setCookie("compareList", s, 14);
      $("#CompareProducts").val(s);
      document.removeProduct.submit();
    }
  } else {
    bootAlert("small", "error", "Error", "Please select an item to remove.");
  }
}
function compareItems() {
  var compareItemCount = 5;
  if (window.innerWidth < 700) {
    var compareItemCount = 2;
  } else if (window.innerWidth < 1200) {
    var compareItemCount = 3;
  }
  var list = getCookie("compareList");
  if (list == null) list = "";
  var listArray = list.split(",");
  var chks = $("input:checkbox[name='compareId']:checked");
  if (listArray.length <= 1) {
    bootAlert(
      "small",
      "error",
      "Error",
      "Please select minimum 2 items to compare"
    );
    return false;
  } else if (listArray.length > compareItemCount) {
    bootAlert(
      "small",
      "error",
      "Error",
      "You cannot compare more than " + compareItemCount + " items at a time"
    );
    return false;
  } else {
    window.location.href = "/itemComparePage.action?compareId=" + list;
  }
}
function getCookie(c_name) {
  var i,
    x,
    y,
    ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == c_name) {
      return unescape(y);
    }
  }
}
function setCookie(c_name, value, exdays) {
  try {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value =
      escape(value) +
      (exdays == null ? "" : "; expires=" + exdate.toUTCString());
    //var c_full=c_name + "=" + c_value+";path=/NorthCoastLight;";
    var c_full = c_name + "=" + c_value + ";path=/;";
    document.cookie = c_full;
  } catch (e) {
    console.log(e);
  }
}
function deleteCookie(name) {
  try {
    setCookie(name, "", -1);
  } catch (e) {
    console.log(e);
  }
}
//----------- Add to product group action
$(document).delegate(
  '[data-function="productGroupDropDown"]',
  "click",
  function () {
    var _this = $(this);
    var toggleListID = "#" + _this.attr("data-listTarget");
    var itemId = _this.attr("data-itemId");
    $("#group_id").val(toggleListID);
    $("#hidden_id").val(itemId);
    _this
      .next(toggleListID)
      .html(
        '<li class="alignCenter"><em class="fa fa-spin fa-spinner"></em></li>'
      );
    _this.next(toggleListID).show();
    jQuery.get(
      "productListIdNamePage.action?productIdList=" + itemId + "&groupType=P",
      function (data, status) {
        _this
          .parent()
          .find(toggleListID + " li")
          .remove();
        _this.parent().find(toggleListID).html(data);
      }
    );
  }
);
function addToProductList(_this) {
  var id = $("#hidden_id").val(),
    partNumber = $("#itmId_" + id).val(),
    uomValue = $("#uomValue_" + partNumber).val(),
    qty = $("#itemTxtQty" + id).val(),
    toggleListID = $("#group_id").val();
  qty = qty.trim();
  var groupId = _this.id ? _this.id : 0;
  var groupName = $(_this).data("groupname")
    ? $(_this).data("groupname")
    : $(_this).val();

  if (qty == "") qty = "1";
  groupName = groupName.trim();
  if (
    groupName == "Create New Product Group" ||
    groupName == "CREATE NEW PRODUCT GROUP"
  ) {
    groupName = "";
  }
  if (groupId == 0) {
    if (groupName == "") {
      bootAlert("small", "error", "Error", "Please Enter Valid Group Name.");
      return false;
    } else {
      var characterReg = /^[-_ a-zA-Z0-9]+$/;
      if (characterReg.test(groupName) == false) {
        bootAlert(
          "medium",
          "error",
          "Error",
          "Special characters are not allowed except underscore or hyphen ( _ , - )."
        );
        return false;
      } else {
        $("#group_name").val(groupName);
        groupName = groupName.replace(/#/g, "%23");
        groupName = groupName.replace(/&/g, "%26");
        groupName = groupName.replace(/;/g, "%3B");
        groupName = groupName.replace(/\//g, "%2F");
        groupName = groupName.replace(/\?/g, "%3F");
        groupName = groupName.replace(/=/g, "%3D");
        groupName = groupName.replace(/@/g, "%40");
      }
    }
  } else {
    $("#group_name").val($("#" + groupId).text());
  }
  block("Please Wait");
  jQuery.get(
    "insertProductListItemPage.action?listId=" +
      groupId +
      "&listName=" +
      groupName +
      "&productIdList=" +
      id +
      "&itemQty=" +
      qty +
      "&uomValue=" +
      uomValue +
      "&dt=" +
      new Date(),
    function (data, status) {
      unblock();
      $(_this).parents(".productGroupBtn").find(toggleListID).hide();
      var itemDesc = $("#itemTitle" + id)
        .text()
        .trim();
      var result = data.split("|");
      //$(toggleListID+"_pop").html(itemDesc+" Added To Group - "+ $("#group_name").val()).attr("href","myProductGroupPage.action?savedGroupId="+result[1]).fadeIn();
      $(_this)
        .parents(".productGroupBtn")
        .find(toggleListID + "_pop")
        .html(itemDesc + " Added To Group - " + $("#group_name").val())
        .attr(
          "href",
          "/" +
            result[1] +
            "/ProductGroup/Product?savedGroupName=" +
            $("#group_name").val()
        )
        .fadeIn();
      setTimeout(function () {
        $(".popMsg").fadeOut();
      }, 3000);
    }
  );
}
function leftFilterScroll() {
  $(".cimm_filter-scrollbar").slimScroll({
    height: "210px",
    railVisible: true,
    alwaysVisible: true,
    size: "15px",
    railColor: "#ccc",
    color: "#e0e0e0",
    railOpacity: "1",
    opacity: "1",
    borderRadius: "0px",
    railBorderRadius: "0px",
    top: "10px",
  });
}
function filterScroll() {
  $(".filterScroll").slimScroll({
    height: "100px",
    railVisible: true,
    alwaysVisible: true,
    size: "15px",
    railColor: "#ccc",
    color: "#e0e0e0",
    railOpacity: "1",
    opacity: "1",
    borderRadius: "0px",
    railBorderRadius: "0px",
    top: "10px",
  });
}
function hideNotificationDiv() {
  try {
    $(document).ready(function () {
      $("#notificationDiv").hide();
      $("#message").html("");
      $("#errorMsg").html("");
    });
  } catch (e) {
    console.log(e);
  }
}
function showNotificationWithIdSuffix(idSuffix, message, error) {
  $("#notificationDiv" + idSuffix).show();
  $("#message" + idSuffix)
    .html(message)
    .show();
  $("#errorMsg" + idSuffix)
    .html(error)
    .show();
  if (message == null || message == "") $("#message" + idSuffix).hide();
  if (error == null || error == "") $("#errorMsg" + idSuffix).hide();
  $("#message" + idSuffix).html(message);
  $("#errorMsg" + idSuffix).html(error);
  $(window).scrollTop($("#notificationDiv" + idSuffix).offset().top);
}
function startTimer() {
  timer = setTimeout("closeCartPop()", 5000);
  timerRunning = true;
}
function closeCartPop() {
  $("#box").animate({ top: "-500px" }, 500, function () {
    $("#overlay").fadeOut("fast");
  });
}
function changeLanguage(val) {
  var str = $(this).serialize();
  $.ajax({
    type: "POST",
    url: "changeLanguage.action",
    data: "registerType=" + val,
    success: function (msg) {
      window.location.reload();
    },
  });
}
function locale(properName) {
  var result = "";
  $.ajax({
    type: "POST",
    url: "propertyLoaderLink.action",
    data: "propertyKey=" + properName,
    async: false,
    success: function (msg) {
      result = msg;
    },
  });
  return result;
}
function validateSearchWithIn() {
  var s = $("#keyWordTxt").val();
  if (
    s == "" ||
    s == "Search Within" ||
    s == "Search%20With%20In" ||
    s.indexOf("Search Within") > -1
  ) {
    bootAlert(
      "small",
      "error",
      "Error",
      "Enter a keyword to Search Within the list."
    );
    return false;
  } else {
    $("#keyWord").val($.trim(s));
    $("#keyWordTxt").val($.trim(replaceNonAscii(s)));
    $("#searchForm").submit();
  }
}
function runScriptSearchWithIn(e) {
  if (e.keyCode == 13) {
    $("#searchWithInBtn").click();
    return false;
  }
}
//------------------- Search Script Ends ------------------
$(document).ready(function () {
  try {
    $("#productOrderForm").submit(function () {
      $("#submitBtn").val("Please wait...");
      $("#submitBtn").attr("disabled", "disabled");
      pleaseWait("Please wait");
      var str = $(this).serialize();
      $.ajax({
        type: "POST",
        url: "ProcessRfqSale.action",
        data: str,
        success: function (msg) {
          if (msg != null && $.trim(msg) != "") {
            bootAlert("small", "error", "Error", msg);
            unBlock();
            $("#submitBtn").removeAttr("disabled");
            $("#submitBtn").val("Submit");
          } else {
            bootAlert(
              "small",
              "success",
              "Success",
              "Request has been sent successfully."
            );
            unBlock();
            setTimeout(100000);
            window.location.reload();
          }
        },
      });
      return false;
    });
  } catch (e) {
    console.log(e);
  }
});
//Credit Card Script Start
function setValue(obj) {
  var id = $(obj).attr("id");
  var expDate = $("#cExp" + id)
    .text()
    .split(" ");
  var eDate = expDate[0].split("-");
  $("#ccNumber").val($("#cNum" + id).text());
  $("#cHolder").val($("#cHld" + id).text());
  if ($("#cardHolder").length > 0) {
    $("#cardHolder").val($("#cHld" + id).text());
  }
  $("#ccExp").val(expDate);
  $("#pCode").val($("#cZip" + id).text());
  if ($("#postalCode").length > 0) {
    $("#postalCode").val($("#cZip" + id).text());
  }
  $("#sAddress").val($("#cAdd" + id).text());
  if ($("#streetAddress").length > 0) {
    $("#streetAddress").val($("#cAdd" + id).text());
  }
  $("#ccType").val($("#cType" + id).text());
  $("#ccTransactionId").val($(obj).attr("value"));
}
function validateRadio() {
  var rLen = $("input[name='radio']:checked");
  if (rLen.length > 0) {
    block();
    return true;
  } else {
    bootAlert("small", "error", "Error", "Please select a card.");
    return false;
  }
}
function sendThisPageScript() {
  var path = window.location.hostname;
  var pathArray = window.location.pathname.split("/");
  var host = pathArray[1];
  var emailitem = localStorage.getItem("emailFriendItem");
  var emailitemlink = localStorage.getItem("emailFriendlink");

  $("#prodName").append(localStorage.getItem("itemName"));
  var mailCon = "";
  if (emailitem != null) {
    $("#mailContent").append(emailitem);
    var imgsrc = $(".main_img img").attr("src");
    $(".qty").remove();
    $(".addtbtn").attr("css", "");
    $(".addtbtn").attr("style", "margin-top:8px");
    $(".addtbtn a").attr(
      "style",
      "background:url(http://" +
        path +
        "/" +
        host +
        "/images/AddTBTN.png) no-repeat;height:21px;padding:3px 12px 8px 13px;font-weight:bold;text-decoration:none;	color:#FFF;cursor: default"
    );
    $("#enalargeImage").remove();
    $(".sub_img").remove();
    $(".reviewBtn").remove();
    $(".subbuttdons").remove();
    $("#mailContent input[type=hidden]").remove();
    if (mailCon == "") {
      $("#mailBody").val(emailitem);
    } else {
      $("#mailBody").val(mailCon);
    }

    $("#mailLink").val(emailitemlink);
  } else if (emailitem == null) {
    $("#SendItem").hide();
    $("#ErrorField").append(
      "Please <a onclick='history.go(-1);' href='javascript:void(0);'>Go Back</a> and select a Product to Send to your Friends/Associates"
    );
  }
}
//send this page
function validateSendMail() {
  var toname = $.trim($("#toName").val());
  var toEmail = $.trim($("#toEmail").val());
  var fromname = $.trim($("#fromName").val());
  var fromEmail = $.trim($("#fromEmail").val());
  var mailSubject = $.trim($("#mailSubject").val());
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  var jcaptcha = $("#jcaptcha").val();
  var userLogin = $("#userLogin").val();
  var Error = "";
  if (toname == "" || toname == null) {
    Error = Error + "Please Enter Your Friend Name<br>";
  }
  if (toEmail == "" || toEmail == null) {
    Error = Error + "Please Enter Friend Email Address <br>";
  }
  if (!emailReg.test(toEmail)) {
    Error = Error + "Your Friends Email Address is Invalid<br>";
  }
  if (fromname == "" || fromname == null) {
    Error = Error + "Please Enter Your Name<br>";
  }
  if (fromEmail == "" || fromEmail == null) {
    Error = Error + "Please Enter Your Email Address<br>";
  }
  if (!emailReg.test(fromEmail)) {
    Error = Error + "Your Email Address is Invalid<br>";
  }
  if (mailSubject == "" || mailSubject == null) {
    Error = Error + "Please Enter  Subject<br>";
  }
  if (userLogin == "false") {
    if (jcaptcha == "" || (jcaptcha == null && userLogin == "false")) {
      Error = Error + "<p>Please Enter Captcha</p>";
    }
  }
  if (Error != "") {
    showNotificationDiv("Error", Error);
    return false;
  } else if (Error == "") {
    $("#sendBtn").val("Sending mail... Please wait...");
    $("#sendBtn").attr("disabled", "disabled");
    send();
  }
  return false;
}

function validateSendMailForAll() {
  var toname = $.trim($("#toName").val());
  var toEmail = $.trim($("#toEmail").val());
  var fromname = $.trim($("#fromName").val());
  var fromEmail = $.trim($("#fromEmail").val());
  var mailSubject = $.trim($("#mailSubject").val());
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  var userLogin = $("#userLogin").val();
  var jcaptcha = $("#jcaptcha").val();
  var Error = "";
  if (toname == "" || toname == null) {
    Error = Error + "Please Enter Your Friend Name<br>";
  }
  if (toEmail == "" || toEmail == null) {
    Error = Error + "Please Enter Friend Email Address <br>";
  }
  if (!emailReg.test(toEmail)) {
    Error = Error + "Your Friend's Email Address is Invalid<br>";
  }
  if (fromname == "" || fromname == null) {
    Error = Error + "Please Enter Your Name<br>";
  }
  if (fromEmail == "" || fromEmail == null) {
    Error = Error + "Please Enter Your Email Address<br>";
  }
  if (!emailReg.test(fromEmail)) {
    Error = Error + "Your Email Address is Invalid<br>";
  }
  if (mailSubject == "" || mailSubject == null) {
    Error = Error + "Please Enter  Subject<br>";
  }
  if (userLogin == "false") {
    if (jcaptcha == "" || (jcaptcha == null && userLogin == "false")) {
      Error = Error + "Please Enter Captcha";
    }
  }
  if (Error != "") {
    showNotificationDiv("Error", Error);
    return false;
  } else if (Error == "") {
    $("#sendBtn").html("Sending mail... Please wait...");
    $("#sendBtn").attr("disabled", "disabled");
    sendPage();
  }
  return false;
}
function send() {
  var path = window.location.hostname;
  var pathArray = window.location.pathname.split("/");
  host = pathArray[1];
  var emailitemlink = localStorage.getItem("emailFriendlink");
  $(".cimm_itemdetail-imgcontainer img").css({
    position: "relative",
    width: "300px",
  });
  $("#mailContentDisplay .contentPart .imgForSend").remove();
  $("#mailContentDisplay .contentPart > table tr td").each(function () {
    $(this).css({ border: "1px solid #CCC", "border-collapse": "collapse" });
    if ($(this).hasClass("text-center")) {
      $(this).css({ "text-left": "left" });
    }
  });
  $("#mailContentDisplay .contentPart > table tr th").each(function () {
    $(this).css({ border: "1px solid #CCC", "border-collapse": "collapse" });
    if ($(this).hasClass("text-left")) {
      $(this).css({ "text-align": "left" });
    }
  });
  $("#ProdRating img").each(function () {
    var originalSrc = $(this).attr("src");
    $(this).attr("src", "http://" + path + "/" + host + "/" + originalSrc);
  });
  $(".prd_img img").each(function () {
    var originalSrc = $(this).attr("src");
    if (originalSrc.indexOf("http:") == -1) {
      $(this).attr("src", "http://" + path + originalSrc);
    } else {
      $(this).attr("src", originalSrc);
    }
  });
  $("#mailContent a").attr("href", emailitemlink);
  $("#imgPart").val($(".cimm_itemdetail-imgcontainer").html());
  $("#contentPart").val($(".cimm_itemDescription").html());
  $("#pricePart").val($(".priceCont").html());
  $("#descPart").val($(".contentPart").html());
  var str = $("#contactEmailUs").serialize();
  var isUpdate = false;
  $.ajax({
    type: "POST",
    url: "sendPageMail.action",
    data: str,
    success: function (msg) {
      var result = $.trim(msg);
      var arrRes = result.split("|");
      if ($.trim(arrRes[0]) == "0") {
        showNotificationDiv("Success", "Mail Sent Successfully", "");
        $("#sendBtn").val("Reloading Page");
        $("#sendBtn").removeAttr("disabled");
        localStorage.removeItem("emailFriendlink");
        localStorage.removeItem("emailFriendItem");
        localStorage.removeItem("itemID");
        location.href = emailitemlink;
      } else if ($.trim(arrRes[0]) == "2") {
        showNotificationDiv("Error", $.trim(arrRes[1]));
        $("#mailContent a").attr("href", "javascript:void(0);");
        $("#sendBtn").val("Send");
        $("#sendBtn").removeAttr("disabled");
        refreshjcaptcha();
      } else {
        showNotificationDiv("Error", "Mail Sending Failed");
        $("#mailContent a").attr("href", "javascript:void(0);");
        $("#sendBtn").val("Send");
        $("#sendBtn").removeAttr("disabled");
        refreshjcaptcha();
      }
    },
    error: function (error) {
      showNotificationDiv("Error", "Mail Sending Failed");
      $("#mailContent a").attr("href", "javascript:void(0);");
      $("#sendBtn").val("Send");
      $("#sendBtn").removeAttr("disabled");
      refreshjcaptcha();
    },
  });
  return false;
}
/*Send this page*/

/*Send this page for All*/
function sendPage() {
  try {
    var path = window.location.hostname;
    var pathArray = window.location.pathname.split("/");
    host = pathArray[1];
    var emailitemlink = localStorage.getItem("emailFriendlink");
    var mailTemplateName = localStorage.getItem("mailTemplateName");
    $("#contentPart").val($("#mailContent").html());
    if ($("#mailTemplateName").length > 0) {
      if (mailTemplateName != null && $.trim(mailTemplateName) != "") {
        $("#mailTemplateName").val(mailTemplateName);
      }
    }
    var str = $("#sendPageForm").serialize();
    var isUpdate = false;
    $.ajax({
      type: "POST",
      url: "sendPageMailForAllUnit.action",
      data: str,
      success: function (msg) {
        var result = $.trim(msg);
        var arrRes = result.split("|");
        if ($.trim(arrRes[0]) == "0") {
          showNotificationDiv("Success", "Mail Sent Successfully", "");
          $("#sendBtn").html("Reloading Page");
          $("#sendBtn").removeAttr("disabled");
          localStorage.removeItem("emailFriendlink");
          localStorage.removeItem("emailFriendItem");
          localStorage.removeItem("mailTemplateName");
          location.href = emailitemlink;

          if (
            $("#sendThisPageNewWindow").length > 0 &&
            $("#sendThisPageNewWindow").val() == "Y"
          ) {
            if (window.top != window.self) {
              console.log("This window is NOT the topmost window!");
            } else {
              bootAlert(
                "small",
                "success",
                "Success",
                "Mail sent successfully."
              );
              console.log("This window is the topmost window!");
              setTimeout(function () {
                window.top.close();
              }, 5000);
            }
          }
        } else if ($.trim(arrRes[0]) == "2") {
          showNotificationDiv("Error", $.trim(arrRes[1]));
          $("#mailContent a").attr("href", "javascript:void(0);");
          $("#sendBtn").html("Send");
          $("#sendBtn").removeAttr("disabled");
          refreshjcaptcha();
        } else {
          showNotificationDiv("Error", "Mail Sending Failed");
          $("#mailContent a").attr("href", "javascript:void(0);");
          $("#sendBtn").html("Send");
          $("#sendBtn").removeAttr("disabled");
        }
      },
    });
  } catch (e) {
    console.log(e);
  }
  return false;
}
/* Custom Forms Script */
function customeSubject() {
  try {
    if ($.trim($("#buildSubject").val() != "")) {
      var buildAttr = eval($("#buildSubject").val());
      var c = "";
      var s = "";
      var sep = "";
      console.log(buildAttr);
      if (buildAttr.length > 0) {
        var eltype;
        for (i = 0; i < buildAttr.length; i++) {
          if (
            Object.prototype.toString.call(buildAttr[i]) === "[object Array]"
          ) {
            console.log(
              "Array : " + buildAttr[i] + "len : " + buildAttr[i].length
            );
            eltype = $('*[name="' + buildAttr[i][0] + '"]');
            sep = buildAttr[i][1];
            if ($.trim(sep) == "") sep = " ";
          } else {
            eltype = $('*[name="' + buildAttr[i] + '"]');
            console.log("String : " + buildAttr[i]);
            sep = " ";
          }
          console.log(
            "Value : " + eltype.prop("tagName") + " - " + eltype.val()
          );
          s = s + c + eltype.val();
          c = sep;
        }
        $('*[name="Subject"]').val(s);
        console.log("Subject : " + $('*[name="Subject"]').val());
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function validateCustomForm(formElement) {
  var elems = $.makeArray(formElement.elements);
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  var phoneReg = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
  var formID = $(formElement).attr("id");
  var valid = true;
  var fieldTypes = ["input[type!='hidden']", "select", "textarea", "checkbox"];
  try {
    for (var i = 0; i < fieldTypes.length; i++) {
      if (valid) {
        $("#" + formID + " " + fieldTypes[i]).each(function () {
          var e = $(this);
          var classValueMain = e.attr("class");
          var classValue = "";
          var classArr = "";
          var fieldName = e.attr("name").replace("_", " ");
          if (classValueMain != undefined && classValueMain != "") {
            classArr = classValueMain.split(" ");
          }
          if (classArr.length > 1) {
            for (var jj = 0; jj < classArr.length; jj++) {
              if (classArr[jj].indexOf("Validate") > -1) {
                classValue = classArr[jj];
                break;
              }
            }
          } else {
            classValue = classArr;
          }
          console.log("classValue --- - - - -: " + classValue);
          if (!classValue == "") {
            var claassValueArray = classValue.toString().split("-");
            console.log("validate-:  " + claassValueArray[0].toLowerCase());
            if (claassValueArray[0].toLowerCase() == "validate") {
              console.log("string-: " + claassValueArray[1].toLowerCase());
              console.log(
                "index : " + claassValueArray[1].toLowerCase().indexOf("string")
              );
              if (claassValueArray[1].toLowerCase() == "string") {
                console.log("value-: " + e.attr("value"));
                if (
                  $.trim(e.attr("value")) == "" ||
                  e.attr("value") == "undefined"
                ) {
                  bootAlert(
                    "small",
                    "error",
                    "Error",
                    "Please Enter valid " + fieldName
                  );
                  e.focus();
                  return (valid = false);
                }
              } else if (claassValueArray[1].toLowerCase() == "number") {
                if (
                  e.attr("value") == "" ||
                  isNaN(e.attr("value")) ||
                  e.attr("value") == "undefined"
                ) {
                  bootAlert(
                    "small",
                    "error",
                    "Error",
                    "Please Enter valid " + fieldName
                  );
                  e.focus();
                  return (valid = false);
                }
              } else if (claassValueArray[1].toLowerCase() == "email") {
                if (e.attr("value") == "" || e.attr("value") == "undefined") {
                  bootAlert(
                    "small",
                    "error",
                    "Error",
                    "Please Enter valid " + fieldName
                  );
                  e.focus();
                  return (valid = false);
                } else if (!emailReg.test(e.attr("value"))) {
                  bootAlert(
                    "small",
                    "error",
                    "Error",
                    "Please Enter valid " + fieldName + " format"
                  );
                  e.focus();
                  return (valid = false);
                }
              } else if (claassValueArray[1].toLowerCase() == "radiochecked") {
                preRadio = fieldName;
                if (fieldName == preRadio || preRadio == "") {
                  var radios = document.getElementsByName(fieldName);
                  var checked = "false";
                  for (var i = 0; i < radios.length; i++) {
                    if (radios[i].checked) {
                      checked = "true";
                      break;
                    }
                  }
                  if (checked == "false") {
                    bootAlert(
                      "small",
                      "error",
                      "Error",
                      "Please Select " + fieldName
                    );
                    return (valid = false);
                  }
                }
              } else if (claassValueArray[1].toLowerCase() == "checkbox") {
                preCheckBox = fieldName;
                if (fieldName == preCheckBox || preCheckBox == "") {
                  var CheckBoxs = document.getElementsByName(fieldName);
                  var checked = "false";
                  for (var i = 0; i < CheckBoxs.length; i++) {
                    if (CheckBoxs[i].checked) {
                      checked = "true";
                      break;
                    }
                  }
                  if (checked == "false") {
                    bootAlert(
                      "small",
                      "error",
                      "Error",
                      "Please Select " + fieldName
                    );
                    return (valid = false);
                  }
                }
              } else if (claassValueArray[1].toLowerCase() == "phone") {
                if (e.attr("value") == "" || e.attr("value") == "undefined") {
                  bootAlert(
                    "small",
                    "error",
                    "Error",
                    "Please Enter " + fieldName
                  );
                  e.focus();
                  return (valid = false);
                } else if (!phoneReg.test(e.attr("value"))) {
                  bootAlert(
                    "small",
                    "error",
                    "Error",
                    "Please Enter valid " + fieldName
                  );
                  e.focus();
                  return (valid = false);
                }
              } else if (claassValueArray[1].toLowerCase() == "select") {
                console.log("value-: " + e.attr("value"));

                if (
                  e.attr("value") == "" ||
                  e.attr("value") == "undefined" ||
                  e.attr("value") == "-1"
                ) {
                  bootAlert(
                    "small",
                    "error",
                    "Error",
                    "Please select a valid " + fieldName
                  );
                  e.focus();
                  return (valid = false);
                }
              }
            }
          }
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
  return valid;
}
function submitCustomForm(id) {
  if (validateCustomForm(id)) {
    var btnVal = $(id).find("#submitBtn").val();
    $(id).find("#submitBtn").val("Please wait...");
    $(id).find("#submitBtn").attr("disabled", "disabled");
    customeSubject();
    var formName = $("input[name=formName]").val();
    var str = $(id).serialize();
    block();
    $.ajax({
      type: "POST",
      url: "SaveAndSendMail.action", //SaveAndSendMail.action
      data: str,
      success: function (msg) {
        unBlock();
        console.log(msg);
        try {
          if ($.trim(msg) == "0") {
            $("#CustomForm")[0].reset();
            $("#custFormMsg").html(
              "<span style='color:green;'>Request has been sent successfully.</span>"
            );
            $("#submitBtn").val(btnVal);
            $("#submitBtn").removeAttr("disabled");
            //bootAlert("small","error","Error",'Thank you for your inquiry.\nYour message has been received and we will be in contact shortly.'); // form.label.staticPageFormSuccessMsg
            if (
              typeof formName != "undefined" &&
              formName == "OnlineReturnCenter"
            ) {
              bootAlert(
                "small",
                "error",
                "Error",
                locale("form.label.staticPageReturnFormSuccessMsg")
              );
            } else {
              bootAlert(
                "small",
                "error",
                "Error",
                locale("form.label.staticPageFormSuccessMsg")
              );
            }
            window.location.reload();
          } else {
            $("#custFormMsg").html(
              "<span style='color:red;'>Problem occured during process please try again Later</span>"
            );
            //bootAlert("small","error","Error",'Problem occured during process please try again Later','');  // form.label.staticPageFormFailureMsg
            bootAlert(
              "small",
              "error",
              "Error",
              locale("form.label.staticPageFormFailureMsg")
            );
            $("#submitBtn").val(btnVal);
            $("#submitBtn").removeAttr("disabled");
          }
        } catch (e) {
          console.log(e);
        }
      },
    });
  } else {
    return false;
  }
  return false;
}

function addItemList(GName, groupId) {
  if (groupId == 0) {
    GName = GName.replace(/#/g, "%23");
    GName = GName.replace(/&/g, "%26");
    GName = GName.replace(/;/g, "%3B");
    GName = GName.replace(/\//g, "%2F");
    GName = GName.replace(/\?/g, "%3F");
    GName = GName.replace(/=/g, "%3D");
    GName = GName.replace(/@/g, "%40");
  }
  //var itemID = $("#productIdList").val();
  var itemID = productGroupItems;
  $("#listName").val(GName);
  $("#listId").val(groupId);

  $("#productIdList").val(itemID);
  block();
  $("#ProductSubmit").attr(
    "action",
    "insertMultipleItemsToProductGroupPage.action"
  );
  $("#ProductSubmit").submit();
  //enqueue('insertProductListItemPorI.action?listId='+groupId+'&listName='+GName+"&productIdList="+itemID+"&itemQty="+qty,ProcessAddProductList1);
}
//-----------------------Credit Card --------------------------------
function checkPCard(s) {
  jConfirm("Are you sure you want to delete?", "Confirmation", function (r) {
    if (r) {
      $("#pCardId").val($("#pCardId_" + s).html());
      $("#rdCard").val("Yes");
      $("#pCardForm").attr("action", "deletePaymentCardInfoSale.action");
      $("#pCardForm").submit();
    }
  });
}
function PageItemsChange() {
  var resultPage = $("#myProductGroup select[name='resultPage']").val();
  var searchKeyWord = $("#productSearchForm input[name='searchkeyWord']").val();
  var isShared = "N";
  if ($("#isShared").length > 0) {
    isShared = $("#isShared").val();
  }
  var prev = "myProductGroupPage.action?savedGroupId=" + $("#GroupId").val();
  prev = prev.split(" ").join("-");
  var pageNo = $("#myProductGroup input[name='pageNo']").val();
  var resultPage = $("#myProductGroup select[name='resultPage']").val();
  var savedGroupName = $("#myProductGroup input[name='savedGroupName']").val();
  var reqType = $("#myProductGroup input[name='reqType']").val();
  var url = "";
  if (
    typeof resultPage != "undefined" &&
    searchKeyWord != null &&
    typeof searchKeyWord != "undefined" &&
    searchKeyWord != ""
  ) {
    url =
      prev +
      "&savedGroupName=" +
      savedGroupName +
      "&reqType=" +
      reqType +
      "&resultPage=" +
      resultPage +
      "&searchkeyWord=" +
      searchKeyWord +
      "&shared=" +
      isShared;
  } else {
    url =
      prev +
      "&savedGroupName=" +
      savedGroupName +
      "&reqType=" +
      reqType +
      "&resultPage=" +
      resultPage +
      "&shared=" +
      isShared;
  }
  location.href = $("base").attr("href") + url;
}
function doLogOff() {
  try {
    deleteCookie("urlShipTo");
    deleteCookie("compareList");
    deleteCookie("poNumber");
    deleteCookie("orderedBy");
    deleteCookie("reqDate");
    deleteCookie("shippingInstruction");
    deleteCookie("defaultShipToId");
    deleteCookie("shipVia");
    deleteCookie("url");
    deleteCookie("recentlyViewed");
    deleteCookie("pageViewMode");
    localStorage.removeItem("emailFriendlink");
    localStorage.removeItem("emailFriendItem");
    localStorage.removeItem("itemID");
    localStorage.removeItem("itemName");
    localStorage.removeItem("salesUserSelected");
    localStorage.removeItem("currentCustomerSU");
    window.location.href = "/doLogOff.action";
  } catch (e) {
    console.log(e);
  }
}
function sameAsBillAddress(billTo) {
  var chk = $("#shipSameAsBill").is(":checked");
  var shipSameAsBill = "N";
  if (chk) {
    shipSameAsBill = "Y";
  }

  pleaseWait("");
  $.ajax({
    type: "POST",
    url:
      "sameAsBillingUnit.action?sameAsBillingAddress=" +
      shipSameAsBill +
      "&defaultBillToId=" +
      billTo,
    data: "",
    success: function (msg) {
      //checkout
      window.location.href = "/checkout.action";
    },
  });

  return false;
}
function underDevelopment() {
  bootAlert("small", "error", "Error", "Functionality Currently Unavailable");
  return false;
}
function refreshjcaptcha() {
  var jcaptchaType = "";
  if ($("#jcaptchaType").length > 0) {
    jcaptchaType = $.trim($("#jcaptchaType").val());
  }
  var imageurl = $("base").attr("href") + "CaptchaServlet";
  $("#captchaImg").attr("src", "");
  $("#captchaImg").attr(
    "src",
    "CaptchaServlet.slt?typ=" + jcaptchaType + "&id=" + new Date()
  );
}

function displayCreditCardDetails() {
  $(document).ready(function () {
    var poNumber = getCookie("poNumber");
    var orderedBy = getCookie("orderedBy");
    var reqDate = getCookie("reqDate");
    var shippingInstruction = getCookie("shippingInstruction");
    var defaultShipToId = getCookie("defaultShipToId");
    var shipVia = getCookie("shipVia");
    if (poNumber != "") {
      $("#poNumber").val(poNumber);
      $("#orderedBy").val(orderedBy);
      $("#reqDate").val(reqDate);
      $("#defaultShipToId").val(defaultShipToId);
      $("#shipVia").val(shipVia);
      $("textarea#shippingInstruction").val(shippingInstruction);
    }
  });
}
function checkRemember(chk) {
  if (chk.checked) {
    $("[name='rememberMe']").each(function () {
      $(this).attr("checked", true);
    });
  } else {
    $("[name='rememberMe']").each(function () {
      $(this).attr("checked", false);
    });
  }
}
function limitText(limitField, limitCount, limitNum) {
  if (limitField.value.length > limitNum) {
    limitField.value = limitField.value.substring(0, limitNum);
  } else if (limitField.value.length <= limitCount) {
    $("#minValue").html(limitCount - limitField.value.length);
    $("#countdown").html(limitNum - limitField.value.length);
  } else if (limitField.value.length > limitCount) {
    $("#minValue").html("0");
    $("#countdown").html(limitNum - limitField.value.length);
  } else {
    $("#countdown").html(limitNum - limitField.value.length);
  }
}
function getCpnFromErp() {
  var partNumber = $("#hidden_PartNum").val();
  var itemId = $("#hidden_ItemID").val();
  var userLogin = $("#userLogin").val();

  if (userLogin != null && userLogin != undefined && userLogin == "true") {
    $.ajax({
      type: "POST",
      url: "getCustomerPartNumbersFromErpPage.action",
      data: "partNumber=" + partNumber + "&itemId=" + itemId,
      success: function (msg) {
        var res = msg.split("|");
        if (res[0] != null && res[0] != 1) {
          if (res[1] != null && $.trim(res[1])) {
            $("#custMainBlock").show();
            $("#custPartBlock").html(res[1]);
          } else {
            $("#custMainBlock").hide();
          }

          $("#linkgcustom" + itemId).unbind("click", disabler);
          $("#custRefreshBlock").hide();
        } else {
          $("#custRefreshBlock").css("color", "red");
          $("#custRefreshBlock").html(
            locale("product.label.customerpartnumberrefresherror")
          );
        }
      },
    });
  }
}
function submitOciForm() {
  enqueue("punchoutOrder.action?type=ociCartPunchOut", function () {
    document.ociFrm.submit();
  });
}
function ociSubmit(s) {
  if (s == 1) $("#ociFrm").submit();
  else $("#cancelOrder").submit();
}
function submitCxmlDoc() {
  enqueue("punchoutOrder.action?type=cxmlCartPunchOut", function () {
    window.document.submitCxml.submit();
  });
}
function cancelCxmlDoc() {
  enqueue("deletePunchoutOrderSale.action?type=cxmlCartPunchOut", function () {
    window.document.cancelOrder.submit();
  });
}
function updateEmailAddress(email) {
  if (email != null && email.trim() != "") {
    if (validateEmail(email.trim())) {
      $.ajax({
        type: "POST",
        url: "updateContactEmailAddressUnit.action",
        data: "email=" + email,
        success: function (msg) {
          var contactUpdateStatusString = locale(
            "contact.information.updated.success"
          );
          bootAlert("small", "success", "Info", msg);
          if (msg == contactUpdateStatusString) {
            setCookie("validEmailAddress", true);
            window.location.reload();
          } else {
            setCookie("validEmailAddress", false);
          }
        },
      });
    } else {
      setCookie("validEmailAddress", false);
      bootAlert("small", "error", "Error", "Please enter valid email address");
    }
  } else {
    setCookie("validEmailAddress", false);
    bootAlert("small", "error", "Error", "Please enter email address");
  }
}
function getOrderPartNumbers() {
  var orderNumber = $("#orderNumberTemp").val();

  if (orderNumber != null && orderNumber != "") {
    $("orderNumber").val(orderNumber);
  } else if (orderNumber == null || orderNumber == "") {
    bootAlert(
      "small",
      "error",
      "Error",
      "please enter atleast one order number"
    );
  } else {
    $("orderNumber").val("");
  }

  var str = $("#orderIdForm").serialize();
  pleaseWait("Loading...");
  $.ajax({
    type: "POST",
    url: "OrderDetailSale.action?requestType=quickorder&orderId=" + orderNumber,
    data: "",
    success: function (data) {
      data = $.parseJSON(data);
      $.each(data, function (key, val) {
        if (key == 20) {
          $(".ShowOnAddMore").show();
        }

        id = key + 1;
        $("#SELOPTION" + id).val("1");
        $("#PN" + key).val(val.partNumber);
        $("#QTY" + key).val(val.qtyordered);
      });
      unBlock();
    },
  });
  return false;
}
function customerAlsoViewed(itemId) {
  if (itemId != null && itemId != "") {
    $.ajax({
      type: "POST",
      url:
        "customerAlsoViewedItemsPage.action?ItemID=" +
        itemId +
        "&dt=" +
        new Date(),
      data: "",
      success: function (data) {
        if (data != null && data.trim() != "") {
          if ($(data).filter("#customerAlsoViwedDiv").length > 0) {
            $("#customerAlsoViewedOuterDiv").show();
            $("#customerAlsoViewedContent").html(
              $(data).filter("#customerAlsoViwedDiv").html()
            );
          }
        }
      },
    });
  }
}

function setValueToSession(key, val) {
  enqueue(
    "sessionValueLink.action?crud=s&keyValue=" +
      key +
      "&insertValue=" +
      val +
      "&dt=" +
      new Date(),
    function () {
      console.log("Value set to: " + key);
    }
  );
}
function getValueFromSession(key) {
  var sessionValue = "";
  enqueue(
    "sessionValueLink.action?keyValue=" + key + "&dt=" + new Date(),
    function (val) {
      sessionValue = val;
    }
  );
  //console.log(key+" - value From Session - "+sessionValue);
  return sessionValue;
}
function clearUserCart() {
  enqueue("clearUserCartActionPage.action?dt=" + new Date(), function () {});
}
function switchUserSubsetFromDB() {
  enqueue(
    "switchToUserSubsetFromDBPage.action?dt=" + new Date(),
    function () {}
  );
}

/*************siteSpecificJs start*******************/
$('[data-function="quickCartView"]').click(function () {
  var toggleType = $(this).attr("data-toggle");
  var toggleElem = $(this).attr("data-target");
  var obj = this;
  if (toggleType == "dropdown") {
    if ($(".quickCartViewBlock").length == 0) {
      var str =
        '<div class="quickCartViewBlock dropdown-menu"><div class="alignCenter"><em class="fa fa-spin fa-spinner"></em></div></div>';
      $(obj).parent().append(str);
    } else {
      var str =
        '<div class="alignCenter"><em class="fa fa-spin fa-spinner"></em></div>';
      $(".quickCartViewBlock").html(str);
    }
    $(toggleElem).dropdown("toggle");
  } else {
    block("Please Wait");
  }
  $.ajax({
    type: "POST",
    url: "shoppingCartPage.action",
    data: {
      quickCartView: "Y",
      responseType: toggleType,
    },
    success: function (data) {
      if (toggleType != "dropdown") unblock();
      if (toggleType == "dropdown") {
        $("html, body").animate({ scrollTop: 0 }, 2000);
        $(".quickCartViewBlock").html(data);
      } else if (toggleType == "modal") {
        $("#generalModel .modal-body").html(data);
        $("#generalModel").modal();
      }
      triggerToolTip();
      formatPrice();
    },
  });
});
function quickCartItemDelete(productListId) {
  var r = "";
  bootbox.confirm({
    size: "small",
    closeButton: false,
    message: "You want to delete the item from cart?",
    callback: function (result) {
      if (result) {
        block("Please Wait");
        $.post(
          "deleteCartPage.action?deleteId=" +
            productListId +
            "&type=quickcartscript",
          function (data, status) {
            unblock();
            if (data == "success" && data != null) {
              bootAlert("small", "success", "Info", "Item deleted");
              window.location.reload();
            }
          }
        );
      } else {
        bootAlert(
          "medium",
          "error",
          "Error",
          "Error While deleting Item. Please Try Later."
        );
      }
    },
  });
}
function cleanLoadingV2() {
  try {
    var userLogin = $("#userLogin").val();
    $("[data-select='availability']").each(function (i) {
      if ($(this).find("img").length > 0) {
        $(this).html("<span class='priceSpanFa'>Call for Availability</span>");
        $("#HomeBranchQty").html(
          "<span class='required'>Call for Availability</span>"
        );
        console.log("In Full Script");
      }
    });
    $("[data-select='priceData']").each(function (i) {
      if ($(this).find("img").length > 0) {
        $(this).html("<span class='priceSpanFa'>Call for Price</span>");
      }
    });
  } catch (e) {
    console.log(e);
  }
}
function cleanLoading() {
  try {
    var userLogin = $("#userLogin").val();
    $("[data-select='availability']").each(function (i) {
      if ($(this).find("img").length > 0) {
        $(this).html("<span class='priceSpanFa'>Call for Availability</span>");
        $("#HomeBranchQty").html(
          "<span class='required'>Call for Availability</span>"
        );
        console.log("In Full Script");
      }
    });
    $("[data-select='priceData']").each(function (i) {
      if ($(this).find("img").length > 0) {
        $(this).html("<span class='priceSpanFa'>Call for Price</span>");
      }
    });

    $("[data-select='uomData']").each(function (i) {
      if ($(this).find("img").length > 0) {
        $(this).html("N/A");
      }
    });

    $("[data-select='minorderquantity']").each(function (i) {
      if ($(this).find("img").length > 0) {
        $(this).html("Min.Order: 1");
      }
    });

    $("[data-select='quantityinterval']").each(function (i) {
      if ($(this).find("img").length > 0) {
        $(this).html("Qty Interval: 1");
      }
    });

    $("input:hidden[name='idListPrice']").each(function (i) {
      var partNum = $(this).val();
      partNum = partNum.replace(/[#;&,.+*~':"!^$[\]()=>|\/]/g, "\\$&");

      if (userLogin != null && userLogin == "true") {
        if ($("#priceValue_" + partNum).val() <= 0) {
          //$("[data-select='addtoCartbtn_"+partNum+"']").html('<a href="javascript:void(0);" class="btn btn-addtocart btns-disable">Add to Cart &raquo;</a>');
        } else {
          $("#enableCart_" + partNum).show();
        }
      } else {
        if (
          $("#enablePriceBeforeLogin").length > 0 &&
          $("#enablePriceBeforeLogin").val() == "Y" &&
          price > 0
        ) {
          $("#enableCart_" + partNum).show();
        } else {
          $("[data-select='addtoCartbtn_" + partNum + "']").html(
            '<a href="javascript:void(0);" class="btn btn-addtocart" onclick="loginPop();">Add to cart</a>'
          );
        }
      }
    });

    if (
      $("#enableNotificationOnCallForPrice").length > 0 &&
      $("#enableNotificationOnCallForPrice").val() == "Y"
    ) {
      $(".btn-addtocart").each(function (i) {
        if ($(this).hasClass("btns-disable")) {
          $(this).removeClass("btns-disable");
          $(this).addClass("sendNotificationOnCallForPrice");
          $(this).prop("disabled", false);
        }
      });
    }

    var itemId = getCookie("itemId");
    var itemPriceID = getCookie("itemPriceId");
    if (itemId != "" && itemId != null && typeof itemId != "undefined") {
      addToCart(itemId, itemPriceID);
      setCookie("itemId", "", -1);
      setCookie("itemPriceId", "", -1);
    }
    var end = new Date().getTime();
    $("#getPriceProcessSEnd").val(end);

    var debugTrue = $("#SearchDebug").val();
    if (debugTrue != null && debugTrue == "Y") {
      debugDataLoad();
    }
  } catch (e) {
    console.log(e);
  }
}

function ProcessAddProductListClone(s) {
  $($("#group_idClone").val() + "pop").fadeIn();
  var itemDesc = "#itemTitle" + $("#hidden_idClone").val();
  var result = s.split("|");
  $($("#group_idClone").val() + "popCont").html(
    "<a href='myProductGroupPage.action?savedGroupId=" +
      result[1] +
      '\' style="color:#fff;">' +
      $(itemDesc).text() +
      " Added To Group - " +
      $("#group_name").val() +
      "</a>"
  );
  $(".dropdownClone dd ul").hide();
}
jQuery(document).bind("click", function (e) {
  /****************addToCart*****************/
  var $clicked = $(e.target);
  if ($clicked.hasClass("addToCart")) {
    $clicked.addToCart({
      flyToCart: "Y",
      quickCartView: "N",
      pickupSupport: "Y",
      functionalBlock: {
        uomValuePrefix: "uomValue_",
        minOrderQtyPrefix: "MinOrderQty_",
        qtyPrefix: "itemTxtQty",
        qtyIntervalPrefix: "OrderQtyInterval_",
        partNumberPrefix: "itmId_",
        itemTitlePrefix: "itemTitle",
        itemShortDescPrefix: "itemShortDesc",
        salesPriceQtyPrefix: "priceSaleQty_",
        priceValuePrefix: "priceValue_",
        salesQtyPrefix: "salesQty",
        itemImagePrefix: "imageName",
      },
    });
  } else if ($clicked.hasClass("sendNotificationOnCallForPrice")) {
    $clicked.sendNotificationOnCallForPrice({
      functionalBlock: {
        partNumberNotificationPrefix: "itmId_",
      },
    });
  }
  /****************afterLoginUrl*****************/
  var staticLink = $clicked.attr("data-staticlink");
  if (staticLink == "  /QuickCartStandard  ") {
    setCookie("afterLoginUrl", "/QuickCartStandard", 1);
  }
  $(".cimm_customPopWrap").click(function (event) {
    event.stopPropagation();
  });
});
/****************multipleAddApplyBtn*****************/
function multipleAddApply(id) {
  if (id.id == "multipleAddApplyBtnPopup") {
    var userLogin = $("#userLogin").val();
    if (id.dataset.perform == "multipleProductGroup") {
      if (typeof userLogin != "undefined" && userLogin == "true") {
        Unilog.loadMyProductGroupData();
      } else {
        loginPop();
      }
    } else if (id.dataset.perform == "multipleAddToCart") {
      Unilog.addToCartCookie();
    } else {
      bootAlert("small", "error", "Error", "Please select an option");
    }
  }
}
function changeAdvSearch() {
  //var SelectDesp = $('#selectBox1');
  var myselect = $("input[name=searchBy]:checked").val();
  if (myselect != "-1") {
    $("#keyWordMatch").hide();
    if (myselect == "0") {
      underDevelopment();
      $("#glantzCode").attr("checked", "checked");
    }
  } else if (myselect == "-1") {
    $("#keyWordMatch").show();
    myselect = $("input[name=searchThrough]:checked").val();
  }
  $("#advSearchHidden").val(myselect);
}

function changeAdvSearchLeftMenu() {
  var myselect = $("select[name= advSearch] option:selected").val();

  if (myselect != "-1") {
    $("#selectBox2").hide();
    $("#selectBox2_chosen").hide();
    if (myselect == "0") {
      underDevelopment();
    }
  } else if (myselect == "-1") {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      $("#selectBox2").show();
    } else {
      $("#selectBox2_chosen").show();
    }
    myselect = $("select[name= advSearchMore] option:selected").val();
  }
  if (typeof myselect != "undefined") $("#advSearchHidden").val(myselect);
}
function displayCreditCardResponse(content) {
  $(document).ready(function () {
    if ($("#cardResponse").val() == "Success") {
      $("#cardStatus").html(content);
    } else {
      $("#cardStatus").html($("#cardResponse").val());
    }
  });
}
/*Send Site Detail Page*/
function sendSiteDetailPagePart(a) {
  var content = "";
  var siteName = $("#siteName").val();
  var b = $("#titleText").val();

  if (
    $(".focusItemTabs").html() == "" ||
    $(".focusItemTabs").html() == undefined
  ) {
    $(".cimm_itemdetail-imgcontainer span.imgForSend img").removeAttr("style");
    var itemImg = $(".cimm_itemdetail-imgcontainer span.imgForSend").html();
    var ProductName = $("#titleText").val();
    var PrintShrtDesc = $(".cimm_itemShortDesc").html();
    var custPartBlock = $("#custPartBlock").html();
  } else {
    var thisid = $(".focusItemTabs").attr("id");
    var test = thisid.split("_");
    var id = test[1];
    //$('#'+id).find('span.imgForSend img').removeAttr('style');
    var itemImg = $("#" + id)
      .find("span.imgForSend")
      .html();
    var ProductName = $(".focusItemTabs .productTitle").html();
    var PrintShrtDesc = $(".focusItemTabs .cimm_itemShortDesc").html();
    var custPartBlock = $("#custPartBlock").html();
  }
  var sitePartNo = $("#sitePartNo").html();
  var mPartNo = $("#mPartNo").html();
  var upcNo = $("#upcNo").html();
  var itemUom = $("#itemUom").html();
  var shipBranchNames = $("#shipBranchNames").html();
  var minOrdQty = $("#minOrdQty").html();
  var qtyInt = $("#qtyInt").html();
  var listPrices = $("#listPrices").html();
  var yourPrices = $("#yourPrices").html();
  var packDescs = $("#packDescs").html();
  var itemAvailable = $("#itemAvailable").html();
  var leadTimeLI = $("#leadTimeLI").html();

  var productModeList = $("#childItemTable_wrapper #childItemTable")
    .clone()
    .find("tr .removeForSend")
    .remove()
    .end()
    .html();
  //var titleDesc = "<div>";
  var titleDesc = "";
  var skuList = "<div style='font-size: 14px;'>";

  if (ProductName != "" && ProductName != undefined) {
    titleDesc =
      titleDesc + "<h2 style='color:#343333'>" + ProductName + "</h2>";
  }
  if (PrintShrtDesc != "" && PrintShrtDesc != undefined) {
    titleDesc = titleDesc + "<p>" + PrintShrtDesc + "</p>";
  }
  if (sitePartNo != "" && sitePartNo != undefined) {
    skuList = skuList + "<p>" + sitePartNo + "</p>";
  }
  if (mPartNo != "" && mPartNo != undefined) {
    skuList = skuList + "<p>" + mPartNo + "</p>";
  }
  if (custPartBlock != "" && custPartBlock != undefined) {
    var cpn = locale("product.label.customerpartnumber");
    skuList =
      skuList + "<p>" + cpn + ": <span>" + custPartBlock + "</span></p>";
  }
  if (upcNo != "" && upcNo != undefined) {
    skuList = skuList + "<p>" + upcNo + "</p>";
  }
  if (itemUom != "" && itemUom != undefined) {
    skuList = skuList + "<p>" + itemUom + "</p>";
  }
  if (shipBranchNames != "" && shipBranchNames != undefined) {
    skuList = skuList + "<p>" + shipBranchNames + "</p>";
  }
  if (minOrdQty != "" && minOrdQty != undefined) {
    skuList = skuList + "<p>" + minOrdQty + "</p>";
  }
  if (qtyInt != "" && qtyInt != undefined) {
    skuList = skuList + "<p>" + qtyInt + "</p>";
  }
  if (listPrices != "" && listPrices != undefined) {
    skuList = skuList + "<p>" + listPrices + "</p>";
  }
  if (yourPrices != "" && yourPrices != undefined) {
    skuList = skuList + "<p>" + yourPrices + "</p>";
  }
  if (packDescs != "" && packDescs != undefined) {
    skuList = skuList + "<p>" + packDescs + "</p>";
  }
  if (itemAvailable != "" && itemAvailable != undefined) {
    skuList = skuList + "<p>" + itemAvailable + "</p>";
  }
  if (leadTimeLI != "" && leadTimeLI != undefined) {
    skuList = skuList + "<p>" + leadTimeLI + "</p>";
  }
  if (productModeList == "" || productModeList == undefined) {
    productModeList = "";
  }

  //titleDesc = titleDesc+"</div>";
  skuList = skuList + "</div>";

  var itemDetailList =
    "<div class='cimm_itemdetail clearAfter'><div class='cimm_itemdetail-imgcontainer'>" +
    itemImg +
    "</div><div class='cimm_itemDescription clearAfter'>" +
    titleDesc +
    skuList +
    "</div></div>";
  var content;
  if ($('[data-type="descriptionSection"]').length > 0) {
    var Desc = $('[data-type="descriptionSection"]').html();
    var descEx = $("#descriptionSection").html();
    content =
      content +
      '<div class="ProdDetails" style="margin: 0px;background:none;"><div class="descript"><div class="descHead" style="background: #343333;padding: 7px;color:#fff;font-size: 16px;">' +
      Desc +
      '</div><div class="descBody" style="font-size:12px; padding: 5px;color:#565F65;border: 1px solid #CCC;margin-bottom:10px;">' +
      descEx +
      "<br /></div></div></div>";
  }
  if ($('[data-type="specificationSection"]').length > 0) {
    var Spec = $('[data-type="specificationSection"]').html();
    var specEx = $("#specificationSection").html();
    content =
      content +
      '<div class="ProdDetails" style="margin: 0px;background:none;"><div class="descript"><div class="descHead" style="background: #343333;padding: 7px;color:#fff;font-size: 16px;">' +
      Spec +
      '</div><div class="descBody" style="font-size:12px; padding: 5px;color:#565F65;border: 1px solid #CCC;margin-bottom:10px;">' +
      specEx +
      "<br /></div></div></div>";
  }
  if ($('[data-type="featureSection"]').length > 0) {
    var Feat = $('[data-type="featureSection"]').html();
    var featureEx = $("#featureSection").html();
    content =
      content +
      '<div class="ProdDetails" style="margin: 0px;background:none;"><div class="descript"><div class="descHead" style="background: #343333;padding: 7px;color:#fff;font-size: 16px;">' +
      Feat +
      '</div><div class="descBody" style="font-size:13px; padding: 5px;color:#565F65;border: 1px solid #CCC;margin-bottom:10px;">' +
      featureEx +
      "<br /></div></div></div>";
  }
  if ($('[data-type="documentsSection"]').length > 0) {
    var Guid = $('[data-type="documentsSection"]').html();
    var guidesEx = $("#documentsSection").html();
    var guidesEx = $(guidesEx)
      .clone()
      .find(".removeForSend")
      .remove()
      .end()
      .html();
    content =
      content +
      '<div class="ProdDetails" style="margin: 0px;background:none;"><div class="descript"><div class="descHead" style="background: #343333;padding: 7px;color:#fff;font-size: 16px;">' +
      Guid +
      '</div><div class="descBody" style="font-size:12px; padding: 5px;color:#565F65;border: 1px solid #CCC;margin-bottom:10px;">' +
      guidesEx +
      "<br /></div></div></div>";
  }
  if (content != "" && content != undefined) {
    content = content;
  } else if (productModeList != "" && productModeList != undefined) {
    var content =
      "<table style='width:100%;text-align: center;' cellspacing='0' cellpadding='0' class='table-bordered'>" +
      productModeList +
      "</table>";
  } else {
    content = "";
  }

  //build html for print page
  var html =
    itemDetailList +
    '<br /><div class="clear"></div><div class="contentPart">' +
    content +
    "</div>";

  localStorage.setItem("emailFriendItem", html);
  localStorage.setItem("emailFriendlink", location.href);
  localStorage.setItem("itemID", a);
  localStorage.setItem(
    "itemName",
    '<a href="' + window.location.pathname + '">' + b + "</a>"
  );
  location.href = "/SendThisPageLink.action";
}
/*End of Send Site Detail page*/
function doLogOffScript() {
  setCookie("loginMessage", "logout", 14);
  localStorage.removeItem("selectedItemsAOP");
  localStorage.removeItem("selectedItemsToGroup");
  //window.location.href="doLogOff.action";
  window.location.pathname = "doLogOff.action";
}
function closeLoginMessagePop() {
  setCookie("loginMessage", "login", 14);
  $("#welcomeMessage").hide();
}
function updateCustomField(obj) {
  var fieldName = $(obj).data("customfield");
  var fieldValueID = $(obj).data("customvalue");
  var fieldValue = "";
  if ($("#" + fieldValueID).is(":checked")) {
    fieldValue = "Y";
  } else {
    fieldValue = "N";
  }
  var dataString = "fieldName=" + fieldName + "&fieldValue=" + fieldValue;
  block();
  enqueue(
    "updateCustomFieldsUnit.action?" + dataString + "&dt=" + new Date(),
    function (data) {
      unBlock();
      if (data == "1") {
        bootAlert("small", "error", "Error", "Update Successfull");
      } else {
        bootAlert("small", "error", "Error", "Update Error. Please try again");
      }
    }
  );
}
function setFieldValues(obj) {
  var id = $(obj).attr("name").split("_")[0];
  var val = $(obj).val();
  $("#" + id).attr("value", val);
}
function sendProduct() {
  var path = window.location.hostname;
  var pathArray = window.location.pathname.split("/");
  var host = pathArray[1];
  var emailitem = localStorage.getItem("emailFriendItem");
  var emailitemMailBody = localStorage.getItem("emailFriendItemMailBody");
  var emailitemlink = localStorage.getItem("emailFriendlink");
  $("#prodName").append(localStorage.getItem("itemName"));
  var mailCon = "";
  if (emailitem != null) {
    $("#mailContent").html(emailitemMailBody);
    $("#mailContentDisplay").html(emailitem);
    $(".qty").remove();
    $(".addtbtn").attr("css", "");
    $(".addtbtn").attr("style", "margin-top:8px");
    $(".addtbtn a").attr(
      "style",
      "background:url(http://" +
        path +
        "/" +
        host +
        "/images/AddTBTN.png) no-repeat;height:21px;padding:3px 12px 8px 13px;font-weight:bold;text-decoration:none;	color:#FFF;cursor: default"
    );
    $("#enalargeImage").remove();
    $(".sub_img").remove();
    $(".reviewBtn").remove();
    $(".subbuttdons").remove();
    $("#mailContent input[type=hidden]").remove();
    if (mailCon == "") {
      if (emailitemMailBody != null && emailitemMailBody != "") {
        $("#mailBody").val(emailitemMailBody);
      } else {
        $("#mailBody").val(emailitem);
      }
    } else {
      $("#mailBody").val(mailCon);
    }

    $("#mailLink").val(emailitemlink);
    $(".cimm_itemdetail-imgcontainer img").width("100%");
  } else if (emailitem == null) {
    $("#SendItem").hide();
    $("#ErrorField").append(
      "Please <a onclick='history.go(-1);' href='javascript:void(0);'>Go Back</a> and select a Product to Send to your Friends/Associates"
    );
  }
}
function updateSearchBtn(obj) {
  var value = $("#orderCategory").val();
  if (
    value == "customerPoNumber" ||
    value == "partNumberToERP" ||
    value == "orderNumber"
  ) {
    $("#searchBtn").attr("data-id", value);
  } else {
    bootAlert("small", "error", "Error", "Please Select One Value");
  }
}
function validateShipFields() {
  var shipAddress1 = $("#shipAddressBlock #shipAddress1").val();
  var shipEmail = $("#shipAddressBlock #shipEmail").val();
  var shipCity = $("#shipAddressBlock #shipCity").val();
  var shipSate = $("#shipAddressBlock #stateSelectShip").val();
  var shipZipcode = $("#shipAddressBlock #shipZipcode").val();
  var shipCountry = $("#shipAddressBlock #countrySelectShip").val();
  var poNumber = $("#orderDetailsBlock #poNumber").val();
  var orderedBy = $("#orderDetailsBlock #orderedBy").val();
  var msg = "";

  if ($.trim(shipAddress1) == "") {
    msg = msg + "Please enter valid Ship Address.<br/>";
  }
  if ($.trim(shipEmail) == "") {
    msg = msg + "Please enter valid Ship Email.<br/>";
  }
  if ($.trim(shipCity) == "") {
    msg = msg + "Please enter valid Ship City.<br/>";
  }
  if ($.trim(shipSate) == "") {
    msg = msg + "Please enter valid Ship State.<br/>";
  }
  if ($.trim(shipZipcode) == "") {
    msg = msg + "Please enter valid Ship Zip / Postal code.<br/>";
  }
  if ($.trim(shipCountry) == "") {
    msg = msg + "Please enter valid Ship Country.<br/>";
  }
  if ($.trim(poNumber) == "") {
    msg = msg + "Please enter Purchase Order Number.<br/>";
  }
  if ($.trim(orderedBy) == "") {
    msg = msg + "Please enter Order By Value.<br/>";
  }

  if (msg != "") {
    jAlert(msg);
    return false;
  } else {
    return true;
  }
}
function paginationScriptV2(n_pages, page_link, iindex, pgno) {
  var n_links = 5;
  var returnString = "";
  //page_link = page_link.replace(/[%]/g,"%25");
  var s_fileName = page_link;
  pageno = pgno;
  n_index = iindex / pageno + 1;
  var jump = n_pages / 5;
  var mod = n_pages % 5;
  var skipstep = parseInt(jump);
  if (mod > 0) {
    skipstep = skipstep + 1;
  }
  var start = 1;
  var ss = n_index / n_links;
  var change = parseInt(ss);
  if (n_index % n_links > 0) {
    change = change + 1;
  }
  n_links = n_links * change;
  start = n_links - 5 + 1;
  var prevpage = pageno * 5 * (change - 2);
  var pagenumber = 0;
  //document.write('<div class="pagebarUTH">');
  returnString += '<div class="pagebarUTH">';
  if (n_index >= 6)
    returnString += '<a href="' + page_link + prevpage + '">Previous</a>\n';
  //document.write('<a href="'+page_link+prevpage+'">Previous</a>\n');

  if (n_links) {
    var n_sideLinks = 1,
      n_firstLink,
      n_lastLink;
    if (n_index >= n_pages) {
      n_firstLink = start;
      n_lastLink = n_pages;
    } else if (n_index <= 0) {
      n_firstLink = start;
      n_lastLink = 5;
    } else {
      n_firstLink = start;
      if (n_links > n_pages) n_lastLink = n_pages;
      else n_lastLink = n_firstLink + 5 - 1;
    }
    for (var i = n_firstLink; i <= n_lastLink; i++) {
      pagenumber = i * pageno - pageno;
      if (i == n_index) {
        var nexpage = pagenumber + pageno;
        nexpage = pageno * n_lastLink;
      }
      returnString +=
        i == n_index
          ? '<span class="this-page">' + i + "</span>\n"
          : '<a href="' +
            page_link +
            pagenumber +
            '" title="Go to page ' +
            i +
            '">' +
            i +
            "</a>\n";
      //document.write(i==(n_index)?'<span class="this-page">'+i+'</span>\n':'<a href="'+page_link+pagenumber+'" title="Go to page '+i+'">'+i+'</a>\n');
    }
  }

  if (n_lastLink != n_pages)
    returnString += '<a href="' + page_link + nexpage + '">Next</a>';
  //document.write('<a href="'+page_link+nexpage+'">Next</a><span class="total" style="background:none;margin-left:2px;border-radius: 3px 3px 0px 0px;padding: 2px 2px 2px 0px;"> of '+n_pages+'</span>');

  returnString += "  </div>";
  //document.write('  </div>');
  return returnString;
}
function updateCart(val) {
  var value = $(val).val();
  value = value.trim();
  qtyVal = $(val).attr("data-itemId");
  if (value == "0" || value == "") {
    bootAlert("small", "error", "Error", "Invalid qty");
    qty = $(val)
      .parent()
      .find("#itemQty_" + qtyVal)
      .val();
    $(val).val(qty);
  }
}
/**** Load More Syn Code ****/
var processing = false;
var pageNo = 1;
function loadNextPageAsync(pageLink, resultPerPage, checkmodevalue) {
  var totalPages = parseInt($("#totalPages").val());
  if (totalPages > 1) {
    var fromDetailPageLoad = getCookie("fromDetailPageLoad");
    if (
      fromDetailPageLoad != null &&
      fromDetailPageLoad == "fromDetailPageLoad"
    ) {
      pageNo = 1;
      setCookie("fromDetailPageLoad", "", -1);
    }
    ++pageNo;
    var pageNoTemp = parseInt($("[name='pageNo']").val());
    if (
      fromDetailPageLoad != null &&
      fromDetailPageLoad == "fromDetailPageLoad"
    ) {
      pageNoTemp = 0;
    }
    var resultCount = parseInt($("#resultCount").val());

    if (pageNo <= totalPages) {
      processing = true;
      pageNoTemp = pageNoTemp + resultPerPage;
      $("[name='pageNo']").each(function () {
        $(this).val(pageNoTemp);
      });
      $("ul.newPageScrolled").each(function () {
        $(this).addClass(checkmodevalue);
      });
      $("#loadingNextPage").show();
      $('input:hidden[name="idListPrice"]').attr("name", "idListPrice1");
      $(".availnew").attr("data-select", "availabilitynew");
      $.post(
        "/" + pageLink + pageNoTemp + "&reqType=loadPage",
        'html=<div class="loadedcontent">new div</div>',
        function (data) {
          $(".listGridContainer").append(data);
          $("#loadMoreBtn").html("Load More");
          priceLoadMainFunction();
          processing = false;
          if (checkmodevalue == "gridView") {
            $("li.newPageScrolled").each(function () {
              $(this)
                .removeClass("newPageScrolled listView")
                .addClass(checkmodevalue);
            });
          } else {
            $("li.newPageScrolled").each(function () {
              $(this)
                .removeClass("newPageScrolled gridView")
                .addClass(checkmodevalue);
            });
          }
        }
      );
    } else {
      $("#loadingNextPage").html("That's it! No more items to display.");
    }
  }
}
/**** Load More Syn Code end****/

function changeLanguage(obj) {
  //bootAlert("small","error","Error","You want to delete the item from cart?");
  var fieldValueID = $(obj).val();
  var fieldValue = obj.selectedOptions.languageSelected.text;
  /*if($('#'+fieldValueID).is(":checked")){
		fieldValue = "Y";
	}else{
		fieldValue = "N";
	}*/
  var dataString = "registerType=" + fieldValueID + "_" + fieldValue;
  //var dataString = "registerType="+fieldValueID;
  block();
  $('select[name^="langauage"] option[value="' + fieldValue + '"]').attr(
    "selected",
    "true"
  );
  unBlock();
  enqueue("changeLanguageUnit.action?" + dataString, function (data) {
    unBlock();
    //$('select[name^="langauage"] option[value="'+$("#languageSelected").val()+'"]').attr("selected","selected")
    window.location.reload();
  });
}

/*-----------------PIWIK Analytics------------------------*/
//PIWIK Tracking Code should be placed in Header Page
var piwik = {
  /*   addEcommerceItemPiwik() method will add cart items and items added to cart to PIWIK   */
  addEcommerceItemPiwik: function (
    partNumber,
    productName,
    categoryName,
    unitPrice,
    qty
  ) {
    console.log("Inside addEcommerceItemPiwik() ");
    console.log("part number : " + partNumber);
    _paq.push([
      "addEcommerceItem",
      partNumber, // (required) SKU: Product unique identifier
      productName, // (optional) Product name
      [categoryName], // (optional) Product category, string or array of up to 5 categories
      unitPrice, // (recommended) Product price
      qty, // (optional, default to 1) Product quantity
    ]);
  },
  /*   trackEcommerceCartUpdatePiwik() method will keep track of the cart total and submit to the PIWIK   */
  trackEcommerceCartUpdatePiwik: function (cartTotal) {
    console.log(" Inside trackEcommerceCartUpdatePiwik()");
    console.log("cart total : " + cartTotal);
    _paq.push(["trackEcommerceCartUpdate", cartTotal]); // (required) Cart amount
    _paq.push(["trackPageView"]);
  },
  /*   trackEcommerceOrderPiwik() method will keep track of the order Details collected from Order Confirmation and submit to the PIWIK   */
  trackEcommerceOrderPiwik: function (
    orderId,
    orderGrandTotal,
    orderSubTotal,
    taxAmount,
    shippingCharge,
    discountOffered
  ) {
    console.log("Inside trackEcommerceOrderPiwik() ");
    console.log("orderId : " + orderId);
    // Specifiy the order details to Piwik server &amp; sends the data to Piwik server
    console.log("orderGrandTotal : " + orderGrandTotal);
    _paq.push([
      "trackEcommerceOrder",
      orderId, // (required) Unique Order ID
      orderGrandTotal, // (required) Order Revenue grand total (includes tax, shipping, and subtracted discount)
      orderSubTotal, // (optional) Order sub total (excludes shipping)
      taxAmount, // (optional) Tax amount
      shippingCharge, // (optional) Shipping amount
      false, // (optional) Discount offered (set to false for unspecified parameter)
    ]);

    // we recommend to leave the call to trackPageView() on the Order confirmation page
    //_paq.push(['trackPageView']);
  },
  /*   setEcommercePageViewPiwik() method will keep track of product Details collected from Product Detail page and submit to the PIWIK   */
  setEcommercePageViewPiwik: function (
    partNumber,
    productName,
    categoryName,
    unitPrice
  ) {
    console.log("Inside setEcommercePageViewPiwik() ");
    console.log("partNumber : " + partNumber);
    _paq.push([
      "setEcommerceView",
      partNumber, // (required) SKU: Product unique identifier
      productName, // (optional) Product name
      categoryName, // (optional) Product category, or array of up to 5 categories
      unitPrice, // (optional) Product Price as displayed on the page
    ]);
    _paq.push(["trackPageView"]);
  },
  /*   setEcommerceCategoryViewPiwik() method will keep track of viewed category Details collected from category  page and submit to the PIWIK   */
  setEcommerceCategoryViewPiwik: function (categoryName) {
    console.log("Inside setEcommerceCategoryViewPiwik() ");
    console.log(this);
    // on a category page, productSKU and productName are not applicable and are set to false
    _paq.push([
      "setEcommerceView",
      (productSku = false), // No product on Category page
      (productName = false), // No product on Category page
      (category = categoryName), // Category Page, or array of up to 5 categories
    ]);
    _paq.push(["trackPageView"]);
  },
  /*   populateOnCategoryPage() fetches current category and submit it to setEcommerceCategoryViewPiwik() further to the PIWIK   */
  populateOnCategoryPage: function () {
    var breadCrumList = $(".cimm_breadcrumbs li:not(:first-child)");
    var currentCategoryTitle = breadCrumList.context.title;
    var currentCategoryTitleArr = currentCategoryTitle.split("|");
    console.log("before currentCategoryTitleArr.pop();");
    console.log(currentCategoryTitleArr);
    currentCategoryTitleArr.pop();
    console.log("before currentCategoryTitleArr.pop();");
    console.log(currentCategoryTitleArr);
    this.setEcommerceCategoryViewPiwik(currentCategoryTitleArr);
  },
  /*this function will push no of results per keyword*/
  /* trackSearchResultsCount : function(keyword, searchCount){
                console.log("piwik - trackSearchResultsCount()")
                _paq.push(['trackSiteSearch',keyword,false,searchCount]);

        },

        trackSearchNoResultsCount : function(keyword, searchCount){
                var searchCount = 0;
                var pageUrl = document.URL + "--##";
                _paq.push(['setCustomUrl', pageUrl + '&search_count=' + searchCount]);
                //_paq.push(['trackPageView']);
        }*/
};
/*-----------------PIWIK Analytics------------------------*/
function validateProductSearch() {
  document.getElementById("searchkeyWord").value = document.getElementById(
    "searchKey"
  ).value;
  var text = document.getElementById("searchkeyWord");
  var s = text.value;
  if (s != undefined && s != "") {
    s = $.trim(s);
    s = s.replace(/</g, "<&nbsp;");
    s = s.replace("\u00AE", "&reg;");
    //s = escape(s);
    //s = s.replace(/#/g, "%23");
    //s = s.replace(/&/g, "%26");
    //s = s.replace(/;/g, "%3B");
    //s = s.replace(/\?/g,"%3F");
    //s = s.replace(/=/g,"%3D");
    //s = s.replace(/@/g,"%40");
    s = s.replace("*", "");
    s = s.replace(
      /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
      ""
    );
    s = replaceNonAscii(s);
  }
  if (text.value == "") {
    bootAlert("small", "error", "Error", "Enter keyword for search");
  } else if (
    s.toLowerCase().indexOf("%3c%26nbsp%3bscript%3e") > -1 ||
    s.toLowerCase().indexOf("%3c%26nbsp%3b/script%3e") > -1
  ) {
    bootAlert(
      "medium",
      "error",
      "Error",
      "ERR_BLOCKED_BY_XSS_AUDITOR : Detected unusual code on this page and blocked it to protect your personal information (for example, passwords, phone numbers, and credit cards)."
    );
    return false;
  } else {
    $("#searchkeyWord").val(s);
    $("#productSearchForm").submit();
    return false;
  }
}

var userLogin = $("#userLogin").val();
if (userLogin == "true") {
  var isShipToSelected = getCookie("isShipToSelected");
  if ($("#isPunchoutUser").length > 0 && $("#isPunchoutUser").val() == "Y") {
    if (
      $("#shipAddressForPunchoutUser").length > 0 &&
      $("#shipAddressForPunchoutUser").val() == "Y"
    ) {
      if (isShipToSelected != "true") {
        loadShippingInfo();
      }
    } else {
      setCookie("isShipToSelected", true);
    }
  } else {
    if (isShipToSelected != "true") {
      var value = getCookie("afterLoginUrl");
      if (typeof value == "undefined" || value == null || value == "") {
        var afterLoginUrl = window.location.href;
        var previousPageUrl = document.referrer;
        var currentLayout = $("#layoutName").val();
        if (
          typeof currentLayout != "undefined" &&
          currentLayout != null &&
          currentLayout.toLowerCase().indexOf("loginpage") > -1
        ) {
          if (
            typeof previousPageUrl != "undefined" &&
            previousPageUrl != "" &&
            previousPageUrl.toLowerCase().indexOf("register") <= -1 &&
            previousPageUrl.toLowerCase().indexOf("forgot") <= -1 &&
            previousPageUrl.toLowerCase().indexOf("login") <= -1 &&
            previousPageUrl.toLowerCase().indexOf("afp") <= -1 &&
            previousPageUrl.toLowerCase().indexOf("dfp") <= -1
          ) {
            setCookie("afterLoginUrl", previousPageUrl, 7);
          } else {
            setCookie("afterLoginUrl", "");
          }
        } else {
          if (
            afterLoginUrl != "" &&
            afterLoginUrl.toLowerCase().indexOf("register") <= -1 &&
            afterLoginUrl.toLowerCase().indexOf("forgot") <= -1 &&
            afterLoginUrl.toLowerCase().indexOf("login") <= -1 &&
            afterLoginUrl.toLowerCase().indexOf("afp") <= -1 &&
            afterLoginUrl.toLowerCase().indexOf("dfp") <= -1
          ) {
            setCookie("afterLoginUrl", afterLoginUrl, 7);
          } else {
            setCookie("afterLoginUrl", "");
          }
        }
      }
      loadShippingInfo();
    }
  }
}
function performBulkAction(obj) {
  var action = $(obj).find(":selected").attr("data-perform");
  if (action == "multipleProductGroup") {
    BulkAction.loadMyProductGroupData();
  } else if (action == "multipleAddToCart") {
    BulkAction.addToCartCookie();
  }
  $("#bulkAction").val("");
  $("#bulkAction").selectpicker("refresh");
}
function commaSeparateNumber(val) {
  while (/(\d+)(\d{3})/.test(val.toString())) {
    val = val.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
  }
  return val;
}
var triggerToolTip = function () {
  var options = {
    placement: function (context, element) {
      var position = $(element).position();
      if (position.top - $(window).scrollTop() < 110) {
        return "bottom";
      }
      return "top";
    },
    trigger: "hover",
  };
  $('[data-toggle="tooltip"]').tooltip(options);
};
function goBack() {
  window.history.back();
}
function runScript(e) {
  if (e.keyCode == 13) {
    if (e.target.id == "txtSearch") {
      $("#performSearchBtn").click();
    } else if (e.target.id == "orderHistorySearchBox") {
      $("#searchBtn").click();
    } else if (e.target.id == "groupSearchKey") {
      $("#searchBtn").click();
    } else if (e.target.id == "password" || e.target.id == "confirmPassword") {
      $("#searchBtn").click();
    } else if (e.target.id == "txtAdvSearch") {
      $("#advSrchBtn").click();
    } else if (e.target.id == "narrowText") {
      $("#nSearchBtn").click();
    } else if (e.target.id == "popkeyword") {
      $("#popLoginBtn").click();
    }
    return false;
  }
}
function eachCheckBox(chk) {
  var chkName = chk.name;
  var allChecked =
    $("input:checkbox[name='" + chkName + "']:checked").length ===
    $("input:checkbox[name='" + chkName + "']").length;
  $("#chkSelectall, .deviceSelectAllChkBox").prop("checked", allChecked);
}
//------------------------------------footer dependent sources----------------------------------------
var footer_icon_plus = "fa-plus";
var footer_icon_minus = "fa-minus";
$(".footerCol h3 em").click(function () {
  if ($(this).parents(".footerCol").find("ul").hasClass("in")) {
    $(this).addClass(footer_icon_plus).removeClass(footer_icon_minus);
  } else {
    $(this).addClass(footer_icon_minus).removeClass(footer_icon_plus);
  }
});
function toDoFooter() {
  if ($(document).width() < 981) {
    $(".footerCol h3 em").show();
    $(".footerCol ul").removeClass("in");
  } else if ($(document).width() >= 981) {
    $(".footerCol h3 em").hide();
    $(".footerCol ul").addClass("in");
  }
}
$(window).resize(function () {
  toDoFooter();
});
var formatPrice = function () {
  if ($(".formatPrice").length > 0) {
    $(".formatPrice").each(function () {
      var e = $(this).text().trim();
      var result = e.match(/\d+/g);
      var finalResult = e;
      if (result != null && result.length > 0) {
        finalResult = result[0];
        finalResult = "$" + commaSeparateNumber(finalResult);
        if (result.length > 1) {
          finalResult = finalResult + "." + result[1];
        }
        $(this).text(finalResult);
      }
    });
  }
};
function hideForDevice() {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    $(".hideForDevice").hide();
  }
}
function textbox() {
  $(
    ".cimm_formContent input[type=text],.cimm_formContent input[type=password]"
  ).each(function () {
    var text_value = $(this).val();
    if (text_value != "") {
      $(this).parent().find("label").addClass("label-select");
    } else {
      $(this).parent().find("label").removeClass("label-select");
    }
  });
  $(".cimm_formContent select").each(function () {
    var text_value = $(this).val();
    if (text_value != "" || text_value != " ") {
      $(this).parent().find("label").addClass("label-select");
    } else {
      $(this).parent().find("label").removeClass("label-select");
    }
  });

  var textValue = $(".cimm_searchWrapper input[type=text]").val();
  if (textValue != "" && textValue != " Enter Keyword or Part Number ") {
    $(".cimm_searchWrapper").find("label").addClass("label-select");
  } else {
    $(".cimm_searchWrapper").find("label").removeClass("label-select");
  }
}

$(".year").html(new Date().getFullYear());

var $ripple = $(".light-ripple");
$ripple.on("click", function (e) {
  var parentOffset = $(this).offset(),
    x = e.pageX - parentOffset.left,
    y = e.pageY - parentOffset.top,
    $this = $(this);
  $this.append("<div class='lRipple'></div>");
  var $ripple = $this.find(".lRipple");
  $ripple.removeClass("animate");
  $ripple
    .css({
      top: y,
      left: x,
    })
    .addClass("animate");
});
$ripple.on(
  "animationend webkitAnimationEnd oanimationend MSAnimationEnd mouseleave",
  function (e) {
    $(this).find(".lRipple").remove();
  }
);
var $dRipple = $(".dark-ripple");
$dRipple.on("click", function (e) {
  var parentOffset = $(this).offset(),
    x = e.pageX - parentOffset.left,
    y = e.pageY - parentOffset.top,
    $this = $(this);
  $this.append("<div class='dRipple'></div>");
  var $dRipple = $this.find(".dRipple");
  $dRipple.removeClass("animate");
  $dRipple
    .css({
      top: y,
      left: x,
    })
    .addClass("animate");
});
$dRipple.on(
  "animationend webkitAnimationEnd oanimationend MSAnimationEnd mouseleave",
  function (e) {
    $(this).find(".dRipple").remove();
  }
);

function formatPhoneVal() {
  $(".formatPhoneVal").val(function (i, text) {
    text = text.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "$1-$2-$3");
    return text;
  });
}
$(function () {
  toDoFooter();
  formatPrice();
  formatPhoneVal();
  triggerToolTip();
  hideBulkAction();
  leftFilterScroll();
  setTimeout(function () {
    $("#filterBar .chosen-container .chosen-single span").attr(
      "onchange",
      "changeAdvSearchLeftMenu()"
    );
    changeAdvSearchLeftMenu();
  }, 3500);
  //------------------------------------navigation dependent sources-----------------------------------------
  //-- For Brands
  var size = 10,
    ul = jQuery("ul.breakColumn"),
    lis = ul.children().filter(":gt(" + (size - 1) + ")"),
    loop = Math.ceil(lis.length / size),
    i = 0;
  ul.css("float", "left").wrap("<div style='overflow: hidden'></div>");
  for (; i < loop; i = i + 1) {
    ul = jQuery("<ul />")
      .css("float", "left")
      .append(lis.slice(i * size, i * size + 10))
      .insertAfter(ul);
  }
  //-- For Brands
  //-- For Manufacturer
  var sizeMfr = 10,
    ulMfr = jQuery("ul.breakColumnManufacturer"),
    lisMfr = ulMfr.children().filter(":gt(" + (sizeMfr - 1) + ")"),
    loopMfr = Math.ceil(lisMfr.length / sizeMfr),
    ii = 0;
  ulMfr.css("float", "left").wrap("<div style='overflow: hidden'></div>");
  for (; ii < loopMfr; ii = ii + 1) {
    ulMfr = jQuery("<ul />")
      .css("float", "left")
      .append(lisMfr.slice(ii * sizeMfr, ii * sizeMfr + 10))
      .insertAfter(ulMfr);
  }
  //-- For Manufacturer
  $(".recentNews .customScroll, .upcomingEvent .customScroll").slimScroll({
    color: "#565F65",
    size: "7px",
    height: "200px",
    alwaysVisible: true,
    opacity: "0.8",
  });

  if ($(".formatPhoneNumber").length > 0) {
    $(".formatPhoneNumber").each(function () {
      $(this).attr("maxlength", "12");
    });

    $(".formatPhoneNumber").keyup(function (e) {
      if (e.keyCode != 8) {
        var curchr = this.value.length;
        var curval = $(this).val();
        if (curchr == 3) {
          $(this).val(curval + "-");
        } else if (curchr == 7) {
          $(this).val(curval + "-");
        }
      }
    });
  }

  if ($(".formatZipCode").length > 0) {
    $(".formatZipCode").each(function () {
      $(this).attr("maxlength", "10");
    });

    $(".formatZipCode").keyup(function (e) {
      if (e.keyCode != 8) {
        var curchr = this.value.length;
        var curval = $(this).val();
        if (curchr == 5) {
          $(this).val(curval + "-");
        }
      }
    });
  }
  $(".formatPhoneText").text(function (i, text) {
    text = text.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "$1-$2-$3");
    return text;
  });

  $(".formatZipCodeText").text(function (i, text) {
    text = text.replace(/(\d\d\d\d\d)(\d\d\d\d)/, "$1-$2");
    return text;
  });

  $(".formatZipCode").val(function (i, val) {
    val = val.replace(/(\d\d\d\d\d)(\d\d\d\d)/, "$1-$2");
    return val;
  });

  $(".quantity").attr("maxlength", "4");

  $(".customCheckBox2 .selectedItems").mousedown(function () {
    $(".cimm_addcartSlider").addClass("cimm_addcartSliderShake");
  });

  $(".customCheckBox2 .selectedItems").mouseup(function () {
    $(".cimm_addcartSlider").removeClass("cimm_addcartSliderShake");
  });

  //***************************backToTop****************************
  $("#backToTop").hide();
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $("#backToTop").fadeIn();
    } else {
      $("#backToTop").fadeOut();
    }
  });
  $("#backToTop a").click(function () {
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      800
    );
    return false;
  });

  //***************************textbox label****************************
  $("ul.cimm_formContent li label, .cimm_searchWrapper label").on(
    "click",
    function () {
      $(this).parent().find("input").focus();
    }
  );
  setTimeout(function () {
    textbox();
  }, 1000);
  triggerText = function textbox() {
    $(
      ".cimm_formContent input[type=text],.cimm_formContent input[type=password]"
    ).each(function () {
      var text_value = $(this).val();
      if (text_value != "") {
        $(this).parent().find("label").addClass("label-select");
      } else {
        $(this).parent().find("label").removeClass("label-select");
      }
    });
    $(".cimm_formContent textarea").each(function () {
      var text_value = $(this).val();
      if (text_value != "") {
        $(this).parent().find("label").addClass("label-select");
      } else {
        $(this).parent().find("label").removeClass("label-select");
      }
    });
    $(".cimm_caroWrap li.slick-slide").wrapInner(
      "<div class='cimm_caroImgDespWrap'></div>"
    );
  };
  $("input").focus(function () {
    var text_value = $(this).val();
    if (text_value != "") {
      $(this).parent().find("label").addClass("label-select");
    }
  });
  $("input").blur(function () {
    var text_value = $(this).val();
    if (text_value != "") {
      $(this).parent().find("label").addClass("label-select");
    } else {
      $(this).parent().find("label").removeClass("label-select");
    }
  });
  $("textarea").blur(function () {
    var text_value = $(this).val();
    if (text_value != "") {
      $(this).parent().find("label").addClass("label-select");
    } else {
      $(this).parent().find("label").removeClass("label-select");
    }
  });
  $(".customCheckBox2,.customCheckBox,.customRadioBtn").append("<b></b>");
  $(".customCheckBox2,.customCheckBox,.customRadioBtn").mousedown(function () {
    $(this).find("b").addClass("ripple");
  });
  $(".customCheckBox2,.customCheckBox,.customRadioBtn").mouseup(function () {
    $(this).find("b").removeClass("ripple");
  });
  $("#loginPopDiv [tabindex= 6]").on("keydown", function (e) {
    if (e.keyCode == 9 && e.shiftKey == false) {
      e.preventDefault();
      $("#loginPopDiv [tabindex=1]").focus();
    }
  });
});
function closeSlide() {
  //jQuery('.sleekNavigationLinks').css('left', '-450px');
  jQuery("#mobileNavigationTrigger,nav.navbar").removeClass("active");
  jQuery("#overlay").fadeOut();
  $("html, body").removeClass("poppupEnabled");
}
function openSlide() {
  //jQuery('.sleekNavigationLinks').css('left', '0');
  jQuery("#mobileNavigationTrigger,nav.navbar").addClass("active");
  jQuery("#overlay").fadeIn();
  //jQuery('.first').removeClass("moveRight, moveLeft");
  //jQuery('.sec, .third, .last').removeClass("moveRight, moveLeft").addClass("moveRight");
  $("html, body").addClass("poppupEnabled");
}
jQuery("#mobileNavigationTrigger").click(function () {
  if (jQuery(this).hasClass("active")) {
    closeSlide();
  } else {
    openSlide();
  }
});
jQuery("#overlay").click(function () {
  closeSlide();
});
/*jQuery('.sleekNavigationLinks').click(function(e) {
	e.stopPropagation();
});*/
$(".cimm_slide li em").click(function () {
  var id = $(this).attr("id");
  if (id) {
    $("[data-itemID=" + id + "]").removeClass("moveRight");
    if ($(this).parents().hasClass("first")) {
      $("#slideIcon span").addClass("active");
      $(".first").addClass("moveLeft");
    } else if ($(this).parents().hasClass("sec")) {
      if (!$(".sec").hasClass("moveRight")) $(".sec").addClass("moveLeft");
    } else if ($(this).parents().hasClass("third")) {
      if (!$(".third").hasClass("moveRight")) $(".third").addClass("moveLeft");
    }
  }
});
$(".navbar-nav li em").click(function () {
  var heading = $(this).parent().text().trim();
  var parentLi = $(this).parent().parent();
  var getSlideMenu = "";
  if (parentLi.hasClass("sec")) {
    getSlideMenu = parentLi.find(".dropdown-menu")[0];
    $(this).parent().parent().find(".nav_headingBlock").remove();
  } else if (parentLi.hasClass("third")) {
    getSlideMenu = parentLi.find(".dropdown-menu")[0];
    $(this).parent().parent().find(".nav_headingBlock").remove();
  } else {
    getSlideMenu = parentLi.find(".dropdown-menu")[0];
    $(this)
      .parents(".navbar-nav")
      .find(".dropdown-menu")
      .removeClass("slideDropMenu");
    $(this).parents(".navbar-nav").find(".nav_headingBlock").remove();
  }

  if (getSlideMenu.nodeName == "UL") {
    $(getSlideMenu).prepend(
      '<li class="nav_headingBlock"><i class="fa fa-lg fa-chevron-left"></i>' +
        heading +
        "</li>"
    );
  } else {
    $(getSlideMenu).prepend(
      '<p class="nav_headingBlock"><i class="fa fa-lg fa-chevron-left"></i>' +
        heading +
        "</p>"
    );
  }
  $(getSlideMenu).addClass("slideDropMenu");
});
$(".dropdown-menu").on("click", ".nav_headingBlock", function () {
  $(this).parent().removeClass("slideDropMenu");
});

$(".cimm_slide h2").click(function () {
  if (!$(this).parent().hasClass("first")) {
    $(this).parent().addClass("moveRight").removeClass("moveLeft");
  }
  if ($(this).parent().hasClass("sec")) {
    $("#slideIcon span").removeClass("active");
    $(".first").removeClass("moveLeft");
  } else if ($(this).parent().hasClass("third")) {
    $(".sec").removeClass("moveLeft");
  } else if ($(this).parent().hasClass("last")) {
    $(".third").removeClass("moveLeft");
  } else if ($(this).parent().hasClass("first")) {
    closeSlide();
  }
});

$(".dropdown").on("show.bs.dropdown", function (e) {
  $(this).find(".dropdown-menu").first().stop(true, true).fadeIn(300);
});

$(".dropdown").on("hide.bs.dropdown", function (e) {
  $(this).find(".dropdown-menu").first().stop(true, true).fadeOut(300);
});

if ($("#enableHeaderQuickOderLink").val() == "Y") {
  $(document).ready(function () {
    $(".cartHead a").click(function (e) {
      e.preventDefault();
      $(".cartHead a").removeClass("active");
      $(this).addClass("active");
      var selectedHash = $(this)[0].hash;
      $(".cartBody>div").fadeOut();
      $(".cartBody>div" + selectedHash).fadeIn();
    });
  });

  $(document).on("click", function (event) {
    if (!$(event.target).closest("#quickOrderPadDrop,.hideMe").length)
      unLoader();
  });

  $(document).on("keydown", function (e) {
    if (e.keyCode === 27) unLoader();
  });

  function unLoader() {
    $(".quickCartContainer").fadeOut();
    $(".modalPopOverlay").hide();
    $(".cimm_navigationBar ul > li > a").removeClass("active");
  }
}
if (
  $("#enableStickyHeader").val() == "Y" &&
  $("#layoutName").val() != "CMSStaticPage"
) {
  $(window).resize(function () {
    var width = $(window).innerWidth();
    if (width < 980) {
      $("#normalHead").height("");
    }
  });
  $(function () {
    var clonePrice = $("#yourPrices").html();
    $("#clonePrice").html(clonePrice);

    $("[data-cloneqty='cloneQty']").keyup(function () {
      $("[data-originalqty='originalQty']").val($(this).val());
    });
    $("[data-originalqty='originalQty']").keyup(function () {
      $("[data-cloneqty='cloneQty']").val($(this).val());
    });

    var addToCart = $("[data-oAddCartBtn='originalAddtoCartbtn'] > a");

    $("[data-cAddCartBtn='cloneAddtoCartbtn']").on("click", function () {
      $(addToCart).trigger("click");
    });

    $("[data-cloneqty='cloneQty']").val(
      $("[data-originalqty='originalQty']").val()
    );
  });
  $(window).scroll(function () {
    var width = $(window).innerWidth();
    if (width > 980) {
      var height = $("#normalHead").height();
      $("#normalHead").height(height);
      var bodyScroll = $(this).scrollTop();
      var headHeight = $("#normalHead").height();
      var fixedHead = $("#fixedHead").html();

      if (bodyScroll >= headHeight) {
        if (fixedHead == "") {
          head = $("header").detach();
          nav = $("nav").detach();
          head.appendTo("#fixedHead");
          nav.appendTo("#fixedHead");
          detail = $("#detailClone").detach();
          detail.appendTo("#fixedHead");
          $("#fixedHead").css({ top: "0" });
        }
      } else {
        if (fixedHead != "") {
          setTimeout(function () {
            head = $("header").detach();
            nav = $("nav").detach();
            head.appendTo("#normalHead");
            nav.appendTo("#normalHead");
            detail = $("#detailClone").detach();
            detail.appendTo(".detailCloneWrap");
            $("#fixedHead").css({ top: "-" + headHeight + "px" });
          }, 300);
        }
      }
    }
  });
}
if (
  navigator.appVersion.indexOf("MSIE 7") != -1 ||
  document.documentMode == 7
) {
  bootAlert(
    "medium",
    "error",
    "Error",
    "Website is not supported in IE7 browser.  Kindly upgrade to a newer version of Internet Explorer."
  );
}
var blockModal = "";
function block(msg) {
  blockModal = bootbox.dialog({
    message:
      '<div class="text-center"><h3 class="cimm_block-title"><em class="fa fa-spin fa-spinner"></em> ' +
      msg +
      "...</h3></div>",
    closeButton: false,
  });
}
function unblock() {
  if (blockModal) {
    blockModal.modal("hide");
  }
}
function hideBulkAction() {
  if ($("input[type=checkbox].selectedItems").length > 0) {
    $(".bulkActionBtn").show();
  } else {
    $(".bulkActionBtn").hide();
  }
}

function sendPageContent(id) {
  var content = "";
  var siteName = $("#siteName").val();
  var sendHtml = $("#" + id).html();
  localStorage.setItem("emailFriendItem", sendHtml);
  localStorage.setItem("emailFriendlink", location.href);
  location.href = "/SendPageLink.action";
}
function validatePcardFormWithNewIds() {
  var cardHolder = $.trim($("#cardHolderNewID").val());
  var cardAddress = $.trim($("#cardAddressNewID").val());
  var postalCode = $.trim($("#postalCodeNewID").val());
  var nickName = $.trim($("#nickNameNewID").val());
  var email = $.trim($("#emailNewID").val());
  var isValid = 1;
  var error = "";
  if (cardHolder == "") {
    error += "Please Enter Card Holder Name.<br/>";
    isValid = 0;
  }
  if (cardAddress == "") {
    error += "Please Enter Street Address.<br/>";
    isValid = 0;
  }
  if (postalCode == "") {
    error += "Please Enter Postal Code.<br/>";
    isValid = 0;
  }
  if (nickName == "") {
    error += "Please Enter Nick Name.";
    isValid = 0;
  }
  if (isValid == 0) {
    showNotificationDiv("error", error);
    return false;
  } else {
    return true;
  }
}

$(".overlay").click(function () {
  $(this).hide();
  $(".assignedStaticPageWrap").height("auto");
  $(".recal_overlay").parent().show();
});
$(".recal_overlay").click(function () {
  $(this).parent().hide();
  $(".assignedStaticPageWrap").height(210);
  $(".overlay").show();
});

function homeCarousels() {
  if ($(".featuredProductList").length > 0) {
    if ($(".featuredProductList").hasClass("slick-initialized")) {
      $(".featuredProductList").slick("unslick");
    }
    $(".featuredProductList").slick({
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      pauseOnHover: true,
      responsive: [
        {
          breakpoint: 1030,
          settings: {
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 770,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 400,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    });
  }
  if (
    $("#featuredProductGroupSize").length > 0 &&
    parseInt($("#featuredProductGroupSize").val()) > 0
  ) {
    var featuredProductGroupSizeIndex = parseInt(
      $("#featuredProductGroupSize").val()
    );
    for (i = 0; i < featuredProductGroupSizeIndex; i++) {
      if ($(".featuredProductGroupList_" + i).length > 0) {
        if ($(".featuredProductGroupList_" + i).hasClass("slick-initialized")) {
          $(".featuredProductGroupList_" + i).slick("unslick");
        }
        $(".featuredProductGroupList_" + i).slick({
          infinite: true,
          slidesToShow: 5,
          slidesToScroll: 1,
          pauseOnHover: true,
          responsive: [
            {
              breakpoint: 1030,
              settings: {
                slidesToShow: 4,
              },
            },
            {
              breakpoint: 770,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 500,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 400,
              settings: {
                slidesToShow: 1,
              },
            },
          ],
        });
      }
    }
  }

  if ($(".featuredBrands").length > 0) {
    if ($(".featuredBrands").hasClass("slick-initialized")) {
      $(".featuredBrands").slick("unslick");
    }
    $(".featuredBrands").slick({
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      pauseOnHover: true,
      responsive: [
        {
          breakpoint: 1030,
          settings: {
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 770,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 400,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    });
  }
  if ($(".featuredManufacturers").length > 0) {
    if ($(".featuredManufacturers").hasClass("slick-initialized")) {
      $(".featuredManufacturers").slick("unslick");
    }
    $(".featuredManufacturers").slick({
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      pauseOnHover: true,
      responsive: [
        {
          breakpoint: 1030,
          settings: {
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 770,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 400,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    });
  }
  if ($(".shopByCategory").length > 0) {
    if ($(".shopByCategory").hasClass("slick-initialized")) {
      $(".shopByCategory").slick("unslick");
    }
    $(".shopByCategory").slick({
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      pauseOnHover: true,
      responsive: [
        {
          breakpoint: 1030,
          settings: {
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 770,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 400,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    });
  }
  if ($(".featuredCategory").length > 0) {
    if ($(".featuredCategory").hasClass("slick-initialized")) {
      $(".featuredCategory").slick("unslick");
    }
    $(".featuredCategory").slick({
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      pauseOnHover: true,
      responsive: [
        {
          breakpoint: 1030,
          settings: {
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 770,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 400,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    });
  }
}

function loadCustomForSalesUser(salesUserDetails) {
  setCookie("isShipToSelected", true);
  $("#loginModal").modal("hide");
  $.get("getCustomersUnit.action", function (data, status, xhr) {
    unblock();
    $("#salesrepModal .modal-body").html(data);
    $("#salesrepModal").modal({ backdrop: "static", keyboard: false });
    $("#salesrepModal").on("shown.bs.modal", function () {
      $("body").addClass("modal-open");
    });
  }).fail(function (error) {
    unblock();
    bootAlert("medium", "error", "Error", "Unable To Load Customers");
  });
}

$(document).ready(function () {
  var selectedCustomer = localStorage.getItem("currentCustomerSU");
  var selectedUser = localStorage.getItem("salesUserSelected");
  var isSalesUser = $("#isSalesUser").val();
  if (!selectedCustomer && isSalesUser == "Y") {
    loadCustomForSalesUser();
  } else if (!selectedUser && selectedCustomer && isSalesUser == "Y") {
    selectedCustomer = JSON.parse(selectedCustomer);
    loadUserByCustomer(selectedCustomer);
  }

  function loadUserByCustomer(attributes) {
    localStorage.removeItem("currentCustomerSU");
    localStorage.setItem("currentCustomerSU", JSON.stringify(attributes));
    block("Please wait");
    $.get(
      "getUsersByCustomerUnit.action",
      {
        customerId: attributes["customerid"],
        accountNumber: attributes["accountnumber"],
      },
      function (data, status, xhr) {
        //$("#salesrepModal").modal('hide');
        $("#salesrepModal .modal-body").html(data);
        $("#salesrepModal").modal({ backdrop: "static", keyboard: false });
        $("#salesrepModal").on("shown.bs.modal", function () {
          $("body").addClass("modal-open");
        });
        unblock();
        //$("#salesrepModal").modal({ backdrop: "static", keyboard: false });
        //$('#salesrepModal').on('shown.bs.modal', function () {
        //	$('body').addClass('modal-open');
        //});
      }
    ).fail(function (error) {
      unblock();
      bootAlert("medium", "error", "Error", "Unable To Load Users");
    });
  }

  $(".switchCustomer").on("click", function () {
    if ($("#countInCart").length > 0 && parseInt($("#countInCart").val()) > 0) {
      bootbox.confirm({
        size: "medium",
        closeButton: false,
        message:
          "There are item(s) in your cart. Do you want to switch customer",
        title:
          "<span class='text-warning'>Warning &nbsp;&nbsp;<em class='glyphicon glyphicon-alert'></em></span>",
        callback: function (result) {
          if (result) {
            block("Please wait");
            loadCustomForSalesUser();
          } else {
            unblock();
            return true;
          }
        },
      });
    } else {
      block("Please wait");
      loadCustomForSalesUser();
    }
  });

  $(".switchUser").on("click", function () {
    var selectedCustomer = localStorage.getItem("currentCustomerSU");
    selectedCustomer = JSON.parse(selectedCustomer);
    if ($("#countInCart").length > 0 && parseInt($("#countInCart").val()) > 0) {
      bootbox.confirm({
        size: "medium",
        closeButton: false,
        message: "There are item(s) in your cart. Do you want to switch user",
        title:
          "<span class='text-warning'>Warning &nbsp;&nbsp;<em class='glyphicon glyphicon-alert'></em></span>",
        callback: function (result) {
          if (result) {
            loadUserByCustomer(selectedCustomer);
          } else {
            unblock();
            return true;
          }
        },
      });
    } else {
      loadUserByCustomer(selectedCustomer);
    }
  });

  $("#salesrepModal").on("click", ".usersForCustomer", function (src) {
    //$("#salesrepModal").modal('hide');
    var attributes = src.target.dataset;
    loadUserByCustomer(attributes);
  });

  $("#salesrepModal").on("click", ".persistUserDetails", function (src) {
    block("Please wait");
    localStorage.removeItem("salesUserSelected");
    localStorage.setItem("salesUserSelected", "Y");
    var attributes = src.target.dataset;
    $.post(
      "setSelectedUserDetailsUnit.action",
      { userName: attributes["username"] },
      function (data, status, xhr) {
        if (data && data == "SUCCESS") {
          //setCookie("isShipToSelected", true);
          window.location.href = "/Products";
        } else {
          unblock();
          bootAlert(
            "medium",
            "error",
            "Error",
            "Unable To Proceed With Selected User"
          );
        }
      }
    ).fail(function (error) {
      unblock();
      bootAlert(
        "medium",
        "error",
        "Error",
        "Unable To Proceed With Selected User"
      );
    });
  });
});

$("#loginModal").on("shown.bs.modal", function () {
  if ($("#isWebview").val() == "WEBVIEW") {
    prodGrpCpnPopup();
  }
});
function callCSPConfigurator(obj) {
  console.log("CallCSPConfigurator");
  if (typeof obj != "undefined" && obj != null && obj != "") {
    var productId = "0";
    var itemId = "0";
    var itemPriceId = "0";
    var paramString = "";
    var paramItemIdString = "";
    if (
      typeof $(obj).data("itemid") != "undefined" &&
      $(obj).data("itemid") != null &&
      $(obj).data("itemid") != "" &&
      parseInt($(obj).data("itemid")) > 0
    ) {
      itemId = $(obj).data("itemid");
      paramItemIdString = "&iid=" + itemId;
    }
    if (
      typeof $(obj).data("productid") != "undefined" &&
      $(obj).data("productid") != null &&
      $(obj).data("productid") != "" &&
      parseInt($(obj).data("productid")) > 0
    ) {
      productId = $(obj).data("productid");
      paramString = "pid=" + productId + paramItemIdString;
    } else if (
      typeof $(obj).data("itempriceid") != "undefined" &&
      $(obj).data("itempriceid") != null &&
      $(obj).data("itempriceid") != "" &&
      parseInt($(obj).data("itempriceid")) > 0
    ) {
      itemPriceId = $(obj).data("itempriceid");
      paramString = "ipid=" + itemPriceId + paramItemIdString;
    }

    window.location.href = "cspConfiguratorPage.action?" + paramString;
  }
}
function validateCaptcha(obj) {
  var email = $(obj).data("emailid");
  var authCode = $(obj).data("authcode");
  var jcType = $(obj).data("jcaptchatype");
  var key = $(obj).data("keycode");
  var jCaplookUp = $(obj).data("jcaptchalookup");
  var jCaptchafromPage = $.trim($("#" + jCaplookUp).val());

  if (jCaptchafromPage == null || jCaptchafromPage == "") {
    bootAlert("small", "error", "Error", "Please enter captcha value");
  } else {
    enqueue(
      "sessionValueLink.action?keyValue=" + key + "&dt=" + new Date(),
      function (val) {
        console.log("Value set to: " + val);
        if (val != null && val != "" && $.trim(val) == jCaptchafromPage) {
          bootAlert("small", "error", "Error", "Valid captcha");

          //-- Here you need to call Auth API from ESB to continue registration Process, make sure to comment above Valid captcha alert box
          //.............................
        } else {
          bootAlert(
            "small",
            "error",
            "Error",
            "Invalid captcha value, try again"
          );
          refreshjcaptcha();
          $("#" + jCaplookUp).val("");
        }
      }
    );
  }
}
/*$(window).unload(function(){
	  localStorage.salesUserSelected=undefined;
	  localStorage.currentCustomerSU=undefined;
});*/

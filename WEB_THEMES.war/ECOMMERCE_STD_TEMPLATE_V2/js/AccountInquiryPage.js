$.ajax({
    type: "GET",
        url:"/OutStandingPaymentListSale.action?pageSize=10&isAjaxRequest=Y",
        async: false,
        success: function (msg) {
            $("#accountTable").html(msg)
        }
});
function ErrorRenderer(){
    this.renderError = function(errorText) {
        $('.alert-error').remove();
        var alertBanner = $("<div>").addClass("alert alert-error alert-danger")
        $("body").prepend(alertBanner);
        var closeButton = $("<a>").attr({
            'class': 'close',
            'data-dismiss': "alert"

        }).html("&times;");
        alertBanner.append(closeButton);
        alertBanner.append($("<div>").html("<strong>Error! </strong>" + errorText));
    }
}

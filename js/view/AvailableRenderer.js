function AvailableRenderer() {
    this.renderAvailable = renderAvailable;
    function renderAvailable(type, bucket) {
        document.write("<div class='col-xs-1 available'>");

        for(var i in bucket) {
            document.write("<button>" + i + "</button>");
        }

        document.write("</div>");
    }
}

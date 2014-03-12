function AvailableRenderer() {
    /*
     * This function renders (or rerenders) the available course list.
     * The component it renders has a id="available".
     *
     * On the first rendering it inserts an empty div in the current position.
     * Then we replace this empty tag with the available list
     * Subsequent calls to this method will replace the list each time.
     *
     * {Note: If we wanted to use unobtrusive javascript we could change the html to
     *  include the div tag and simply replace it with jquery but this way seems
     * more intuitive since not everybody knows unobtrusive js.}
     */
    this.renderAvailable = function renderAvailable(bucket) {
        // First time we create the empty div tag
        if($("#available").length == 0) {
            document.write("<div id='available'></div>");
        }

        // Create the available list
        var newAvail = "<div id='available' class='col-xs-1'>";
        for(var i in bucket) {
            newAvail += "<button id=\"" + i + "\">" + i + "</button>";
        }
        newAvail += "</div>";
        // replace the old list
        $("#available").replaceWith(newAvail);
    }
}

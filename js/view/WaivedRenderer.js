function WaivedRenederer(userCourses){
    this.userCourses = userCourses;
    this.renderWaived = function () {
        var selected = $('.waived');
        var waivedCourses = this.userCourses.waived;
        for(var i in waivedCourses) {
            var button = $("#" + i);

            button.detach().prependTo(selected);
            button.show();
        }
    }



}

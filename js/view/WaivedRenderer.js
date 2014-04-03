function WaivedRenederer(userCourses, rules){
    this.userCourses = userCourses;
    this.rules = rules;

    this.renderWaivedAvailable = function () {
        var waivedAvailable = $('#waived-available');
        var notWaived = [this.userCourses.available, this.userCourses.selected, this.userCourses.taken]
        for(var j in notWaived) {
            for(var i in notWaived[j]) {
                if(jQuery.inArray(i, this.rules.rules.core) >= 0) {
                    console.log("in if");
                    var button = $("#" + i);
                    button.detach().prependTo(waivedAvailable);
                    button.show();
                }
            }
        }
    }

    this.renderWaived = function () {
        var waived = $('#waived-waived');
        var waivedCourses = this.userCourses.waived;
        for(var i in waivedCourses) {
            var button = $("#" + i);

            button.detach().prependTo(waived);
            button.show();
        }
    }

    this.renderAll = function () {
        this.renderWaivedAvailable();
        this.renderWaived();
    }

}

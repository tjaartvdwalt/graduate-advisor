function WaivedRenderer(userCourses, rules){
    this.init = function() {
        this.userCourses = userCourses;
        this.rules = rules;
        this.renderLine();
    }
    this.renderLine = function() {
        var selected = $('.right-border');
        // fill the rest of the bucket with empty buttons
        for(k=0; k<9; k++) {
            $('<button>Spacer</button>').attr({
                'class' : 'spacer'
            }).prependTo(selected);


        }
    }

    this.renderWaivedAvailable = function () {
        var waivedAvailable = $('#waived-available');
        var notWaived = [this.userCourses.available, this.userCourses.selected, this.userCourses.taken]
        for(var j in notWaived) {
            for(var i in notWaived[j]) {
                if(this.rules.isCore(i)) {
                    var button = $("#" + i);
                    button.detach().appendTo(waivedAvailable);
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

            button.detach().appendTo(waived);
            button.show();
        }
    }

    this.renderAll = function () {
        //this.renderWaivedAvailable();
        this.renderWaived();
    }
    this.init();

}

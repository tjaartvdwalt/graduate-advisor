function PopoverRenderer (userCourses, rules) {
    this.init = function() {
        this.userCourses = userCourses;
        this.rules = rules;
    }

    // this.renderSchedulePopover = function (course) {
    //     var courseName = this.userCourses.getCourse(course).course_name;
    //     var buttons = this.scheduleButtons();
    //     var courseButton = $('#' + course);
    //     courseButton.popover({
    //         'span' : '2',
    //         'container' : 'body',
    //         'title' :courseName,
    //         'html' : true,
    //         'content' : buttons });
    //     courseButton.popover('show');
    // }

    this.scheduleButtons = function() {
        var buttons = []
        var anchorButton = $('<button>').html('anchor');
        buttons.push(anchorButton);
        //this.addClickListener(availableButton, courseNumber, "available")
        var selectButton = $('<button>').html('remove');
        buttons.push(selectButton);
        //this.addClickListener(selectButton, courseNumber, "other semester")
        return buttons;
    }

    // If the type is schedule we add different buttons
    this.renderPopover = function (course,type) {
        var buttons = this.buttonsToDisplay(course.course_number);
        if(type == "schedules") {
            buttons = this.scheduleButtons();
        }
        var courseButton = $('#' + course.course_number);
        courseButton.popover({
            'span' : '2',
            'container' : 'body',
            'title' : course.course_name,
            'html' : true,
            'content' :  buttons });
        courseButton.popover('show');
    }

    this.buttonsToDisplay = function(courseNumber) {
        var availableButton = $('<button>').html('available');
        this.addClickListener(availableButton, courseNumber, "available")
        var selectButton = $('<button>').html('select');
        this.addClickListener(selectButton, courseNumber, "selected")
        var completeButton = $('<button>').html('complete');
        this.addClickListener(completeButton, courseNumber, "taken")
        var waiveButton = $('<button>').html('waive');
        this.addClickListener(waiveButton, courseNumber, "waived")

        var buttons = [];
        var status = this.userCourses.getCourseStatus(courseNumber);
        if(status != "available") {
            buttons.push(availableButton);
        }
        if(status != "selected") {
            buttons.push(selectButton);
        }

        if(status != "taken") {
            buttons.push(completeButton);
        }
        if(status != "waived" && $.inArray(courseNumber, this.rules.rules.core) >= 0) {
            buttons.push(waiveButton);
        }
        return buttons;
    }

    this.addClickListener = function(button, course, action) {
        button.click(function(event) {
            var myEvent = new CustomEvent(
                "popupClickMessage",
                {
                    detail: {
                        course: course,
                        action: action,
                    },
                    bubbles: true,
                    cancelable: true
                }
            );
            button[0].dispatchEvent(myEvent);
        });
    }

    this.destroyPopover = function () {
        for(var course in this.userCourses.selected) {
         $("#" + course).popover('destroy');
        }
        for(var course in this.userCourses.available) {
         $("#" + course).popover('destroy');
        }
        for(var course in this.userCourses.waived) {
         $("#" + course).popover('destroy');
        }
        for(var course in this.userCourses.taken) {
         $("#" + course).popover('destroy');
        }

        //$('.popover').remove();
    }

    this.init();
}

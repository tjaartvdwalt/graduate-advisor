function PopoverRenderer (userCourses, rules) {
    this.init = function() {
        this.userCourses = userCourses;
        this.rules = rules;
    }

    this.scheduleButtons = function(course) {
        var content = $('<div>');
        var anchorButton = $('<button>').addClass('btn-sm').html('anchor');
        content.append(anchorButton);
        //this.addClickListener(availableButton, courseNumber, "available")
        var selectButton = $('<button>').addClass('btn-sm').html('remove');
        content.append(selectButton);
        //this.addClickListener(selectButton, courseNumber, "other semester")

        var scheduledItem = this.userCourses.getScheduledCourse(course.course_number);
        if(scheduledItem != undefined && scheduledItem.day != "") {
            var text = $("<p>");
            text.html("Days: " + scheduledItem.day + "<br>Time: " + scheduledItem.time);
            content.append(text);
        }



        return content;
    }

    // If the type is schedule we add different buttons
    this.renderPopover = function (course,type) {
        var content = this.contentToDisplay(course.course_number);

        if(type == "schedules") {
            content = this.scheduleButtons(course);
        }
        var courseButton = $('#' + course.course_number);
        courseButton.popover({
            'span' : '2',
            'container' : 'body',
            'title' : '<a href="https://apps.umsl.edu/webapps/courseschedules/descriptions/dsp_just_course_desc.cfm?subject=CMP%20SCI&coursenum= '+ course.course_number + '" target="_blank">' + course.course_name + '</a>',
            'html' : true,
            'placement' : 'auto right',
            'content' : content[0] });
        courseButton.popover('show');
    }

    this.contentToDisplay = function(courseNumber) {
        var content = $("<div>");
        var availableButton = $('<button>').addClass('btn-sm').html('unselectd');
        this.addClickListener(availableButton, courseNumber, "available")
        var selectButton = $('<button>').addClass('btn-sm').html('select');
        this.addClickListener(selectButton, courseNumber, "selected")
        var completeButton = $('<button>').addClass('btn-sm').html('complete');
        this.addClickListener(completeButton, courseNumber, "taken")
        var waiveButton = $('<button>').addClass('btn-sm').html('waive');
        this.addClickListener(waiveButton, courseNumber, "waived")
        var prereqButton = $('<button>').addClass('btn-sm').html('select w/ prereq');
        this.addClickListener(prereqButton, courseNumber, "prereq")

        var buttons = [];
        var status = this.userCourses.getCourseStatus(courseNumber);
        if(status != "available" && !this.rules.isCore(courseNumber)) {
            content.append(availableButton);
        }
        if(status != "selected") {
            content.append(selectButton);
        }

        var course = this.userCourses.getCourse(courseNumber);
        if(status != "selected" && this.userCourses.findPrereq(course) != undefined) {
            content.append(prereqButton);
        }

        if(status != "taken") {
            content.append(completeButton);
        }
        if(status != "waived") {
           //&& $.inArray(courseNumber, this.rules.rules.core) >= 0) {
            content.append(waiveButton);
        }
        return content;
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

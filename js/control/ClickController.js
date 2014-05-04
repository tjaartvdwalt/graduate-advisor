function ClickController(parent, render) {
    this.init = function() {
        this.currentClicked = "";
        this.courses = parent.courses;
        this.userCourses = parent.userCourses;
        this.render = render;
        this.rules = parent.rules;
        // this.courseController = courseController;
        this.addButtonListeners();
        this.addListeners();
    }

    // Handle event is a special function that catches all events
    this.handleEvent = function (event) {
        var courseNumber = event.currentTarget.id;
        var currentTab = $('.tab-pane.active')[0].id;
        this.clickHandler(currentTab, courseNumber);
    }

    this.clickHandler = function(currentTab, courseNumber) {
        var clickedCourse = this.userCourses.getCourse(courseNumber);
        if(this.currentClicked == courseNumber) {
            var src = this.userCourses.getCourseBucket(courseNumber);
            switch(currentTab) {
            case "waived":
                this.waived(clickedCourse);
                break;
            case "taken":
                this.taken(clickedCourse);
                break;
            case "selected":
                this.selected(clickedCourse);
                break;
            case "schedules":
                return;
                // console.log("schedules");
                // this.scheduled(clickedCourse);
                // break;
            }
            this.render.scoreboard.renderAll();
            this.render.waived.renderAll();
            this.render.selected.renderAll();
            this.currentClicked = "";
        }
        else {
            this.render.popover.destroyPopover();
            this.render.popover.renderPopover(clickedCourse, currentTab);
            this.currentClicked = courseNumber;
        }

    }

    /*
     * We break IE legacy compatibility because we don't use the attachEvent
     * method here. Don't care too much about that for now.
     */
    this.addButtonListeners = function () {
        var coursesList = this.userCourses.getCourses();
        for(var i in coursesList) {
            var courseButton = document.getElementById(coursesList[i].course_number);
            if(courseButton != null) {
                courseButton.addEventListener("click", this, false);
            }
        }
    }

    this.waived = function(course) {
        var src = this.userCourses.getCourseBucket(course.course_number);
        if(src == this.userCourses.waived) {
            this.userCourses.moveCourse(course, src, this.userCourses.selected);
        }
        else {
            this.userCourses.moveCourse(course, src, this.userCourses.waived);
        }
    }

    this.taken = function(course) {
        var src = this.userCourses.getCourseBucket(course.course_number);
        if(src == this.userCourses.taken) {
            this.userCourses.moveCourse(course, src, this.userCourses.available);
        }
        else {
            this.userCourses.moveCourse(course, src, this.userCourses.taken);
        }
    }

    this.selected = function(course) {
        // If the selected course is currently in available move it to selected
        // else if it is selected move it to available
        var src = this.userCourses.getCourseBucket(course.course_number);
        if(src == this.userCourses.available) {
            this.userCourses.moveCourse(course, src, this.userCourses.selected);
        }
        else {
            // If the course was selected, and it was a core course, move it to waived...
            // This is a "shortcut" for waiving a course
            // else it is now available
            if(this.rules.isCore(course.course_number)) {
                this.userCourses.moveCourse(course, src, this.userCourses.waived);
            }
            else {
                this.userCourses.moveCourse(course, src, this.userCourses.available);
            }
        }

    }

    this.scheduled = function(course) {
        // if(this.currentClicked == courseNumber) {
        //     this.render.popover.destroyPopover();
        // }
        // else {
        //     this.render.popover.destroyPopover();
        //     this.render.popover.renderPopover(courseNumber);
        //     this.currentClicked = courseNumber;
        // }
    }

    this.search = function() {
        // remove previous search results
        var searchResults = $('.searchresult');
        searchResults.removeClass('searchresult');
        var searchResults = self.userCourses.search($('#searchtext').val());
        for(var i in searchResults) {
            $('#' + searchResults[i]).addClass('searchresult');
        }
    }

    this.addListeners = function() {
        var self = this;
        $('#searchbutton').click(function(event) {
            self.search();
        });

        $('#searchtext').keypress(function(event) {
            if (event.which == 13) {
                self.search();
            }
        });


        var self = this;
        $('#resetbutton').click(function(event) {
            var searchResults = $('.searchresult');
            searchResults.removeClass('searchresult');
            $('#searchtext').val("");
        });

        $(document).click(function(event) {
            if(event.target.id != self.currentClicked) {
                self.render.popover.destroyPopover();
                self.currentClicked = "";
            }
        });

        document.addEventListener("popupClickMessage", popupEventHandler, false);

        function popupEventHandler(e) {
            var action = e.detail.action;
            var courseNumber = e.detail.course;
            var course = self.userCourses.getCourse(courseNumber);
            var src = self.userCourses.getCourseBucket(courseNumber);
            switch(action) {
            case "waived":
                self.userCourses.moveCourse(course, src, self.userCourses.waived);
                break;
            case "taken":
                self.userCourses.moveCourse(course, src, self.userCourses.taken);
                break;
            case "selected":
                self.userCourses.moveCourse(course, src, self.userCourses.selected);
                break;
            case "available":
                self.userCourses.moveCourse(course, src, self.userCourses.available);
                break;
            case "prereq":
                var prereq = self.userCourses.findPrereq(course);
                course.prereq = prereq.course_number;
                self.userCourses.moveCourse(course, src, self.userCourses.selected);
                self.userCourses.moveCourse(prereq, src, self.userCourses.selected);
                break;
            }
            self.render.popover.destroyPopover();
            self.render.scoreboard.renderAll();
            self.render.waived.renderAll();
            self.render.selected.renderAll();
            self.currentClicked = "";
        }
    }
    this.init();
}

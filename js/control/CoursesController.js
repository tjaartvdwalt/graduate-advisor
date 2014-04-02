function CoursesController() {
    this.init = function() {
        this.currentClicked = "";
        this.courses =     new Courses();
        this.rules =       new Rules();
        this.userCourses = new UserCourses(this.courses.courses, this.rules);

        // Initialize the different renderers
        this.configure =   new ConfigureRenederer(this.userCourses);
        this.waived =      new WaivedRenederer(this.userCourses);
        this.taken =       new TakenRenederer(this.userCourses);
        this.selected =    new SelectedRenederer(this.userCourses, this.rules);

        //this.rotation = new JSONParser().getJSON('rotation');
        //console.log(this.rotation);
        //this.configure.render();
        this.addButtonListeners();
    }

    /*
     * TODO: should the event handlers rather be in the View?
     */
    // Handle event is a special function that catches all events
    this.handleEvent = function (event) {

        var currentTab = $('.tab-pane.active')[0].id;
        switch(currentTab) {
        case "waived":

            break;
        case "taken":
            break;
        case "selected":
            if(this.currentClicked == event.currentTarget.id) {
                var clickedCourse = this.userCourses.getCourse(event.currentTarget.id);
                var src = this.userCourses.getCourseBucket(event.currentTarget.id);
                // If the selected course is currently in available move it to selected
                // else if it is selected move it to available
                if(src == this.userCourses.available) {
                    this.userCourses.moveCourse(clickedCourse, src, this.userCourses.selected);
                }
                else {
                    this.userCourses.moveCourse(clickedCourse, src, this.userCourses.available);
                }
                this.selected.renderAll();

                this.currentClicked = "";
            }
            else {
                var clickedCourse = this.userCourses.getCourse(event.currentTarget.id);
                this.selected.renderDescription(clickedCourse);
                this.currentClicked = event.currentTarget.id;
            }
            break;
        }
    }


    /*
     * This method gets fired when the wizard changes the tab being displayed
     */
    this.onTabShow = function(tab, navigation, index) {

        switch(index) {
        case 0:
            // configuration
            break;
        case 1:
            // waived
            break;
        case 2:
            // taken
            this.selected.renderAvailable();
            break;
        case 3:
            // selected
            this.selected.renderAvailable();
            break;
        case 4:
            // schedule
            break;
        }

        console.log(index)
        //this.selected.renderAll('6000');
    }

    /*
     * We break IE legacy compatibility because we don't use the attachEvent
     * method here. Don't care too much about that for now.
     */
    this.addButtonListeners = function () {
        for(var i in this.courses.courses) {
            var courseButton = document.getElementById(this.courses.courses[i].course_number);
            if(courseButton != null) {
                courseButton.addEventListener("click", this, false);
            }
        }
    }
    this.init();
}

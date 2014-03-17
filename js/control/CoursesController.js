function CoursesController() {
    this.currentClicked = "";
    this.courses =     new Courses();
    this.rules =       new Rules();
    this.userCourses = new UserCourses(this.courses.courses, this.rules);
    this.renderer =    new CourseRenederer(this.userCourses, this.rules);

    this.renderer.renderAll('6000');

    /*
     * TODO: should the event handlers rather be in the View?
     */
    // Handle event is a special function that catches all events
    this.handleEvent = function (event) {
        switch(event.currentTarget.id) {
        case "available-6000":
            this.renderer.renderAvailable(this.userCourses["available"], "6000");
            break;
        case "available-5000":
            this.renderer.renderAvailable(this.userCourses["available"], "5000");
            break;
        case "available-4000":
            this.renderer.renderAvailable(this.userCourses["available"], "4000");
            break;
            // Any course button
        default:
            // If this is the 2nd consecutive click on the button switch it between the
            //available and selected buckets
            if(this.currentClicked == event.currentTarget.id) {
                var clickedCourse = this.userCourses.getCourse(event.currentTarget.id);
                console.log("2 clicked");
                this.userCourses.moveCourse(clickedCourse, this.userCourses.available, this.userCourses.selected);
                this.renderer.renderAll('6000');

                this.currentClicked = "";
            }
            else {
                console.log(event.currentTarget);
                var clickedCourse = this.userCourses.getCourse(event.currentTarget.id);
                this.renderer.renderDescription(clickedCourse);
                this.currentClicked = event.currentTarget.id;
            }
        }
    }

    /*
     * We break IE legacy compatibility because we don't use the attachEvent
     * method here. Don't care too much about that for now.
     */
    this.addButtonListeners = function addButtonListeners() {
        availableButtons = ["available-6000", "available-5000", "available-4000"];
        for(var i in availableButtons) {
            var availableButton = document.getElementById(availableButtons[i]);
            availableButton.addEventListener("click", this, false);
        }

        for(var i in this.courses.courses) {
            var courseButton = document.getElementById(this.courses.courses[i].course_number);
            if(courseButton != null) {
                courseButton.addEventListener("click", this, false);
            }
        }

    }
    this.addButtonListeners();
}

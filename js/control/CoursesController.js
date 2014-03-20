function CoursesController() {
    this.currentClicked = "";
    this.courses =     new Courses();
    this.rules =       new Rules();
    this.userCourses = new UserCourses(this.courses.courses, this.rules);
    this.renderer =    new CourseRenederer(this.userCourses, this.rules);

    this.rotation = new JSONParser().getJSON('rotation');
    console.log(this.rotation);
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
        case "schedule-button":
            var Courses_Offered = Get_Courses_Offered(this.rotation);
            /** This is where you can introduce courses that have already been taken, though
                I think we can implement this at the GUI-level (with rules that disclude
                courses that are already taken.
            **/
            var Courses_Taken = new Array();
            var Courses_Available = Get_Courses_Available(Courses_Taken, Courses_Offered);
            /** "choices" needs to be an array of 10 course object - non-time specific **/
            var Schedules = GetSchedules(this.userCourses.selected, Courses_Available);
            console.log(Schedules);
            break;
            // Any course button
        default:
            // TODO: This method will have to be refactored when we start looking at
            // waived and taken courses
            // If this is the 2nd consecutive click on the button switch it between the
            //available and selected buckets
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
                this.renderer.renderAll();

                this.currentClicked = "";
            }
            else {
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

        var scheduleButton = document.getElementById('schedule-button');
        console.log(scheduleButton);
        scheduleButton.addEventListener("click", this, false);


    }
    this.addButtonListeners();
}

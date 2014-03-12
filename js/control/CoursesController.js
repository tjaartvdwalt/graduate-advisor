function CoursesController() {
    this.currentClicked = "";
    this.courses = new Courses();
    this.rules = new Rules();
    console.log("construct");
    this.userCourses = new UserCourses(this.courses);

    this.renderBucket = function renderBucket(type) {
        var renderer = new BucketRenderer();
        renderer.renderBucket(type, this.userCourses["selected"][type]);
    }
    this.renderAvailable = function renderAvailable(type) {
        var renderer = new AvailableRenderer();
        renderer.renderAvailable(this.userCourses["available"][type]);
    }

    // Handle event is a special function that catches all events
    this.handleEvent = function(event) {
        switch(event.currentTarget.id) {
        case "available-6000":
            this.renderAvailable("6000");
            break;
        case "available-5000":
            this.renderAvailable("5000");
            break;
        case "available-4000":
            this.renderAvailable("4000");
            break;
            // Any course button
        default:
            if(this.currentClicked == event.currentTarget.id) {
                console.log("2 clicked");
                this.currentClicked = "";
            }
            else {
                this.currentClicked = event.currentTarget.id;
            }
        }
        console.log(event.currentTarget.id);
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
            console.log(this.courses.courses[i].course_number);
            var courseButton = document.getElementById(this.courses.courses[i].course_number);
            console.log(courseButton);
            if(courseButton != null) {
                courseButton.addEventListener("click", this, false);
            }
        }

    }
}

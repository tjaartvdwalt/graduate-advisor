function CoursesController() {
    this.init = function() {
        this.currentClicked = "";
        this.courses =     new Courses();
        this.rules =       new Rules();
        this.userCourses = new UserCourses(this.courses.courses, this.rules);

        // Initialize the different renderers
        this.configure =   new ConfigureRenderer(this.userCourses, this.rules);
        this.configure.renderAll();

        this.xmlRotation = new Rotation(); //JSONParser().getJSON('rotation');
        this.rotationTranslator = new RotationTranslator(this.xmlRotation.rotation);
        this.scheduleTranslator = new ScheduleTranslator();

        this.errors =    new ErrorRenderer();
        this.scoreboard =  new ScoreboardRenderer(this.userCourses, this.rules);
        this.scoreboard.renderAll();
        // This breaks the design, but to get the scoreboard reset after a load
        // we will pass the scoreboard as a parameter for Load renderer.
        // The proper solution is that the load fires an event to the controller
        // once it has finished loading the file.
        this.loadSaveModel = new LoadAndSave(this.userCourses, this.scoreboard);
        this.loadSave =      new LoadSaveRenderer(this.loadSaveModel);
        this.waived =      new WaivedRenderer(this.userCourses,  this.rules);
        this.selected =    new SelectedRenderer(this.userCourses, this.xmlRotation, this.rules);
        this.schedule =    new ScheduleRenderer(this.userCourses);
        this.addButtonListeners();
        this.addListeners();
    }

    /*
     * TODO: should the event handlers rather be in the View?
     */
    // Handle event is a special function that catches all events
    this.handleEvent = function (event) {

        var currentTab = $('.tab-pane.active')[0].id;
        switch(currentTab) {
        case "waived":
            var clickedCourse = this.userCourses.getCourse(event.currentTarget.id);
            var src = this.userCourses.getCourseBucket(event.currentTarget.id);
            if(src == this.userCourses.waived) {
                this.userCourses.moveCourse(clickedCourse, src, this.userCourses.selected);
            }
            else {
                this.userCourses.moveCourse(clickedCourse, src, this.userCourses.waived);
            }
            console.log("here");
            this.scoreboard.renderAll();
            this.waived.renderAll();
            break;
        case "taken":
            if(this.currentClicked == event.currentTarget.id) {
                var clickedCourse = this.userCourses.getCourse(event.currentTarget.id);
                var src = this.userCourses.getCourseBucket(event.currentTarget.id);
                if(src == this.userCourses.taken) {
                    this.userCourses.moveCourse(clickedCourse, src, this.userCourses.available);
                }
                else {
                    this.userCourses.moveCourse(clickedCourse, src, this.userCourses.taken);
                }
                this.scoreboard.renderAll();
                this.selected.renderAll();
                this.currentClicked = "";
            }
            else {
                var clickedCourse = this.userCourses.getCourse(event.currentTarget.id);
                this.selected.renderDescription(clickedCourse);
                this.currentClicked = event.currentTarget.id;
            }
            break;

        case "selected":
            if(this.currentClicked == event.currentTarget.id) {
                var clickedCourse = this.userCourses.getCourse(event.currentTarget.id);
                var src = this.userCourses.getCourseBucket(event.currentTarget.id);
                // If the selected course is currently in available move it to selected
                // else if it is selected move it to available
                if(src == this.userCourses.available) {
                    this.userCourses.moveCourse(clickedCourse, src, this.userCourses.selected);

                    if(this.userCourses.backend == "1" &&
                       this.runScheduler(Object.keys(this.userCourses.selected).length) == 0) {

                        this.errors.renderError("We could not schedule CS"+ event.currentTarget.id + " with the current selection and configuration. Please select another course or change the configuration parameters");

                        this.userCourses.moveCourse(clickedCourse, this.userCourses.selected, src);

                    }
                }
                else {
                    // If the course was selected, and it was a core course, move it to waived...
                    // This is a "shortcut" for waiving a course
                    // else it is now available
                    console.log(this.rules.rules.core.indexOf(clickedCourse.course_number));
                    if(this.rules.rules.core.indexOf(clickedCourse.course_number) >= 0) {
                        this.userCourses.moveCourse(clickedCourse, src, this.userCourses.waived);
                    }
                    else {
                        this.userCourses.moveCourse(clickedCourse, src, this.userCourses.available);
                    }
                }
                this.scoreboard.renderAll();
                this.waived.renderAll();
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
            // Configuration page only needs to be rendered once
            break;
        case 1:
            // waived
            this.waived.renderAll();
            break;
        case 2:
            // taken
            this.selected.renderAll();
            break;
        case 3:
            // selected
            this.selected.renderAll();
            break;
        case 4:
            if(this.userCourses.backend == "0") {
                var tempSchedule = MakeSchedule(this.userCourses.selected, this.userCourses.semestersRemaining(), 30, this.xmlRotation.rotation, this.courses);
                this.userCourses.schedule =  this.scheduleTranslator.translateSchedule(tempSchedule);
            }
            else {
                // schedule
                var takenSchedule = this.runScheduler();
                this.userCourses.schedule = takenSchedule;
            }
            this.schedule.renderSchedule(this.userCourses.schedule);
            break;
        }
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

    this.runScheduler = function(nrOfCourses) {
        var requirements = {}
        requirements.reqCourse = this.userCourses.getSortedCoursList();
        if(nrOfCourses == undefined) {
            nrOfCourses = (this.userCourses.coursesRequired - Object.keys(this.userCourses.taken).length);
        }

        var schedule =  scheduleAll(nrOfCourses, this.userCourses.coursesPerSem, this.rotationTranslator.rotation, requirements);
        return schedule;
    }

    this.addListeners = function() {
        var self = this;
        $('#total-courses-list').change(function(event) {
            $('#semesters-list').val(self.userCourses.semestersRemaining());
            self.scoreboard.renderAll();
        });

    }

    this.init();
}

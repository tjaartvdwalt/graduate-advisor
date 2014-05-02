function RootController() {
    this.init = function() {
        this.rules =       new Rules();
        this.courses =     new Courses(this.rules);
        this.userCourses = new UserCourses(this.courses.courses, this.courses.restrictions, this.rules);

        // Initialize the different renderers

        this.xmlRotation = new Rotation(this.userCourses.getArrangedCourses(this.userCourses.available)); //JSONParser().getJSON('rotation');
        this.schedule = new Schedule(); //JSONParser().getJSON('rotation');

        this.rotationTranslator = new RotationTranslator(this.xmlRotation.rotation, this.schedule);
        this.scheduleTranslator = new ScheduleTranslator(this.userCourses);

        this.loadSaveModel = new LoadAndSave(this.userCourses, this.scoreboard);

        this.addListeners();
    }
    this.getUserCourses = function() {
        return this.userCourses;
    }

    this.runScheduler = function(nrOfCourses) {
        var requirements = {}
        requirements.preReqs = [];
        var selected = this.userCourses.selected;
        // Add pre requisites
        for(var i in selected) {
            if(selected[i].prereq != undefined) {
                requirements.preReqs.push([selected[i].course_number, selected[i].prereq]);
            }
        }

        // Add min courses for international students
        if(this.userCourses.intStudent == true) {
            requirements.minCoursesBase = 3;
        }

        requirements.reqCourse = this.userCourses.getSortedCourseList(this.userCourses.selected);
        requirements.semesterLimit = this.userCourses.semestersRemaining();
        requirements.startDate = [parseInt(this.userCourses.startDate.year), this.userCourses.startDate.sem];
        if(nrOfCourses == undefined) {
            nrOfCourses = (this.userCourses.coursesRequired - Object.keys(this.userCourses.taken).length);
        }
        // Set the max number required at each level
        var sixTaken =this.userCourses.countCoursesAboveLevel(this.userCourses.taken, 6000);
        var fiveTaken = this.userCourses.countCoursesAboveLevel(this.userCourses.taken, 5000)
        var fourTaken = this.userCourses.countCoursesAboveLevel(this.userCourses.taken, 4000)
        requirements.greaterThan = [[6000, 1 - sixTaken], [5000, 6 - fiveTaken], [4000, 10 - fourTaken]];

        // set the day preferences
        requirements.preferences = [this.userCourses.nightOnly, this.userCourses.days];

        // Add waived courses.
        // Completed courses also needs to go into the list so that they do not get rescheduled.
        requirements.waived = [];
        for(var i in this.userCourses.waived) {
            requirements.waived.push(this.userCourses.waived[i].course_number);
        }

        for(var i in this.userCourses.taken) {
            requirements.waived.push(this.userCourses.taken[i].course_number);
        }

        console.log(nrOfCourses);
        console.log(this.userCourses.coursesPerSem);
        console.log(requirements);
        var translatedRotation = this.rotationTranslator.rotation;
        var schedule =  scheduleAll(nrOfCourses, this.userCourses.coursesPerSem, translatedRotation, requirements);
        return this.scheduleTranslator.sortSchedule(schedule);
        //return schedule;
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

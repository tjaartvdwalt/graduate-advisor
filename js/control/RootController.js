function RootController() {
    this.init = function() {
        this.rules =       new Rules();
        this.courses =     new Courses();
        this.userCourses = new UserCourses(this.courses.courses, this.rules);

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
        for(var i in selected) {
            if(selected[i].prereq != undefined) {
                requirements.preReqs.push([selected[i].course_number, selected[i].prereq]);
            }
        }
        requirements.reqCourse = this.userCourses.getSortedCourseList(this.userCourses.selected);
        requirements.semesterLimit = this.userCourses.semestersRemaining();
        requirements.startDate = [parseInt(this.userCourses.startDate.year), this.userCourses.startDate.sem];
        requirements.greaterThan = [[6000, 1], [5000,6], [4000, 10]];
        if(nrOfCourses == undefined) {
            nrOfCourses = (this.userCourses.coursesRequired - Object.keys(this.userCourses.taken).length);
        }

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

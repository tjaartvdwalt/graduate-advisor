function RootController() {
    this.init = function() {
        this.courses =     new Courses();
        this.rules =       new Rules();
        this.userCourses = new UserCourses(this.courses.courses, this.rules);

        // Initialize the different renderers

        this.xmlRotation = new Rotation(); //JSONParser().getJSON('rotation');
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
        requirements.reqCourse = this.userCourses.getSortedCoursList();
        requirements.semesterLimit = this.userCourses.semestersRemaining();
        requirements.greaterThan = [[6000, 1], [5000,6], [4000, 10]];
        if(nrOfCourses == undefined) {
            nrOfCourses = (this.userCourses.coursesRequired - Object.keys(this.userCourses.taken).length);
        }

        var schedule =  scheduleAll(nrOfCourses, this.userCourses.coursesPerSem, this.rotationTranslator.rotation, requirements);
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

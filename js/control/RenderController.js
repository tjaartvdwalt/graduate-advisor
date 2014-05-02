function RenderController(parent) {
    this.init = function() {
        this.configure =     new ConfigureRenderer(parent.userCourses, parent.rules);
        this.configure.renderAll();
        this.scoreboard =    new ScoreboardRenderer(parent.userCourses, parent.rules);
        this.scoreboard.renderAll();
        this.errors =        new ErrorRenderer();
        this.loadSave =      new LoadSaveRenderer(parent.loadSaveModel);
        this.waived =        new WaivedRenderer(parent.userCourses,  parent.rules);
        this.selected =      new SelectedRenderer(parent.userCourses, parent.xmlRotation, parent.rules);
        this.schedule =      new ScheduleRenderer(parent.userCourses);
        this.intro =         new IntroRenderer();
        this.popover =       new PopoverRenderer(parent.userCourses, parent.rules);
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
            if(parent.userCourses.backend == "0") {
                var tempSchedule = MakeSchedule(parent.userCourses.selected, parent.userCourses.semestersRemaining(), 30, this.xmlRotation.rotation, this.courses);
                parent.userCourses.schedule =  parent.scheduleTranslator.translateSchedule(tempSchedule);
            }
            else {
                // schedule
                var takenSchedule = parent.runScheduler();
                console.log(takenSchedule);
                parent.userCourses.schedule = parent.scheduleTranslator.sortSchedule(takenSchedule);
            }
            this.schedule.renderSchedule(parent.userCourses.schedule);
            break;
        }
    }

    this.init();
}

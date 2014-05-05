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

    this.hideSearch = function() {
        $("#searchtext").hide();
        $("#searchbutton").hide();
        $("#resetbutton").hide();
    }

    this.showSearch = function() {
        $("#searchtext").show();
        $("#searchbutton").show();
        $("#resetbutton").show();
    }

    /*
     * This method gets fired when the wizard changes the tab being displayed
     */
    this.onTabShow = function(tab, navigation, index) {
        switch(index) {
        case 0:
            // Configuration page only needs to be rendered once
            // Hide the search button
            var searchText = $("<input>").attr('id', 'searchtext').attr('type', 'text')
                .addClass("navbar-search");
            var searchButton = $("<button>").attr('id', 'searchbutton').addClass("btn btn-sm")
                .addClass("glyphicon glyphicon-search");
            var resetButton = $("<button>").attr('id', 'resetbutton').addClass("btn btn-sm")
            this.hideSearch();
            break;
        case 1:
            // waived
            this.waived.renderAll();
            this.selected.renderAvailable();
            this.showSearch();
            break;
        case 2:
            // taken
            this.selected.renderAll();
            this.showSearch();
            break;
        case 3:
            // selected
            this.selected.renderAll();
            this.showSearch();
            break;
        case 4:
            if(parent.userCourses.backend == "0") {
                var tempSchedule = MakeSchedule(parent.userCourses.selected, parent.userCourses.semestersRemaining(), 30, this.xmlRotation.rotation, this.courses);
                parent.userCourses.schedule =  parent.scheduleTranslator.translateSchedule(tempSchedule);
            }
            else {
                // schedule
                var takenSchedule = parent.runScheduler();
                //parent.userCourses.schedule = parent.scheduleTranslator.sortSchedule(takenSchedule);
            }
            this.showSearch();
            break;
        }
    }

    this.init();
}

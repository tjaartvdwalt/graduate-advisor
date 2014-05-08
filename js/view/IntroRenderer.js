function IntroRenderer(userCourses, popover){
    this.init = function() {
        this.userCourses = userCourses;
        this.addButton();
        this.popover = popover;
    }

    this.addButton = function() {
        var self = this;
        var button = $('<button>').attr('id', 'intro-button')
            .addClass('btn btn glyphicon glyphicon-question-sign');
        button[0].addEventListener("click", function (evt) {
            console.log('click');
            var tripArray = []
            var currentTab = $('.tab-pane.active')[0].id;
            switch(currentTab) {
            case "configure":
                self.navRender(tripArray);
                self.toolbarRenderer(tripArray, 0, "Configure your settings");
                self.configureRenderer(tripArray);
                break;
            case "waived":
                self.navRender(tripArray);
                self.misc(tripArray);
                self.toolbarRenderer(tripArray, 1, "Mark courses for which you have received credit.");
                self.waiveRenderer(tripArray);
                break;
            case "taken":
                self.navRender(tripArray);
                self.misc(tripArray);
                self.toolbarRenderer(tripArray, 2, "Mark courses that you have already completed.");
                self.completedRenderer(tripArray);
                break;
            case "selected":
                self.navRender(tripArray);
                self.misc(tripArray);
                self.toolbarRenderer(tripArray, 3, "Mark courses that you wish to take.");
                self.selectedRenderer(tripArray);
                break;
            case "schedules":
                self.navRender(tripArray);
                self.toolbarRenderer(tripArray, 4, "Render a schedule with your current criteria.");
                self.scheduleRenderer(tripArray);
                break;
            }
            options = {  delay : -1,
                         //canGoPrev: false,
                         //prevLabel: "",
                         animation: undefined,
                         onTripEnd : function() {
                             $('.trip-block').remove();
                         }
                      }

            this.trip = new Trip(tripArray, options);
            this.trip.start();
        }, false);


        // //self.takeTrip();
        //     // }
        // }, false);
        $('#intro').append(button);

    }

    this.navRender = function(trip) {
        trip.push({
            sel :  $('body'),
            content : "You can use the left and right arrow keys to navigate the introduction.",
            position: "screen-ne",
            showNavigation: true,
            expose: true
        });

        trip.push({
            sel :  $('body'),
            content : "The introduction is context sensitive. It introduces the current selected tab only. You can run it again from another tab.",
            position: "screen-ne",
            showNavigation: true,
            expose: true
        });
        return trip
    }

    this.toolbarRenderer = function(trip, tab, content) {
        console.log(tab);
        tabIndex =["Configure", "Waived", "Completed", "Selected", "Schedule"]
        console.log($('a:contains("' + tabIndex[tab] + '")'));
        trip.push(
            {
                sel : $('a:contains("' + tabIndex[tab] + '")'),
                content : "" + content,
                position: "screen-ne",
                showNavigation: true,
                expose: true,
                callback: function() {
                    $('#rootwizard').bootstrapWizard('show',tab);
                }
            });
        return trip;
    }
    this.availableRenderer = function(trip, context) {
        self = this;
        trip.push({
            sel :  $('#' + context + '-available'),
            content : "All courses that can be " + context + " are shown in the course selection list.",
            position: "screen-ne",
            showNavigation: true,
            expose: true
        });

        trip.push({
            sel :  $('#available-groups,#available-groups, #waived-groups'),
            content : "You can filter courses based on their level by clicking on one of the level filter buttons.",
            position: "screen-ne",
            showNavigation: true,
            expose: true,
            // callback: function(callback) {
            //     var courseNumber = $('#' + context + '-group > button')[0].id;
            //     var course = self.userCourses.getCourse(courseNumber);
            //     self.popover.renderPopover(course,'selected');
            // }
        });

        trip.push({
            sel :  $('#6900A, #6900B, #5880A, 5880B, #5890A, 5890B, #4880A, 4880B'),
            content : "All courses are considered to be 3 credit hours each. <br>Courses that can be repeated for credit are duplicated in the list.",
            position: "screen-ne",
            showNavigation: true,
            expose: true,
            callback: function(callback) {
                var courseNumber = $('#' + context + '-group > button')[0].id;
                var course = self.userCourses.getCourse(courseNumber);
                self.popover.renderPopover(course,'selected');
            }
        });

        trip.push({
            sel : $('#' + context + '-group'),
            content : 'If you click on a course you will see the course title.<br> You can also perform any action available for the course in the current context by clicking on the corresponding action button.',
            position: "screen-ne",
            showNavigation: true,
            callback: function() {
                self.popover.destroyPopover();
            },
            expose: true
        });
        trip.push({
            sel : $('#' + context + '-group'),
            content : 'Alternatively, clicking on the course a second time will perform the <b>default</b> action in the current context.',
            position: "screen-ne",
            showNavigation: true,
            expose: true
        });


    }

    this.configureRenderer = function(trip) {
        trip.push({
            sel : $('.int-student'),
            content : "If you are a international student, select this option.<br> This will schedule 3 courses per semester in each semester except the last one.",
            position: "screen-ne",
            showNavigation: true,
            expose: true
        });
        trip.push({
            sel : $('.restricted-status'),
            content : "If you have been admitted on restricted status, select this option.<br> This will make prerequisite undergraduate courses available for scheduling.",
            position: "screen-ne",
            showNavigation: true,
            expose: true
        });
        trip.push({
            sel : $('.courses-per-sem'),
            content : "For your convenience the maximum number courses you wish to take in any semester <br> and the minimum number of courses you will need to complete your degree are linked.<br> If you know what you are doing you can unlink them and set them seperately.",
            position: "screen-ne",
            showNavigation: true,
            expose: true
        });
        trip.push({
            sel : $('.start-date'),
            content : "Set this value if you want to set your starting date for a different semester.",
            position: "screen-ne",
            showNavigation: true,
            expose: true
        });
        trip.push({
            sel : $('.night-only'),
            content : "Select this option if you only want to schedule night classes.<br>This feature is only accurate for the coming semester.",
            position: "screen-ne",
            showNavigation: true,
            expose: true
        });
        trip.push({
            sel : $('.days-of-week'),
            content : "Select the days of the week you prefer to have classes. <br>This feature is only accurate for the coming semester.",
            position: "screen-ne",
            showNavigation: true,
            expose: true
        });
        trip.push({
            sel : $('.required-nr-courses'),
            content : "Change the number of courses required to graduate.<br>This is a developer option and in general should not be changed",
            position: "screen-ne",
            showNavigation: true,
            expose: true
        });

    }
    this.waiveRenderer = function(trip) {
        var self = this;
        this.availableRenderer(trip, "waived");

        trip.push({
            sel :  $('#waived-waived'),
            content : "If you apply the <b>waive</b> action, the course will be waived. If you apply another action the new course status will only be visible in the corresponding tab.",
            position: "screen-ne",
            showNavigation: true,
            expose: true,
        });

    }

    this.maxLines = function(trip) {
        trip.push({
            sel : $('.max-4000'),
            content : 'The red line shows the maximum number of courses that can be taken for credit at the 4000 level.',
            position: "screen-nw",
            showNavigation: true,
            expose: true
        });
        trip.push({
            sel : $(".min-5000, .min-6000"),
            content : 'The green lines shows the minimum number of courses that must be taken at the 5000 and 6000 levels.',
            position: "screen-nw",
            showNavigation: true,
            expose: true
        });
    }

    this.completedRenderer = function(trip) {
        this.availableRenderer(trip, "taken");
        trip.push({
            sel : $('.taken'),
            content : "If you apply the <b>complete</b> action, the course will be moved to its corresponding completed list.<br> If you apply another action the new course status will only be visible in the corresponding tab.",
            position: "screen-ne",
            showNavigation: true,
            expose: true,
        });
        this.maxLines(trip);

    }

    this.selectedRenderer = function(trip) {
        var self = this;
        this.availableRenderer(trip, "selected");
        this.maxLines(trip);
        trip.push({
            sel : $('.selected'),
            content : "You do not need to select all 10 courses.<br>If you select only a subset of courses the scheduler will fill the schedule with courses that satisfy the degree criteria.",
            position: "screen-nw",
            showNavigation: true,
            expose: true,
        });

        trip.push({
            sel : $('#4250, #4760, #5130, #5500, #5700'),
            content : "Core courses are always either selected, completed or waived, they can not be unselected",
            position: "screen-nw",
            showNavigation: true,
            expose: true,
        });

        trip.push({
            sel : $('.selected'),
            content : "Waived courses are not shown anywhere, as they are effectively eliminated from selection",
            position: "screen-nw",
            showNavigation: true,
            expose: true,
        });

        trip.push({
            sel : $('.selected, a:contains("Schedule")'),
            content : "Completed courses are shown with dashed lines, and drop to the bottom of the list.<br>They decrease the number of courses required to complete your degree",
            position: "screen-sw",
            showNavigation: true,
            expose: true
        });

        return trip;
    }

    this.misc = function(trip) {
        trip.push({
            sel : $('.glyphicon-floppy-open'),
            content : "Load previously saved data from a JSON file.",
            position: "screen-sw",
            showNavigation: true,
            expose: true
        });

        trip.push({
            sel : $('.glyphicon-floppy-save'),
            content : "Save your data in JSON format.",
            position: "screen-sw",
            showNavigation: true,
            expose: true
        });

        trip.push({
            sel : $('.glyphicon-trash'),
            content : "Reset your current session. All unsaved changes will be lost.",
            position: "screen-sw",
            showNavigation: true,
            expose: true
        });

        trip.push({
            sel : $('#searchbar'),
            content : "You can search for a course based on the course number or title.<br> You can also use regular expression syntax to do more advanced searches.",
            position: "screen-sw",
            showNavigation: true,
            expose: true
        });

        trip.push({
            sel : $('#searchbutton'),
            content : "To complete your search you may press return or click the search button.",
            position: "screen-sw",
            showNavigation: true,
            expose: true
        });

        trip.push({
            sel : $('#resetbutton'),
            content : "To clear the search results you can press the search reset button.",
            position: "screen-sw",
            showNavigation: true,
            expose: true
        });
    }

    this.scheduleRenderer = function(trip) {
        var self = this;
        trip.push({
            sel : $('.table-header'),
            content : "The schedule is rendered for the number of semesters you configured, starting from the semester you configured.",
            position: "screen-s",
            showNavigation: true,
            expose: true,
        });

        trip.push({
            sel : $('.day-time'),
            content : "If available, the scheduler will show what day a course is being presented, and whether the course is a day course or an evening course.",
            position: "screen-nw",
            showNavigation: true,
            expose: true,
        });
        trip.push({
            sel : $('.prereq'),
            content : "Courses that are scheduled with a pre-requirement are highlighted.",
            position: "screen-ne",
            showNavigation: true,
            expose: true,
        });

        return trip;
    }

    // this.takeTrip = function() {
    //     var tripArray = []
    //     tripArray.push(this.toolbarRenderer(0, "The Configuration Tab"));
    //     this.configureRenderer(tripArray);
    //     tripArray.push(this.toolbarRenderer(1, "The Waived Tab "));
    //     this.waiveRenderer(tripArray);
    //     tripArray.push(this.toolbarRenderer(2, "The Completed Tab "));
    //     this.completedRenderer(tripArray);
    //     tripArray.push(this.toolbarRenderer(3, "The Selected Tab"));
    //     this.selectedRenderer(tripArray);

    //     options = {  delay : -1,
    //                  //canGoPrev: false,
    //                  //prevLabel: "",
    //                  animation: undefined,
    //                  onTripEnd : function() {
    //                      $('.trip-block').remove();
    //                  }
    //               }

    //     this.trip = new Trip(tripArray, options);
    //     this.trip.start();

    // }

    this.init();
}

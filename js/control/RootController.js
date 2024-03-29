function RootController() {
    this.init = function() {
        this.rules =       new Rules();
        this.courses =     new Courses(this.rules);
        this.userCourses = new UserCourses(this.courses.courses, this.courses.restrictions, this.rules);
        // Initialize the different renderers

        this.xmlRotation = new Rotation(this.userCourses.getArrangedCourses(this.userCourses.available), this.rules); //JSONParser().getJSON('rotation');
        this.schedule = new Schedule(); //JSONParser().getJSON('rotation');

        this.rotationTranslator = new RotationTranslator(this.xmlRotation.rotation, this.schedule);
        this.scheduleTranslator = new ScheduleTranslator(this.userCourses);

        this.addListeners();
        this.WW_PRESENT = false;
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
        // Add all 6000 level prereqs if no 6000 level course is selected we should add
        // all the prereqs so that the prereq gets loaded when you select it
        if(this.userCourses.countCoursesAboveLevel(this.userCourses.selected, 6000) == 0) {
            var sixCourses = this.userCourses.getCoursesAboveLevel(this.userCourses.available, 6000);
            for(var i in sixCourses) {
                var prereq = this.userCourses.findPrereq(sixCourses[i]);
                if(prereq != null) {
                    requirements.preReqs.push([sixCourses[i].course_number, prereq.course_number]);
                }
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
        var fiveTaken = this.userCourses.countCoursesAboveLevel(this.userCourses.taken, 5000);
        var fourTaken = this.userCourses.countCoursesAboveLevel(this.userCourses.taken, 4000);
        requirements.greaterThan = [[6000, 1 - sixTaken], [5000, 6 - fiveTaken], [4000, 10 - fourTaken]];

        // set the day preferences
        var nightOnly = 0;
        if(this.userCourses.nightOnly == true) {
            nightOnly = 1;
        }

        requirements.preferences = [nightOnly, parseInt(this.userCourses.daysOfWeek)];

        // Add waived courses.
        // Completed courses also needs to go into the list so that they do not get rescheduled.
        requirements.waived = [];
        for(var i in this.userCourses.waived) {
            requirements.waived.push(this.userCourses.waived[i].course_number);
        }

        for(var i in this.userCourses.taken) {
            requirements.waived.push(this.userCourses.taken[i].course_number);
        }
        // waive the thesis option if not selected so that they don't get scheduled
        if(!this.userCourses.thesis) {
            requirements.waived.push("6900A");
            requirements.waived.push("6900B");
        }
        else {
            requirements.preReqs.push(["6900B", "6900A"]);
        }
        
        var nrOfRestrictedCourses = this.userCourses.countCoursesBelowLevel(this.userCourses.selected, 4000);
        nrOfCourses = nrOfCourses + nrOfRestrictedCourses;
        var RestCourses = this.userCourses.getCoursesBelowLevel(this.userCourses.selected,4000);
        var translatedRotation = this.rotationTranslator.rotation;
        var newTranslatedRotation = [];
        //console.log(translatedRotation);
        for(var x in translatedRotation) {
            if(parseInt(translatedRotation[x].courseNumber) >= 4000){
                newTranslatedRotation.push(translatedRotation[x]);
                //console.log(translatedRotation[x]);
            }
            else {
                //If it is below 4000, the only way we include it is if it's specified as Restricted
                for(var z in RestCourses) {
                    if(translatedRotation[x].courseNumber == RestCourses[z].course_number) {
                        newTranslatedRotation.push(translatedRotation[x]);
                        //      console.log(translatedRotation[x]);
                    }
                }
            }
        }
        
        //console.log(newTranslatedRotation);
        translatedRotation = newTranslatedRotation;

        //Creates a Web Worker to run the scheduling algorithm in a separate thread
        //We render a loading screen from here, and the actual schedule is rendered
        //on the Web Worker callback
        var self = this;
        var worker = new Worker("js/scheduler1/scheduler.js");
        var temp_obj = [nrOfCourses, this.userCourses.coursesPerSem, translatedRotation, requirements];
        //console.log(scheduleAll(nrOfCourses, this.userCourses.coursesPerSem, translatedRotation, requirements));
        if(!this.WW_PRESENT) {
            this.WW_PRESENT = true;
            worker.postMessage(temp_obj);
            worker.onmessage = function(event) {
                self.userCourses.schedule = self.scheduleTranslator.sortSchedule(event.data);
                if(self.userCourses.schedule.length != 0) {
                    if($('.tab-pane.active').attr('id') == "schedules")
                        global_render.schedule.renderSchedule();
                }
                else {
                    global_render.errors.renderError("Sorry, no working schedule can be made with that selection.");
                    $('#loading').remove();
                }
                self.WW_PRESENT = false;
            }
            global_render.schedule.renderLoading();
        }
        return;
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

function ScheduleRenderer(userCourses){
    this.init = function() {
        this.userCourses = userCourses;
    }
    this.hideCourses = function() {
        //This is overkill, but we move all courses back to hidden list...
        //otherwise the previously scheduled buttons will get deleted, but
        // there is currently no super easy way to know which buttons were
        // selected. But the other views will work correctly if everything is moved
        // anyway, so we do that.
        var courses = this.userCourses.getCourses();
        for(var i in courses) {
            var button = $("#" + courses[i].course_number);
            $("#buttons").append(button).hide()
        }
    }
    this.renderLoading = function() {
        this.hideCourses();
        $('#schedtable').remove();
        $('#loading').remove();
        var loading = $("<img>").attr("id", "loading").attr('src', 'assets/images/ajax-loader.gif');
        $("#schedules").append(loading);

    }

    this.renderSchedule = function() {
        var semesterArray = [userCourses.semestersRemaining()];
        this.hideCourses();
        // Remove the previous schedule
        $('#loading').remove();

        var table = $('<div>').attr('id', 'schedtable').addClass('table');

        var headers = $($('<div>').addClass("table-row"));
        var row = [];
        var year = 0;
        var semester = "";
        var cur_row = 0;
        var cols = 0;
        var schedule = this.userCourses.schedule;
        this.addPrereqClass(schedule);
        for(var j in schedule) {
            if(schedule[j].year != year || schedule[j].semester != semester) {
                cols++;
            }
        }
        console.log(cols/2);
        for(var j in schedule) {
            var col = "col-xs-2"
            if(cols > 12) {
                col = "col-xs-1"
            }
            if(schedule[j].year != year || schedule[j].semester != semester) {
                headers.append($('<div>').addClass(col +" table-header").html("<b>" + schedule[j].semester + " " + schedule[j].year + "</b>"));
                cur_row = 0;
                year = schedule[j].year;
                semester = schedule[j].semester;
            }
            table.append(headers);
            if(cur_row >= row.length) {
                row.push($('<div>').addClass("table-row"));
            }
            //console.log(schedule[j]);
            var details = this.getDetails(schedule[j].courseNumber);
            var cell = $("<div>").addClass(col + ' table-cell');
            row[cur_row].append(cell);

            for(var i in details) {
                cell.append(details[i]);
            }

            cur_row++;
        }
        for(var i=0; i< row.length; i++) {
            table.append(row[i])
        }

        $("#schedules").append(table)
    }

    this.getDetails = function(courseNumber) {
        var courseButton = $("#" + courseNumber).show();
        //console.log(courseNumber);
        var course = this.userCourses.getCourse(courseNumber);
        var scheduledItem = this.userCourses.getScheduledCourse(course.course_number);
        var details = [];
        details.push(courseButton)
        details.push(course.course_name);

        if(scheduledItem != undefined && scheduledItem.day != "") {
            var dates = this.getTimeDate(scheduledItem.day, scheduledItem.time);
            details.push("<div><b>Times</b></div>");
            for(i in dates) {
                details.push("<div class='day-time'>" + dates[i] + "</div>");
            }
        }
        return details;
    }

    this.getTimeDate = function(days, times) {
        var returnArray = [];
        while(days.length > 0) {
            var returnString = "";
            var day = days.substring(0, 2);
            days = days.substring(2);
            if(day == "MW") {
                returnString = "Mon/Wed"
            }
            else{
                returnString = "Tue/Thu"
            }
            var time = times.substring(0,1);
            times = times.substring(1);
            //console.log(times);
            if(time == "D") {
                returnString += "-- Day"
            } else {
                returnString += "-- Evening"
            }
            returnArray.push(returnString);
        }
        return returnArray;

    }


    // add the prereq class to the button if a prereq exists.
    // this is used to highlight prereqs if they are auto poputated
    this.addPrereqClass = function() {
        var schedule = this.userCourses.schedule;
        for(var i in schedule) {
            if(parseInt(schedule[i].courseNumber) > 6000) {
                var course = this.userCourses.getCourse(schedule[i].courseNumber);
                var prereq = this.userCourses.findPrereq(course);
                if(prereq != null) {
                    $("#" + course.course_number).addClass("prereq");
                    $("#" + prereq.course_number).addClass("prereq");
                }
            }
        }
    }

    this.init();
}

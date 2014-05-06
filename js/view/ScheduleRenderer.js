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

        var table = $('<div>').attr('id', 'schedtable');

        var headers = $($('<div>').addClass("row"));
        var row = [];
        var year = 0;
        var semester = "";
        var cur_row = 0;
        var schedule = this.userCourses.schedule;
        this.addPrereqClass(schedule);
        for(var j in schedule) {
            if(schedule[j].year != year || schedule[j].semester != semester) {
                headers.append($('<div>').addClass("col-xs-2").html(schedule[j].semester + " " + schedule[j].year));
                cur_row = 0;
                year = schedule[j].year;
                semester = schedule[j].semester;
            }
            table.append(headers);
            if(cur_row >= row.length) {
                row.push($('<div>').addClass("row"));
            }
            var courseButton = $("#" + schedule[j].courseNumber).show();
            row[cur_row].append($("<div>").addClass('col-xs-2').append(courseButton));
            cur_row++;
        }
        for(var i=0; i< row.length; i++) {
            table.append(row[i])
        }

        $("#schedules").append(table)
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

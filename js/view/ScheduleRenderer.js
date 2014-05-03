function ScheduleRenderer(userCourses){
    this.init = function() {
        this.userCourses = userCourses;
    }
    this.renderLoading = function() {
        var loading = $("<p1>").attr("id", "schedtable").html("loading");
        $("#schedules").append(loading);

    }

    this.renderSchedule = function() {
        var semesterArray = [userCourses.semestersRemaining()];
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

        // Remove the previous schedule
        $('#schedtable').remove();

        var table = $('<div>').attr('id', 'schedtable');

        var headers = $($('<div>').addClass("row"));
        var row = [];
        var year = 0;
        var semester = "";
        var cur_row = 0;
        var schedule = this.userCourses.schedule;
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


    this.init();
}

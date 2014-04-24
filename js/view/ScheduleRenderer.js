function ScheduleRenderer(userCourses){
    this.init = function() {
        this.userCourses = userCourses;
    }

    this.renderSchedule = function() {
        var semesterArray = [userCourses.semestersRemaining()];
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

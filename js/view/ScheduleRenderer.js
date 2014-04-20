function ScheduleRenderer(userCourses){
    this.init = function() {
        this.userCourses = userCourses;
    }

    this.renderSchedule = function() {
        var semesterArray = [userCourses.semestersRemaining()];
        // Remove the previous schedule
        $('#schedtable').remove();
        var table = $('<table>').attr('id', 'schedtable').addClass('table').addClass('table-striped');

        var row = []
        var year = 0;
        var semester = "";
        var cur_row = 0;
        var schedule = this.userCourses.schedule;
        for(var j in schedule) {
            if(schedule[j].year != year || schedule[j].semester != semester) {
                table.append($('<th>').html(schedule[j].semester + " " + schedule[j].year));
                cur_row = 0;
                year = schedule[j].year;
                semester = schedule[j].semester;
            }
            if(cur_row >= row.length) {
                row.push($('<tr>'));
            }
            row[cur_row].append($("<td>").html(schedule[j].courseNumber))
            cur_row++;
        }
        for(var i=0; i< row.length; i++) {
            table.append(row[i])
        }

        $("#schedules").append(table)
    }


    this.init();
}

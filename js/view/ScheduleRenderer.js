function ScheduleRenderer(userCourses){
    this.init = function() {
        this.userCourses = userCourses;
    }

    this.renderSchedule = function(schedule) {
        var semesterArray = [userCourses.semesters];
        // Remove the previous schedule
        $('#schedtable').remove();
        var table = $('<table>').attr('id', 'schedtable').addClass('table').addClass('table-striped');

        for(var i = 0; i < userCourses.semesters; i++) {
            semesterArray[i] = new Array();
        }

        for(var j in schedule) {
            semesterArray[schedule[j].sem - 1].push(schedule[j]);
        }

        // This is a hack to find out the start year and the start semester
        var startYear = semesterArray[0][0].year;
        console.log("start year " + startYear);
        var startSemester = 0;
        var semesterName = ['Fall', 'Spring'];
        if(semesterArray[1][0] != startYear) {
            startSemester = 1;
        }


        for(var i = 0; i < userCourses.semesters; i++) {
            var year = parseInt(startYear) + Math.floor(i/2) + startSemester;
            table.append($('<th>').html(semesterName[(i + startSemester) % 2] + ' ' + year));
        }


        var finished = 0;
        while(finished < userCourses.semesters) {
            console.log("in while");
            console.log(semesterArray);

            var row = $('<tr>');
            table.append(row);
            for(i = 0; i < userCourses.semesters; i++) {
                var td = $('<td>');
                row.append(td);
                if(semesterArray[i].length > 0) {
                    console.log(semesterArray[i][0].course.course_number);
                    td.html(semesterArray[i][0].course.course_number);
                    semesterArray[i].splice(0, 1)
                }
                else {
                    finished++;

                }
            }
        }
        $("#schedules").append(table)
    }


    this.init();
}

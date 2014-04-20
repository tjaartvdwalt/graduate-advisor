function ScheduleTranslator() {
    this.translateSchedule = function(schedule) {
        var translatedSchedule = [];
        for(var i in schedule) {
            var tempSchedule = {}
            tempSchedule.courseNumber = schedule[i].course.course_number;
            tempSchedule.year = schedule[i].year;
            if(schedule[i].sem == 1) {
                tempSchedule.semester = "Fall";
            } else {
                tempSchedule.semester = "Spring";

            }
            translatedSchedule.push(tempSchedule);
        }
        translatedSchedule.sort(this.sortSchedule);

        console.log(translatedSchedule);
        return translatedSchedule;
    }

    this.sortSchedule = function (a, b){
        if(a.year < b.year) {
            return -1;
        }
        if(a.year > b.year) {
            return 1;
        }

        if(a.semester == b.semester) {
            return 0;
        }

        if(a.semester == "Fall") {
            return -1;
        }
        return 1;
        //Compare "a" and "b" in some fashion, and return -1, 0, or 1
    }
}

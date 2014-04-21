function ScheduleTranslator(userCourses) {
    this.init = function() {
        this.userCourses = userCourses;
    }

    this.translateSchedule = function(schedule) {
        var translatedSchedule = [];
        if(this.userCourses.startDate.sem = "Spring") {
            offset = 0;
        }
        else offset = 1;

        for(var i in schedule) {
            var tempSchedule = {}
            tempSchedule.courseNumber = schedule[i].course.course_number;
            tempSchedule.year = schedule[i].year;
            if((schedule[i].sem - 1 + offset)%2  == 0) {
                tempSchedule.semester = "Fall";
            } else {
                tempSchedule.semester = "Spring";

            }
            translatedSchedule.push(tempSchedule);
        }
        return this.sortSchedule(translatedSchedule);
    }
    this.sortSchedule = function(schedule) {
        return schedule.sort(this.sorterAlgorithm);
    }

    this.sorterAlgorithm = function (a, b){
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
    this.init();
}

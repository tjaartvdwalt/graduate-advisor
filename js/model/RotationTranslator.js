/*
 * This is a translation layer between the rotation received from the xml and the
 *  rotation required by the backend
 */
function RotationTranslator(xmlRotation, schedule) {

    this.init = function() {
        this.xmlRotation = xmlRotation;
        this.schedule = schedule;
        this.rotation = this.createRotation();
    }

    this.createRotation = function() {
        rotation = [];
        for(var i in this.xmlRotation.rotation_year) {
            var year = this.xmlRotation.rotation_year[i].year;
            for(var j in this.xmlRotation.rotation_year[i].course) {
                var course = this.xmlRotation.rotation_year[i].course[j];
                for(var k in course.rotation_term) {
                    if(! $.isEmptyObject(course.rotation_term[k].time_code)) {
                        var term = course.rotation_term[k].term
                        this.addScheduleData(course, year, term)
                        rotation.push(this.createSingleCourse(course.course_number, year, term, course.day, course.time));
                    }
                }
            }
        }
//        console.log(rotation)
        return rotation;
    }

    this.addScheduleData = function(course, year, term) {
        // initialize the object properties we want to add
        course.time = "";
        course.day = "";

        var transTerm = "";
        switch(term) {
        case "Spring":
            transTerm = "SP";
            break;
        case "Fall":
            transTerm = "FS";
            break;
        case "Summer":
            transTerm = "SS";
        }
        var tempSched = this.schedule.schedule.scheduled_course;
        for(var i in tempSched) {
            if(tempSched[i].year == year && tempSched[i].term ==  transTerm) {
                var tempCourse = tempSched[i].session[0].course;
                for(var j in tempCourse) {
                    if(tempCourse[j].course_number == course.course_number) {
                        course.day = course.day + tempCourse[j].uncommon.uncommon_record.day_code;
                        //console.log(course.day);
                        if(tempCourse[j].uncommon.uncommon_record.start_time > 1600) {
                            course.time = course.time + "E";
                        }
                        else {
                            course.time = course.time + "D";
                        }

                    }
                }
            }
        }
    }

    //This function is going to take an input of all classes in a semester and all classes taken so far
    // and choose x classes to
    // attend and return the scheduled classes with these added.
    this.createSingleCourse = function (courseNumber, year, semester, day, time)
    {
        var generalCourse = new Object();
        generalCourse.courseNumber = courseNumber;
        generalCourse.year= year;
        generalCourse.semester=semester;
        generalCourse.day=day;
        generalCourse.time=time;

        return generalCourse;
        //All of these can be undefined. If a variable is undefined, it is considered to mean
        //Any course of that level. This can be used for the requirements var
    }
    this.init();
}

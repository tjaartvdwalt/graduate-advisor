/*
 * This is a translation layer between the rotation received from the xml and the
 *  rotation required by the backend
 */
function RotationTranslator(xmlRotation) {
    this.init = function() {
        this.xmlRotation = xmlRotation;
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
                        rotation.push(this.createSingleCourse(course.course_number, year, term));
                    }
                }
            }
        }
        return rotation;
    }
    //This function is going to take an input of all classes in a semester and all classes taken so far
    // and choose x classes to
    // attend and return the scheduled classes with these added.
    this.createSingleCourse = function (courseNumber, year, semester)
    {
        var generalCourse = new Object();
        generalCourse.courseNumber = courseNumber;
        generalCourse.year= year;
        generalCourse.semester=semester;

        return generalCourse;
        //All of these can be undefined. If a variable is undefined, it is considered to mean
        //Any course of that level. This can be used for the requirements var
    }

    this.init();
}

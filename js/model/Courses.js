function Courses() {
    // The constructor
    //we get a list of all courses, and filter them so that only the
    // Graduate Computer Science courses get in the list. 
    var allCourses = getCoursesFromJSON();
    var graduateCourses = getGraduateCourses(allCourses);
    this.courses = getCMPCourses(graduateCourses);
    // We create our course buckets
    this.buckets = populateBuckets(this.courses);

    /* The raw JSON has a "course" key that contains o list of all the courses.
       Ex:
     * {"course":[{"course_number":"1010", ...},{...}]}
     *
     * Since course numbers is unique It will be more convenient for us to have
     * the course number as the key at the highest level. So we will return a
     * associative array where the key is the course number instead.
     * In JSON our object will look like:
     * {"1010":{"course_number":"1010", ...}, "1020":{...}...}
     */
    function getCoursesFromJSON() {
        var return_array = new Object();
        var json = new JSONParser();
        var courses = json.getJSON("courses").course;
        for (var i in courses){
            var course = courses[i];
            return_array[course.course_number] = course;
        }
        return return_array;
    }

    /*
     * Filters a course object so that only Computer Science courses are returned
     */
    function getCMPCourses(courses) {
        var return_array = new Object();
        for (var i in courses){
            var course = courses[i];
            if(course.subject == "CMP SCI") {
                return_array[course.course_number] = course;
            }
        }
        return return_array;
    }


    /*
     * Filters a course object so that only graduate courses are returned
     */
    function getGraduateCourses(courses) {
        var return_array = new Object();
        for (var i in courses){
            var course = courses[i];
            if(course.course_number >= 4000) {
                return_array[course.course_number] = course;
            }
        }
        return return_array;
    }

    this.getEmptyBuckets = getEmptyBuckets;
    function getEmptyBuckets() {
        var return_array = {};
        return_array['core'] = {};
        return_array['6000'] = {};
        return_array['5000'] = {};
        return_array['4000'] = {};
        return return_array;
    }

    /*
     * Our buckets are 2 dimensional associative arrays. The outer key is the
     * bucket name, the inner key is a list of courses with the course number
     * as the key. Each course can only be in 1 bucket.
     *
     * In JSON our object will lo
     ok like:
     * {"core":[{"4010":{"course_number":"1010", ...}, "4025":{...}..., "6000":...}]}
     */
    function populateBuckets(courses) {
        var return_array = getEmptyBuckets();

        // Core courses are hardcoded at this stage... should make it customizable
        core_course_names = ["4760", "4250", "5700", "5500", "5130"];

        for (var i in courses){
            var course = courses[i];
            if(core_course_names.indexOf(course.course_number) >= 0) {
                return_array["core"][course.course_number] = course;
            }
            else if(course.course_number >= 6000) {
                return_array["6000"][course.course_number] = course;
            }
            else if(course.course_number >= 5000) {
                return_array["5000"][course.course_number] = course;
            }
            else {
                return_array["4000"][course.course_number] = course;
            }
        }
        return return_array;
    }
}

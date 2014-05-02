function Courses(rules) {
    this.init = function() {
        //we get a list of all courses, and filter them so that only the
        // Gradduate Computer Science courses get in the list.
        // Note: the order is important here, if we first filter the graduate courses
        // the course numbers for math and cmp would clash and we may lose some cmp courses
        var allCourses = this.getCoursesFromJSON();
        this.courses = this.getGraduateCourses(allCourses);
        this.restrictions = this.getRestrictedCourses(allCourses, rules.rules.restrictions);
    }
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
    this.getCoursesFromJSON = function() {
        var return_array = new Object();

        var json = new JSONParser();
        var courses = json.getJSON("courses").course;
        for (var i in courses){
            var course = courses[i];
            // here we filter so that only cmp courses are displayed. If we want to
            // have math we will need to add a second level to the object
            if(course.subject == "CMP SCI") {
                return_array[course.course_number] = course;
            }
        }
        return return_array;
    }

    //     /*
    //      * Filters a course object so that only Computer Science courses are returned
    //      */
    //     function getCMPCourses(courses) {
    //         var return_array = new Object();
    //         for (var i in courses){
    //             var course = courses[i];
    //             return_array[course.course_number] = course;
    //         }
    //     }
    //     return return_array;
    // }


    /*
     * Filters a course object so that only graduate courses are returned
     */
    this.getGraduateCourses = function(courses) {
        var return_array = new Object();
        for (var i in courses){
            var course = courses[i];
            if(course.course_number >= 4000) {
                return_array[course.course_number] = course;
            }
        }
        return return_array;
    }

    this.getRestrictedCourses = function(courses, courseNames) {
        var myCourses = {};
        for(var i in courses) {
            if($.inArray(courses[i].course_number, courseNames)>= 0) {
                myCourses[courses[i].course_number] = courses[i];
            }
        }
        return myCourses;
    }

    this.init();
}

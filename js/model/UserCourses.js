function UserCourses(courses, rules) {
    this.addCourse = function (course, dest) {
        dest[course.course_number] = course;
    }

    this.moveCourse = function (course, src, dest) {
        dest[course.course_number] = course;
        delete src[course.course_number];
    }

    /*
     * TODO: We should refactor the data structure so that we
     * can do these checks inside a for loop
     */
    this.getCourse = function (courseNumber) {
        if(this.available[courseNumber] !== undefined) {
            return this.available[courseNumber];
        }
        else if(this.selected[courseNumber] !== undefined) {
            return this.selected[courseNumber];
        }
        else if(this.taken[courseNumber] !== undefined) {
            return this.taken[courseNumber];
        }
        else if(this.waived[courseNumber] !== undefined) {
            return this.waived[courseNumber]
        }
    }

    /* TODO: We should refactor this method after we have updated the data structure
     * Returns the bucket that the given course is in
     */
    this.getCourseBucket = function(courseNumber) {
        if(this.available[courseNumber] !== undefined) {
            return this.available;
        }
        else if(this.selected[courseNumber] !== undefined) {
            return this.selected;
        }
        else if(this.taken[courseNumber] !== undefined) {
            return this.taken;
        }
        else if(this.waived[courseNumber] !== undefined) {
            return this.waived;
        }
    }

    this.getAvailableCourses = function () {
        return this.selected;
    }

    this.getSelectedCourses = function () {
        return this.selected;
    }

    this.getTakenCourses = function () {
        return this.taken;
    }

    this.getWaivedCourses = function () {
        return this.waived;
    }

    // Constructor items
    this.available = {};
    this.selected  = {};
    this.taken     = {};
    this.waived    = {};
    // We initialise core courses as selected. Everything else goes in available
    core = rules.rules.core;
    for(var i in courses) {
        if($.inArray(courses[i].course_number, core) < 0) {
            this.addCourse(courses[i], this.available);
        }
        else {
            this.addCourse(courses[i], this.selected);
        }

    }

}

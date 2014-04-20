function UserCourses(courses, rules) {
    this.init = function () {
        this.backend = 0;
        this.rules = rules;
        // Constructor items
        this.coursesPerSem = 3;
        this.coursesRequired = 10;
        this.available = {};
        this.selected  = {};
        this.taken     = {};
        this.waived    = {};

        // The schedule generated for the user.
        this.schedule  = {};

        // We initialise core courses as selected. Everything else goes in available
        core = this.rules.rules.core;
        for(var i in courses) {
            if($.inArray(courses[i].course_number, core) < 0) {
                this.addCourse(courses[i], this.available);
            }
            else {
                this.addCourse(courses[i], this.selected);
            }
        }
    }

    this.semestersRemaining = function() {
        return Math.ceil((this.coursesRequired - Object.keys(this.taken).length) / this.coursesPerSem);
    }

    this.export = function() {
        var json = JSON.stringify(this);
    }

    this.addCourse = function (course, dest) {
        dest[course.course_number] = course;
    }

    /* We check only 6000 level dependencies!
     * With the current course schedule all 6000 level courses have exactly
     * 1 prerequisite with 1 exception:
     *
     * CS6420 have an option of two prereqs: CS5400 or CS5420
     * TODO: To deal with this sort of situation in general we should probably
     * show the user a dialog so that he can choose the one he wants.
     *
     * The quick fix: CS5400 is not in the rotation schedule currently so we
     * hard code it so that we choose CS5420 for now.
     *
     */
    this.findPrereq = function(course) {
        // Check if the course has a true prereq. If not return.
        // Currently all proper prereqs use or_choice.
        if(course.course_number < 6000 || course.prerequisite == undefined ||
           course.prerequisite.or_choice == undefined ) {
            return null;
        }

        // Get the prereq course number from the rule.
        // Currently all or rules are followed by and_required.. check that
        if(course.prerequisite.or_choice.and_required == undefined) {
            return null;
        }
        var ruleString = course.prerequisite.or_choice.and_required;
        // The and_required rules all have the following form:
        // {and_required: "CMP SCI 5400,CMP SCI 5420"}
        // so we:
        // 1) split the string on comma
        // 2) split the resulting string on space, and select the 3rd one.
        // 3) we hardcode the prereq for CS6420 to be CS5420 for now.
        var rulesArray = ruleString.split(",");
        for(i = 0; i < rulesArray.length; i++) {
            var ruleArray = rulesArray[i].split(" ");
            var course_number = ruleArray[2];

            // This is a hack to deal with CS6420! it should be generalized
            if(rulesArray.length == 1 || course_number == 5420) {
                return this.getCourse(course_number);
            }
        }
    }

    // Move the selected course and if it has prerequisites move those too.
    this.moveCourse = function (course, src, dest) {
        // move the prerequisite recursively
        var prereq = this.findPrereq(course);
        if(prereq != undefined) {
            this.moveCourse(prereq, src, dest);
        }
        // move the course itself
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

    this.getSortedCoursList = function() {
        var courseList = [];
        for (var i in this.selected) {
            courseList.push(this.selected[i].course_number);
        }
        courseList.sort();
        return courseList;
    }
    // execute the constructor
    this.init();
}

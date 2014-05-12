function UserCourses(courses, restrictions, rules) {
    this.init = function () {
        this.startDate = {"sem": "Fall", "year": "2014"};
        this.backend = 1;
        this.rules = rules;
        // Constructor items
        this.coursesPerSem = 3;
        this.semesters = 4;
        this.coursesRequired = 10;
        this.intStudent = false;
        this.nightOnly = false;
        this.thesis = false;
        this.restrictedStudent = false;
        // -1 = no preference
        // 0  = Mo/We
        // 1  = Tu/Th
        this.daysOfWeek = -1;
        this.available = {};
        this.selected  = {};
        this.taken     = {};
        this.waived    = {};

        // The schedule generated for the user.
        this.schedule  = {};

        // We initialise core courses as selected. Everything else goes in available
        core = this.rules.rules.core;
        var arrCourses = this.getArrangedCourses(courses);
        for(var i in courses) {
            var courseNumber = courses[i].course_number;
            if(!rules.isCore(courseNumber)) {
                var shouldAdd = true;
                for(var j in arrCourses){
                    if(arrCourses[j].course_number == i) {
                        shouldAdd = false;
                    }
                }
                if(shouldAdd) {
                    this.addCourse(courses[i], this.available);
                }
            }
            else {
                this.addCourse(courses[i], this.selected);
            }
        }
        this.duplicateArrangedCourses(arrCourses);
        this.addRestrictedCourses(restrictions);
    }

    this.duplicateArrangedCourses = function(arrangedCourses) {
        for(var i in arrangedCourses) {
            var upperLimit = arrangedCourses[i].credit.match(/\d$/gi);
            var nrOfCourses = Math.ceil(upperLimit/3);

            // check if the course may be repeated for credit and add 1 to nrOfCourses
            if(arrangedCourses[i].can_select_multiple == "true") {
                nrOfCourses++;
            }
            for(var j=1; j<= nrOfCourses; j++) {
                arrangedCourses[i].instance = j;
                var myClone = dojo.clone(arrangedCourses[i]);
                //var myClone = $.clone(arrangedCourses[i]);
                myClone.course_number = arrangedCourses[i].course_number + String.fromCharCode(64 + j);
                this.addCourse(myClone, this.available);
            }

        }
    }

    this.addRestrictedCourses = function(restrictedCourses) {
        for(var i in restrictedCourses) {
            this.addCourse(restrictedCourses[i], this.available);
        }
    }


    // We make the assumption that a coures with variable number of credit
    // hours is arranged by the instructor. These courses are not in the rotation
    this.getArrangedCourses = function(srcList) {
        var returnCourses = []
        // Check if the course has variable credit hours
        // i.e in the xml it looks like courses="1-6"
        for(var i in srcList) {
            if(srcList[i].credit.match(/\d-\d/gi)) {
                returnCourses.push(srcList[i]);
            }
        }
        return returnCourses;
    }

    this.semestersRemaining = function() {
        if(this.semesters == undefined) {
            return Math.ceil((this.coursesRequired - Object.keys(this.taken).length) / this.coursesPerSem);
        }
        return this.semesters;
    }

    this.export = function() {
        var json = JSON.stringify(this);
    }

    this.addCourse = function (course, dest) {
        dest[course.course_number] = course;
    }

    /* With the current course schedule all 6000 level courses have exactly
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
        if(course.prerequisite == undefined ||
           course.prerequisite.or_choice == undefined) {
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
        if(! $.isArray(ruleString)) {
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
    }

    // Move the selected course and if it has prerequisites move those too.
    this.moveCourse = function (course, src, dest) {
        // move the prerequisite recursively
        // var prereq = this.findPrereq(course);
        // if(prereq != undefined) {
        //     this.moveCourse(prereq, src, dest);
        // }
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
        return undefined;
    }

    // returns all the courses in a single array
    this.getCourses = function() {
        var returnArray = [];
        courseBuckets = [this.available, this.selected, this.taken, this.waived];

        for(var i in courseBuckets) {
            for(var j in courseBuckets[i])
                returnArray.push(courseBuckets[i][j])
        }
        return returnArray;
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

    /* TODO: We should refactor this method after we have updated the data structure
     * Returns the bucket that the given course is in
     */
    this.getCourseStatus = function(courseNumber) {
        if(this.available[courseNumber] !== undefined) {
            return "available";
        }
        else if(this.selected[courseNumber] !== undefined) {
            return "selected";
        }
        else if(this.taken[courseNumber] !== undefined) {
            return "taken";
        }
        else if(this.waived[courseNumber] !== undefined) {
            return "waived";
        }
    }

    //regex search in course number, name and description
    this.search = function(searchString) {
        var matchedCourses = [];
        courseBuckets = [this.available, this.selected, this.taken, this.waived];

        for(var i in courseBuckets) {
            for(var j in courseBuckets[i])
                if(courseBuckets[i][j] != undefined) {
                    var matcher = searchString.toLowerCase()
                    var matchee1 = toString(courseBuckets[i][j].course_number).toLowerCase()
                    var matchee2 = courseBuckets[i][j].course_name.toLowerCase()
                    // var matchee3 = courseBuckets[i][j].course_description.toLowerCase()
                    if(matchee1.match(matcher) != null) {
                        matchedCourses.push(courseBuckets[i][j].course_number);
                    } else
                        if(matchee2.match(matcher) != null) {
                            matchedCourses.push(courseBuckets[i][j].course_number);
                        }
                    // else if(matchee3.match(matcher) != null) {
                    //     matchedCourses.push(courseBuckets[i][j].course_number);
                    // }
                }
        }
        return matchedCourses;
    }


    this.getSortedCourseList = function(inputList) {
        var courseList = [];
        for (var i in inputList) {
            courseList.push(inputList[i].course_number);
        }
        courseList.sort();
        return courseList;
    }

    // For a particular bucket, count how many courses are at a particular level.
    // For example countCoursesAboveLevel(this.taken, 6000) returns how many courses
    // above 6000 has been taken
    this.getCoursesAboveLevel = function(bucket, level) {
        var returnArray = [];
        for(var i in bucket) {
            if(parseInt(bucket[i].course_number) > level) {
                returnArray.push(bucket[i]);
            }
        }
        return returnArray;
    }

    this.getCoursesBelowLevel = function(bucket, level) {
        var returnArray = [];
        for(var i in bucket) {
            if(parseInt(bucket[i].course_number) < level) {
                returnArray.push(bucket[i]);
            }
        }
        return returnArray;
    }


    // For a particular bucket, count how many courses are at a particular level.
    // For example countCoursesAboveLevel(this.taken, 6000) returns how many courses
    // above 6000 has been taken
    this.countCoursesAboveLevel = function(bucket, level) {
        return this.getCoursesAboveLevel(bucket, level).length;
    }

    this.countCoursesBelowLevel = function(bucket, level) {
        return this.getCoursesBelowLevel(bucket, level).length;
    }



    this.getScheduledCourse = function(courseNumber) {
        for(var i in this.schedule)
            if(this.schedule[i].courseNumber == courseNumber) {
                return this.schedule[i];
            }
    }

    // execute the constructor
    this.init();
}

function ConfigureRenderer(userCourses, rules){
    this.init = function() {
        self = this;
        this.userCourses = userCourses;
        this.rules = rules;
    }

    this.coursesPerSemesterRenderer = function() {

        // Add the select list
        var semestersList = $('<select>').addClass('selectpicker').attr('id', 'semesters-list');
        var coursesPerSemesterList = $('<select>').addClass('selectpicker');
        var link = $('<input>').attr('type', 'checkbox');


        $('#semesters').append(semestersList)
            .change(function(event) {
                if(self.userCourses.semesters == undefined) {
                    self.userCourses.coursesPerSem = Math.ceil((self.rules.rules.total - Object.keys(self.userCourses.taken).length) / event.target.value);
                    coursesPerSemesterList.val(self.userCourses.coursesPerSem);
                }
                else{
                    self.userCourses.semesters = parseInt(event.target.value);
                }
            });

        $('#courses-per-semester').append(coursesPerSemesterList)
            .change(function(event) {
                self.userCourses.coursesPerSem = event.target.value;
                if(self.userCourses.semesters == undefined) {
                    semestersList.val(self.userCourses.semestersRemaining());
                }
            });
        for(var i=1; i <= 5; i++) {
            coursesPerSemesterList.append($('<option>').html(i));
        }
        for(var i=2; i <= 10; i++) {
            semestersList.append($('<option>').html(i));
        }

        coursesPerSemesterList.val(self.userCourses.coursesPerSem);
        semestersList.val(self.userCourses.semestersRemaining());
        if(self.userCourses.semesters == undefined) {
            link.attr('checked', true);
        }

        $('#link-courses-semesters').append(link)
            .change(function(event) {
                if(event.target.checked == true) {
                    self.userCourses.semesters = undefined;
                }
                else {
                    self.userCourses.semesters = parseInt(semestersList.val());
                }
            });

    }

    this.intCheckboxRenderer = function() {
        var intCheckbox = $('<input>').attr('type', 'checkbox');
        $('#int-student').append(intCheckbox)
            .change(function(event) {
                if(event.target.checked == true) {
                    self.userCourses.intStudent = true;
                }
                else {
                    self.userCourses.intStudent = false;
                }
            });
        intCheckbox.val(self.userCourses.intStudent);

    }

    this.daysRenderer = function() {
        var nightOnly= $('<input>').attr('type', 'checkbox');
        $('#night-only').append(nightOnly)
            .change(function(event) {
                if(event.target.checked == true) {
                    self.userCourses.nightOnly = true;
                }
                else {
                    self.userCourses.nightOnly = false;
                }
            });

        var days = $('<select>').addClass('selectpicker')
        $('#week-days').append(days)
        days.change(function(event) {
            console.log(event.target.value);
            self.userCourses.daysOfWeek = event.target.value;
        });
        days.append($('<option>').attr('value', '-1').html('Any'));
        days.append($('<option>').attr('value', '0').html('Monday/Wednesday'));
        days.append($('<option>').attr('value', '1').html('Tuesday/Thursday'));
        days.val(self.userCourses.daysOfWeek);
    }

    this.dateRenderer = function(which) {
        var currentYear = $('<select>').addClass('selectpicker')
        $('#' + which + '-year').append(currentYear)
        currentYear.change(function(event) {
            self.userCourses.startDate.year = event.target.value;
        });
        for(var i=2014; i <= 2017; i++) {
            currentYear.append($('<option>').html(i));
        }
        currentYear.val(self.userCourses.startDate.year);

        var startSemester = $('<select class="left">').addClass('selectpicker')
        startSemester.append($('<option class="left">').html("Fall"));
        startSemester.append($('<option class="left">').html("Spring"));
        startSemester.change(function(event) {
            self.userCourses.startDate.sem = event.target.value;
        });
        startSemester.val(self.userCourses.startDate.sem);

        $('#' + which + '-semester').append(startSemester)

    }

    this.totalCoursesRenderer = function() {
        var totalCoursesList = $('<select>').addClass('selectpicker').attr('id', 'total-courses-list');
        $('#total-courses').append(totalCoursesList);
        totalCoursesList.change(function(event) {
            self.userCourses.coursesRequired = event.target.value;
        });

        for(var i=2; i <= 12; i++) {
            totalCoursesList.append($('<option>').html(i));
        }
        totalCoursesList.val("10");

    }

    this.backendRenderer = function() {
        var backendList = $('<select>').addClass('selectpicker').attr('id', 'backend-list');
        $('#backend').append(backendList)
            .change(function(event) {
                self.userCourses.backend = event.target.value;
            });
        backendList.append($('<option>').attr('value', '0').html("Schedule Packing"));
        backendList.append($('<option>').attr('value', '1').html("Depth First Search"));
        backendList.val("1");


    }

    this.renderAll = function() {
        this.coursesPerSemesterRenderer();
        this.dateRenderer('starting');
        this.dateRenderer('current');
        this.daysRenderer();
        this.intCheckboxRenderer();
        this.totalCoursesRenderer();
        this.backendRenderer();
    }

    this.init();
}

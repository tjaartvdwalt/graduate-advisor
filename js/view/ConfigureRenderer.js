function ConfigureRenderer(userCourses, rules){
    this.init = function() {
        self = this;
        this.userCourses = userCourses;
        this.rules = rules;
    }
    // this.renderAdvancedButton = function() {
    //     self = this;
    //     var advancedButton = $('<button>').addClass('btn-sm').html("Advanced");
    //     var row = $("<div>").addClass('row');
    //     var col = $("<div>").addClass('col-md-offset-6 col-xs-1').append(advancedButton);
    //     row.append(col);
    //     $('#config').append($("<div>").addClass('row'));
    //     $('#config').append(row);
    //     advancedButton.click(function(){
    //         self.advancedConfig.toggle();
    //     });
    // }

    this.regularRenderer = function() {
        this.regularConfig = $("<div>");
        $('#config').append(this.regularConfig);
        this.regularConfig.append($("<div>").addClass('row'));
        this.regularConfig.append(this.getHeader('General settings'));
        this.regularConfig.append(this.getInternationalStudent());
        this.regularConfig.append(this.getRestricted());
        this.regularConfig.append($("<div>").addClass('row'));
        this.regularConfig.append(this.getHeader('Courses per semester'));
        this.regularConfig.append(this.getCoursesPerSemester());
        this.regularConfig.append($("<div>").addClass('row'));
        this.regularConfig.append(this.getHeader('Starting date'));
        this.regularConfig.append(this.getStartDate());
        this.regularConfig.append($("<div>").addClass('row'));
        this.regularConfig.append(this.getHeader('Class times'));
        this.regularConfig.append(this.getNight());
        this.regularConfig.append(this.getDays());
        this.regularConfig.append(this.getTotalNrOfCourses());
    }

    // this.advancedRenderer = function() {
    //     this.advancedConfig = $("<div>");
    //     this.advancedConfig.hide();
    //     $('#config').append(this.advancedConfig);
    //     this.advancedConfig.append($("<div>").addClass('row'));
    //     this.advancedConfig.append(this.getHeader('Starting date'));
    //     this.advancedConfig.append(this.getStartDate());
    //     this.advancedConfig.append($("<div>").addClass('row'));
    //     this.advancedConfig.append(this.getHeader('Class times'));
    //     this.advancedConfig.append(this.getNight());
    //     this.advancedConfig.append(this.getDays());
    //     this.advancedConfig.append(this.getTotalNrOfCourses());
    // }

    this.getHeader = function(title) {
        var header = $("<div>").addClass('config row').html("<b>" + title + "</b>");
        return header;
    }

    this.getInternationalStudent = function() {
        var self = this;
        var div = $("<div>").addClass('row');
        var text= $("<div>").addClass('col-xs-4').html("International Student");
        var intCheckbox = $('<input>').attr('type', 'checkbox');
        intCheckbox.change(function(event) {
            console.log(event.target.checked);
            if(event.target.checked == true) {
                self.userCourses.intStudent = true;
            }
            else {
                self.userCourses.intStudent = false;
            }
        });
        intCheckbox.val(self.userCourses.intStudent);
        div.append(text);
        div.append($("<div>").addClass('col-xs-1').append(intCheckbox));
        return div;
    }

    this.getRestricted = function() {
        var self = this;
        var div = $("<div>").addClass('row');
        var text= $("<div>").addClass('col-xs-4').html("Restricted Status");
        var restrictedCheckbox = $('<input>').attr('type', 'checkbox');
        restrictedCheckbox.change(function(event) {
            console.log(event.target.checked);
            if(event.target.checked == true) {
                self.userCourses.restrictedStudent = true;
            }
            else {
                self.userCourses.restrictedStudent = false;
            }
        });
        restrictedCheckbox.val(self.userCourses.restrictedStudent);
        div.append(text);
        div.append($("<div>").addClass('col-xs-1').append(restrictedCheckbox));
        return div;

    }

    this.getCoursesPerSemester = function() {
        var div = $('<div>');
        var div1 = $("<div>").addClass('row');
        var text1= $("<div>").addClass('col-xs-3').html("Max nr of courses per semester");
        div1.append(text1);

        var div2 = $("<div>").addClass('row');
        var text2= $("<div>").addClass('col-xs-3').html("Min nr of semesters");
        div2.append(text2);

        div.append(div1);
        div.append(div2);

        // Add the select list
        var semestersList = $('<select>').addClass('selectpicker').attr('id', 'semesters-list');
        var coursesPerSemesterList = $('<select>').addClass('selectpicker');
        var link = $('<input>').attr('type', 'checkbox');
        div1.append(semestersList);
        div2.append(coursesPerSemesterList);
        div1.append($("<div>").addClass('col-xs-1').html("link"));
        div2.append($("<div>").addClass('col-xs-1').append(link));

        semestersList.change(function(event) {
            if(self.userCourses.semesters == undefined) {
                self.userCourses.coursesPerSem = Math.ceil((self.rules.rules.total - Object.keys(self.userCourses.taken).length) / event.target.value);
                coursesPerSemesterList.val(self.userCourses.coursesPerSem);
            }
            else{
                self.userCourses.semesters = parseInt(event.target.value);
            }
        });

        coursesPerSemesterList.change(function(event) {
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

        link.change(function(event) {
            if(event.target.checked == true) {
                self.userCourses.semesters = undefined;
            }
            else {
                self.userCourses.semesters = parseInt(semestersList.val());
            }
        });

        return div;

    }

    this.getStartDate = function(which) {
        var div = $("<div>").addClass('row');
        var text= $("<div>").addClass('col-xs-4').html("Start date");
        div.append(text);
        var currentYear = $('<select>').addClass('selectpicker');
        div.append(currentYear);
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

        div.append(startSemester)
        return div;
    }


    this.getNight = function() {
        var div = $("<div>").addClass('row');
        var text= $("<div>").addClass('col-xs-4').html("Night only");
        var nightOnly= $('<input>').attr('type', 'checkbox');
        nightOnly.change(function(event) {
            if(event.target.checked == true) {
                self.userCourses.nightOnly = true;
            }
            else {
                self.userCourses.nightOnly = false;
            }
        });
        div.append(text);
        div.append(nightOnly);
        return div;
    }

    this.getDays = function() {
        var div = $("<div>").addClass('row');
        var text= $("<div>").addClass('col-xs-4').html("Days of the week");

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
        div.append(text);
        div.append(days);
        return div;
    }


    this.getTotalNrOfCourses = function() {
        var div = $("<div>").addClass('row');
        var text= $("<div>").addClass('col-xs-4').html("Number of required courses");

        var totalCoursesList = $('<select>').addClass('selectpicker').attr('id', 'total-courses-list');
        totalCoursesList.change(function(event) {
            self.userCourses.coursesRequired = event.target.value;
        });

        for(var i=2; i <= 12; i++) {
            totalCoursesList.append($('<option>').html(i));
        }
        totalCoursesList.val("10");
        div.append(text);
        div.append(totalCoursesList);
        return div;
    }

    this.backendRenderer = function() {
        var div = $("<div>").addClass('row');
        var text= $("<div>").addClass('col-xs-4').html("Scheduling algorithm");

        var backendList = $('<select>').addClass('selectpicker').attr('id', 'backend-list');
            backendList.change(function(event) {
                self.userCourses.backend = event.target.value;
            });
        backendList.append($('<option>').attr('value', '0').html("Schedule Packing"));
        backendList.append($('<option>').attr('value', '1').html("Depth First Search"));
        backendList.val("1");

        div.append(text);
        div.append(backendList);
        return div;

    }

    this.renderAll = function() {
        // this.renderAdvancedButton();
        this.regularRenderer();
        // this.advancedRenderer();
    }

    this.init();
}



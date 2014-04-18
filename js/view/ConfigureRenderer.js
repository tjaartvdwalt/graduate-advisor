function ConfigureRenderer(userCourses, rules){
    this.init = function() {
        self = this;
        this.userCourses = userCourses;
        this.rules = rules;
    }
    this.semestersRenderer = function() {
        // Add the select list
        var semesterList = $('<select>').addClass('selectpicker');
        $('#courses-per-semester').append(semesterList)
            .change(function(event) {
                self.userCourses.coursesPerSem = event.target.value;
                $('#nr-of-semesters')[0].value = self.userCourses.semestersRemaining();
            });
        for(var i=1; i <= 5; i++) {
            semesterList.append($('<option>').html(i));
        }
        semesterList.val("3");
    }

    this.semesterRenderer = function(which) {
        var currentYear = $('<select>').addClass('selectpicker')
        $('#' + which + '-year').append(currentYear)
        currentYear.change(function(event) {
            //self.userCourses.semesters = event.target.value;
        });
        for(var i=2014; i <= 2017; i++) {
            currentYear.append($('<option>').html(i));
        }

        var startSemester = $('<select class="left">').addClass('selectpicker')
        startSemester.append($('<option class="left">').html("Fall"));
        startSemester.append($('<option class="left">').html("Spring"));
        startSemester.change(function(event) {
            //self.userCourses.semesters = event.target.value;
        });
        $('#' + which + '-semester').append(startSemester)

    }


    this.renderAll = function() {
        this.semestersRenderer();
        this.semesterRenderer('starting');
        this.semesterRenderer('current');
    }

    this.init();
}

function ConfigureRenderer(userCourses){
    this.init = function() {
        self = this;
        this.userCourses = userCourses;
    }
    this.semestersRenderer = function() {
        // Add the select list
        var semesterList = $('<select>').addClass('selectpicker');
        $('#nr-of-semesters').append(semesterList)
            .change(function(event) {
                self.userCourses.semesters = event.target.value;
            });
        for(var i=3; i <= 6; i++) {
            semesterList.append($('<option>').html(i));
        }
        // TODO set the default semesters to the default of the list.
        // need to find a better solution here
        this.userCourses.semesters = 3;
    }
    this.startingSemesterRenderer = function() {
        var startYear = $('<select>').addClass('selectpicker')
        $('#starting-year').append(startYear)
        startYear.change(function(event) {
            //self.userCourses.semesters = event.target.value;
        });
        for(var i=2014; i <= 2017; i++) {
            startYear.append($('<option>').html(i));
        }

        var startSemester = $('<select>').addClass('selectpicker')
        startSemester.append($('<option>').html("Fall"));
        startSemester.append($('<option>').html("Spring"));
        startSemester.change(function(event) {
            //self.userCourses.semesters = event.target.value;
        });
        $('#starting-semester').append(startSemester)

    }

    this.exportRenderer = function() {
        var button = $('<button>').html('export');
        $('#export').append(button);
        button[0].addEventListener("click", function (evt) {
            var myJSONText = JSON.stringify(self.userCourses);
            console.log(myJSONText);
            window.open("data:text/json;charset=utf-8," + escape(myJSONText))
        }, false);
    }

    this.renderAll = function() {
        this.semestersRenderer();
        this.startingSemesterRenderer();
        this.exportRenderer();
    }

    this.init();
}

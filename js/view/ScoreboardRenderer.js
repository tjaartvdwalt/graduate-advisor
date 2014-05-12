function ScoreboardRenderer(userCourses, rules){
    this.init = function() {
        this.userCourses = userCourses;
        this.rules = rules;
    }

    this.renderAll = function() {
        var waived = Object.keys(this.userCourses.waived).length;
        // only courses above 4000 counts towards your degree
        var taken = this.userCourses.countCoursesAboveLevel(this.userCourses.taken, 4000);
        var selected = Object.keys(this.userCourses.selected).length;
        var total = selected;
        var restricted = 0;
        for(var i in this.userCourses.selected) {
            if(parseInt(this.userCourses.selected[i].course_number) < 4000) {
                restricted++;
            }
        }
        var required = this.userCourses.coursesRequired + restricted  - taken;
        console.log(restricted);
        $('#waived-badge').html(waived);
        $('#completed-badge').html(taken);
        $('#selected-badge').html(selected);
        $('#schedule-badge').html(total + "/" + required);
    }

    this.init();
}

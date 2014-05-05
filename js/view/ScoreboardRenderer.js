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
        var required = this.userCourses.coursesRequired - taken;
        $('#waived-badge').html(waived);
        $('#completed-badge').html(taken);
        $('#selected-badge').html(selected);
        $('#schedule-badge').html(total + "/" + required);
    }

    this.init();
}

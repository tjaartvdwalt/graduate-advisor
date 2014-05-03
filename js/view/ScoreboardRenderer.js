function ScoreboardRenderer(userCourses, rules){
    this.init = function() {
        this.userCourses = userCourses;
        this.rules = rules;
    }

    this.renderAll = function() {
        var waived = Object.keys(this.userCourses.waived).length;
        var taken = Object.keys(this.userCourses.taken).length;
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

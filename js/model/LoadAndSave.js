function LoadAndSave(userCourses, scoreboard) {
    this.init = function() {
        this.userCourses = userCourses;
        this.scoreboard = scoreboard;
    }

    this.saveFile = function() {
        var myJSONText = JSON.stringify(this.userCourses);

        var pom = $('<a>').attr('id', 'saveLink').attr('href', 'data:text/plain;charset=utf-8,' + myJSONText)
            .attr('download', "courseSchedule.json");
        $('#buttons').append(pom);
        pom[0].click();
        $('#buttons').remove(pom);
    }

    this.loadFile = function(f) {
        var r = new FileReader();
        var result = r.readAsText(f);
        console.log(result);
        self = this;

        r.onload = function(e) {
            var contents = e.target.result;
            var myObject = JSON.parse(contents);

            self.userCourses.selected = myObject.selected;
            self.userCourses.taken = myObject.taken;
            self.userCourses.waived = myObject.waived;
            self.scoreboard.renderAll();
        }
    }
    this.init();
}

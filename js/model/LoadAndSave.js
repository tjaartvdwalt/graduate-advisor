function LoadAndSave(userCourses, waived, selected, scoreboard) {
    this.init = function() {
        this.userCourses = userCourses;
        this.waived = waived;
        this.selected = selected;
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

        var self = this;
        r.onload = function(e) {
            var contents = e.target.result;
            var myObject = JSON.parse(contents);

            self.userCourses.selected = myObject.selected;
            self.userCourses.taken = myObject.taken;
            self.userCourses.waived = myObject.waived;
            var activeTab = $('.tab-pane.active').attr('id');
            switch(activeTab) {
            case "waived":
                self.waived.renderAll();
                break;
            case "taken":
                self.selected.renderAll();
                break;
            case "selected":
                self.selected.renderAll();
                break;
            case "schedules":
                self.waived.renderAll();
            }
            self.scoreboard.renderAll();
        }
    }
    this.init();
}

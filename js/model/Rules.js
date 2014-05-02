function Rules() {
    var json = new JSONParser();
    this.rules = json.getJSON("rules");

    this.isCore = function(courseNumber) {
        if(this.rules.core.indexOf(courseNumber) >= 0) {
            return true;
        }
        return false;
    }
}

function Rotation() {
    this.init = function() {
        var allCourses = this.getRotationFromJSON();
    }

    this.getRotationFromJSON = function() {
        var json = new JSONParser();
        var rotation = json.getJSON("rotation");
        console.log(rotation);
    }

    this.init();
}

function Rotation() {
    this.init = function() {
        var json = this.getRotationFromJSON();
        this.rotation = this.getCSCourses(json);
    }

    this.getRotationFromJSON = function() {
        var json = new JSONParser();
        return json.getJSON("rotation");
    }

    // Filter everything so that only the CS courses remain.
    // This is probably not the ideal way to do this...
    // We recreate the object, leaving out any unwanted courses
    this.getCSCourses = function(json) {
        //        console.log(json);
        var returnObject = {};
        returnObject.rotation_year = [];
        for(var i in json) {
            for(var j in json[i]) {
                var yearObject = {};
                yearObject.year = json[i][j].year;
                yearObject.course = [];
                for(var k in json[i][j].course) {
                    if(json[i][j].course[k].subject == "CMP SCI") {
                        yearObject.course.push(json[i][j].course[k]);
                    }
                }
                returnObject.rotation_year.push(yearObject);
            }
        }
        return returnObject;
    }

    //Search the XML for all Rotation Object occurrences within a semester threshold
    //for a given course_number. Returns an array of all occurrences in the form of
    //objects {course = actual course object; year = year offered; sem = 0-N format
    //of what semester it is offered distanced from current semester (0 is next, etc.)
    this.findOptions = function (course_number, semesters) {
        var result = [];
        for(var i = 0; i < this.rotation.rotation_year.length; i++)
            for(var k = 0; k < this.rotation.rotation_year[i].course.length; k++) {
                if(this.rotation.rotation_year[i].course[k].subject != "CMP SCI" ||
                   this.rotation.rotation_year[i].course[k].course_number != course_number) continue;
                for(var j = 0; j < this.rotation.rotation_year[i].course[k].rotation_term.length; j++) {
                    if(jQuery.isEmptyObject(this.rotation.rotation_year[i].course[k].rotation_term[j].time_code))
                        continue;
                    var temp = new Object();
                    temp.course = this.rotation.rotation_year[i].course[k];
                    temp.year = this.rotation.rotation_year[i].year;
                    if(this.rotation.rotation_year[i].course[k].rotation_term[j].term == "Fall")
                        temp.sem = 2*i+1;
                    else
                        temp.sem = 2*i+2;
                    if(temp.sem > semesters) continue; //threshold at a semester limit
                    result.push(temp);
                }
            }
        return result;
    }

    this.init();
}

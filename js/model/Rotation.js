function Rotation() {
    this.init = function() {
       this.rotation = this.getRotationFromJSON();
    }

    this.getRotationFromJSON = function() {
        var json = new JSONParser();
        return json.getJSON("rotation");
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

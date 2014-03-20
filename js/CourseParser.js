/* NOTES:
   -All courses are represented as objects with their name ("name", string), semester offered ("sem", int 1-6), timeslot offered ("time",
   string-E/D, combination of both), prerequisite requirements("prereq", a course object), course level ("level", int 4=4000, 5=5000,
   6=6000, core=a core course)
*/


/* Get course offering in JSON from XML and parse to 2D array
   'jo' is a JSON object
*/
function Get_Courses_Offered(jo) {
    avail = new Array();
    for(var i = 0; i < MAX_SEMESTERS; i++) {
        avail.push(new Array());
    }
    //Iterate through each year, and then through each course in the year
    for (var i = 0; i < jo.rotation_year.length; i++) {
        for(var k = 0; k < jo.rotation_year[i].course.length; k++) {
            for(var l = 0; l < jo.rotation_year[i].course[k].rotation_term.length; l++) {
                //Parse this course into our standardized "course" object
                temp_course = new Object();
                temp_course.name = jo.rotation_year[i].course[k].course_name;
                if(jo.rotation_year[i].course[k].subject != "CMP SCI") continue;
                if(jQuery.isEmptyObject(jo.rotation_year[i].course[k].rotation_term[l].time_code)) continue;
                else temp_course.time = jo.rotation_year[i].course[k].rotation_term[l].time_code;
                temp_course.level = jo.rotation_year[i].course[k].course_number;
                //Parse out course_level
                if(temp_course.level == 4760 || temp_course.level == 4250 || temp_course.level == 5700
                   || temp_course.level == 5500 || temp_course.level == 5130) temp_course.level = "core";
                else if(temp_course.level >= 6000) temp_course.level = 6;
                else if(temp_course.level >= 5000) temp_course.level = 5;
                else temp_course.level = 4;
                //Add the pre-req object if this is a 6000 level
                if(temp_course.level == 6) {
                    temp_course.level
                    temp_course.prereq = new Object();
                    //temp_course.prereq.name =;
                    //temp_course.prereq.level  =;
                }
                if(jo.rotation_year[i].course[k].rotation_term[l].term == "Fall") {
                    temp_course.sem = 2*i+1;
                    avail[2*i].push(temp_course);
                }
                else {
                    temp_course.sem = 2*i+2;
                    avail[2*i+1].push(temp_course);
                }
            }
        }
    }
    return avail;
}

/* Get courses taken in JSON/or user input format and parse to 1D array
 */
function Get_Courses_Taken() {}

/* Returns a 2D array representing courses offered in XML minus those
 * we have already taken.
 */
function Get_Courses_Available(Courses_Taken, Courses_Offered) {
    CA = new Array();
    for(var i=0; i<MAX_SEMESTERS;i++) {
        CA[i] = new Array();
    }
    //Clear out repeated courses
    for(var i=0; i<MAX_SEMESTERS;i++) {
        for(var k=0; k<Courses_Offered[i].length; k++) {
            for(var j=0; j < Courses_Taken.length; j++) {
                if(Courses_Taken[j].name == Courses_Offered[i][k].name) {
                    delete Courses_Offered[i][k];               //We delete it, so it's undef
                    break;
                }
            }
        }
    }
    //Copy to a new array, excluding repeats
    for(var i=0; i<MAX_SEMESTERS;i++) {
        for(var k=0; k<Courses_Offered[i].length; k++) {
            if(typeof(Courses_Offered[i][k]) != "undefined") {
                CA[i].push(Courses_Offered[i][k]);
            }
        }
    }
    return CA;
}

/* Takes a course object as an argument, and returns an array listing course
 * numbers of prerequisites.
 * Uses an html-embedded JSON
 */
function GetPrereqs(course) {
    var reqs;
    for(var i = 0; i < courses_jo.length; i++) {
        if(course.name == courses_jo[i].course_name) {
            if(jQuery.isEmptyObject(courses_jo[i].prerequisite)) return "None";
               if(jQuery.isEmptyObject(courses_jo[i].prerequisite.or_choice)) return "None";
                  reqs = split(courses_jo[i].prerequisite.or_choice.and_required, ",");
                  for(var k = 0; k < reqs.length; k++) {
                      reqs[k] = substring(8); //cuts out "CMP SCI "
                  }
                  return reqs;
                 }
              }
        }

        /* Takes a course number as an argument and returns its name
         * Uses an html-embedded JSON
         */
        function GetCourseName(num) {
            for(var i = 0; i < courses_jo.length; i++) {
                if(num == courses_jo[i].course_number &&
                   courses_jo[i].subject == "CMP SCI")
                    return courses_jo[i].course_name;
            }
            return "No CMP SCI Course with that course number";
        }

        /* Takes a course name as an argument and returns its number
         * Uses an html-embedded JSON
         */
        function GetCourseNumber(name) {
            for(var i = 0; i < courses_jo.length; i++) {
                if(name == courses_jo[i].course_name &&
                   courses_jo[i].subject == "CMP SCI")
                    return courses_jo[i].course_number;
            }
            return "No CMP SCI course with that name";
        }

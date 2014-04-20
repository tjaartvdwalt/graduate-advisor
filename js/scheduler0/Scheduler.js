/* In fulfilling requirements of MakeSchedule, we are not prepared for more
 * than one prerequisite number; suggest parsing "non-serious" prerequisites
 * in GetPrereqs() itself.
 *
 * We need the Rotations JSON object as "jo"
 *
 */

var MAX_PER_SEMESTER = 4;
var ATTEMPTS = 100000;
var NEEDED_FIVES = 5;
var NEEDED_SIXES = 1;
var NEEDED_COURSES = 10;
var jo, cjo; //jo is the rotations xml, cjo is the courses xml
var sem_density = [];
var error_type;

//Takes an array of Course object and number of semesters, returns
//an array of Rotation objects
function MakeSchedule(selection, semesters, needed, JOi, CJOi) {
    NEEDED_COURSES = needed / 3;
    jo = JOi;
    cjo = CJOi;
    error_type = -1; //-1 no error, 0 semester overload, 1 prereq order
    var i, remaining_fives, num_courses = 0, crash_counter = 0;
    var Options = new Array();
    var Order = new Array();
    var Finished = new Array();
    sem_density = []; //reset sem_density each call to a 0 size array
    for(i = 0; i < semesters; i++)
        sem_density.push(0);
    var five_req = 0, six_req = 0, pre_req = false, pre_num;
    //Options arrays stores all Rotations of a given course
    for(var x in selection) {
        num_courses++;
        Options[x] = FindOptions(x, semesters, jo);
    }
    //Check to see if we fulfill requirements
    for(var x in Options) {
        if(x >= 6000) {
            six_req++;
            pre_num = GetPrereqs(Options[x], cjo);
        }
        else if(x >= 5000) {
            five_req++;
        }
    }
    for(var x in Options) {
        if(pre_num == i) {
            pre_req = true;
            break;
        }
    }
    //Fill 5000s if we need them
    if(five_req < NEEDED_FIVES) {
        remaining_fives = NEEDED_FIVES - five_req;
        for(i = 0; i < remaining_fives; i++) {
            var result = FindMaxOption(1, semesters, Options);
            if(result == -1) throw new function() {
                this.message = "Can't find a random 5000";
                this.name = "FiveFindError";
            }
            Options[result.number] = results.arr;
            num_courses++;
        }
    }
    //Fill 6000(s) if we need it (them)
    if(six_req < NEEDED_SIXES) {
        var result = FindMaxOption(2, semesters, Options);
        if(result == -1) throw new function() {
            this.message =  "Can't Fill a 6000";
            this.name = "SixFindError";
        }
        Options[result.number] = results.arr;
        Options[GetPrereqs(result.number, cjo)] =
            FindOptions(GetPrereqs(result.number, cjo), semesters);
        num_courses++;
    }
    //Fill random courses to get to course limit if we need it
    while(num_courses < NEEDED_COURSES) {
        var result = FindMaxOption(3, semesters, Options);
        if(result == -1) return "Can't Fill a Random Course";
        Options[result.number] = result.arr;
        num_courses++;
    }
    //Get a sorted indicator for the Options array
    for(i = 0; i < NEEDED_COURSES; i++) {
        Order[i] = FindMin(Options, Order);
    }
    for(i = 0; i < NEEDED_COURSES; i++) {
        Finished[Order[i]] = PickAppropriate(Order[i], Options)
        sem_density[Finished[Order[i]].sem - 1]++;
    }
    //Build a schedule according to the algorith; modify if necessary
    while(!Valid(Finished) && crash_counter < ATTEMPTS) {
        crash_counter++;
        if(error_type == 0) {   //semester overload error
            for(i = 0; i < semesters; i++) {
                if(sem_density[i] > MAX_PER_SEM) {
                    //MoveMax will modify sem_density counter
                    MoveMax(Finished, Order, Options);
                }
            }
        }
        if(error_type == 1) {   //prerequisite order error
            //ReOrderPreReq will modify sem_density counter
            ReOrderPrereq(Finished, Order, Options);
        }
    }
    if(crash_counter >= ATTEMPTS) return "Exhausted Attempts";
    return Finished;
}

//Search the XML for all Rotation Object occurrences within a semester threshold
//for a given course_number. Returns an array of all occurrences in the form of
//objects {course = actual course object; year = year offered; sem = 0-N format
//of what semester it is offered distanced from current semester (0 is next, etc.)
function FindOptions(course_number, semesters, jo) {
    var result = [];
    for(var i = 0; i < jo.rotation_year.length; i++)
        for(var k = 0; k < jo.rotation_year[i].course.length; k++) {
            if(jo.rotation_year[i].course[k].subject != "CMP SCI" ||
               jo.rotation_year[i].course[k].course_number != course_number) continue;
            for(var j = 0; j < jo.rotation_year[i].course[k].rotation_term.length; j++) {
                if(jQuery.isEmptyObject(jo.rotation_year[i].course[k].rotation_term[j].time_code))
                    continue;
                var temp = new Object();
                temp.course = jo.rotation_year[i].course[k];
                temp.year = jo.rotation_year[i].year;
                if(jo.rotation_year[i].course[k].rotation_term[j].term == "Fall")
                    temp.sem = 2*i+1;
                else
                    temp.sem = 2*i+2;
                if(temp.sem > semesters)  continue; //threshold at a semester limit
                result.push(temp);
            }
        }
    return result;
}

//Returns the course option that satisfies the provided "type" and has the
//most occurrences of any other similarly-fulfilling course. Avoids picking
//already selected courses. type 1 picks a 6000, 2 picks a 5000, 3 picks a 4000
function FindMaxOption(type, semesters, filled) {
    var course_numbers = [];
    var temp_sem;
    var variety = new Array();
    var skipflag = false;
    var max_opts = 0, max_ind = -1;
    //Create a list of courses that potentially satisfy the requirements and their occurrences
    for(var i = 0; i < jo.rotation_year.length; i++)
        for(var k = 0; k < jo.rotation_year[i].course.length; k++) {
            skipflag = false;
            //Skip courses that aren't CMP SCI
            if(jo.rotation_year[i].course[k].subject != "CMP SCI") continue;
            //Skip courses we already have
            for(var j in filled) {
                if(jo.rotation_year[i].course[k].course_number ==
                   filled[j][0].course.course_number) skipflag = true;
            }
            if(skipflag) continue;
            for(var l = 0; l < jo.rotation_year[i].course[k].rotation_term.length; l++) {
                if(jQuery.isEmptyObject(jo.rotation_year[i].course[k].rotation_term[l].time_code)) continue;
                //Threshold at a semester limit
                if(jo.rotation_year[i].course[k].rotation_term[l].term == "Fall")
                    temp_sem = 2*i+1;
                else temp_sem = 2*i+2;
                if(temp_sem > semesters) continue;

                if(type == 1) {
                    if(jo.rotation_year[i].course[k].course_number >= 6000) {
                        //Only include those that actually have the Pre-req available before them
                        if(!HasOccurrence(GetPrereqs(jo.rotation_year[i].course[k].course_number, cjo), temp_sem))
                            continue;
                        variety[jo.rotation_year[i].course[k].course_number]++;
                    }
                }
                if(type == 2) {
                    if(jo.rotation_year[i].course[k].course_number < 6000 &&
                       jo.rotation_year[i].course[k].course_number >= 5000) {
                        variety[jo.rotation_year[i].course[k].course_number]++;
                    }
                }
                if(type == 3) {
                    if(jo.rotation_year[i].course[k].course_number < 5000 &&
                       jo.rotation_year[i].course[k].course_number >= 4000) {
                        variety[jo.rotation_year[i].course[k].course_number]++;
                    }
                }
            }
        }
    //Determine which of the courses stored above have the highest number of options
    for(var i in variety) {
        if(variety[i] > max_opts) {
            max_ind = i;
            max_opts = variety[i];
        }
    }
    if(max_ind == -1) return -1;
    return FindOptions(max_ind, semesters);
}

//Searches the Options array associative array, excludes choices already in
//the Order array, and then returns the remaining course option with the fewest choices
function FindMin(Options, Order) {
    var skipflag, max_opt = 0, max_ind = -1;
    for(var i in Options) {
        skipflag = false;
        for(var j = 0; j < Order.length; j++) {
            if(i == Order[j]) skipflag = true;
        }
        if(skipflag) continue;
        if(Options[i].length > max_opt) {
            max_opt = Options[i].length;
            max_ind = i;
        }
    }
    return max_ind;
}

//Returns true if the provided course number occurs before the specified
//semester and returns false if not
function HasOccurrence(course_number, sem) {
    var temp_sem;
    if(sem < 2) return false;
    for(var i = 0; i < jo.rotation_year.length; i++)
        for(var k = 0; k < jo.rotation_year[i].course.length; k++) {
            if(jo.rotation_year[i].course[k].course_number != course_number ||
               jo.rotation_year[i].course[k].subject != "CMP SCI") continue;
            for(var j = 0; j < jo.rotation_year[i].course[k].rotation_term.length;j++) {
                if(jQuery.isEmptyObject(jo.rotation_year[i].course[k].rotation_term[j].time_code))
                    continue;
                if(jo.rotation_year[i].course[k].rotation_term[j].time_code == "Fall")
                    temp_sem = 2*i+1;
                else temp_sem = 2*i+2;
                if(temp_sem < sem) return true;
            }
        }
    return false;
}

//Takes in a course number, selects the occurrence of that course that
//occurs in the semester with the fewest classes,  returns it in a modified
//rotation object
function PickAppropriate(course_number, Options) {
    var min_val = 100, min_ind = -1;
    for(var i = 0; i < Options[course_number].length; i++) {
        if(sem_density[Options[course_number][i].sem - 1] < min_val) {
            min_val = sem_density[Options[course_number][i].sem - 1];
            min_ind = i;
        }
    }
    return Options[course_number][min_ind];
}

//Moves the first-encountered course that is in an "overloaded" semester and moves
//it to a non-overloaded semester (will try to move only max-varied course)
function MoveMax(Finished, Orderi, Options) {
    var max_val = 0, max_ind = -1, old_sem;
    for(var i = 0; i < sem_density.length; i++) {
        //For each semester that is overloaded
        if(sem_density[i] >  MAX_SEM_PER_SEMESTER) {
            //Find its most-varied course
            for(var j in Finished) {
                //avoids fighting ReOrderPrereq over course movement
                if(Finished[j].course.course_number >= 6000) continue;
                if(Finished[j].sem - 1 == i) {
                    if(Options[j].length > max_val) {
                        max_val = Options[j].length;
                        max_ind = j; //course number of most-varied course
                    }
                }
            }
            //Move the most-varied course to a new, viable semester and update countersa
            old_sem = Finished[j].sem - 1;
            Finished[j] = PickAppropriate(j, Options);
            sem_density[old_sem]--;
            sem_density[Finished[j].sem - 1]++;
            return; //Exit after discovering the first violation
        }
    }

}

//If a pre-requisite order violation is encountered, this moves the 6000
//or the prereq to a different, appropriate spot (and updates sem_density)
function ReOrderPrereq(Finished, Order, Options) {
    var pn, six, max_val = 0, max_ind = -1, min_val = 1000, min_ind = -1;
    var old_sem;
    for(var i in Finished) {
        if(i >= 6000) {
            pn = GetPrereqs(Finished[i].course, cjo);
            six = i;
            break;
        }
    }
    //Move the pre-req as early as is viable and the 6000 as late
    //as viable
    for(var i=0; i < Options[six].length; i++) {
        if(Options[six][i].sem >= max_val) {
            if(sem_density[Options[pn][i].sem - 1] >= MAX_PER_SEM) continue;
            max_val = Options[six][i].sem;
            max_ind = i;
        }
    }
    for(var i = 0; i < Options[pn].length; i++) {
        if(Options[pn][i].sem <= min_val) {
            if(sem_density[Options[pn][i].sem - 1] >= MAX_PER_SEM) continue;
            min_val = Options[pn][i].sem;
            min_ind = i;
        }
    }
    //No point in swapping if we had the best values from the beginning
    if(max_val == Finished[six].sem && min_val == Finished[pn].sem) return;
    //Move the courses to their appropriate fields
    old_sem = Finished[six].sem;
    Finished[six] = Options[six][max_ind];
    sem_density[old_sem]--;
    sem_density[max_val-1]++;
    old_sem = Finished[pn].sem;
    Finished[pn] = Options[pn][min_ind];
    sem_density[old_sem]--;
    sem_density[min_val-1]++;
}

//Returns true if the schedule has no overload (type 0) errors or prereq
//(type 1) errors and sets the error_type flag accordingly
function Valid(Finished) {
    var pn, six;
    for(var i in Finished) {
        if(i >= 6000) {
            pn = GetPrereqs(Finished[i].course,cjo);
            six = i;
            break;
        }
    }
    //We check for overload errors first so that they are corrected
    //before we try to move around prerequisites
    for(var i = 0; i < sem_density.length; i++) {
        if(sem_density[i] > MAX_PER_SEMESTER) {
            error_type = 0;
            return false;
        }
    }
    if(Finished[pn].sem >= Finished[six].sem) {
        error_type = 1;
        return false;
    }
    return true;
}

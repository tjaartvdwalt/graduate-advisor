/* In fulfilling requirements of MakeSchedule, we are not prepared for more
 * than one prerequisite number; suggest parsing "non-serious" prerequisites
 * in GetPrereqs() itself.
 *
 * We need the Rotations JSON object as "jo"
 */

var MAX_PER_SEMESTER = 4;
var ATTEMPTS = 100000;
var NEEDED_FIVES = 6;
var NEEDED_SIXES = 1;
var NEEDED_COURSES = 10;
var jo;

//Takes an array of Course object and number of semesters, returns
//an array of Rotation objects
function MakeSchedule(selection, semesters, needed, JOi) {
	NEEDED_COURSES = needed;
	jo = JOi;
	var error_type = -1; //-1 no error, 0 semester overload, 1 prereq order
	var sem_density = [];
	var i, remaining_fives, num_courses = 0, crash_counter = 0;
	var Options = new Array();
	var Order = new Array();
	var Final = new Array();
	var Core_Courses = [4760, 4250, 5700, 5500, 5130];

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
		if(i >= 6000) {
			six_req++;
			pre_num = GetPrereqs(Options[x]);
		}
		else if(i >= 5000) {
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
		remaining_fives = NEEDED_FIVES - fives_req;
		for(i = 0; i < remaining_fives; i++) {
			var result = FindMaxOption(1, semesters, Options);
			if(result == -1) return "Can't Fill a 5000";
			Options[result.number] = results.arr;
			num_courses++;
		}
	}
	//Fill 6000(s) if we need it (them)
	if(six_req < NEEDED_SIXES) {
		var result = FindMaxOption(2, semesters, Options);
		if(result == -1) return "Can't Fill a 6000";
		Options[result.number] = results.arr;
		Options[GetPrereqs(result.number)] = 
				FindOptions(GetPrereqs(result.number), semesters);
		num_courses++;	
	}
	//Fill random courses to get to course limit if we need it
	while(num_courses < NEEDED_COURSES) {
		var result = FindRandomCourse(0, semesters, Options);
		if(result == -1) return "Can't Fill a Random Course";
		Options[result.number] = result.arr;
		num_courses++;
	}
	//Get a sorted indicator for the Options array
	for(i = 0; i < NEEDED_COURSES; i++) {
		Order[i] = FindMin(Options, Order);
	}
	for(i = 0; i < NEEDED_COURSES; i++) {
		Final[Order[i]] = PickAppropriate(Order[i])
	}
	//Build a schedule according to the algorith; modify if necessary
	while(!Valid(Final) && crash_counter < ATTEMPTS) {
		crash_counter++;
		if(error_type == 0) {   //semester overload error
			for(i = 0; i < semesters; i++) {
				if(sem_density[i] > MAX_PER_SEM) {
					MoveMax(Final, Order);
				}
			}
		}
		if(error_type == 1) {   //prerequisite order error
			ReOrderPreReq(Final, Order);
		}
	}
	if(crash_counter >= ATTEMPTS) return "Exhausted Attempts";
	return Final;
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
		if(jQuery.isEmptyObject(jo.rotation_year[i].course[k].rotation_term[l].time_code))
			continue;
		var temp = new Object();	
		var temp.course = jo.rotation_year[i].course[k];
		var temp.year = jo.rotation_year[i].year;
		var temp.sem = jo.rotation_year[i].course[k]
		if(jo.rotation_year[i].course[k].rotation_term[l].term == "Fall")
                	temp.sem = 2*i+1;
                else 
                        temp.sem = 2*i+2;
		result.push(temp);
	}	
	}
	return result;	
}

//Returns the course option that satisfies the provided "type" and has the 
//most occurrences of any other similarly-fulfilling course. Avoids picking
//already selected courses. type 1 picks a 6000, 2 picks a 5000
function FindMaxOption(type, semesters, filled) {
	var course_numbers = [];
	var variety = new Array();
	var skipflag = false;
	var max_opts = 0, max_ind = -1;
	//Create a list of courses that potentially satisfy the requirements
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
			if(type == 1) {
				if(jo.rotation_year[i].course[k].course_number >= 6000) {
					if(jQuery.isEmptyObject(jo.rotation_year[i].course[k].ro	
				}
			if(type == 2) {
				if(jo.rotation_year[i].course[k].course_number < 6000 &&
					jo.rotation_year[i].course[k].course_number >= 5000) {
					course_numbers.push(jo.rotation_year[i].course[k].course_number);
				}

			}
		}	
	}
	//Determine which of the courses stored above have the highest number of options
}

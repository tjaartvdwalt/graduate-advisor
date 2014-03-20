/* This code requires a number of globally defined variables: 
 * MAX_SEMESTERS	number of semesters in the rotation
 * MAX_PER_SEM		number of courses, max, per semester
 * Courses_Available	array that stores course objects from the embed. JSON
 *
 * Currently does not implement prerequisite checking.
 */

/* Takes a list of courses parsed by MakeList and returns an array that
 * stores arrays with integer values that correspond to the "time" when 
 * a course can be taken (in the same order). Eliminates schedules that
 * violate the maximum number of courses per semester and prerequisite
 * violations for 6000-level courses
 */
function CheckList(list_obj) {
	var a,b,c,d,e,f,g,h,i,j,k, flag;
	var temp = [];
	var schedules = [];
	var result = [];
	var max_track = [];
	var list = list_obj.schedule;
        console.log(list)
	for(i = 0; i < MAX_SEMESTERS; i++) {
		max_track.push(0);
	}
	//For all 10 courses we need a heavily nested loop
	for(a = 0; a < list[0].times.length; a++)
	for(b = 0; b < list[1].times.length; b++)
	for(c = 0; c < list[2].times.length; c++)
	for(d = 0; d < list[3].times.length; d++)
	for(e = 0; e < list[4].times.length; e++)
	for(f = 0; f < list[5].times.length; f++)
	for(g = 0; g < list[6].times.length; g++)
	for(h = 0; h < list[7].times.length; h++)
	for(i = 0; i < list[8].times.length; i++)
	for(j = 0; j < list[9].times.length; i++) {
		temp=[list[0].times[a],list[1].times[b],
			list[2].times[c],list[3].times[d],
			list[4].times[e],list[5].times[f],
			list[6].times[g],list[7].times[h],
			list[8].times[i], list[9].times[j]];
		schedules.push(temp);
	}
	//Check validity of each
	for(i = 0; i < schedules.length; i++) {
		for(k = 0; k < MAX_SEMESTERS; k++) {
			max_track[k] = 0;
		}
		flag = 0;
		for(h = 0; h < list_obj.sixes.length; h++) {
                        for(j = 0; j < list_obj.pres[h].length; j++) {
                               if(schedules[i][list_obj.pres[h][j]] >=
                                       schedules[i][list_obj.sixes[h]])
                                     flag = 1;
                	}
                }
		if(flag) continue; //if there's a prereq error, we know to ignore it
		for(k = 0; k < schedules[i].length; k++) {
			max_track[schedules[i][k]]++;
			if(max_track[schedules[i][k]] > MAX_PER_SEM) flag = 1;
		}
		if(flag == 0) result.push(schedules[i]);
	}
	return result;
}

/* Takes an array of course objects and parses it into a list
 * of objects with a "time" field that is an array that stores
 * all possible time combinations. It returns an object with three fields,
 * "sixes" which stores the indices at which 6000's occur, "pres" which stores
 * the course numbers of prerequisites at the same index as sixes, and "list"
 * which stores the abovementioned list.
 */
function MakeList(sched, Courses_Available) {
	var i,k,j, h;
	var result = [];
	var sixes = [];
	var pres = [];
	var prereqs = [];
	var t = [];
        i=0;
	for(var course in sched) {
		var temp = new Object();
		temp.times = [];
		//Mark where prerequisites are
		if(sched[course].course_number >= 6000) {
			prereqs = GetPrereqs(sched[course]);
			sixes.push(i++);	//store where the 6 occurs
			var reqs = [];
			//find where its prereqs occur
                        j = 0;
			for(var course2 in sched) {
				for(h = 0; h < prereqs.length; h++) {
					var temp_arr = [];
					if(prereqs[h] == GetCourseNumber(sched[course2].course_name)) {
						reqs.push(j++);
					}
				}
			}
			t.push(reqs);
		}
		//Find all instances of the course in Courses_Available and add their times
		for(k = 0; k < Courses_Available.length; k++) {
			for(j = 0; j < Courses_Available[k].length; j++) {

				if(Courses_Available[k][j].name == sched[course].course_name) 
					temp.times.push(Courses_Available[k][j].sem);
			}
		}	
		result.push(temp);	
	}
	var final = new Object();
	final.sixes = sixes;
	final.pres = t;
	final.schedule = result;
	return final;
}

/* Convenience function that combines the two above. Takes a list of choices
 * (the user's course selections) and returns a 2D array of the form:
 * Schedule 1: [Course 1: [{a,b,c,d,e,f,g,h,i,j}]
 * 	       [ Course 2: [{b,a,e,c,d,h,g,f,j,i}]
 * 	       etc.
 * Schedule 2: [Course 1: [{a,c,b,d,e,f,h,g,j,i}]
 * 	       [Course 2: [{c,b,d,e,f,g,a,h,i,j}]
 * 	       etc.
 * Where a-j represent integers 0-MAX_SEMESTERS and designate when the course
 * in the given choice-ordering should go. For example, when given a series of course
 * choices "A-J" (note capitals), result[0][0] represents in what semester course A
 * should be taken. result[0][1] represents the first option for what semester Course B
 * should be taken. result[1][X] represents the next possible schedule (if any).
 * A choice series that has no viable schedules will return an array length 0. */
function GetSchedules(choices, available) {
	var List_Obj = MakeList(choices, available);
	return CheckList(List_Obj);
}

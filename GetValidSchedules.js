/* NOTES:
	-All courses are represented as objects with their name ("name", string), semester offered ("sem", int 1-6), timeslot offered ("time", string-E/D),
	prerequisite requirements("prereq", a course object), course level ("level", int 4=4000, 5=5000, 6=6000, core=a core course)
	-Graduation requirements are hard-coded, mainly because I haven't thought up
	a convenient way to make them flexible based on the XML
*/

//GLOBAL VARIABLES
var MAX_SEMESTERS = 6;			  //shouldn't change unless the XML itself changes
var MAX_COURSES_PER_SEMESTER = 4; //could be 5, with overrides
var Req6 = false;	//These are hardcoded requirements globals, that we can set in
var Req5 = false;	//Get_Courses_Taken in case we have already fulfiled some reqs
var ReqC = false;
var Req4 = false;

/* Get course offering in JSON from XML and parse to 2D array */
function Get_Courses_Offered() {}

/* Get courses taken in JSON/or user input format and parse to 1D array*/
function Get_Courses_Taken() {}

/* Returns a 2D array representing courses offered in XML minus those
we have already taken
*/
function Get_Courses_Available(Courses_Taken, Courses_Offered) {
	CA = new array(MAX_SEMESTERS);
	for(var i=0; i<MAX_SEMESTERS;i++) {
		CA[i] = new array(0);
	}
	//Clear out repeated courses
	for(var i=0; i<MAX_SEMESTERS;i++) {
		for(var k=0; k<MAX_COURSES_PER_SEMESTER; k++) {
			for(var j=0; j < Courses_Taken.length; j++) {
				if(Courses_Taken[j].name == Courses_Offered[i][k].name) {
						delete Courses_Offered[i][k];		//We delete it, so it's undef
						break;
				}
			}
		}
	}
	//Copy to a new array, excluding repeats
	for(var i=0; i<MAX_SEMESTERS;i++) {
		for(var k=0; k<MAX_COURSES_PER_SEMESTER; k++) {
			if(typeof(Courses_Offered[i][k]) != "undefined") {
				CA[i].push(Courses_Offered[i][k]);
			}
		}
	}
	return CA;
}

/* Seperate courses available into "requirements bins" that are
filled with all courses of that group. Return this 2D array.
*/ 
function Get_Required_Offerings(CA) {
	//HARDCODED REQUIREMENTS ARRAY
	RO = new array(4);
	RO[0] = new array(0);	//Core
	RO[1] = new array(0);	//6000
	RO[2] = new array(0);	//5000
	RO[3] = new array(0);	//4000
	//Create "bins"
	for(var i=0; i<MAX_SEMESTERS;i++) {
		for(var k=0; k<MAX_COURSES_PER_SEMESTER; k++) {
			switch(CA[i][k].level) {
				case 'core':
					RO[0].push(CA[i][k]);
					break;
				case '6':
					RO[1].push(CA[i][k]);
					break;
				case '5':
					RO[2].push(CA[i][k]);
					break;
				case '4':
					RO[3].push(CA[i][k]);
					break;	
			}
		}
	}
	return RO;
}

/* Create combinatorial pools of each requirement that show
all possible combinations of each requirement group. If a particular
group is already finished, we mark the first element in the relevent array
as "DONE". If it isn't DONE and there are no combinations, we mark it as 
"NONE", signifying it is impossible.
Otherwise, the Ropt arary will be structured as followed
Ropt[0] = all permutations of core requirements; e.g. AB, ADE, ABCDE 
Ropt[1] = all permutations of 6000 requirements;
etc. 
(note that this means Ropt[x] holds variable sized arrays and single choices
Removal of duplicate courses (course A in the fall and spring of year XXXX) is done
AFTER permutation creation
NOTE: This entire function is HARDCODED REQUIREMENTS 
*/
function Get_Required_Options(RO, Courses_Taken) {
	Ropt = new array(4);
	Ropt[0] = new array(0);		//Core
		if(ReqC) Ropt[0].push("DONE");
		else if(RO[0].length == 0) Ropt[0].push("NONE");
	Ropt[1] = new array(0);		//6000
		if(Req6) Ropt[1].push("DONE");
		else if(RO[1].length == 0) Ropt[1].push("NONE");
	Ropt[2] = new array(0);		//5000
		if(Req5) Ropt[2].push("DONE");
		else if(RO[2].length == 0) Ropt[2].push("NONE");
	Ropt[3] = new array(0);		//4000
		if(Req4) Ropt[3].push("DONE");
		else if(RO[3].length == 0) Ropt[3].push("NONE");
	//Create combinatorial bins
	if(Ropt[0].length == 0) {
		//Case = 1
		for(var i = 0; i < RO[0].length; i++) {
			Ropt[0].push(RO[0][i]);
		}
		//Case = 2
		if(RO[0].length > 1) {
			for(var i = 0; i < RO[0].length-1; i++) {
				for(var k = i+1; k < RO[0].length; k++) {
					var temp = [RO[0][i], RO[0][k]];
					Ropt[0].push(temp);
				}
			}
		}
		//Case = 3
		if(RO[0].length > 2) {
			for(var i = 0; i < RO[0].length-2; i++) {
				for(var k = i+1; k < RO[0].length-1; k++) {
					for(var j = k+1; j < RO[0].length; j++) {
						var temp = [RO[0][i], RO[0][k], RO[0][j]];
						Ropt[0].push(temp);
					}
				}
			}	
		}
		//Case = 4
		if(RO[0].length > 3) {
			for(var i = 0; i < RO[0].length-3; i++) {
				for(var k = i+1; k < RO[0].length-2; k++) {
					for(var j = k+1; j < RO[0].length-1; j++) {
						for(var l = j+1; l < RO[0].length; l++) {
							var temp = [RO[0][i], RO[0][k], RO[0][j], RO[0][l]];
							Ropt[0].push(temp);
						}
					}
				}
			}	
		}
		//Case = 5	
		if(RO[0].length > 4) {
			for(var i = 0; i < RO[0].length-4; i++) {
				for(var k = i+1; k < RO[0].length-3; k++) {
					for(var j = k+1; j < RO[0].length-2; j++) {
						for(var l = j+1; l < RO[0].length-1; l++) {
							for(var m = l+1; m < R0[0].length; m++) {
								var temp = [RO[0][i], RO[0][k], RO[0][j], RO[0][l], RO[0][m]];
								Ropt[0].push(temp);
							}
						}
					}
				}
			}	
		}	
	}
	if(Ropt[1].length == 0) {
		for(var i = 0; i < RO[1].length; i++) {
			var prflag = false;
			//Check to see if we've taken the pre-req already
			for(var k = 0; k < Courses_Taken.length; k++) {
				if(RO[1][i].prereq.name == Courses_Taken[k].name) {
					prflag = true;
					break;
				}
			}
			if(prflag) {
				Ropt[1].push(RO[1][i]);	
			} else {
				var lvl = RO[1][i].prereq.level;
				if(lvl == "C") lvl = 0;
				if(lvl == 6) lvl = 1;
				if(lvl == 5) lvl = 2;
				if(lvl == 4) lvl = 3;
				//We're pulling out of another requirements bin below, so we risk
				//repeats, but we take care of ALL repeats at a later point
				for(var k = 0; k < 	RO[lvl].length; k++) {
					if(RO[lvl][k].name == RO[1][i].prereq.name) {
							var temp = [RO[1][i], RO[lvl][k]];
							Ropt[1].push(temp);
					}
				}
			}
		}
	}
	//Only need 3 5000 level courses (18 Hrs, 9 in Cores)
	if(Ropt[2].length == 0) {
		//Case 1
		for(var i = 0; i < RO[2].length; i++) {
			Ropt[2].push(RO[2][i]);
		}
		//Case 2
		for(var i = 0; i < RO[2].length-1; i++) {
			for(var k = i+1; k < RO[2].length; k++) {
				var temp = [RO[2][i], RO[2][k]];
				Ropt[2].push(temp);
			}
		}	
		//Case 3
		for(var i = 0; i < RO[2].length-2; i++) {
			for(var k = i+1; k < RO[2].length-1; k++) {
				for(var j = k+1; j < RO[2].length; j++) {
					var temp = [RO[2][i], RO[2][k], RO[2][j]];
					Ropt[2].push(temp);
				}
			}
		}	
	}
	//We blend the 5000 and 4000 arrays here so that you don't NEED 4000 level courses
	if(Ropt[3].length == 0) {
		//Between Core courses (5), the 6000 (1), the three 5000s (3), we could only need, AT MOST, 1 extra
		for(var i = 0; i < RO[2].length; i++) {
			Ropt[3].push(RO[2][i]);	
		}
		for(var i = 0; i < RO[3].length; i++) {
			Ropt[3].push(RO[3][i]);	
		}
	}
	
	return Ropt;
}

/* Checks a provided array (a set of courses) for validity based on:
	1. Actually meets requirements
	2. Is no more (or less) than 10 courses
	3. Contains no repeats
	4. A prereq is taken before its parent (or exists at all)
	5. No semester is above MAX_COURSES_PER_SEMESTER
	
	And of course: HARDCODED REQUIREMENTS
*/
function VerifyPath(p, Courses_Taken) {
	var a=0,b=0,c=0,d=0,e=0,f=0; //represents courses taken during all six semesters
	var six = false, core = 0, five = 0; //Counters for reqs - note that for these we don't need to
	//keep track of whether or not we have the pre-req, or if we repeat five thousand level courses
	//because we later we wil fail any repetitious schedule anyway. "four" would be irrelevant, as it gets
	//checked in total hours by default
	var pre=-1, act=0; //represent the semester in which the 6000/prereq are taken
	var pre_name;
	obj={}; //used for duplicate checking later
	
	//THE FOLLOWING FOR LOOPS ARE SEPERATED FOR CLARITY - IT MAY BE NOTICEABLY MORE EFFICIENT TO COMBINE THEM
	//First let's update counters from Courses_Taken, they can't repeat because we check that back in
	//Get_Courses_Available
	for(var i=0; i < Courses_Taken.length; i++) {
		switch(Courses_Taken[i].level) {
			case 'C':
				core++;
				break;
			case '6':
				six = true;
				break;
			case '5':
				five++;
				break;
		}
	}
	for(var i=0; i < p.length; i++) {
		if(p[i].level == 6)	{
			act = p[i].sem;					//Record when the 6000 occurs
			pre_name = p[i].prereq.name;	
		}
	}
	for(var i=0; i < p.length; i++) {
		switch(p[i].sem) {
			case '1': a++; break;
			case '2': b++; break;
			case '3': c++; break;
			case '4': d++; break;
			case '5': e++; break;
			case '6': f++; break;
		}
		switch(p[i].level) {
			case 'C':
				core++;
				break;
			case '6':
				six = true;
				break;
			case '5':
				five++;
				break;
		}
		if(p[i].name == pre_name) pre = p[i].sem;		//Record when the prereq occurs
	}
	if(a > MAX_COURSES_PER_SEMESTER || b > MAX_COURSES_PER_SEMESTER || c > MAX_COURSES_PER_SEMESTER
		 || d > MAX_COURSES_PER_SEMESTER || e > MAX_COURSES_PER_SEMESTER || f > MAX_COURSES_PER_SEMESTER) return false;
	if(pre >= act || pre == -1) return false;
	//Duplicate removal - genius stackoverflow advice
	for(var i=0; i < p.length; i++) {
		obj[p[i].name]=0;	
	}
	for(i in obj) {
		temp.push(i);
	}
	if(temp.length != p.length) return false;
	//Check to ensure we meet requirements
	if(core != 5 || six == false || five != 3) return false;
	//Check to make sure we have the right amount of hours
	if(Courses_Taken.length + p.length != 10) return false;
	
	return true;	
}

/* Takes the provided Ropt that contains all possible combinations of all requirements bins
	and creates an array populated by all possible course paths, calls VerifyPath to ensure
	they're valid, then returns the set of valid paths
*/
function CreatePossiblePaths(Ropt) {
	var PP = [];
	for(var i = 0; i < Ropt[0].length; i++) {
		if(Ropt[0][i] == "NONE") return -1;		//If there are NO possibilities, don't even try others and notify us with -1 ret value
		for(var k = i+1; k < Ropt[1].length; k++) {
			if(Ropt[1][k] == "NONE") return -1;
			for(var j = k+1; j < Ropt[2].length; j++) {
				if(Ropt[2][j] == "NONE") return -1;
				for(var l = j+1; l < Ropt[3].length; l++) {
					if(Ropt[3][l] == "NONE") return -1;
					var temp = [Ropt[0][i], Ropt[1][k], Ropt[2][j], Ropt[3][l]];
					PP.push(temp);	
				}
			}
		}
	}
	
	//Check all paths for validity (no repeats, actual satisfy reqs)
	var VP = [];
	for(var i = 0; i < PP.length; i++) {
		if(VerifyPath(PP[i])) VP.push(PP[i]);	
	}
	return VP;	
}

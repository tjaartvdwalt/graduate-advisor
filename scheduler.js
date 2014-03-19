//This function is going to take an input of all classes in a semester and all classes taken so far
// and choose x classes to
// attend and return the scheduled classes with these added.
function course(level,courseName,courseNumber, creditHours)
{
	this.courseName = name;
	this.level = level;
	this.courseNumber = courseNumber;
	this.creditHours = creditHours;
	//All of these can be undefined. If a variable is undefined, it is considered to mean
	//Any course of that level. This can be used for the requirements var
}

function restriction(dayOrNight, maxHours){
	this.dayOrNight = dayOrNight;
	this.maxHours = maxHours;
}

function scheduleSemesterClasses(courseLimit, availableCourses, availableStartingIndex, coursesTaken, takenStartingIndex){
	var takenIndex = takenStartingIndex;
	var outList = [];
	for(var availableIndex = availableStartingIndex; availableIndex < availableCourses.length; availableIndex++){
		while(coursesTaken.length != 0 && availableCourses[availableIndex] < coursesTaken[takenIndex]){ // make sure that we are comparing the closest higher course taken next
			takenIndex++;
		}
		if((coursesTaken.length == 0 || coursesTaken[takenIndex] != availableCourses[availableIndex]) && courseLimit == 1){
			//if this course hasn't been taken
			outList.push([availableCourses[availableIndex]])
		}else if(coursesTaken != availableCourses[availableIndex]){
			outList = outList.concat(permutate(availableCourses[availableIndex], scheduleSemesterClasses(courseLimit-1, availableCourses, availableIndex+1, coursesTaken, takenIndex)));
		}
	}	

	return outList;
}

function permutate(courseToPerm, listToPerm){
	//courseToPerm is an int
	//listToPerm is an Array of Arrays of ints
	var outList = [];
	for(var x =0; x < listToPerm.length; x++){
		outList.push([courseToPerm].concat(listToPerm[x]));
	}

	return outList;
}

//This is the main function of the program
function scheduleAll(totalCourses, coursesPerSemester, coursesAvailable){
	//just scheduling fall of 2013 right now
	var courseNumberAvailableList = [];
	var courseNumberTakenList = [];

	for(var x = 0; x < coursesAvailable.length; x++){
		if(coursesAvailable[x].year == 2014 && coursesAvailable[x].semester == "Fall"){
			courseNumberAvailableList.push(coursesAvailable[x].courseNumber);
		}
	}

	courseNumberAvailableList.sort();
	console.log(scheduleSemesterClasses(3, courseNumberAvailableList, 0 , courseNumberTakenList, 0));


}

//I think that by ordering the schedules from smallest course number to largest,
//we can find if an array is completely unique in nlogn time.

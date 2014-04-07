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
		while( takenIndex < coursesTaken.length-1&& availableCourses[availableIndex] > coursesTaken[takenIndex]){ // make sure that we are comparing the closest higher course taken next
			takenIndex++;
		}
		if((coursesTaken.length == 0 || coursesTaken[takenIndex] != availableCourses[availableIndex]) && courseLimit == 1){
			//if this course hasn't been taken
			outList.push([availableCourses[availableIndex]])
		}else if(coursesTaken[takenIndex] != availableCourses[availableIndex]){
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

//	for(var x = 0; x < coursesAvailable.length; x++){
//		if(coursesAvailable[x].year == 2014 && coursesAvailable[x].semester == "Fall"){
//			courseNumberAvailableList.push(coursesAvailable[x].courseNumber);
//		}
//
	var seasonList = ["Spring", "Fall"];

	var startDate = [2014, 1]

	var numberOfCoursesToTake = totalCourses;

	var potentialSolutions = [];
	potentialSolutions.push([]);

	var semesterIndex = 0;
	var courseLimitCurrentSemester;

	while(potentialSolutions[0].length < numberOfCoursesToTake){

		if(numberOfCoursesToTake-potentialSolutions[0].length < coursesPerSemester){
			courseLimitCurrentSemester = numberOfCoursesToTake-potentialSolutions[0].length;
		}else{
			courseLimitCurrentSemester = coursesPerSemester;
		}

		//reset the coursesAvailable list
		courseNumberAvailableList = getCoursesAvailableThisSemester(coursesAvailable, startDate, semesterIndex, seasonList);
		

		if(courseNumberAvailableList.length == 0){
			break;
		}
		var newPotentialSolutions = [];

		for(var y = 0; y < potentialSolutions.length; y++){
			newPotentialSolutions = newPotentialSolutions.concat(combineTakenAndNew(potentialSolutions[y],scheduleSemesterClasses(courseLimitCurrentSemester, courseNumberAvailableList, 0 , potentialSolutions[y], 0)));
		}
		if(newPotentialSolutions.length == 0){
			newPotentialSolutions.push([]);
		}else{
			newPotentialSolutions = removeNonUnique(newPotentialSolutions)
		}
		potentialSolutions = newPotentialSolutions;

		semesterIndex++;
	}

	console.log(potentialSolutions);
	//courseNumberAvailableList.sort();
	//console.log(scheduleSemesterClasses(3, courseNumberAvailableList, 0 , courseNumberTakenList, 0));

}

function combineTakenAndNew(takenCourses, newCourses){
	//taken []
	//new [[]]
	var outList = [];
	for(var x =0; x < newCourses.length; x++){
		outList.push(takenCourses.concat(newCourses[x]));
	}
	for(var y=0; y < outList.length; y++){
		outList[y] = outList[y].sort();
	}

	return outList;

}

function removeNonUnique(inList){
	var listToSearch = inList.sort(function(a,b){
		for(var index=0; index < a.length; index++){
			if(parseInt(a[index]) - parseInt(b[index]) != 0){
				return parseInt(a[index]) - parseInt(b[index]);
			}
		}
		return 0;
	});
	var outList = [listToSearch[0]];
	for(var x = 0; x < listToSearch.length; x++){
		var addToList = false;
		for(var y = 0; y < listToSearch[x].length; y++){
			if(outList[outList.length-1][y] != listToSearch[x][y]){
				addToList = true;
			}
		}
		if(addToList){
			outList.push(listToSearch[x]);
		}
	}

	return outList;
}

function getCoursesAvailableThisSemester(coursesAvailable, startDate, semesterIndex, seasonList){
	var coursesAvailableReturn =[];
	var currentYear = startDate[0] + parseInt(semesterIndex/seasonList.length);
	var currentMonth = seasonList[(semesterIndex+startDate[1])%seasonList.length];
	for(var x = 0; x < coursesAvailable.length; x++){
		if(coursesAvailable[x].year == currentYear && coursesAvailable[x].semester == currentMonth){
			coursesAvailableReturn.push(coursesAvailable[x].courseNumber);
		}
	}
	coursesAvailableReturn.sort();
	return coursesAvailableReturn;
}

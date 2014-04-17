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
		while( takenIndex < coursesTaken.length && availableCourses[availableIndex].courseNumber > coursesTaken[takenIndex].courseNumber){ // make sure that we are comparing the closest higher course taken next
			takenIndex++;
		}
		if((takenIndex >= coursesTaken.length || coursesTaken.length == 0 || coursesTaken[takenIndex].courseNumber != availableCourses[availableIndex].courseNumber) && courseLimit == 1){
			//if this course hasn't been taken
			outList.push([availableCourses[availableIndex]])
		}else if(takenIndex >= coursesTaken.length || coursesTaken[takenIndex].courseNumber != availableCourses[availableIndex].courseNumber){
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
function scheduleAll(totalCourses, coursesPerSemester, coursesAvailable, requirementsIn){

	var requirements = new Object();
	requirements = requirementsIn;
	if(requirements.useTest == true){
			//setting the default 
		var arrayOfReqTitles = ["reqCourseNumbers", "preReqCourseNumbers", "dayOfWeekPreference", "reqPerSemesterCourseNumbers", "reqCourseAtLeast"]
		requirements.reqCourse = ["4250","5130"];
		requirements.reqCourse.sort();
		requirements.preReqs = [["4010","5010"]];
		requirements.coursesPerSemester = [2,1,3];
	}

	return scheduleAllRecursive(totalCourses, coursesPerSemester, coursesAvailable, [], 0, requirements);
}

function scheduleAllRecursive(totalCourses, coursesPerSemester, coursesAvailable, coursesTaken, currentSemesterIndex, requirements){
	var courseNumberAvailableList = [];
	var courseNumberTakenList = [];
	var seasonList = ["Spring", "Fall"];
	var startDate = [2014, 1]
	var numberOfCoursesToTake = totalCourses;

	var potentialSolutions = [];
	potentialSolutions.push([]);

	var semesterIndex = currentSemesterIndex;
	var courseLimitCurrentSemester = coursesPerSemester;

	//Set unavailable courses. The prereqs aren't filled or you just cant take them this semester
	var unavailableCourses = [];
	unavailableCourses = unavailableCourses.concat(doesntCompletePreReqs(coursesTaken,requirements))
	if(requirements.coursesPerSemester != undefined && requirements.coursesPerSemester[currentSemesterIndex] != undefined){
		courseLimitCurrentSemester = requirements.coursesPerSemester[currentSemesterIndex];
	}

	if(numberOfCoursesToTake-coursesTaken.length < courseLimitCurrentSemester){
		courseLimitCurrentSemester = numberOfCoursesToTake-coursesTaken.length;
	}

	//set coursesAvailable list
	courseNumberAvailableList = getCoursesAvailableThisSemester(coursesAvailable, startDate, semesterIndex, seasonList);
	

	if(courseNumberAvailableList.length == 0){
		console.log("uhh this shouldn't happen");
	}


	var takenAndNoPreReq =[];
	if(unavailableCourses.length > 0 ){
		takenAndNoPreReq = coursesTaken.concat(unavailableCourses);
		takenAndNoPreReq.sort(function(a,b){
			return parseInt(a.courseNumber) - parseInt(b.courseNumber);
		});
	}else{
		takenAndNoPreReq = coursesTaken;
	}

	var solutionPermutationsForIndexY = combineTakenAndNew(coursesTaken,scheduleSemesterClasses(courseLimitCurrentSemester, courseNumberAvailableList, 0 , takenAndNoPreReq, 0))
	//FILTER FOR REQ'S HERE ( if solutionPermutationsForIndexY has anything left in it, break, we have a solution)

	var filteredSolution = filterRequirements(solutionPermutationsForIndexY, requirements, numberOfCoursesToTake); // This is going to return an array of length 2;
	if(filteredSolution[0].length > 0){
		return filteredSolution[0];
	}

	solutionPermutationsForIndexY = filteredSolution[1];
	//inductive step
	for(var y = 0; y < solutionPermutationsForIndexY.length; y++){
		
		var returnedAnswer = scheduleAllRecursive(totalCourses, coursesPerSemester, coursesAvailable, solutionPermutationsForIndexY[0], semesterIndex+1, requirements)
		if(returnedAnswer.length > 0){
			return returnedAnswer;
		}
	}
	
	return [];
}

function doesntCompletePreReqs(coursesIn, requirements){
	var outList = [];
	var failList = [];
	var passedList = []
	if(requirements.preReqs != undefined && coursesIn.length > 0){
		//Here we go through each prereq and see if it's been satisfied. If it hasn't it gets added to the outlist
		for(var reqIndex=0; reqIndex < requirements.preReqs.length; reqIndex++){
			//now we check 1 particular requirement
			var preReqsPassed = true;
			for(var preReqIndex=1; preReqIndex < requirements.preReqs[reqIndex].length; preReqIndex++){
				if(!courseNumberInCourseList(coursesIn, requirements.preReqs[reqIndex][preReqIndex])){
					preReqsPassed = false;
				}
			}
			if(preReqsPassed){
				passedList.push(requirements.preReqs[reqIndex]);
			}else{
				failList.push(requirements.preReqs[reqIndex]);
			}
		}
		passedList.sort(function(a,b){
			return parseInt(a[0]) - parseInt(b[0]);
		});
		failList.sort(function(a,b){
			return parseInt(a[0]) - parseInt(b[0]);
		});
		var passedIndex = 0;
		for(var failListIndex = 0; failListIndex < failList.length; failListIndex++){
			if(failListIndex == 0 || failList[failListIndex][0] != failList[failListIndex-1][0]){
				while(passedIndex < passedList.length && failList[failListIndex][0] > passedList[passedIndex][0]){ // make sure that we are comparing the closest higher course taken next
					passedIndex++;
				}
				if(passedIndex >= passedList.length ||  passedList.length == 0 || passedList[passedIndex][0] != failList[failListIndex][0]){
					var newBlankCourse = new Object();
					newBlankCourse.courseNumber = failList[failListIndex][0];
					outList.push(newBlankCourse);
				}
			}
		}
	}else if(requirements.preReqs != undefined){
		for(var outListIndex = 0; outListIndex < requirements.preReqs.length; outListIndex++){
				var newBlankCourse = new Object();
				newBlankCourse.courseNumber = requirements.preReqs[outListIndex][0];
				outList.push(newBlankCourse);
		}
	}

	return outList;
}

function filterRequirements(scheduleArrayIn, requirements, numberOfCoursesToTake){
	var reqCoursePass;
	var reqCoursePassCount
	var returnSchedule = [];
	var returnSolution = [];
	if(requirements.reqCourse != undefined && requirements.reqCourse.length > 0){
		for(var scheduleIndex=0; scheduleIndex < scheduleArrayIn.length; scheduleIndex++){
			reqCoursePassCount = 0;
			for(var reqCourseIndex=0; reqCourseIndex < requirements.reqCourse.length; reqCourseIndex++){
				for (var courseIndex =0; courseIndex < scheduleArrayIn[scheduleIndex].length; courseIndex++){
					if(scheduleArrayIn[scheduleIndex][courseIndex].courseNumber == requirements.reqCourse[reqCourseIndex]){
						reqCoursePassCount++;
						break;//look for the next required course
					}
				}
			}
			if((requirements.reqCourse.length - reqCoursePassCount) + scheduleArrayIn[scheduleIndex].length <= numberOfCoursesToTake){
					returnSchedule.push(scheduleArrayIn[scheduleIndex]);
			}
		}	
	}else{
		returnSchedule = scheduleArrayIn;
	}

	if(returnSchedule.length > 0 && returnSchedule[0].length == numberOfCoursesToTake){
		returnSolution = returnSchedule[0];
	}

	return [returnSolution, returnSchedule];
}

function courseNumberInCourseList(courseList, courseNumberToFind){
	for(var courseIndex = 0 ; courseIndex < courseList.length; courseIndex++){
		if(courseList[courseIndex].courseNumber == courseNumberToFind){
			return true;
		}
	}
	return false;
}

function combineTakenAndNew(takenCourses, newCourses){
	//taken []
	//new [[]]
	var outList = [];
	for(var x =0; x < newCourses.length; x++){
		outList.push(takenCourses.concat(newCourses[x]));
	}
	for(var y=0; y < outList.length; y++){
		outList[y] = outList[y].sort(function(a,b){
			return parseInt(a.courseNumber) - parseInt(b.courseNumber);
		});
	}

	return outList;

}

function removeNonUnique(inList){
	var listToSearch = inList.sort(function(a,b){
		for(var index=0; index < a.length; index++){
			if(parseInt(a[index].courseNumber) - parseInt(b[index].courseNumber) != 0){
				return parseInt(a[index].courseNumber) - parseInt(b[index].courseNumber);
			}
		}
		return 0;
	});
	var outList = [listToSearch[0]];
	for(var x = 0; x < listToSearch.length; x++){
		var addToList = false;
		for(var y = 0; y < listToSearch[x].length; y++){
			if(outList[outList.length-1][y].courseNumber != listToSearch[x][y].courseNumber){
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
	var currentYear = startDate[0] + parseInt((semesterIndex+startDate[1])/seasonList.length);
	var currentMonth = seasonList[(semesterIndex+startDate[1])%seasonList.length];
	for(var x = 0; x < coursesAvailable.length; x++){
		if(coursesAvailable[x].year == currentYear && coursesAvailable[x].semester == currentMonth){
			coursesAvailableReturn.push(coursesAvailable[x]);
		}
	}
	coursesAvailableReturn.sort(function(a,b){
		return parseInt(a.courseNumber) - parseInt(b.courseNumber);
	});
	return coursesAvailableReturn;
}
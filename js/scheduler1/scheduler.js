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
    maxRecursionsGlobal =0;
    if(requirements.useTest == true){
        //setting the test. This might not work, but there is basic usage here for all options
        requirements.reqCourse = ["4250","5130"];
        requirements.reqCourse.sort();
        requirements.preReqs = [["4010","5010"]];
        requirements.greaterThan= [[6000, 1], [5000, 6]];
        requirements.coursesPerSemester = [2,1,3];
        requirements.semesterLimit = 10;
        requirements.waived = ["4010"];
        requirements.startDate = [2014, "Fall"];
        requirements.preferences = [0, -1];
        requirements.reqCoursePerSemester = [["4250"],["5130"]];
        requirements.minCoursesBase = 3; //No less than 3 courses per semester
        requirements.minCoursesPerSemester = [1,2,3]; // No less than 1 course in the 1st semester Both of these do not count for the final semester
        requirements.restrictCourseBySemester = [[],["4250","5130"], ["4010"]];
        requirements.takenCourses = ["4250","5000"];
        requirements.maxRecursions = 4000;
    }

    return scheduleAllRecursive(totalCourses, coursesPerSemester, coursesAvailable, [], 0, requirements);
}

var maxRecursionsGlobal = 0;

function scheduleAllRecursive(totalCourses, coursesPerSemester, coursesAvailable, coursesTaken, currentSemesterIndex, requirements){
    var courseNumberAvailableList = [];
    var courseNumberTakenList = [];
    var seasonList = ["Spring", "Fall"];
    var startDate = [2014, "Fall"];
    if(requirements.startDate != undefined){
        startDate = requirements.startDate;
    }
    var numberOfCoursesToTake = totalCourses;
    var minNumberOfCoursesToTake = 0;

    if(requirements.minCoursesBase != undefined){
        minNumberOfCoursesToTake = requirements.minCoursesBase-1;
    }

    if(requirements.minCoursesPerSemester != undefined && requirements.minCoursesPerSemester[currentSemesterIndex] != undefined){
        minNumberOfCoursesToTake = requirements.minCoursesPerSemester[currentSemesterIndex]-1;
    }

    var potentialSolutions = [];
    potentialSolutions.push([]);

    if(requirements.semesterLimit != undefined && currentSemesterIndex >= requirements.semesterLimit){
        return []; //Do not continue down this branch if we are searching past the semester limit
    }

    if(requirements.maxRecursions != undefined && maxRecursionsGlobal > requirements.maxRecursions){
        return [];
    }
    maxRecursionsGlobal++;

    if(requirements.waived != undefined && currentSemesterIndex == 0){
        coursesTaken = coursesTaken.concat(numberListToBlankCourseList(requirements.waived),true);
        numberOfCoursesToTake = numberOfCoursesToTake + requirements.waived.length;
    }

    if(requirements.takenCourses != undefined && currentSemesterIndex == 0){
        coursesTaken = coursesTaken.concat(numberListToBlankCourseList(requirements.takenCourses,false));
    }

    if(currentSemesterIndex == 0){
        var testFilter = [[],[]];
        var testCourses = numberOfCoursesToTake;
        while(testFilter[1].length == 0 && testCourses <= coursesTaken.length+numberOfCoursesToTake){
            testFilter =  filterCurrentBranch([coursesTaken], requirements, testCourses);
            if(testFilter[1].length > 0){
                numberOfCoursesToTake = testCourses;
                break;
            }
            testCourses++;
        }
    } 

    var semesterIndex = currentSemesterIndex;
    var courseLimitCurrentSemester = coursesPerSemester;

    //--------------------------------------------------------------------------------------------
    //Set unavailable courses. The prereqs aren't filled or you just cant take them this semester
    var unavailableCourses = [];
    unavailableCourses = unavailableCourses.concat(doesntCompletePreReqs(coursesTaken,requirements));

    if(requirements.restrictCourseBySemester != undefined && requirements.restrictCourseBySemester[currentSemesterIndex] != undefined){
     unavailableCourses = unavailableCourses.concat(numberListToBlankCourseList(requirements.restrictCourseBySemester[currentSemesterIndex]), false);
    }

    //--------------------------------------------------------------------------------------------



    //Set the course upper and lower limits for classes this semester
    //----------------------------------------------------------------------------------------------
    if(requirements.coursesPerSemester != undefined && requirements.coursesPerSemester[currentSemesterIndex] != undefined){
        courseLimitCurrentSemester = requirements.coursesPerSemester[currentSemesterIndex];
    }

    if(coursesTaken.length > 0 && numberOfCoursesToTake-coursesTaken[0].length < courseLimitCurrentSemester){
        courseLimitCurrentSemester = numberOfCoursesToTake-coursesTaken[0].length;
    }

    if(requirements.totalPossible == undefined){
        requirements.totalPossible = 0;
    }
    requirements.totalPossible += courseLimitCurrentSemester;

    if(minNumberOfCoursesToTake + 1 >= totalCourses - coursesTaken.length){
        minNumberOfCoursesToTake = totalCourses - coursesTaken.length - 1;
    }
    //----------------------------------------------------------------------------------------------


    //set coursesAvailable list
    courseNumberAvailableList = getCoursesAvailableThisSemester(coursesAvailable, startDate, semesterIndex, seasonList, requirements.preferences);


    if(courseNumberAvailableList.length == 0){
        console.log("Hitting the end of the schedule data. Result will be bound to the dataset.");
    }


    var takenAndNoPreReq =[];
    if(unavailableCourses.length > 0 ){
        takenAndNoPreReq = coursesTaken.concat(unavailableCourses);
        takenAndNoPreReq.sort(function(a,b){
            return parseCourseNumber(a.courseNumber) - parseCourseNumber(b.courseNumber);
        });
    }else{
        takenAndNoPreReq = coursesTaken;
    }
    //Semester scheduler assumes sorted inputs
    takenAndNoPreReq = takenAndNoPreReq.sort(function(a,b){
            return parseCourseNumber(a.courseNumber) - parseCourseNumber(b.courseNumber);
        });


    var solutionPermutationsForIndexY = [];
    for(var numberOfCoursesIndex = courseLimitCurrentSemester; numberOfCoursesIndex > minNumberOfCoursesToTake; numberOfCoursesIndex--){
        var semesterPermOfSameLength = scheduleSemesterClasses(numberOfCoursesIndex, courseNumberAvailableList, 0 , takenAndNoPreReq, 0);
        if(requirements.reqCoursePerSemester != undefined && requirements.reqCoursePerSemester[currentSemesterIndex] != undefined){
            semesterPermOfSameLength = filterRequirements(semesterPermOfSameLength, requirements.reqCoursePerSemester[currentSemesterIndex], semesterPermOfSameLength[0].length);
        }
        solutionPermutationsForIndexY = solutionPermutationsForIndexY.concat(combineTakenAndNew(coursesTaken,semesterPermOfSameLength));
    }
    //FILTER FOR REQ'S HERE ( if solutionPermutationsForIndexY has anything left in it, break, we have a solution)
    //solutionPermutationsForIndexY = filterSemesterRequirements(solutionPermutationsForIndexY, requirements);
    if(solutionPermutationsForIndexY.length ==0 && requirements.totalPossible-courseLimitCurrentSemester <= totalCourses){
        return coursesTaken;
    }


    var filteredSolution = filterCurrentBranch(solutionPermutationsForIndexY, requirements, numberOfCoursesToTake); // This is going to return an array of length 2;
    if(filteredSolution[0].length > 0){
        return removeWaived(filteredSolution[0]);
    }

    solutionPermutationsForIndexY = filteredSolution[1];
    //inductive step
    for(var y = 0; y < solutionPermutationsForIndexY.length; y++){

        var returnedAnswer = scheduleAllRecursive(numberOfCoursesToTake, coursesPerSemester, coursesAvailable, solutionPermutationsForIndexY[y], semesterIndex+1, requirements)
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
            return parseCourseNumber(a[0]) - parseCourseNumber(b[0]);
        });
        failList.sort(function(a,b){
            return parseCourseNumber(a[0]) - parseCourseNumber(b[0]);
        });
        var passedIndex = 0;
        for(var failListIndex = 0; failListIndex < failList.length; failListIndex++){
            if(failListIndex == 0 || failList[failListIndex][0] != failList[failListIndex-1][0]){
                while(passedIndex < passedList.length && failList[failListIndex][0] > passedList[passedIndex][0]){ // make sure that we are comparing the closest higher course taken next
                    passedIndex++;
                }
                if(passedIndex >= passedList.length || passedList.length == 0 || passedList[passedIndex][0] != failList[failListIndex][0]){
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

function numberListToBlankCourseList(courseNumList){
    var outList =[]
    for(var outListIndex = 0; outListIndex < courseNumList.length; outListIndex++){
        var newBlankCourse = new Object();
        newBlankCourse.courseNumber = courseNumList[outListIndex];
        newBlankCourse.waived = true;
        newBlankCourse.remove = true;
        outList.push(newBlankCourse);
    }
    return outList;
}

function filterCurrentBranch(scheduleArrayIn, requirements, numberOfCoursesToTake){
    var returnSolution = [];
    var scheduleArray = filterGreaterThan(scheduleArrayIn, requirements, numberOfCoursesToTake);
    scheduleArray = filterRequirements(scheduleArray, requirements.reqCourse, numberOfCoursesToTake);

    if(scheduleArray.length > 0 && scheduleArray[0].length >= numberOfCoursesToTake){
        for(var scheduleIndex = 0; scheduleIndex < scheduleArray.length; scheduleIndex++){
            if(scheduleArray[scheduleIndex].length == numberOfCoursesToTake){
                returnSolution = scheduleArray[scheduleIndex];
                break;
            }
        }
    }
    return [returnSolution, scheduleArray];
}

function filterRequirements(scheduleArrayIn, requiredCourses, numberOfCoursesToTake){
    var reqCoursePass;
    var reqCoursePassCount;
    var returnSchedule = [];
    var scheduleArray = scheduleArrayIn;
    if(requiredCourses != undefined && requiredCourses.length > 0){
        for(var scheduleIndex=0; scheduleIndex < scheduleArray.length; scheduleIndex++){
            reqCoursePassCount = 0;
            for(var reqCourseIndex=0; reqCourseIndex < requiredCourses.length; reqCourseIndex++){
                for (var courseIndex =0; courseIndex < scheduleArray[scheduleIndex].length; courseIndex++){
                    if(scheduleArray[scheduleIndex][courseIndex].courseNumber == requiredCourses[reqCourseIndex]){
                        reqCoursePassCount++;
                        break;//look for the next required course
                    }
                }
            }
            if((requiredCourses.length - reqCoursePassCount) + scheduleArray[scheduleIndex].length <= numberOfCoursesToTake){
                returnSchedule.push(scheduleArray[scheduleIndex]);
            }
        }
    }else{
        returnSchedule = scheduleArray;
    }

    return returnSchedule;
}

function removeWaived(schedule){
    var outList =[]
    for(var outListIndex = 0; outListIndex < schedule.length; outListIndex++){
        if(schedule[outListIndex].remove != true){
            outList.push(schedule[outListIndex]);
        }
    }

    return outList;
}

function parseCourseNumber(courseNumberString){
var courseNumberOut = parseInt(courseNumberString);
if(courseNumberString != undefined && courseNumberString.indexOf('B') != -1){
courseNumberOut += .5;
}
return courseNumberOut;
}

function filterGreaterThan(scheduleArrayIn, requirements, numberOfCoursesToTake){
    var reqCoursePass;
    var reqCoursePassCount = [];
    var returnSchedule = [];
    var returnSolution = [];
    if(requirements.greaterThan != undefined && requirements.greaterThan.length > 0){
        for(var scheduleIndex=0; scheduleIndex < scheduleArrayIn.length; scheduleIndex++){
            reqCoursePassCount = [];
            for(var reqCourseIndex=0; reqCourseIndex < requirements.greaterThan.length; reqCourseIndex++){
                reqCoursePassCount.push(0);
                for (var courseIndex =0; courseIndex < scheduleArrayIn[scheduleIndex].length; courseIndex++){
                    if(scheduleArrayIn[scheduleIndex][courseIndex].waived != true && parseCourseNumber(scheduleArrayIn[scheduleIndex][courseIndex].courseNumber) >= requirements.greaterThan[reqCourseIndex][0]){
                        reqCoursePassCount[reqCoursePassCount.length-1]++;
                    }
                }
            }
            var schedulePass = true;
            for(var reqCoursePassCountIndex = 0; reqCoursePassCountIndex < reqCoursePassCount.length; reqCoursePassCountIndex++){
                if(requirements.greaterThan[reqCoursePassCountIndex][1] - reqCoursePassCount[reqCoursePassCountIndex] > numberOfCoursesToTake - scheduleArrayIn[scheduleIndex].length){
                    schedulePass = false;
                }
            }

            if(schedulePass){
                returnSchedule.push(scheduleArrayIn[scheduleIndex]);
            }
        }
    }else{
        returnSchedule = scheduleArrayIn;
    }

    return returnSchedule;
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
            return parseCourseNumber(a.courseNumber) - parseCourseNumber(b.courseNumber);
        });
    }

    return outList;

}

function getCoursesAvailableThisSemester(coursesAvailable, startDate, semesterIndex, seasonList, preferences){
    var coursesAvailableReturn =[];
    var currentYear = startDate[0] + parseInt((semesterIndex+seasonList.indexOf(startDate[1]))/seasonList.length);
    var currentMonth = seasonList[(seasonList.indexOf(startDate[1]) + semesterIndex)%seasonList.length];
    if(preferences === undefined)
preferences = [0, -1];
    for(var x = 0; x < coursesAvailable.length; x++){
        if(coursesAvailable[x].year == currentYear && coursesAvailable[x].semester == currentMonth){
            //If these courses have a schedule component
            if(coursesAvailable[x].day != "" && coursesAvailable[x].time != "") {
                //If we have preferences (preferences only matter if we have a schedule component)
                if(preferences[0] == 1 || preferences[1] >= 0) {
                    //Check time preference
                    if(preferences[0] == 1) {
                        //If it isn't offered in the evening, throw it out
                        if(coursesAvailable[x].time.indexOf("E") == -1) continue;
                    }
                    //Check day preference
                    if(preferences[1] == 0) {
                        if(coursesAvailable[x].day.indexOf("MW") == -1) continue;
                    } else if(preferences[1] == 1) {
                        if(coursesAvailable[x].day.indexOf("TR") == -1) continue;
                    }
                }
                //If we haven't "continue"d, then we haven't violated anything, add it
                coursesAvailableReturn.push(coursesAvailable[x]);
            } else
                coursesAvailableReturn.push(coursesAvailable[x]);
        }
    }
    coursesAvailableReturn.sort(function(a,b){
        return parseCourseNumber(a.courseNumber) - parseCourseNumber(b.courseNumber);
    });
    return coursesAvailableReturn;
}

onmessage = function(event) {
                nrOfCourses = event.data[0];
                coursesPerSem = event.data[1];
                translatedRotation = event.data[2];
                requirements = event.data[3];
                var scheduler = scheduleAll(nrOfCourses, coursesPerSem, translatedRotation, requirements);
                postMessage(scheduler);
}

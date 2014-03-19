document.write("Hello World");

//function course(level,courseName,courseNumber, creditHours, year, semester)
var coursesAvailable = [];

var xmlString = "";
var xmlObj;
var coursesInSchedule;

xmlString = $.get("Rotation.xml", function() {
  	xmlObj = $.parseXML(xmlString.responseText);
	console.log(xmlObj);
	scheduleAll(0,0,parseToCourses(xmlObj));

});

function parseToCourses(objIn){
	var courses = $.xml2json(objIn);
	var courseList = [];
	for(var yearIndex = 0; yearIndex < courses.rotation_year.length; yearIndex++){
		for(var courseIndex = 0; courseIndex < courses.rotation_year[yearIndex].course.length; courseIndex++){
			//Iterate through all courses in all years
			if(courses.rotation_year[yearIndex].course[courseIndex].subject == "CMP SCI" &&
				courses.rotation_year[yearIndex].course[courseIndex].course_number >= 4000){
				//filter out all courses under 4000 and not CMP SCI
				if(courses.rotation_year[yearIndex].course[courseIndex].rotation_term[0].time_code != ""){
					//Don't add courses in semesters that they aren't scheduled in.
					courseList.push(generateScheduledCourse(courses.rotation_year[yearIndex].course[courseIndex].course_number, courses.rotation_year[yearIndex].year, courses.rotation_year[yearIndex].course[courseIndex].rotation_term[0].term));
				}

				if(courses.rotation_year[yearIndex].course[courseIndex].rotation_term[1].time_code != ""){
					courseList.push(generateScheduledCourse(courses.rotation_year[yearIndex].course[courseIndex].course_number, courses.rotation_year[yearIndex].year, courses.rotation_year[yearIndex].course[courseIndex].rotation_term[1].term));
				}
			}

		}
	}
	return courseList;
}

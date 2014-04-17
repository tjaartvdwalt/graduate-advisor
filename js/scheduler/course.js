//This function is going to take an input of all classes in a semester and all classes taken so far
// and choose x classes to
// attend and return the scheduled classes with these added.
function generateScheduledCourse(courseNumber, year, semester)
{
    var generalCourse = new Object();
    generalCourse.courseNumber = courseNumber;
    generalCourse.year= year;
    generalCourse.semester=semester;

    return generalCourse;
    //All of these can be undefined. If a variable is undefined, it is considered to mean
    //Any course of that level. This can be used for the requirements var
}

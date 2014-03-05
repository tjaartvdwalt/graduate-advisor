/* The UserCourses object manages the courses taken, waived and selected by the user.
 * The resulting selected courses list will be used to filter the output for the
 * scheduling algorithm
 *
 * The constructor takes 1 argument:
 * buckets: an 2 dimensional associative array of all the available courses divided into buckets
 *
 * The buckets contains the courses to be picked from by the user. It is important
 * that balance must be maintained. If a course moves from available to selected
 * it must be removed from available when added to selected and visa versa.
 */
function UserCourses(courses) {
    // function removeSelectedCourse(course) {
    //     this.selected.removeItem(course);
    //     this.buckets.removeItem("prop")
    //     }

    this.addSelectedCourse = addSelectedCourse
    function addSelectedCourse(course, bucket) {
        this.selected[bucket][course.course_number] = course;
        delete this.available[bucket][course.course_number];
    }

    this.addSelectedCourses = addSelectedCourses
    function addSelectedCourses(courses, bucket) {
        for(var i in courses) {
            this.selected[bucket][courses[i].course_number] = courses[i];
            delete this.available[bucket][courses[i].course_number];
        }
    }

    function getSelectedCourses() {
        return this.selected;
    }

    function getTakenCourses() {
        return this.taken;
    }

    function getWaivedCourses() {
        return this.waived;
    }

    // Constructor items
    this.available = courses.buckets;
    // We initialise core. courses as selected. If waived gets set this will change.
    this.selected  = courses.getEmptyBuckets();
    this.addSelectedCourses(courses.buckets["core"], "core");

    this.taken     = courses.getEmptyBuckets();
    this.waived    = courses.getEmptyBuckets();

}

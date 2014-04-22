function IntroRenderer(userCourses, rules){
    this.init = function() {

    }

    this.setStartButton = function() {
    }

    this.selectedIntroRenderer = function() {
var trip = new Trip([
{
sel : $('#available-groups'),
content : "The filter bar keeps the number of courses shown at any given time to a reasonable number by only showing the courses at the given level.",
    showNavigation: true,
    delay: 1000,
    expose: true
},
{
sel : $('#selected-group'),
content : 'Only the courses at the selected level are displayed here. The courses are also filtered by the Number of semesters Remaining setting in the Configuration tab. Courses that are not presented in your selected time frame will not be displayed here.',
    showNavigation: true,


}
],    {    showCloseBox: true,
backToTopWhenEnded: true, delay : 3000,
onTripEnd : function() {
    $('.trip-block').remove();
    }
      }
); // details about options are listed below
        

        // $('.navbar-collapse').attr("data-step", "3").attr("data-intro", "Clicking once on a course button shows the details of the course. Clicking a second time on the same course moves the course to the corresponding selected bucket");

         trip.start();
    }
    this.init();
}

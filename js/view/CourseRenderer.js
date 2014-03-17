/* When this class is instantiated all course buttons and listeners are generated.
 * Initially all buttons are hidden.
 * It is up to the renderAvailable, renderWaived, renderTaken and renderSelected
 * methods to change visibility.
 *
 */
function CourseRenederer(userCourses, rules){
    this.userCourses = userCourses;
    this.bucketSize = 6;
    this.rules = rules;
    /*
     * There will always be 1 button for every course in the HTML page, and the
     * button will have an id  corresponding to its course number.
     *
     * With JQuery it is easy to find the button in the DOM. If a button
     * moves to a different bucket we can find it in the DOM, remove it from its
     * current position, and insert it at its new position.
     *
     * The buttons will need to be initialized however. To do that we add every
     * button to a buttons div, and make it hidden. Then the buttons can be moved
     * from there into their correct buckets.
     */
    $('body').append($('<div>').attr({
        'id' : 'buttons'
    }));
    for(var i in userCourses.available) {
        $("#buttons").append($("<button>" + i + "</button>").attr({
            'id' : i
        })).hide();
    }
    for(var i in userCourses.selected) {
        $("#buttons").append($("<button>" + i + "</button>").attr({
            'id' : i
        })).hide();
    }

    this.renderAll = function(currentAvailable) {
        this.renderAvailable(this.userCourses["available"], currentAvailable);

        this.renderSelected(this.userCourses["selected"], 'core');
        this.renderSelected(this.userCourses["selected"], '6000');
        this.renderSelected(this.userCourses["selected"], '5000');
        this.renderSelected(this.userCourses["selected"], '4000');

    }

    /*
     * This function renders (or rerenders) the available course list.
     * The component it renders has a id="available".
     *
     * On the first rendering it inserts an empty div in the current position.
     * Then we replace this empty tag with the available list
     * Subsequent calls to this method will replace the list each time.
     *
     * {Note: If we wanted to use unobtrusive javascript we could change the html to
     *  include the div tag and simply replace it with jquery but this way seems
     * more intuitive since not everybody knows unobtrusive js.}
     */
    this.renderAvailable = function (courses, filter) {
        var available = $("#available");
        if (filter == null) {
            console.log("filter is null");
            filter = available.attr('filter');
            console.log(filter);
        }
        else {
            available.attr({'filter' : filter});
        }
        // $("#available").each( function(index, element ) {
        //      console.log(element);
        //  });

        for(var i in courses) {
            var button = $("#" + i);
            if((button.get(0).id > filter && button.get(0).id -  1000 < filter)) {
                button.detach().prependTo('#available');
                button.show();
            }
            else {
                button.hide();
            }
        }
    }

    this.renderSelected = function (courses, filter) {
        var j = 0;
        // JQuery select based on multiple class values
        var selected = $('.selected.' + filter);
        var spacers =  $('.selected.' + filter + " > .spacer");

        console.log(spacers);
        spacers.remove();
        //        for(var spacer in spacers) {
        //        }

        for(var i in courses) {
            //console.log(filter);
            var button = $("#" + i);

            // Core courses are handled seperately
            if($.inArray(button.get(0).id, this.rules.getRules().core) >= 0) {
                if(filter == 'core'){
                    button.detach().prependTo(selected);
                    button.show();
                    j++;
                }
            }
            else {
                console.log("else");
                console.log(i);
                if((button.get(0).id > filter && button.get(0).id -  1000 < filter)) {
                    button.detach().prependTo(selected);
                    button.show();
                    j++;
                }
            }
        }

        // fill the rest of the bucket with empty buttons
        for(k=j; k<this.bucketSize; k++) {
            $('<button>Spacer</button>').attr({
                'class' : 'spacer'
            }).prependTo(selected);
        }
    }

    this.renderDescription = function (course) {
        console.log(course);
        var description = $('#description');
        // remove the previous description
        description.children("div").remove();
        // Add the new description
        var details = "course number: " + course.course_number + "<br>" +
            "course name:   " + course.course_name + "<br>" +
            "credits:"        + course.credit + "<br>" +
            "course description:   " + course.course_description + "<br>";
        $('<div>' + details + '</div>').prependTo(description);
    }
}
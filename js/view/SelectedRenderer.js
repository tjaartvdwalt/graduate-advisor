/* When this class is instantiated all course buttons and listeners are generated.
 * Initially all buttons are hidden.
 * It is up to the renderAvailable, renderWaived, renderTaken and renderSelected
 * methods to change visibility.
 *
 */
function SelectedRenderer(userCourses, rotation, rules){
    this.init = function() {
        this.userCourses = userCourses;
        this.bucketSize = 6;
        this.rotation = rotation;
        this.rules = rules;

        this.addCourseButtons();
        this.availableButtons = ["6000", "5000", "4000"];

        this.addAvailableButtons();
    }

    this.addCourseButtons = function() {
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
            'id' : 'buttons',
            'class': 'btn-block btn-sm'
        }));
        for(var i in userCourses.available) {
            $("#buttons").append($("<button>" + i + "</button>").attr({
                'id' :   i,
                'class': 'btn-block btn-sm',
                // 'data-container' : 'body',
                // 'data-toggle' : 'popover',
                // 'data-placement': 'auto right',
                // 'data-content':   'Vivamus sagittis lacus vel augue laoreet rutrum faucibus.'

            })).hide();
        }
        for(var i in userCourses.selected) {
            $("#buttons").append($("<button>" + i + "</button>").attr({
                'id' : i,
                'class': 'btn-block btn-sm core'
            })).hide();
        }

    }

    this.addAvailableButtons = function () {
        for(var i in this.availableButtons) {
            var button = $("<button>" + this.availableButtons[i] + "</button>").attr({
                'id' : this.availableButtons[i],
                'class': 'btn-xs'
            });
            button[0].addEventListener("click", this, false);
            $("#buttons").append(button).hide();
        }
        // Set the 6000 button to be the active filter initially
        $('#6000').addClass('filter');
    }

    // Handle event is a special function that catches all events
    this.handleEvent = function (event) {
        for(var i in this.availableButtons) {
            $('#' + this.availableButtons[i]).removeClass('filter');
        }

        $('#' + event.target.id).addClass('filter');
        this.renderAvailable();
    }

    this.renderAll = function(currentAvailable) {
        this.renderAvailable();
        this.renderSelected('6000');
        this.renderSelected('5000');
        this.renderSelected('4000');
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
    this.renderAvailable = function () {
        var activeTab = $('.tab-pane.active').attr('id');

        var available = $("#" + activeTab + "-available>#selected-group");
        var availableGroups = $("#" + activeTab + "-available" + "> .row-fluid");

        // render the category buttons first
        for(var i in this.availableButtons) {
            var button = $("#" + this.availableButtons[i]);
            button.detach().prependTo(availableGroups);
            button.show();
        }
        var filter = $(".filter").attr('id');

        var j = 0;
        for(var i in this.userCourses.available) {
            var button = $("#" + i);
            // remove unavailable class
            button.removeClass("inactive");

            // remove the prereq class if its set
            button.removeClass("prereq");
            if(this.inRange(button.get(0).id) && button.length > 0 && button.get(0).id > filter && button.get(0).id -  1000 < filter) {
                button.detach().appendTo(available);
                button.show();
                j++
            }
            else {
                button.detach().prependTo("#buttons");
                button.hide();
            }
        }

        // for(var k=0;k<7-j;k++) {
        //     $('<button>Spacer</button>').attr({
        //         'class' : 'spacer'
        //     }).appendTo(available);
        // }

    }

    this.renderSelected = function (filter) {
        var activeTab = $('.tab-pane.active').attr('id');
        var otherTab = undefined;
        if(activeTab == "selected") {
            otherTab = "taken";
        }
        else {
            otherTab = "selected";
        }

        displayRules = this.rules.rules[filter];
        if(displayRules != null) {
            var keys = Object.keys(displayRules);
        }

        var j = 0;
        // JQuery select based on multiple class values
        var selected = $('.' + activeTab + '.' + filter);
        var spacers =  $('.'+ activeTab + '.' + filter + " > .spacer");
        spacers.remove();
        var minRules =  $('.min');
        minRules.remove();
        var maxRules =  $('.max');
        maxRules.remove();

        var renderData = [this.userCourses.taken, this.userCourses.selected];
        if(activeTab == "taken") {
            renderData = [undefined, this.userCourses.taken];
        }

        for(var l in renderData) {
            for(var i in renderData[l]) {
                var button = $("#" + i);

                // If the button is from the inactive bucket
                if(l == 0) {
                    button.addClass("inactive");
                }
                else {
                    button.removeClass("inactive");
                }

                // Add a class to the button if it has a dependency
                // we can then colorize the buttons in the css
                var course = this.userCourses.getCourse(i);
                var prereq = this.userCourses.findPrereq(course);
                if(prereq != undefined) {
                    button.addClass("prereq");
                    $("#" + prereq.course_number).addClass("prereq");
                }

                if(button.length > 0 && button.get(0).id > filter && button.get(0).id -  1000 < filter) {

                    button.detach().prependTo(selected);
                    button.show();
                    j++;
                    // if(keys != null && j == displayRules[keys[0]]) {
                    //     $("<div>").addClass(keys[0]).prependTo(selected);
                    // }
                }
            }
        }

        // fill the rest of the bucket with empty buttons
        for(k=j; k<this.bucketSize; k++) {
            $('<button>Spacer</button>').attr({
                'class' : 'spacer btn-block btn-sm'
            }).prependTo(selected);
            j++;


            if(keys != null && j == displayRules[keys[0]]) {
                $("<div>").addClass(keys[0]).prependTo(selected);
            }
        }
    }

    this.inRange = function(course) {
        var options = this.rotation.findOptions(course, this.userCourses.semestersRemaining());
        if(options.length > 0) {
            return true;
        }
        return false;
    }

    this.renderDescription = function (course) {
        this.userCourses;
        var description = $('#description');
        // remove the previous description
        description.children("div").remove();
        // Add the new description
        var details ="<table>" +
            "<tr><td>course number</td><td>" + course.course_number + "</td></tr>" +
            "<tr><td>course name</td><td>" + course.course_name + "</td></tr>" +
            "<tr><td>credits</td><td>" + course.credit + "</td></tr>" +
            "<tr><td>course description</td><td>" + course.course_description+ "</td></tr>"
        "</table>";
        $('<div>' + details + '</div>').prependTo(description);
    }

    this.renderCore = function () {
        this.userCourses;
    }
    this.init();
}

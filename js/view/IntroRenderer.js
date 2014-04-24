function IntroRenderer(userCourses, rules){
    this.init = function() {
        this.addButton();

    }

    this.addButton = function() {
        var self = this;
        var button = $('<button>').attr('id', 'intro-button').addClass('btn').html('Intro');
        button[0].addEventListener("click", function (evt) {
            console.log('click');
            var currentTab = $('.tab-pane.active')[0].id;
            switch(currentTab) {
            case "selected":
                self.toolbarRenderer();
                self.selectedRenderer();
            }
        }, false);
        $('#intro').append(button);

    }

    this.toolbarRenderer = function() {
        var trip = new Trip([
            {
                sel : $('#available-groups'),
                content : "toolbar.",
                position: "screen-nw",
                showNavigation: true,
                delay: 1000,
                expose: true
            }

        ])
    }

    this.selectedRenderer = function() {
        var trip = new Trip([
            {
                sel : $('#available-groups'),
                content : "The filter bar keeps the number of courses shown at any given time to a <br> reasonable number by only showing the courses at the given level.",
                position: "screen-nw",
                showNavigation: true,
                delay: 1000,
                expose: true
            },
            {
                sel : $('#selected-group'),
                content : 'Only the courses at the selected level are displayed here.<br> The courses are also filtered by the Number of semesters Remaining setting in the Configuration tab.<br> Courses that are not presented in your selected time frame will not be displayed here.',
                position: "screen-nw",
                showNavigation: true,
                expose: true
            },
            {
                sel : $('#selected-group'),
                content : 'If you click on a course once, the course details will be displayed <br> If you click on the course a second time...',
                position: "screen-nw",
                showNavigation: true,
                expose: true


            },

            {
                sel : $('.selected'),
                content : 'It will be moved to the corresponding selected bucket.',
                position: "screen-nw",
                showNavigation: true,
                expose: true

            }
        ],    {
            position: "screen-nw",
            delay : 3000,
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

function ConfigureRenederer(userCourses){
    this.init = function() {
        self = this;
        this.userCourses = userCourses;

        // Add the select list
        $('#nr-of-semesters').append($('<select>').attr('id', 'semesters-list')
                                     .addClass('selectpicker'))
            .change(function(event) {
                self.userCourses.semesters = event.target.value;
            });
        for(var i=3; i <= 6; i++) {
            $('#semesters-list').append($('<option>').html(i));
        }
    }

    this.init();
}

function ConfigureRenederer(userCourses){
    this.init = function() {
        self = this;
        this.userCourses = userCourses;
        console.log($('#nr-of-semesters'));

        // Add the select list
        $('#nr-of-semesters').append($('<select>').attr('id', 'semesters-list')
                                     .addClass('selectpicker'))
            .change(function(event) {
                self.userCourses.semesters = event.target.value;
                console.log(self.userCourses);
            });
        for(var i=3; i <= 6; i++) {
            $('#semesters-list').append($('<option>').html(i));
        }
    }

    this.init();
}

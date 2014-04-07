function ConfigureRenederer(userCourses){
    this.init = function() {
        self = this;
        this.userCourses = userCourses;
    }
    this.SemestersRenderer = function() {
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

    this.exportRenderer = function() {
        var file = $('#export').append($('<input>').attr({
            type : 'file',
            id: 'files'
        }));

        file[0].addEventListener('change', function (evt) {
            console.log("hoora");
        }, false);
        // var reader = new FileReader();
        // reader.onload = function (e) {
        //     //$('#source-image').attr('src', e.target.result);
        // };
        // append(reader);
    }

    this.renderAll = function() {
        this.SemestersRenderer();
        this.exportRenderer();
    }

    this.init();
}

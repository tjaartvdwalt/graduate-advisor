function ScoreboardRenderer(userCourses){
    this.init = function() {
        this.userCourses = userCourses;
    }

    this.renderAll = function() {
        $('#waived-badge').html(Object.keys(this.userCourses.waived).length);
        $('#completed-badge').html(Object.keys(this.userCourses.taken).length);
        $('#selected-badge').html(Object.keys(this.userCourses.selected).length);

        var evt = document.createEvent("Event");
        evt.initEvent("myEvent",true,true);
        //invoke
        document.dispatchEvent(evt);

        // $('.small-table').remove();
        // var table = $("<table>").addClass('table').addClass('table-striped').addClass('small-table');
        // $('#scoreboard').append(table);
        // var row1 = $('<tr>');
        // table.append(row1);
        // var infoWaived = $('<td>').addClass('small-font').html("Courses Waived");
        // console.log(Object.keys(this.userCourses.waived).length);
        // var valueWaived = $('<td>').addClass('small-font').html(Object.keys(this.userCourses.waived).length);
        // row1.append(infoWaived);
        // row1.append(valueWaived);
        // var row2 = $('<tr>');
        // table.append(row2);
        // var infoCompleted = $('<td>').addClass('small-font').html("Courses Completed");
        // var valueCompleted = $('<td>').addClass('small-font').html(Object.keys(this.userCourses.taken).length);
        // row2.append(infoCompleted);
        // row2.append(valueCompleted);
        // var row3 = $('<tr>');
        // table.append(row3);
        // var infoSelected = $('<td>').addClass('small-font').html("Courses Selected");
        // var valueSelected = $('<td>').addClass('small-font').html(Object.keys(this.userCourses.selected).length);
        // row3.append(infoSelected);
        // row3.append(valueSelected);
        // var row4 = $('<tr>');
        // table.append(row4);
        // var infoTotal = $('<td>').addClass('small-font').html("<b>Required hours</b>");
        // var total = 30 - Object.keys(this.userCourses.selected).length * 3;
        // var valueTotal = $('<td>').addClass('small-font').html(total + "/30");
        // row4.append(infoTotal);
        // row4.append(valueTotal);

    }

    this.init();
}

$(document).ready(function() {

    var controller = new CoursesController();
    //$('#rootwizard').bootstrapWizard();
    $('#rootwizard').bootstrapWizard({'onTabShow': function(tab, navigation, index) {
        controller.onTabShow(tab, navigation, index);
        //console.log("hallo");
    }});
});

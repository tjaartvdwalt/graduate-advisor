$(document).ready(function() {
    document.addEventListener("myEvent", function() {
        $('#rootwizard').bootstrapWizard('hide', 4);
    },false);

    var controller = new CoursesController();
    //$('#rootwizard').bootstrapWizard();
    var rootwizard = $('#rootwizard').bootstrapWizard({'onTabShow': function(tab, navigation, index) {
        controller.onTabShow(tab, navigation, index);
        //console.log("hallo");
    }});

});

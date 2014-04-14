$(document).ready(function() {

    console.log("add listener");
    document.addEventListener("myEvent", function() {
        $('#rootwizard').bootstrapWizard('hide', 4);
        console.log("disable schedule");
    },false);

    var controller = new CoursesController();
    //$('#rootwizard').bootstrapWizard();
    var rootwizard = $('#rootwizard').bootstrapWizard({'onTabShow': function(tab, navigation, index) {
        controller.onTabShow(tab, navigation, index);
        //console.log("hallo");
    }});

});

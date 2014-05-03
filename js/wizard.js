$(document).ready(function() {
    document.addEventListener("myEvent", function() {
        $('#rootwizard').bootstrapWizard('hide', 4);
    },false);

    var root = new RootController();
    var render = new RenderController(root);
    global_render = render;
    var click = new ClickController(root, render);
    var rootwizard = $('#rootwizard').bootstrapWizard({'onTabShow': function(tab, navigation, index) {
        render.onTabShow(tab, navigation, index);
    }});
});

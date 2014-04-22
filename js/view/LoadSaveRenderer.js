function LoadSaveRenderer(model){
    this.init = function() {
        this.model = model;
        this.introRenderer();
        this.loadRenderer();
        this.saveRenderer();
    }

    this.introRenderer = function() {
        var button = $('<button>').attr('id', 'intro-button').addClass('btn').html('Intro');
        button[0].addEventListener("click", function (evt) {
        }, false);
        $('#intro').append(button);

    }

    this.saveRenderer = function() {
        var self = this;
        var button = $('<button>').addClass('btn').html('Save');
        $('#export').append(button);
        button[0].addEventListener("click", function (evt) {
            self.model.saveFile();
        }, false);

    }

    this.loadRenderer = function() {
        var self = this;
        var file = $("#import");
        file[0].addEventListener('change', function (evt) {
            console.log(self);
            self.model.loadFile(evt.target.files[0]);
        }, false);
    }

    this.init();
}

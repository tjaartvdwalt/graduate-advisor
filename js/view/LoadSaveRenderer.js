function LoadSaveRenderer(model){
    this.init = function() {
        this.model = model;
        this.loadRenderer();
        this.saveRenderer();
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

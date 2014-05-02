function LoadSaveRenderer(model){
    this.init = function() {
        this.model = model;
        this.loadRenderer();
        this.saveRenderer();
        this.addSearchBar();
    }


    this.saveRenderer = function() {
        var self = this;
        var button = $('<button>').addClass('btn glyphicon glyphicon-floppy-save');
        $('#export').append(button);
        button[0].addEventListener("click", function (evt) {
            self.model.saveFile();
        }, false);

    }

    this.loadRenderer = function() {
        var self = this;
        var file = $("#import");
        $("#import-button").add("<span>")
            .addClass('btn glyphicon glyphicon-floppy-open');

        //  onclick="$('input[id=import]').click();

        // file[0].addEventListener('change', function (evt) {
        //     console.log(self);
        //     self.model.loadFile(evt.target.files[0]);
        // }, false);
    }

        this.addSearchBar = function() {
        var searchText = $("<input>").attr('id', 'searchtext').attr('type', 'text')
            .addClass("navbar-search");
        var searchButton = $("<button>").attr('id', 'searchbutton').addClass("btn btn-sm")
            .addClass("glyphicon glyphicon-search");
        var resetButton = $("<button>").attr('id', 'resetbutton').addClass("btn btn-sm")
            .addClass("glyphicon glyphicon-remove");

        $("#searchbar").append(searchText).append(searchButton).append(resetButton);

    }



    this.init();
}

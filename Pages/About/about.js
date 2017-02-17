(function (global) {

    "use strict";

    Page.Create('/Pages/htmltest/htmltest.html', {
        Ready: {
            value: function (element, options) {

                var button = new Buttons.Text("id_Back");
                button.Parent = element;
                button.OnClick = function () {
                    Page.Navigate('/Pages/MainMenu/MainMenu.html');
                }.bind(this);
                button.AddClass('BackButton');

                var blurb = new 
            },
            writable: false,
            enumerable: true
        },
        Unload: {
            value: function () {
                this.Promise && this.Promise.Cancel && this.Promise.Cancel();
            },
            writable: false,
            enumerable: true
        }
    });

})(this);
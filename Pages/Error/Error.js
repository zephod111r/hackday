(function (global) {

    "use strict";

    Page.Create('./Pages/Error/Error.html', {
        Ready: {
            value: function (element, options) {

                var button = new Buttons.Text("id_Back");
                button.Parent = element;
                button.OnClick = function () {
                    Page.Navigate('./Pages/MainMenu/MainMenu.html');
                    event.preventDefault();
                    event.stopPropagation();
                }.bind(this);
                button.AddClass('BackButton');
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
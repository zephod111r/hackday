(function (global) {

    "use strict";

    Page.Create('./Pages/About/About.html', {
        Ready: {
            value: function (element, options) {

                var button = new Buttons.Text("id_Back");
                button.Parent = element;
                button.OnClick = function () {
                    Page.Navigate('./Pages/Game/Game.html');
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
            },
            writable: false,
            enumerable: true
        }
    });

})(this);
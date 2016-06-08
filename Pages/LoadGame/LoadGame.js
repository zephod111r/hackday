(function initLoadGame(Root) {

    "use strict";

    Page.Create('/Pages/LoadGame/LoadGame.html', {
        Ready: {
            value: function (element, options) {

                var button = new Buttons.Text("id_Back");
                button.Parent = element;
                button.OnClick = function () {
                    Page.Navigate('/Pages/MainMenu/MainMenu.html');
                };
                button.AddClass('BackButton');

            }, writable: false, enumerable: true
        },
        Unload: {
            value: function () {
            }, writable: false, enumerable: true
        }
    });

})();
(function (global) {

    "use strict";

    Page.Create('/Pages/Directory/Directory.html', {
        Ready: {
            value: function (element, options) {

                var button = new Buttons.Text("id_Back");
                button.Parent = element;
                button.OnClick = function () {
                    Page.Navigate('/Pages/MainMenu/MainMenu.html');
                }.bind(this);
                button.AddClass('BackButton');

                var promise = global.Listing.Promise('resources/DirectoryList.xml', []).Then(function (list) {
                    for (var index in list) {
                        var entry = list[index];
                        entry.GetThumbPromise().Then(function (url) {
                            var button = new Buttons.Icon(url);
                            button.Parent = element;
                            button.OnClick = function () {
                                Application.EnableSpinner();
                                Page.Navigate('/Pages/ImageViewer/ImageViewer.html', { Entry: this });
                            }.bind(this);
                        }.bind(entry));
                    }
                });

            }, writable: false, enumerable: true
        },
        Unload: {
            value: function () {
            }, writable: false, enumerable: true
        }
    });

})(this);
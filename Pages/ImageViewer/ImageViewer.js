(function (global) {

    "use strict";

    Page.Create('/Pages/ImageViewer/ImageViewer.html', {
        Ready: {
            value: function (element, options) {
                var button = new Buttons.Text("id_Back");
                button.Parent = element;
                button.OnClick = function () {
                    Page.Navigate('/Pages/Directory/Directory.html');
                }.bind(this);
                button.AddClass('BackButton');

                options && options.Entry && options.Entry.GetRequestPromise().Then(function (url) {
                    element.style.backgroundImage = 'url(' + url + ')';
                    Application.DisableSpinner();
                });

            }, writable: false, enumerable: true
        },
        Unload: {
            value: function () {
            }, writable: false, enumerable: true
        }
    });

})(this);
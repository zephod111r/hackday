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

                Object.defineProperty(this, "Promise", { value: global.Listing.Promise('resources/DirectoryList.xml', []), writable: true, enumerable: true, configurable: true });

                this.Promise = this.Promise.Then(function (list) {
                    for (var index in list) {
                        var entry = list[index];
                        this.Promise = this.Promise.Then(function () {
                            Application.EnableSpinner();
                            return this.GetRequestPromise().Then(function (url) {
                                Application.DisableSpinner();
                                var page = document.getElementById('ImageLocator');
                                page.style.backgroundImage = 'url(' + url + ')';
                                return StateMachine.Promise.Timeout(5000).Then(function () {
                                    URL.revokeObjectURL(this);
                                }.bind(url));
                            });
                        }.bind(entry));
                    }
                    this.Promise.Then(function () {
                        Page.Navigate('/Pages/htmltest/htmltest.html');
                    })
                }.bind(this));

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
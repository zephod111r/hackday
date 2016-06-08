(function initGenerateLevel(Root) {

    "use strict";

    Page.Create('/Pages/Editor/Editor.html', {
        Ready: {
            value: function (element, options) {

                var cleanUp = [];

                var button = new Buttons.Text("id_Back");
                button.Parent = element;
                button.OnClick = function () {
                    Page.Navigate('/Pages/MainMenu/MainMenu.html');
                };
                button.AddClass('BackButton');

                cleanUp.push(button);

                var serverLogin = new DisplayElement.Text('Server Login details');
                serverLogin.Parent = element;
                cleanUp.push(serverLogin);

                var username = new DisplayElement.Text('Username');
                username.Parent = serverLogin.Element;
                cleanUp.push(username);

                var usernameInput = new DisplayElement.Input();
                usernameInput.Element.value = '';
                usernameInput.Parent = username.Element;
                cleanUp.push(usernameInput);

                var password = new DisplayElement.Text('Password');
                password.Parent = serverLogin.Element;
                cleanUp.push(password);

                var passwordInput = new DisplayElement.Input();
                passwordInput.Element.value = '';
                passwordInput.Element.type = 'password';
                passwordInput.Parent = password.Element;
                cleanUp.push(passwordInput);

                var filenameInput = new DisplayElement.Input();
                filenameInput.Element.value = '';
                filenameInput.Parent = element;
                cleanUp.push(filenameInput);

                var submit = new Buttons.Text("game_Submit");

                submit.OnClick = function () {
                    HTTP.SaveJavascript(filenameInput.Element.value, "Testing", usernameInput.Element.value, passwordInput.Element.value).Then(function () {

                        alert('Uploaded successfully!');
                    }, function (error) {
                        alert('Failed to upload! Reason: ' + error);
                    });
                };

                submit.Parent = element;

                cleanUp.push(submit);

            }, writable: false, enumerable: true
        },
        Unload: {
            value: function () {
            }, writable: false, enumerable: true
        }
    });

})();
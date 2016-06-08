(function initMainMenu(Root) {

    "use strict";

    Page.Create('./Pages/MainMenu/MainMenu.html', {
        Ready: {
            value: function (element, options) {
                var menu = new DisplayElement.Wrap(document.createElement('div'));
                menu.Parent = element;
                menu.AddClass("MainMenuBackground");

                var menuTitle = new DisplayElement.Text("Main_Menu_Title");
                menuTitle.Parent = menu.Element;
                menuTitle.AddClass("Title");

                var buttons = [];
                
                var button = new Buttons.Text("game_New_Game");
                button.OnClick = function (event) {
                    Page.Navigate('./Pages/NewGame/NewGame.html');
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                };
                button.Parent = menu.Element;

                button = new Buttons.Text("game_Edit_Game");
                button.OnClick = function (event) {
                    Page.Navigate('./Pages/Editor/Editor.html');
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                };
                button.Parent = menu.Element;

                button = new Buttons.Text("game_Load_Game");
                button.OnClick = function (event) {
                    Page.Navigate('./Pages/LoadGame/LoadGame.html');
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                };

                if (!Application.hasGames) {
                    button.Enabled = false;
                }

                button.Parent = menu.Element;

                button = new Buttons.Text("en-GB");
                button.OnClick = function (event) {
                    Translation.Language("en-GB").Then(function () {
                        Page.Navigate('./Pages/MainMenu/MainMenu.html');
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    });
                };
                button.Parent = menu.Element;

                button = new Buttons.Text("en-US");
                button.OnClick = function (event) {
                    Translation.Language("en-US").Then(function () {
                        Page.Navigate('./Pages/MainMenu/MainMenu.html');
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    });
                };
                button.Parent = menu.Element;

            }, writable: false, enumerable: true
        },
        Unload: {
            value: function () {
            }, writable: false, enumerable: true
        }
    });

})();
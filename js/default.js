// Main entry point for new website.
(function (Root) {

    "use strict";
    Application.onInitialise = function () {
        console.log("Initialising");
        var GameConstructor = Class.Design(function () {}, {}, {});
        Application.Game = new GameConstructor();
    }

    Application.onRun = function () {
        console.log("Running");

        return Page.Navigate('./Pages/MainMenu/MainMenu.html');
    }

    Application.onShutdown = function () {
        console.log("Shutting Down");
    }

} )(this);

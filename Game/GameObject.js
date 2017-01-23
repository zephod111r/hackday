(function initGameObject(local) {
"use strict";
    var GameObject = Class.Design(function () {
    }, {
        Type: {
            get: function () {
                return "Invalid";
            },
            enumerable: true,
            configurable: true
        },
        Description: {
            get: function () {
                return "game_Object_Description".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Name: {
            get: function () {
                return "game_Object".Translate();
            },
            enumerable: true,
            configurable: true
        }
    }, {
    });

    Object.defineProperty(local.Game, "GameObject", {
        value: GameObject,
        enumerable: true,
        writable: false,
        configurable: false
    });

})(this);

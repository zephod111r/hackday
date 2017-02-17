(function initResourceStone(local) {
"use strict";
    var Stone = Class.Derive(local.Game.Resource, function () {
    }, {
        Description: {
            get: function () {
                return "game_Stone_Description".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Name: {
            get: function () {
                return "game_Stone".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Value: {
            get: function () {
                return 50;
            },
            enumerable: true,
            configurable: true
        }
    }, {

    });

    Object.defineProperty(local.Game, "Stone", {
        value: Stone,
        enumerable: true,
        writable: false,
        configurable: false
    });

})(this);

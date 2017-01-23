(function initResourceOre(local) {
"use strict";
    var Ore = Class.Derive(local.Game.Resource, function () {
    }, {
        Description: {
            get: function () {
                return "game_Ore_Description".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Name: {
            get: function () {
                return "game_Ore".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Value: {
            get: function () {
                return 1500;
            },
            enumerable: true,
            configurable: true
        }
    }, {

    });

    Object.defineProperty(local.Game, "Ore", {
        value: Ore,
        enumerable: true,
        writable: false,
        configurable: false
    });

})(this);

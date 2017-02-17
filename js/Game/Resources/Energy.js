(function initResourceEnergy(local) {
"use strict";
    var Energy = Class.Derive(local.Game.Resource, function () {
    }, {
        Description: {
            get: function () {
                return "game_Energy_Description".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Name: {
            get: function () {
                return "game_Energy".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Value: {
            get: function () {
                return 2500;
            },
            enumerable: true,
            configurable: true
        }
    }, {

    });

    Object.defineProperty(local.Game, "Energy", {
        value: Energy,
        enumerable: true,
        writable: false,
        configurable: false
    });

})(this);

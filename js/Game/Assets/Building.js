(function initBuilding(local) {

    "use strict";
    var Building = Class.Derive(local.Game.Asset, function (position) {
        Object.defineProperties(this, {
        });
    }, {
        Description: {
            get: function () {
                return "game_Building_Description".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Name: {
            get: function () {
                return "game_Building".Translate();
            },
            enumerable: true,
            configurable: true
        }
    }, {
    });

    Object.defineProperty(local.Game.Assets, "Building", {
        value: Building,
        enumerable: true,
        writable: false,
        configurable: false
    });

})(this);

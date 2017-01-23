(function initConsumable(local) {

    "use strict";
    var Consumable = Class.Derive(local.Game.Asset, function (position) {
        Object.defineProperties(this, {
        });
    }, {
        Description: {
            get: function () {
                return "game_Consumable_Description".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Name: {
            get: function () {
                return "game_Consumable".Translate();
            },
            enumerable: true,
            configurable: true
        }
    }, {
    });

    Object.defineProperty(local.Game.Assets, "Consumable", {
        value: Consumable,
        enumerable: true,
        writable: false,
        configurable: false
    });

})(this);

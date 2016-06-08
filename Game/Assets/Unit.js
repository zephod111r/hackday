(function initUnit(local) {

    var Unit = Class.Derive(local.Game.Asset, function (position) {
        Object.defineProperties(this, {
        });
    }, {
        Description: {
            get: function () {
                return "game_Unit_Description".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Name: {
            get: function () {
                return "game_Unit".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Movement: {
            get: function () {
                return {};
            },
            enumerable: true,
            configurable: true
        },
        MoveRestrictions: {
            get: function () {
                return {};
            },
            enumerable: true,
            configurable: true
        }
    }, {

    });

    Object.defineProperty(local.Game.Assets, "Unit", {
        value: Unit,
        enumerable: true,
        writable: false,
        configurable: false
    });

})(this);
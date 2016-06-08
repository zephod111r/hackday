(function initResourceWood(local) {

    var Wood = Class.Derive(local.Game.Resource, function () {
    }, {
        Description: {
            get: function () {
                return "game_Wood_Description".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Name: {
            get: function () {
                return "game_Wood".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Value: {
            get: function () {
                return 1;
            },
            enumerable: true,
            configurable: true
        }
    }, {

    });

    Object.defineProperty(local.Game, "Wood", {
        value: Wood,
        enumerable: true,
        writable: false,
        configurable: false
    });

})(this);
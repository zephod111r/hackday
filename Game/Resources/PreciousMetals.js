(function initResourcePreciousMetals(local) {

    var PreciousMetals = Class.Derive(local.Game.Resource, function () {
    }, {
        Description: {
            get: function () {
                return "game_PreciousMetals_Description".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Name: {
            get: function () {
                return "game_PreciousMetals".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Value: {
            get: function () {
                return 10000;
            },
            enumerable: true,
            configurable: true
        }
    }, {

    });

    Object.defineProperty(local.Game, "PreciousMetals", {
        value: PreciousMetals,
        enumerable: true,
        writable: false,
        configurable: false
    });

})(this);
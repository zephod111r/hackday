(function initResourceFood(local) {

    var Food = Class.Derive(local.Game.Resource, function () {
    }, {
        Description: {
            get: function () {
                return "game_Food_Description".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Name: {
            get: function () {
                return "game_Food".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Value: {
            get: function () {
                return 5;
            },
            enumerable: true,
            configurable: true
        }
    }, {

    });

    Object.defineProperty(local.Game, "Food", {
        value: Food,
        enumerable: true,
        writable: false,
        configurable: false
    });

})(this);
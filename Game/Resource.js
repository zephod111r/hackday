(function initResource(local) {

    var Resource = Class.Derive(local.Game.GameObject, function () {
    }, {
        Description: {
            get: function () {
                return "game_Resource_Description".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Name: {
            get: function () {
                return "game_Resource".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Type: {
            get: function () {
                return "Resource";
            },
            enumerable: true,
            configurable: true
        },
        Value: {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        }
    }, {

    });

    Object.defineProperty(local.Game, "Resource", {
        value: Resource,
        enumerable: true,
        writable: false,
        configurable: false
    });

})(this);
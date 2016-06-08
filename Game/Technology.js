(function initTechnology(local) {

    var Technology = Class.Derive(local.Game.GameObject, function () {
        Object.defineProperties(this, {
        });
    }, {
        Description: {
            get: function () {
                return "game_Technology_Description".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Name: {
            get: function () {
                return "game_Technology".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Type: {
            get: function () {
                return "Technology";
            },
            enumerable: true,
            configurable: true
        },
        ResearchCost: {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        },
        ResearchTime: {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        },
        Requirements: {
            get: function () {
                return {};
            },
            enumerable: true,
            configurable: true
        },
        Operation: {
            get: function () {
                return {};
            },
            enumerable: true,
            configurable: true
        }

    }, {

    });

    Object.defineProperty(local.Game, "Technology", {
        value: Technology,
        enumerable: true,
        writable: false,
        configurable: false
    });

})(this);
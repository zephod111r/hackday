(function initAsset(local) {

    "use strict";
    var Asset = Class.Derive(local.Game.GameObject, function (position) {
        Object.defineProperties(this, {
            position: {
                value: position || { x: 0, y: 0 },
                writable: true,
                enumerable: false,
                configurable: true
            }
        });
    }, {
        Type: {
            get: function () {
                return "Asset";
            },
            enumerable: true,
            configurable: true
        },
        ConstructionCost: {
            get: function () {
                return {};
            },
            enumerable: true,
            configurable: true
        },
        ConstructionTime: {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        },
        PeriodicCost: {
            get: function () {
                return {};
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
        },
        Position: {
            get: function () {
                return this.position;
            },
            set: function (value) {
                this.position = value;
            },
            enumerable: true
        }
    }, {

    });

    Object.defineProperty(local.Game, "Asset", {
        value: Asset,
        enumerable: true,
        writable: false,
        configurable: false
    });

    Object.defineProperty(local.Game, "Assets", {
        value: {},
        enumerable: true,
        writable: false,
        configurable: false
    });

})(this);

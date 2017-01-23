(function initPlayer(local) {
"use strict";
    var Player = Class.Derive(local.Game.GameObject, function () {
        Object.defineProperties(this, {
            resources: {
                value: {},
                enumerable: false,
                writable: false,
                configurable: false
            },
            technologies: {
                value: {},
                enumerable: false,
                writable: false,
                configurable: false
            },
            assets: {
                value: {},
                enumerable: false,
                writable: false,
                configurable: false
            }
        });
    }, {
        Description: {
            get: function () {
                return "game_Player_Description".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Name: {
            get: function () {
                return "game_Player".Translate();
            },
            enumerable: true,
            configurable: true
        },
        Type: {
            get: function () {
                return "Player";
            },
            enumerable: true,
            configurable: true
        },
        Resources: {
            get: function () {
                return this.resources;
            },
            enumerable: true,
            configurable: true
        },
        Technologies: {
            get: function () {
                return this.technologies;
            },
            enumerable: true,
            configurable: true
        },
        Assets: {
            get: function () {
                return this.assets;
            },
            enumerable: true,
            configurable: true
        }

    }, {

    });

    Object.defineProperty(local.Game, "Player", {
        value: Player,
        enumerable: true,
        writable: false,
        configurable: false
    });

})(this);

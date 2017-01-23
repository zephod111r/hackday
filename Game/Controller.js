(function initController(local) {
"use strict";
    var Controller = Class.Design(function (controls) {
        Object.defineProperties(this, {
            vec: {
                value: new THREE.Vector3(0, 0, 0),
                writable: true,
                enumerable: false,
                configurable: false
            },
            buttons: {
                value: [false, false, false, false, false, false],
                writable: true,
                enumerable: false,
                configurable: false
            },
            controls: {
                value: controls,
                writable: false,
                enumerable: false,
                configurable: false
            }
        });
        for (var i = 0; i < this.controls.length; i++) {
            this.controls[i].pressed = false;
        }

        document.addEventListener("keydown", this.onKeyDown.bind(this), false);
        document.addEventListener("keyup", this.onKeyUp.bind(this), false);
    }, {
        rightLeft: {
            value: function () {
                return this.vec.x;
            },
            writable: false,
            enumerable: true,
            configurable: true
        },
        upDown: {
            value: function () {
                return this.vec.y;
            },
            writable: false,
            enumrable: true,
            configurable: true
        },
        strafeLeftRight: {
            value: function () {
                return -this.upDown();
            },
            writable: false,
            enumrable: true,
            configurable: true
        },
        forwardBack: {
            value: function () {
                return this.vec.z;
            },
            writable: false,
            enumrable: true,
            configurable: true
        },
        controlVector: {
            value: function () {
                return this.vec.clone();
            },
            writable: false,
            enumrable: true,
            configurable: true
        },
        onKey: {
            value: function (event, pressed) {
                // Get the key code of the pressed key
                var keyCode = event.which;
                for (var i = 0; i < this.controls.length; i++) {
                    if (keyCode == this.controls[i].kc) {

                        var control = this.controls[i];

                        var isPressed = pressed ? " pressed" : " up";
                        console.log(control.which + isPressed);

                        var effect = 0.0;
                        if (pressed && !control.pressed) {
                            effect = +1.0;
                        }
                        else if (!pressed && control.pressed) {
                            effect = -1.0;
                        }

                        if (effect != 0) {
                            if ("button" in control
                                && control.button >= 0
                                && control.button < this.buttons.length) {
                                this.buttons[control.button] = (effect > 0);
                            }
                            if ("dx" in control) {
                                this.vec.x += effect * control.dx;
                            }
                            if ("dy" in control) {
                                this.vec.y += effect * control.dy;
                            }
                            if ("dz" in control) {
                                this.vec.z += effect * control.dz;
                            }
                            if("open" in control && pressed) {
                                Page.Navigate(control.open);
                            }
                        }

                        control.pressed = pressed;
                    }
                }
            },
            writable: false,
            enumrable: true,
            configurable: true
        },
        isButtonPressed: {
            value: function (buttonIndex) {
                if (buttonIndex >= 0 && buttonIndex < this.buttons.length) {
                    return this.buttons[buttonIndex];
                }
                return false;
            },
            writable: false,
            enumrable: true,
            configurable: true
        },
        onKeyDown: {
            value: function (event) {
                this.onKey(event, true);
            },
            writable: false,
            enumrable: true,
            configurable: true
        },
        onKeyUp: {
            value: function (event) {
                this.onKey(event, false);
            },
            writable: false,
            enumrable: true,
            configurable: true
        }
    }, {

    });

    var standardControls = [
        // xz controls: arrow keys left, right, up, down
        { which: "left", kc: 37, dx: -1 },
        { which: "right", kc: 39, dx: 1 },
        { which: "forward", kc: 38, dz: 1 },
        { which: "back", kc: 40, dz: -1 },

        // xyz controls w,a,s,d,q,e
        { which: "a", kc: 65, dy: -1 },
        { which: "d", kc: 68, dy: 1 },
        { which: "s", kc: 83, dz: -1 },
        { which: "w", kc: 87, dz: 1 },
        { which: "q", kc: 81, dx: -1 },
        { which: "e", kc: 69, dx: 1 },

        // buttons z,x,c,v
        { which: "z", kc: 90, button: 0 },
        { which: "x", kc: 88, button: 1 },
        { which: "c", kc: 67, button: 2 },
        { which: "v", kc: 86, button: 3 },

        { which: "esc", kc: 27, open: "./Pages/MainMenu/MainMenu.html" },
        { which: "tab", kc: 9, open: "./Pages/GameInventory/GameInventory.html" },
        { which: "end", kc: 35, open: "./Pages/EndGame/EndGame.html" }

    ];

    Object.defineProperty(local, "Controller", {
        value: new Controller(standardControls),
        enumerable: true,
        writable: false,
        configurable: false
    });

})(this);

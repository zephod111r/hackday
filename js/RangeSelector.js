(function initRangeSelector(local) {
"use strict";
    var NumberInput = Class.Derive(DisplayElement.Div, function (title, defaultValue, minvalue, maxvalue, increment) {
        Object.defineProperties(this, {
            value: {
                value: defaultValue || 0,
                writable: true,
                enumerable: false,
                configurable: false
            },
            minvalue: {
                value: typeof minvalue === 'number' ? minvalue : -999999999999,
                writable: true,
                enumerable: false,
                configurable: false
            },
            maxvalue: {
                value: typeof maxvalue === 'number' ? maxvalue : 999999999999,
                writable: true,
                enumerable: false,
                configurable: false
            },
            increment: {
                value: increment || 1,
                writable: true,
                enumerable: false,
                configurable: false
            },
            _Minus: {
                value: new Buttons.Text("-"),
                writable: false, 
                enumerable: false, 
                configurable: false
            },
            _Plus: {
                value: new Buttons.Text("+"),
                writable: false, 
                enumerable: false, 
                configurable: false
            },
            _Input: {
                value: new DisplayElement.Input(),
                writable: false, 
                enumerable: false, 
                configurable: false
            }
        });

        var text = new DisplayElement.Text(title);
        text.Parent = this;

        this._Minus.AddClass("Minus");
        this._Plus.AddClass("Plus");
        this._Input.AddClass("Input");

        this._Minus.Parent = this;
        this._Plus.Parent = this;
        this._Input.Parent = this;

        this.AddClass("NumberInput");

        this._Input.type = 'text';

        this._Input.OnChange = function (event) {
            var value = this.Value;
            value = Math.max(value, this.minvalue);
            value = Math.min(value, this.maxvalue);
            this.Value = value;
            event.preventDefault();
            event.stopPropagation();
            return false;
        }.bind(this);

        this._Plus.OnClick = function (event) {
            this.Value = this.Value + this.increment;
            event.preventDefault();
            event.stopPropagation();
            return false;
        }.bind(this);

        this._Minus.OnClick = function (event) {
            this.Value = this.Value - this.increment;
            event.preventDefault();
            event.stopPropagation();
            return false;
        }.bind(this);

    }, {
        Value: {
            get: function () {
                return Number(this._Input.Value);
            },
            set: function (value) {
                if (typeof value != 'number') return;

                if (value > this.maxvalue) {
                    value = this.maxvalue;
                } else if (value < this.minvalue) {
                    value = this.minvalue;
                }
                this._Input.Value = value.toString();
            },
            enumerable: true
        }
    });

    
    Namespace.Design("Controls", {
        NumberInput: {
            value: NumberInput,
            writable: false,
            enumerable: true,
            configurable: false
        }
    });

})(this);

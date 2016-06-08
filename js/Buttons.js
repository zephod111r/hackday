(function (Root) {

    "use strict";

    var TextButton = Class.Derive(DisplayElement.Button, function (text) {
        if (text && typeof text == 'string') {
            this.Element.innerText = text.Translate();
        }

        this.AddClass("Text");
    }, {
        Text: {
            get: function () {
                return this.element.innerText;
            },
            set: function (value) {
                this.element.innerText = toString(value);
            },
            enumerable: true
        }
    });

    var IconButton = Class.Derive(DisplayElement.Button, function (img) {
        if (img) {
            this.Element.style.backgroundImage = "url(" + img + ")";
        }
        this.AddClass("Icon");
    }, {
        Icon: {
            get: function () {
                return this.element.firstChild.src;
            },
            set: function (value) {
                this.element.firstChild.src = value;
            },
            enumerable: true
        }
    });

    var ContextMenu = Class.Derive(TextButton, function (text, children) {
        Object.defineProperties(this, {
            children: {
                value: children,
                writable: false,
                enumerable: true,
                configurable: true
            },
            expanded: {
                value: false,
                writable: true,
                enumerable: true,
                configurable: true
            }
        });

        for (var index = 0; index < this.children.length; ++index) {
            var child = this.children[index];
            child.Parent = this.element;
            child.Visible = this.expanded;
        }

        this.element.onclick = function (event) {
            if (this.Enabled) {
                this.clickaction && this.clickaction();
                this.expanded = !this.expanded;
                for (var index = 0; index < this.children.length; ++index) {
                    var child = this.children[index];
                    child.Visible = this.expanded;
                }
            }
            event.preventDefault();
            event.stopPropagation();
            return false;
            
        }.bind(this);
    }, 
    {
        OnClick: {
            set: function (value) {
                if (typeof value == 'function') {
                    this.clickaction = value;
                }
            },
            get: function () {
                return this.clickaction;
            },
            enumerable: true,
            configurable: true
        },
        Children: {
            get: function () {
                return this.children;
            },
            enumerable: true
        }
    });

    Namespace.Design("Buttons", {
        Icon: {
            value: IconButton,
            writable: false,
            enumerable: true,
            configurable: false
        },
        Text: {
            value: TextButton,
            writable: false,
            enumerable: true,
            configurable: false
        },
        ContextMenu: {
            value: ContextMenu,
            writable: false,
            enumerable: true,
            configurable: false
        },
    });
})(this);
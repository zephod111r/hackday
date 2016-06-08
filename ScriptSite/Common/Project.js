var Project = function (element, gamescript) {
    var date = new Date();
    this.lasttime = date.getTime();
    this.delta = 0;
    this.canvas = element;
    this.gamescript = gamescript;
    this.canvas.focus();
    this.renderable = new RenderElement(new Position(0, 0, this.canvas.width, this.canvas.height), "#000000");
    this.object = new ObjectElement();
    this.object.actions = new Array();
    this.object.actions.push( new CodeElement( this, "Update", this.Update));
    this.input = new Input(this.canvas, this);
    this.context = this.canvas.getContext("2d");
    this.intervalHandler = this.interval.bind(this);
    window.setInterval(this.intervalHandler, 50);
    this.loader = new Loader();
    this.loader.loadJSON(gamescript, this.onScriptLoaded.bind(this));
};

Project.prototype.onScriptLoaded = function (loadedScript)
{
    if (loadedScript != null) {
        this.ParseScript(this, loadedScript);
    }
}

Project.prototype.addKey = function (key) {
    if (key < Key.count) {
        this.keys[key] = true;
    }
};

Project.prototype.removeKey = function (key) {
    if (key < Key.count) {
        this.keysRelease[key] = true;
    }
};

Project.prototype.restart = function () {
};

Project.prototype.loadLevel = function () {
    this.keys = [false, false, false, false];
    this.keysRelease = [false, false, false, false];
    this.tick = 0;
    this.DrawObject(this);
};

Project.prototype.interval = function () {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 6;
    this.renderable.position.width = this.canvas.width;
    this.renderable.position.height = this.canvas.height;
    try {
        this.UpdateObject(this);
    }
    catch (err) { }
    this.DrawObject(this);
};

Project.prototype.Update = function () {
    var date = new Date();
    var time = date.getTime();
    this.delta = time - this.lasttime;
    this.lasttime = time;
    this.tick++;

    this.input;
}

Project.prototype.UpdateObject = function (object) {
    if (object == null) { return; }
    try {
        object.object.Run("Update", this.delta);
    }
    catch (err) { }

    if (object.object == undefined || object.object == null || object.object.children == null) { return; }
    for (var index in object.object.children) {
        var child = object.object.children[index];
            this.UpdateObject(child);
    }
}

Project.prototype.DrawObject = function (object, parentPos) {

    if (object == null || object.renderable == undefined || object.renderable == null || object.renderable.visible == false) { return; }
    try {
        object.renderable.Prepare(this.context);
        object.renderable.setParentPosition(parentPos);
        object.Draw(this.context);
    }
    catch (err) { }
    if (object.object == undefined || object.object == null || object.object.children == null) { return; }
    for (var index in object.object.children) {
        var child = object.object.children[index];
        if (object.renderable != undefined && object.renderable != null) {
            this.DrawObject(child, object.renderable.getScreenPosition());
        } else {
            this.DrawObject(child, parentPos);
        }
    }
}

Project.prototype.Draw = function (context) {
    context.fillStyle = "#0F0FF0";
    context.fillRect(this.renderable.position.x, this.renderable.position.y, this.renderable.position.width, this.renderable.position.height);
};

Project.prototype.Clone = function(item)
{
    var target = null;
    if (item instanceof MenuElement) {
        target = new MenuElement(item);
    } else if (item instanceof TemplateElement) {
        target = new TemplateElement(item);
    } else if (item instanceof DummyElement) {
        target = new DummyElement(item);
    } else if(item instanceof TextElement){
        target = new TextElement(item);
    } else if (item instanceof ImageElement) {
        target = new ImageElement(item);
    } else if (item instanceof CodeElement) {
        target = new CodeElement(item);
    }

    return target;
}

Project.prototype.ParseScript = function (object, scriptdata) {

    if (object.object == undefined || scriptdata == undefined || scriptdata == null) return; // Not an object able to accept children!

    for (var index in scriptdata) {
        var script = scriptdata[index];

        var element = null;

        if (script.Type == "Menu") {
            element = new MenuElement();
            element.clear = script.Clear;
        }
        else if (script.Type == "TextElement") {
            var font = new Font(script.Font.name, script.Font.size);
            element = new TextElement();
            element.font = font;
            element.text = script.Text;
            element.textAlign = script.TextAlign;
        }
        else if (script.Type == "ImageElement") {
            element = new ImageElement();
            element.imageload.src = script.Src;
        }
        else if (script.Type == "Template") {
            element = new TemplateElement();
        } else {
            element = new DummyElement();
        }

        if (element != null) {
            var renderable = new RenderElement();

            if (script.Renderable != undefined) {
                renderable = new RenderElement(script.Renderable);
            }
            else {
                if (script.Position != undefined) {
                    renderable.position = new Position(script.Position[0], script.Position[1], script.Position[2], script.Position[3]);
                }
                if (script.Colour != undefined) {
                    renderable.hasColour(script.Colour);
                }
                if (script.Shadow != undefined) {
                    renderable.hasShadow(script.Shadow);
                }
                if (script.Visible != undefined) {
                    renderable.visible = script.Visible;
                }
                if (script.Scale != undefined) {
                    renderable.scale = script.Scale;
                }
            }
            element.renderable = renderable;

            if (script.Title != undefined && script.Title != null) {
                element.title = script.Title;
            }

            if (object.object == null) object.object = new ObjectElement();
            if (object.object.children == null) object.object.children = new Array();

            object.object.children.push(element);

            if (script.Template != undefined && script.Template != null) {
                if (element.object == undefined || element.object == null) {
                    element.object = new ObjectElement();
                }

                var template = this.FindElementByName(script.Template);
                if (template != null && template.object != undefined && template.object != null) {

                    if (template.renderable.hasColour()) {
                        element.renderable.hasColour(template.renderable.colour);
                    }
                    if (template.renderable.hasShadow()) {
                        element.renderable.hasShadow(new ShadowElement(template.renderable.shadow));
                    }


                    // Templated Elements
                    if (template.object.children != undefined && template.object.children != null) {
                        if (element.object.children == undefined || element.object.children == null) {
                            element.object.children = new Array();
                        }
                        for (var index in template.object.children) {
                            var templateitem = template.object.children[index];
                            var target = this.Clone(templateitem);
                            if (target != null) {
                                element.object.children.push(target);
                            }
                        }
                    }
                    // Templated actions!
                    if (template.object.actions != undefined && template.object.actions != null) {
                        if (element.object.actions == undefined || element.object.actions == null) {
                            element.object.actions = new Array();
                        }
                        for (var index in template.object.actions) {
                            var templateitem = template.object.actions[index];
                            var target = this.Clone(templateitem);
                            if (target != null) {
                                target.target = element;
                                element.object.actions.push(target);
                            }
                        }
                    }

                }
            }

            this.ParseScript(element, script.children, script.Template);

            if (script.actions != null) {
                for (var index in script.actions) {
                    var action = script.actions[index];
                    if (element.object != undefined && element.object != null) {
                        if (element.object.actions == undefined || element.object.actions == null) {
                            element.object.actions = new Array();
                        }
                        var code = new CodeElement(element, action.Type, eval('(' + action.Code + ')'));
                        element.object.actions.push(code);
                    }
                }
            }

            try {
                element.object.Run("Init");
            } catch (err) { }
        }
    }
}

Project.prototype.FindChildElementByName = function (object, name) {
    if (object == undefined || object == null || object.object == undefined || object.object == null || object.object.children == undefined || object.object.children == null) return null;
    for (var index in object.object.children) {
        var child = object.object.children[index];
        if (child.title == undefined || child.title == null) continue;
        if (child.title === name) return child;
    }
    return null;
}

Project.prototype.FindElementByName = function (name) {
    var names = name.split(".", name.length);
    var objectParent = this;
    var object = null;
    for (var index in names) 
    {
        object = this.FindChildElementByName( objectParent, names[index] );
        if(object == null)  {
            break;
        }
        objectParent = object;
    }
    return object;
}

Project.prototype.OnMouseDown = function (object, x, y) {
    var captured = false;


    // Top down stack unlike update which is a bottom up stack.
    if (object.object != undefined && object.object != null && object.object.children != null) {
        for (var index in object.object.children) {
            var child = object.object.children[index];
            captured = this.OnMouseDown(child, x, y);
            if (captured == true) {
                return captured;
            }
        }
    }

    if (object.renderable != undefined && object.renderable != null && object.renderable.getScreenPosition().contains(new Position(x, y))) {
        if (object.MouseDownObjects == undefined) {
            object.MouseDownObjects = new Array();
        }
        object.MouseDownObjects.push(object);
        try {
                captured = object.object.Run("MouseDown", x, y);
            } catch (err) { }
    }

    return captured;
}


Project.prototype.OnMouseUp = function (object, x, y) {
    var captured = false;

    if (object.MouseDownObjects != undefined) {
        for (var index in object.MouseDownObjects) {
            var target = object.MouseDownObjects[index];
            if (target != undefined && target != null) {
                try {
                    target.object.Run("MouseUp", x, y, true); 
                } catch (err) { }
            }
        }

        object.MouseDownObjects = new Array();
    }

    // Top down stack unlike update which is a bottom up stack.
    if (object.object != undefined && object.object != null && object.object.children != null) {
        for (var index in object.object.children) {
            var child = object.object.children[index];
            captured = this.OnMouseUp(child, x, y);
            if (captured == true) {
                return captured;
            }
        }
    }

    if (object.renderable != undefined && object.renderable != null && object.renderable.getScreenPosition().contains(new Position(x, y))) {
        try {
                captured = object.object.Run("MouseUp", x, y, true);
            } catch (err) { }
    }

    return captured;
}

Project.prototype.OnMouseMove = function (object, x, y, isMouseDown) {
    var captured = false;

    if (isMouseDown && object.MouseDownObjects != undefined) {
        var array = new Array();
        for (var index in object.MouseDownObjects) {
            var target = object.MouseDownObjects[index];
            if (target.renderable != undefined && target.renderable != null && target.renderable.getScreenPosition().contains(new Position(x, y))) {
                array.push(target);
            }
            else {
                try {
                    target.object.Run("MouseUp", x, y, false);
                } catch (err) { }
            }
        }

    }

    // Top down stack unlike update which is a bottom up stack.
    if (object.object != undefined && object.object != null && object.object.children != null) {
        for (var index in object.object.children) {
            var child = object.object.children[index];
            captured = this.OnMouseMove(child, x, y, isMouseDown);
            if (captured == true) {
                return captured;
            }
        }
    }

    if (object.renderable != undefined && object.renderable != null && object.renderable.getScreenPosition().contains(new Position(x, y))) {
        try {
                captured = object.object.Run("MouseMove", x, y, isMouseDown);
            } catch (err) { }
    }

    return captured;
}
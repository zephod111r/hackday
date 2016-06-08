var ShadowElement = function () {

   this.position = new Position();
   this.colour = null;
   
   if (arguments.length == 1) {
        this.position = new Position(arguments[0].position);
        this.colour = arguments[0].colour;
    }
    else if(arguments.length > 1) {
        this.position = new Position(arguments[0]);
        this.colour = arguments[1];
    }
}

ShadowElement.prototype.IsDisabled = function () {
    if (this.Position == new Position(0, 0) || this.colour == null) return true;
    return false;
}

ShadowElement.prototype.Prepare = function(context) {
    context.shadowOffsetX = this.position.x;
    context.shadowOffsetY = this.position.x;
    context.shadowBlur = this.position.width;
    context.shadowColor = this.colour;
}

var RenderElement = function () {

    this.position = new Position();
    this.colour = null;
    this.visible = true;
    this.scale = 1.0;
    this.parentPos = null;
    this.hascolour = false;
    this.shadow = new ShadowElement();
    this.hasshadow = false;

    if (arguments.length == 1) {
        this.position = arguments[0].position;
        this.colour = arguments[0].colour;
        this.visible = arguments[0].visible;
        this.scale = arguments[0].scale;
        this.shadow = arguments[0].shadow;
        this.parentPos = arguments[0].parentPos;
        this.hascolour = arguments[0].hascolour;
        this.hasshadow = arguments[0].hasshadow;
    } else if(arguments.length > 1) {
        this.position = new Position(arguments[0]);
        this.colour = arguments[1];
        this.hascolour = true;

        if (arguments.length >= 3) {
            this.visible = arguments[2];
        }
        else {
            this.visible = true; // default to visible!
        }

        if (arguments.length >= 4) {
            this.scale = arguments[3];
        }
        else {
            this.scale = 1.0;
        }

        if (arguments.length >= 5) {
            this.shadow = new ShadowElement(arguments[5], arguments[6]);
            this.hasshadow = true;
        }
        else {
            this.shadow = new ShadowElement();
            this.hasshadow = false;
        }
    }
}
RenderElement.prototype.hasColour = function () {
    if (arguments.length != 0) {
        this.colour = arguments[0];
        this.hascolour = true;
    }
    return this.hascolour;
}

RenderElement.prototype.hasShadow = function () {
    if (arguments.length != 0) {
        this.shadow = new ShadowElement(arguments[0]);
        this.hasshadow = true;
    }
    return this.hasshadow;
}

RenderElement.prototype.getScreenX = function () {
    var x = this.position.x;
    if (this.parentPos != null) x += this.parentPos.x
    return x;
}
RenderElement.prototype.getScreenY = function () {
    var y = this.position.y;
    if(this.parentPos != null) y += this.parentPos.y
    return y;
}
RenderElement.prototype.getLocalX = function () {
    return this.position.x;
}
RenderElement.prototype.getLocalY = function () {
    return this.position.y;
}
RenderElement.prototype.getScreenPosition = function () {
    return new Position(this.getScreenX(), this.getScreenY(), this.position.width, this.position.height);
}

RenderElement.prototype.setParentPosition = function (position) {
    this.parentPos = position;
}

RenderElement.prototype.Prepare = function (context) {
    if (this.shadow != undefined && this.shadow != null) {
        this.shadow.Prepare(context);
    }
    context.fillStyle = this.colour;
}

var CodeElement = function () {
    if (arguments.length == 0) {
        this.target = null;
        this.name = null;
        this.code = null;
    } else if (arguments.length == 1) {
        this.target = arguments[0].target;
        this.name = arguments[0].name;
        this.code = arguments[0].code;
    }
    else {
        this.target = arguments[0];
        this.name = arguments[1];
        this.code = arguments[2];
    }
}

var ObjectElement = function () {
    if (arguments.length == 1) {
        this.actions = new Array(arguments[0].actions);
        this.children = new Array(arguments[0].children);
    }
    else {
        this.actions = null;
        this.children = null;
    }
}

ObjectElement.prototype.Run = function () {
    var name = arguments[0];
    if (this.actions != undefined && this.actions != null) {
        for (var index in this.actions) {
            var code = this.actions[index];
            if (code.name === name) {
                code.target.execute = code.code;
                switch (arguments.length - 1) {
                    case 0:
                        return code.target.execute();
                    case 1:
                        return code.target.execute(arguments[1]);
                    case 2:
                        return code.target.execute(arguments[1], arguments[2]);
                    case 3:
                        return code.target.execute(arguments[1], arguments[2], arguments[3]);
                    case 4:
                        return code.target.execute(arguments[1], arguments[2], arguments[3], arguments[4]);
                    case 5:
                        return code.target.execute(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                    case 6:
                        return code.target.execute(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                    case 7:
                        return code.target.execute(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
                    case 8:
                        return code.target.execute(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                    case 9:
                        return code.target.execute(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
                    case 10:
                        return code.target.execute(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9], arguments[10]);
                    default:
                        return code.target.execute(arguments);
                }
            }
        }
    }
}

var TemplateElement = function () {

    this.object = new ObjectElement();
    this.renderable = new RenderElement();
    this.renderable.visible = false;
    this.renderable.hasColour(false);

    if (arguments.length == 1) {
        this.object = new ObjectElement(arguments[0].object);
        this.renderable = new RenderElement(arguments[0].renderable);
        this.renderable.visible = false;
    }
}

var DummyElement = function () {
        this.object = new ObjectElement();
        this.renderable = new RenderElement();
        this.renderable.visible = true;
    if (arguments.length == 1) {
        this.object = new ObjectElement(arguments[0].object);
        this.renderable = new RenderElement();
        this.renderable.visible = true;
    }
    else {
    }
}
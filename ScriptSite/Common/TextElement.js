var TextElement = function () {
    this.font = null;
    this.text = null;
    this.textAlign = null;
    this.renderable = new RenderElement();
    this.object = new ObjectElement();

    if (arguments.length == 1) // Copy constructor
    {
        this.renderable = new RenderElement(arguments[0].renderable);
        this.object = new ObjectElement(arguments[0].object);
        this.font = arguments[0].font;
        this.text = arguments[0].text;
        this.textAlign = arguments[0].textAlign;
    }
}

TextElement.prototype.Draw = function (context) {
    var pos = this.renderable.getScreenPosition();
    this.font.DrawString(context, this.text, pos.x, pos.y, pos.width, pos.height, this.textAlign);
}
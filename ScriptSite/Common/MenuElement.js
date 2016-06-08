var MenuElement = function () {

    this.clear = false;
    this.renderable = new RenderElement();
    this.object = new ObjectElement;

    if (arguments.length == 1) // Copy constructor
    {
        this.renderable = new RenderElement( arguments[0].renderable );
        this.object = new ObjectElement(argument[0].object);
        this.clear = argument[0].clear
    }
}

MenuElement.prototype.Draw = function (context) {
    var pos = this.renderable.getScreenPosition();
    if (this.clear != undefined && this.clear != false) {
        context.clearRect(pos.x, pos.y, pos.width, pos.height);
    }

}

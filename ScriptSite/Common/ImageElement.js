var ImageElement = function () {
    this.image = null;
    this.imageload = new Image();
    this.imageload.onload = this.onload.bind(this);
    this.imageload.src = null;
    this.renderable = new RenderElement();
    this.object = new ObjectElement();

    if (arguments.length == 1) // Copy constructor
    {
        this.renderable = new RenderElement(arguments[0].renderable);
        this.object = new ObjectElement(arguments[0].object);
        this.image = new Image(arguments[0].image);
        this.imageload = new Image(arguments[0].imageload);
        this.imageload.onload = this.onload.bind(this);

    }
}

ImageElement.prototype.onload = function () {
    this.image = this.imageload;
}

ImageElement.prototype.Draw = function (context) {
    context.fillStyle = this.renderable.colour;
    var pos = this.renderable.getScreenPosition();
    if (this.image != null) context.drawImage(this.image, pos.x, pos.y, pos.width, pos.height);
    else context.fillRect(pos.x, pos.y, pos.width, pos.height);
}
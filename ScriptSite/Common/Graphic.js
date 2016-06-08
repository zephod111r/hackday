var Graphic = function( dx, dy, dw, dh, colour)
{
	this.position = new Position( dx, dy, dw, dh );
	this.image = null;
	this.colour = colour;
	this.children = null;
}

Graphic.prototype.Draw = function( context )
{
	context.fillStyle = this.colour;
	if(this.image != null)
	{
		context.drawImage(this.image, this.position.x, this.position.y, this.position.width, this.position.height);
	}
	else
	{
		context.fillRect( this.position.x, this.position.y, this.position.width, this.position.height  );
	}
}
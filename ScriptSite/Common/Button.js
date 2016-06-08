var Button = function( font, align, colour, dx, dy, dw, dh, style)
{
	this.position = new Position(dx,dy,dw,dh);
	this.children = new Array();
	this.style = style;
	this.state = ButtonState.Up;
	this.text = new TextElement( font, "", align, colour, this.position );
	this.children.push(this.text);
	this.textaction = new Action( ActionTypes.Text );
	this.textaction.New = "Active"
	this.target = null;
}

Button.prototype.OnMouseDown = function( position ) {

	if(this.state == ButtonState.Up)
	{
		if(this.position.IsPointOver(position))
		{
			this.state = ButtonState.Down;
			if(this.textaction != null)
			{
				this.textaction.Activate(this.text);
			}
			if(this.graphicaction != null)
			{
				this.graphicaction.Activate(this.graphics);
			}
		}
	}
} 

Button.prototype.OnMouseUp = function( position ) {

	if(this.state == ButtonState.Down)
	{
		if(this.position.IsPointOver(position))
		{
			try
			{
					this.OnPressedHandler();
			}
			catch(err){}
		}
		this.state = ButtonState.Up;
		if(this.textaction != null)
		{
			this.textaction.Deactivate(this.text);
		}
		if(this.graphicaction != null)
		{
			this.graphicaction.Deactivate(this.graphics);
		}
	}
} 

Button.prototype.OnPressedHandler = function()
{
	this.OnPress();
}

Button.prototype.Draw = function( display )
{
	for(var child in this.children)
	{
		this.children[child].Draw(display);
	}
}

Button.prototype.SetColour = function( colour )
{
	this.colour = colour;
	for(var index in this.graphics)
	{
		
	}
}
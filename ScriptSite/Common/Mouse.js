var Mouse = function()
{
	this.position = new Position(0,0,0,0);
	this.pressed = false;
}

Mouse.prototype.ChangeState = function( statetype, value )
{
	switch(statetype)
	{
	case MouseState.Pressed:
		{
			this.pressed = value;
		}
		break;
	default:
		break;
	}
}
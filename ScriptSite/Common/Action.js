var Action = function( action )
{
	this.action = action;
	this.New = null;
	this.Old = null;
}

Action.prototype.Activate = function( element )
{
	switch( this.action )
	{
	case ActionTypes.Text:
		{
			if(this.Old == null) this.Old = element.text;
			element.text = this.New;
		}
		break;
	case ActionTypes.Colour:
		{
			if(this.Old == null) this.Old = element.colour;
			element.colour = this.New;
		}
		break;
	case ActionTypes.Graphic:
		{
			if(this.Old == null) this.Old = element.graphic;
			element.graphic = this.New;
		}
		break;
	case ActionTypes.None:
	default:
		break;
	}
}

Action.prototype.Deactivate = function( element )
{
	switch( this.action )
	{
	case ActionTypes.Text:
		{
			element.text = this.Old;
		}
		break;
	case ActionTypes.Colour:
		{
			element.colour = this.Old;
		}
		break;
	case ActionTypes.Graphic:
		{
			element.graphic = this.Old;
		}
		break;
	case ActionTypes.None:
	default:
		break;
	}
}
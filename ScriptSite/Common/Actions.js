var Actions = function(element)
{
	this.element = element;
	this.array = new Array();
	for( var index in ActionEvent )
	{
		this.array.push(null);
	}

	this.array[ActionEvent.Draw] = Actions.DrawAction.bind(this);
	this.array[ActionEvent.Update] = Actions.Update.bind(this);
}

Actions.prototype.DrawAction = function()
{
	try{
		this.element.Draw();
	} catch(err) {}
}

Actions.prototype.DrawAction = function(element)
{
	try
	{
		this.element.Update();
	} catch(err) {}
}


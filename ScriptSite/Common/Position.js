var Position = function () {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    
    if (arguments.length === 1) // copy constructor
    {
        this.x = arguments[0].x;
        this.y = arguments[0].y;
        this.width = arguments[0].width;
        this.height = arguments[0].height;
    }
    else if (arguments.length === 2) // (x, y)
    {
        this.x = arguments[0];
        this.y = arguments[1];
        this.width = 0;
        this.height = 0;
    }
    else if (arguments.length === 4) // (x, y, w, h)
    {
        this.x = arguments[0];
        this.y = arguments[1];
        this.width = arguments[2];
        this.height = arguments[3];
    }
};

Position.prototype.equals = function (position) {
    return (this.x == position.x) && (this.y == position.y);
};

Position.prototype.contains = function (position) {
    return (this.x <= position.x) && ((this.x + this.width) >= (position.x + position.width)) && (this.y <= position.y) && ((this.y + this.height) >= (position.y + position.height));
};

var Orientation = 
{
    Vertical: 0,
    Horizontal: 1
};

var ScrollBarPosition = 
{
    None: 0,
    LeftVertical: 1,
    BottomHorizontal: 2,
    RightVertical: 4,
    TopHorizontal: 8
};

var Grid = function (dx, dy, dw, dh) {
    this.postion.x = dx;
    this.position.y = dy;
    this.position.width = dw;
    this.position.height = dh;
    this.Container = new Array();
    this.position.scaleX = 1.0;
    this.position.scaleY = 1.0;
    this.position.scrollX = 0.0;
    this.position.scrollY = 0.0;
    this.ShowScroll = false;
    this.ScrollBar = ScrollBarPosition.None
}

Grid.prototype.AddElement = function(element) {
    this.Container.push(element)
}

Grid.prototype.onDrawGrid = function () {

    var Span = 0;
    var Stride = 0;
    for (i = 0; i < this.array.length; i++) {
        if (this.orientation == Orientation.Vertical) {
            Span = this.array[i].width;
            if (this.array[i].height > Stride)
                Stride = this.array[i].height;
        } else {
            Span = this.array[i].height;
            if (this.array[i].width > Stride)
                Stride = this.array[i].width;
        }
    }

    if (Span > this.position.height) {
        this.ScrollBar = ScrollBarPosition.Left
    }


}
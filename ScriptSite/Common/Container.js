var Container = function (max) {
    this.maxItems = max;
    this.count = 0;
    this.array = new Array();
}

Container.prototype.Add = function (item) {
    if (this.array.length <= this.maxItems) {
        this.array.push(item);
    }
}
var LoadRequestType = {
    None: 0,
    Image: 1,
    Audio: 2,
    JSON: 3,
    Javascript: 4 
};

function AjaxRequest() {
    var activexmodes = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];  //activeX versions to check for in IE
    if (window.ActiveXObject) { //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
        for (var i = 0; i < activexmodes.length; i++) {
            try {
                return new ActiveXObject(activexmodes[i]);
            }
            catch (e) {
                //suppress error
            }
        }
    }
    else
        return new XMLHttpRequest();
}

var DocumentRequest = function (type, name, callback) {
    this.type = type;
    this.name = name;
    this.callback = callback;
    this.value = null;
    this.request = new AjaxRequest();
    this.request.onreadystatechange = this.onReadyStateChange.bind(this);
    this.request.open("GET", name, false)
    this.request.send();
}

DocumentRequest.prototype.onReadyStateChange = function () {
    if (this.request.readyState == 4) {
        if ((this.request.status == 200) || (window.location.href.indexOf("http") == -1)) {
            this.value = JSON.parse( this.request.responseText ); //retrieve result as an JavaScript object
            this.callback(this.value);
        }
        else {
            alert("An error has occured making the request " + this.name);
        }
    }
}

var Loader = function () {
    this.count = 0;
    this.items = new Array();
};

Loader.prototype.loadScript = function (filename, callback) {
    this.items.push(new DocumentRequest(LoadRequestType.Javascript, filename, callback));
}

Loader.prototype.loadJSON = function (filename, callback) {
    this.items.push(new DocumentRequest(LoadRequestType.JSON, filename, callback));
}

Loader.prototype.Find = function (name) {
    for (var index in this.items) {
        var item = this.items[index];
        if (item.name == name) return item;
    }
    return null;
}

var Input = function (canvas, project) {
    this.canvas = canvas;
    this.project = project;
    this.touchPosition = null;
    this.mouseDownHandler = this.mouseDown.bind(this);
    this.mouseUpHandler = this.mouseUp.bind(this);
    this.mouseMoveHandler = this.mouseMove.bind(this);
    this.touchStartHandler = this.touchStart.bind(this);
    this.touchEndHandler = this.touchEnd.bind(this);
    this.touchMoveHandler = this.touchMove.bind(this);
    this.keyDownHandler = this.keyDown.bind(this);
    this.keyPressHandler = this.keyPress.bind(this);
    this.keyUpHandler = this.keyUp.bind(this);
    this.isMouseDown = false;
    this.canvas.addEventListener("touchstart", this.touchStartHandler, false);
    this.canvas.addEventListener("touchmove", this.touchMoveHandler, false);
    this.canvas.addEventListener("touchend", this.touchEndHandler, false);
    this.canvas.addEventListener("mousedown", this.mouseDownHandler, false);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler, false);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler, false);
    document.addEventListener("keydown", this.keyDownHandler, false);
    document.addEventListener("keypress", this.keyPressHandler, false);
    document.addEventListener("keyup", this.keyUpHandler, false);
    this.isWebKit = typeof navigator.userAgent.split("WebKit/")[1] !== "undefined";
    this.isMozilla = navigator.appVersion.indexOf('Gecko/') >= 0 || ((navigator.userAgent.indexOf("Gecko") >= 0) && !this.isWebKit && (typeof navigator.appVersion !== "undefined"));
};

Input.prototype.keyDown = function (e) {
    if (!this.isMozilla && !e.ctrlKey && !e.altKey && !e.altKey && !e.metaKey) {
        this.processKey(e, e.keyCode);
    }
};

Input.prototype.keyPress = function (e) {
    if (this.isMozilla && !e.ctrlKey && !e.altKey && !e.altKey && !e.metaKey) {
        this.processKey(e, (e.keyCode != 0) ? e.keyCode : (e.charCode === 32) ? 32 : 0);
    }
};

Input.prototype.keyUp = function (e) {
    switch (e.keyCode) {
        case 37: { this.project.removeKey(Key.left); } break;
        case 39: { this.project.removeKey(Key.right); } break;
        case 38: { this.project.removeKey(Key.up); } break;
        case 40: { this.project.removeKey(Key.down); } break;
    }
};

Input.prototype.processKey = function (e, keyCode) {
    switch( keyCode )
    {
        case 37: { this.stopEvent(e); this.project.addKey(Key.left); } break;
        case 39: { this.stopEvent(e); this.project.addKey(Key.right); } break;
        case 38: { this.stopEvent(e); this.project.addKey(Key.up); } break;
        case 40: { this.stopEvent(e); this.project.addKey(Key.down); } break;
        case 27: { this.stopEvent(e); this.project.addKey(Key.reset); } break;
        case 8:
        case 36: { this.stopEvent(e); this.project.nextLevel(); } break;
        default: if (!this.project.isAlive()) { this.stopEvent(e); this.project.addKey(Key.reset); } break;
    }

};

Input.prototype.mouseDown = function (e) {
    e.preventDefault();
    this.canvas.focus();
    try {
        this.isMouseDown = true;
        this.project.OnMouseDown(this.project, e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop);
    } catch (err) { }
};

Input.prototype.mouseUp = function (e) {
    e.preventDefault();
    this.canvas.focus();
    try {
        this.isMouseDown = false;
        this.project.OnMouseUp(this.project, e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop);
    } catch (err) { }
};

Input.prototype.mouseMove = function (e) {
    e.preventDefault();
    this.canvas.focus();
    try {
        this.project.OnMouseMove(this.project, e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop, this.isMouseDown);
    } catch (err) { }
};

Input.prototype.touchStart = function (e) {
    e.preventDefault();
    if (e.touches.length > 3) // 4 finger touch = jump to next level
    {
        this.project.nextLevel();
    }
    else if ((e.touches.length > 2) || (!this.project.isAlive())) // 3 finger touch = restart current level
    {
        this.project.addKey(Key.reset);
    }
    else {
        for (var i = 0; i < e.touches.length; i++) {
            this.touchPosition = new Position(e.touches[i].pageX, e.touches[i].pageY);
        }
    }
};

Input.prototype.touchMove = function (e) {
    e.preventDefault();
    for (var i = 0; i < e.touches.length; i++) {
        if (this.touchPosition !== null) {
            var x = e.touches[i].pageX;
            var y = e.touches[i].pageY;
            var direction = null;
            if ((this.touchPosition.x - x) > 20) {
                direction = Key.left;
            }
            else if ((this.touchPosition.x - x) < -20) {
                direction = Key.right;
            }
            else if ((this.touchPosition.y - y) > 20) {
                direction = Key.up;
            }
            else if ((this.touchPosition.y - y) < -20) {
                direction = Key.down;
            }
            if (direction !== null) {
                this.touchPosition = new Position(x, y);
                for (var i = Key.left; i <= Key.down; i++) {
                    if (direction == i) {
                        this.project.addKey(i);
                    }
                    else {
                        this.project.removeKey(i);
                    }
                }
            }
        }
    }
};

Input.prototype.touchEnd = function (e) {
    e.preventDefault();
    this.touchPosition = null;
    this.project.removeKey(Key.left);
    this.project.removeKey(Key.right);
    this.project.removeKey(Key.up);
    this.project.removeKey(Key.down);
};

Input.prototype.stopEvent = function (e) {
    e.preventDefault();
    e.stopPropagation();
};

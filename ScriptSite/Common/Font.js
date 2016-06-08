

var Glyph = function (image, x, y, width, height, step) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.step = step;
}

Glyph.prototype.Draw = function (context, x, y, widthscale, heightscale) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height, x, y + this.step, this.width * widthscale, this.height * heightscale);
}

var Font = function (systemfont, size) {
    this.systemfont = systemfont;
    this.size = size;
    if (systemfont == null) {
        this.image = new Image();
        this.glyphMap = null;
        this.image.onload = this.onLoadCallback.bind(this);
        this.image.src = "ArialBoldAlpha.png";
    }
}

Font.prototype.onLoadCallback = function () {
    this.glyphMap = new Array
        (
    // First line
            new Glyph(this.image, 0, 5, 5, 14, 0), // (space)
            new Glyph(this.image, 5, 5, 5, 14, 0), //!
            new Glyph(this.image, 10, 5, 8, 14, 0), //"
            new Glyph(this.image, 18, 6, 10, 14, 0), //#
            new Glyph(this.image, 29, 5, 11, 14, 1), //$
            new Glyph(this.image, 40, 5, 16, 14, 0),  //%
            new Glyph(this.image, 57, 5, 13, 14, 0), //&
            new Glyph(this.image, 70, 5, 4, 14, 0), //'
            new Glyph(this.image, 74, 5, 6, 14, 0), //(
            new Glyph(this.image, 80, 5, 6, 14, 0), //)
            new Glyph(this.image, 87, 5, 7, 14, 0), //*
            new Glyph(this.image, 95, 5, 9, 14, 1), //+
            new Glyph(this.image, 115, 5, 5, 14, 0), //,
            new Glyph(this.image, 120, 5, 5, 14, 0), //-
            new Glyph(this.image, 125, 5, 5, 14, 0), //.
            new Glyph(this.image, 130, 5, 5, 14, 0), ///
            new Glyph(this.image, 135, 5, 11, 14, 0), //0
            new Glyph(this.image, 146, 5, 11, 14, 0), //1
            new Glyph(this.image, 157, 5, 11, 14, 0), //2
            new Glyph(this.image, 168, 5, 11, 14, 0), //3
            new Glyph(this.image, 179, 5, 11, 14, 0), //4
            new Glyph(this.image, 190, 5, 11, 14, 0), //5
            new Glyph(this.image, 201, 5, 11, 14, 0), //6
            new Glyph(this.image, 212, 5, 11, 14, 0), //7
            new Glyph(this.image, 223, 5, 11, 14, 0), //8
            new Glyph(this.image, 234, 5, 11, 14, 0), //9
            new Glyph(this.image, 245, 5, 5, 14, 0), //:
            new Glyph(this.image, 250, 5, 5, 14, 0), //;
    // Second line
            new Glyph(this.image, 0, 29, 11, 14, 1), //<
            new Glyph(this.image, 11, 29, 11, 14, 2), //=
            new Glyph(this.image, 22, 29, 11, 14, 1), //>
            new Glyph(this.image, 33, 29, 10, 14, 1), //?
            new Glyph(this.image, 43, 29, 12, 14, 1), //@
            new Glyph(this.image, 55, 29, 12, 14, 1), //A
            new Glyph(this.image, 67, 29, 12, 14, 1), //B
            new Glyph(this.image, 79, 29, 12, 14, 1), //C
            new Glyph(this.image, 91, 29, 13, 14, 1), //D
            new Glyph(this.image, 104, 29, 11, 14, 1), //E
            new Glyph(this.image, 115, 29, 11, 14, 1), //F
            new Glyph(this.image, 126, 29, 13, 14, 1), //G
            new Glyph(this.image, 140, 29, 11, 14, 1), //H
            new Glyph(this.image, 152, 29, 6, 14, 1), //I
            new Glyph(this.image, 158, 29, 11, 14, 1), //J
            new Glyph(this.image, 170, 29, 12, 14, 1), //K
            new Glyph(this.image, 182, 29, 11, 14, 1), //L
            new Glyph(this.image, 194, 29, 14, 14, 1), //M
            new Glyph(this.image, 209, 29, 11, 14, 1), //N
            new Glyph(this.image, 221, 29, 13, 14, 1), //O

    // Line three
            new Glyph(this.image, 1, 51, 11, 14, 0), //P
            new Glyph(this.image, 12, 51, 13, 14, 0), //Q
            new Glyph(this.image, 26, 51, 11, 14, 0), //R
            new Glyph(this.image, 37, 51, 12, 14, 0), //S
            new Glyph(this.image, 49, 51, 12, 14, 0), //T
            new Glyph(this.image, 62, 51, 11, 14, 0), //U
            new Glyph(this.image, 74, 51, 12, 14, 0), //V
            new Glyph(this.image, 86, 51, 16, 14, 0), //W
            new Glyph(this.image, 102, 51, 12, 14, 0), //X
            new Glyph(this.image, 114, 51, 12, 14, 0), //Y
            new Glyph(this.image, 126, 51, 12, 14, 0), //Z
            new Glyph(this.image, 138, 53, 6, 14, 1), //[
            new Glyph(this.image, 144, 53, 5, 14, 0), //\
            new Glyph(this.image, 149, 53, 6, 14, 1), //]
            new Glyph(this.image, 156, 53, 9, 14, 0), //^
            new Glyph(this.image, 165, 53, 10, 14, 0), //_
            new Glyph(this.image, 175, 53, 5, 14, 0), //`
            new Glyph(this.image, 181, 53, 11, 14, 2), //a
            new Glyph(this.image, 192, 53, 11, 14, 2), //b
            new Glyph(this.image, 203, 53, 11, 14, 2), //c
            new Glyph(this.image, 214, 53, 11, 14, 2), //d
            new Glyph(this.image, 225, 53, 11, 14, 2), //e
            new Glyph(this.image, 236, 53, 7, 14, 2), //f
            new Glyph(this.image, 244, 53, 11, 14, 2), //g

    // Line four
            new Glyph(this.image, 1, 76, 9, 14, 2), //h
            new Glyph(this.image, 11, 76, 5, 14, 2), //i
            new Glyph(this.image, 16, 76, 6, 14, 2), //j
            new Glyph(this.image, 22, 76, 11, 14, 2), //k
            new Glyph(this.image, 33, 76, 5, 14, 2), //l
            new Glyph(this.image, 38, 76, 15, 14, 2), //m
            new Glyph(this.image, 54, 76, 11, 14, 2), //n
            new Glyph(this.image, 65, 76, 11, 14, 2), //o
            new Glyph(this.image, 76, 76, 11, 14, 2), //p
            new Glyph(this.image, 87, 76, 11, 14, 2), //q
            new Glyph(this.image, 98, 76, 8, 14, 2), //r
            new Glyph(this.image, 106, 76, 10, 14, 2), //s
            new Glyph(this.image, 116, 76, 7, 14, 2), //t
            new Glyph(this.image, 123, 76, 10, 14, 2), //u
            new Glyph(this.image, 134, 76, 10, 14, 2), //v
            new Glyph(this.image, 144, 76, 15, 14, 2), //w
            new Glyph(this.image, 159, 76, 11, 14, 2), //x
            new Glyph(this.image, 170, 76, 10, 14, 2), //y
            new Glyph(this.image, 180, 76, 9, 14, 2), //z
            new Glyph(this.image, 189, 76, 6, 14, 1), //{
            new Glyph(this.image, 195, 76, 4, 14, 1), //|
            new Glyph(this.image, 199, 76, 6, 14, 1), //}
            new Glyph(this.image, 205, 76, 10, 14, 2) //~
        );
}

Font.prototype.GetLineWidth = function (text) {
    var width = 0;
    for (var character in text) {
        var index = text.charCodeAt(character) - 32;
        if (index < 0 || index > 95) continue;
        var glyph = this.glyphMap[index];
        width += glyph.width;
    }
    return width;
}

Font.prototype.GetTextWidth = function (text) {
    var maxwidth = 0;
    var lines = text.split("\n", text.length);
    for (var index in lines) {
        var width = this.GetLineWidth(lines[index]);
        if (width > maxwidth)
            maxwidth = width;
    }
    return maxwidth;
}

Font.prototype.GetTextHeight = function (text) {
    var height = 0;
    var lines = text.split("\n", text.length);
    for (var index in lines) {
        height += this.glyphMap[0].height + 2;
    }
    return height;
}

Font.prototype.DrawString = function (context, text, x, y, w, h, colour, textAlign) {
    var strings = text.split("\n", text.length);

    if (this.systemfont == null) 
    {
        if (this.glyphMap == null) return;


        var origX = x;
        var width = this.GetTextWidth(text);
        var widthscale = 1.0
        if (w < width) widthscale = w / width;

        var height = this.GetTextHeight(text);
        var heightscale = 1.0
        if (h < height) heightscale = h / height;

        for (var index in strings) {
            var string = strings[index];
            for (var i in string) {
                var index = string.charCodeAt(i) - 32;
                var glyph = this.glyphMap[index];
                if (glyph != null) {
                    glyph.Draw(context, x, y, widthscale, heightscale);
                    x += glyph.width * widthscale;
                }
            }
            x = origX;
            y += ((this.glyphMap[0].height + 2) * heightscale);
        }
    }
    else 
    {
        context.font = this.systemfont;
        context.textBaseline = 'alphabetic';
        context.textAlign = textAlign;
        for (var index in strings) {
            y += this.size;
            var string = strings[index];
            context.fillText(string, x, y, w);
            y += 2;
        }
    }
}


//Font.prototype.imageData=["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"];
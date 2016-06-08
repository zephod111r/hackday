(function initMathematics(local) {
 
local.Mathematics = Class.Design(function(){}, {}, {
 
    convertDegreesToRadians: {
        value: function toRad(deg) { return deg * (Math.PI / 180); },
        writable: false,
        enumerable: true,
        configurable: false
    },
    
    convertRadiansToDegrees: {
        value: function toDeg(rad) { return rad * (180 / Math.PI); },
        writable: false,
        enumerable: true,
        configurable: false
    }
});

})(this);
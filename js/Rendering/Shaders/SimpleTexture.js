(function(local){

    "use strict";
    
var fragmentShader = [
                        "uniform sampler2D texture1;",
                        "",
                        "varying vec2 vUv;",
                        "",
                        "void main( void ) {",
                        "gl_FragColor = texture2D(texture1, vUv);",
                        //"gl_FragColor = vec4(0.5, 0.2, 1.0, 1.0);",
                        "}"
    ].join('\n');
    
var vertexShader = [
                          "uniform vec2 uvScale;",
                          "",
                          "varying vec2 vUv;",
                          "",
                          "void main()",
                          "{",
                          "    vUv = (uvScale * uv);",
                          "    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
                          "    gl_Position = projectionMatrix * mvPosition;",
                          "}"
    ].join('\n');
    
var textureCloud = Rendering.TextureLoader.load( "./images/cloud.png" );
textureCloud.wrapS = THREE.RepeatWrapping;
textureCloud.wrapT = THREE.RepeatWrapping;

var uniforms = {
    texture1: { value: textureCloud },
    uvScale: { value: new THREE.Vector2(1.0, 1.0) }
};

local.SimpleTexture = local.SimpleTexture || {};

Object.defineProperties( local.SimpleTexture, {
    OnWindowResize: { value: function() {}, writable: false, configurable: false, enumerable: false },
    fragmentShader: { value: fragmentShader, writable: false, enumerable: true, configurable: false },
    vertexShader: { value: vertexShader, writable: false, configurable: false, enumerable: true },
    uniforms: { value: uniforms, writable: false, enumerable: true, configurable: false },
});

Object.defineProperty( local.SimpleTexture, "material", {
    value: new THREE.ShaderMaterial( local.SimpleTexture ),
    writable: false,
    configurable: false,
    enumerable: true
});
    
local.Register(local.SimpleTexture);
    
})(this.Shaders);

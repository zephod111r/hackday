(function initShaders(local) {

var shaderList = [];

;

function registerShader( shader )
{
    this.push(shader);
}

Object.defineProperties(local, {
    Update: {
        value: function shaderUpdate( delta )
            {
                for(var index in shaderList) {
                    var item = shaderList[index];
                    if(!!item) {
                        item.material.uniforms.time.value += ( delta );
                    }
                }
            },
        writable: false,
        configurable: false,
        enumerable: true
    },
    Register: {
        value: registerShader.bind(shaderList),
        writable: false,
        configurable: false,
        enumerable: true
    },
    onWindowResize: {
        value: function shaderOnWindowResize( event, rect )
            {
                for(var index in shaderList)
                {
                    var item = shaderList[index];
                    if(!!item) {
                        item.OnWindowResize( event, rect );
                    }
                }
            },
        writable: false,
        configurable: false,
        enumerable: true
 
    }
});

})(this.Shaders);
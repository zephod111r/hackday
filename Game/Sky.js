(function initSky(local){

local.Sky = Class.Design(function skyConstructor(arenaSize){
// Constructor
    var texture = new THREE.CanvasTexture( this.GenerateSky() );
    var geo = new THREE.PlaneBufferGeometry( 50, 50 );

    arenaSize = arenaSize || 50;
    
    arenaSize = (arenaSize/50);

    for( var i = 0; i < arenaSize; ++i) {
        for( var j = 0; j < arenaSize; ++j) {
            var mat = new THREE.MeshBasicMaterial({ color: new THREE.Color( 0x111111 )});
            var mesh = new THREE.Mesh(geo, mat);
            mesh.recieveShadow = true;
    
            var sky = new Rendering.Renderable(mesh, true);
            var rand = Math.ceil(Math.random() * 100);
            var zrot = (rand % 4) * (Math.PI/2);
            var xpos = 50 * ((i + 0.5) - (0.5 * arenaSize));
            var ypos = 50 * ((j + 0.5) - (0.5 * arenaSize));
            var zpos = -300
            sky.Position.x = xpos;
            sky.Position.y = ypos;
            sky.Position.z = zpos;
            sky.Rotation = { x:0, y:0, z:zrot };

            // star plane
            for(var layer = 0; layer < 3; ++layer) {
                var mat = new THREE.MeshBasicMaterial( {
                    color: new THREE.Color().setHSL( 0.0, 0.0, 0.0 ),
                    map: texture,
                    depthTest: false,
                    depthWrite: false,
                    transparent: true
                } );
                var mesh = new THREE.Mesh(geo, mat);
                var skyLayer = new Rendering.Renderable(mesh, true);
                skyLayer.Position.x = xpos;
                skyLayer.Position.y = ypos + (layer * 0.015);
                skyLayer.Position.z = zpos;
                skyLayer.Rotation = { x:0, y:0, z:zrot };
            }
        }
    }
}, {
    GenerateSky: {
            value: function generateTexture() {
				var canvas = document.createElement( 'canvas' );
				canvas.width = 512;
				canvas.height = 512;
				var context = canvas.getContext( '2d' );
				context.globalAlpha = 0.075;
				context.globalCompositeOperation = 'darken';
				for ( var i = 0; i < 1000; i ++ ) {
					context.fillStyle = 'hsl(0, 0%,' + ( Math.random() * 100 ) + '%)';
					context.beginPath();
					context.arc( Math.random() * canvas.width, Math.random() * canvas.height, Math.random() + 0.15, 0, Math.PI * 2, true );
					context.fill();
				}
				return canvas;
			},
            writable: false,
            configurable: false,
            enumerable: false
        }
// Members
}, {
// Statics
});

})(this.Game);

(function initSky(local){

local.Sky = Class.Design(function skyConstructor(arenaSize){
// Constructor
    var texture = new THREE.CanvasTexture( this.GenerateSky() );
    var geo = new THREE.PlaneBufferGeometry( 79, 79 );

    arenaSize = arenaSize || 79;
    
    arenaSize = (arenaSize/79);

    for( var i = 0; i < (2*arenaSize); ++i) {
        for( var j = 0; j < (arenaSize); ++j) {
            var mat = new THREE.MeshBasicMaterial({ color: new THREE.Color( 0xffffff ) });
            var mesh = new THREE.Mesh(geo, mat);
            mesh.recieveShadow = false;
    
            var sky = new Rendering.Renderable(mesh, true);
            var rand = Math.ceil(Math.random() * 100);
            var zrot = (rand % 4) * (Math.PI/2);
            var xpos = 79 * ((i + 0.5) - (arenaSize));
            var ypos = 79 * ((j + 0.5) - (0.5 * arenaSize));
            var zpos = -(arenaSize * 40)
            sky.Position.x = xpos;
            sky.Position.y = ypos;
            sky.Position.z = zpos;
            sky.Rotation = { x:0, y:0, z:zrot };

            // star plane
            for(var layer = 0; layer < 10; ++layer) {
                var rand = Math.ceil(Math.random() * 100);
                var mat = new THREE.MeshBasicMaterial( {
                    color: new THREE.Color().setHSL( ((layer / 10) * 0.4), ((layer / 10) * 0.4), ((layer / 10) * 0.4) ),
                    map: texture,
                    depthTest: true,
                    depthWrite: true,
                    transparent: true
                } );
                var mesh = new THREE.Mesh(geo, mat);
                mesh.recieveShadow = false;
                var skyLayer = new Rendering.Renderable(mesh, true);
                skyLayer.Position.x = xpos;
                skyLayer.Position.y = ypos;
                skyLayer.Position.z = zpos + (layer * 0.015);
                skyLayer.Rotation = { x:0, y:0, z:(rand % 4) * (Math.PI/2)};
            }
        }
    }
}, {
    GenerateSky: {
            value: function generateTexture() {
				var canvas = document.createElement( 'canvas' );
				canvas.width = 256;
				canvas.height = 256;
				var context = canvas.getContext( '2d' );
				context.globalAlpha = 1;
				context.globalCompositeOperation = 'darken';
				for ( var i = 0; i < 10000; i ++ ) {
					context.fillStyle = 'hsl(0, 0%,' + ( 50 + (Math.random() * 50) % 50 ) + '%)';
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

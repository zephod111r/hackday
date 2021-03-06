(function initFloor(local){
"use strict";
local.Floor = Class.Design(function floorConstructor(arenaSize){
// Constructor
    var texture = new THREE.CanvasTexture( this.GenerateFloor() );
    var geo = new THREE.PlaneBufferGeometry( 49, 49 );

    arenaSize = arenaSize || 49;
    
    arenaSize = (arenaSize/49);

    for( var i = 0; i < arenaSize; ++i) {
        for( var j = 0; j < arenaSize; ++j) {
            var mat = new THREE.MeshBasicMaterial({ color: new THREE.Color( 0x112200 )});
            var mesh = new THREE.Mesh(geo, mat);
            mesh.recieveShadow = true;
    
            var floor = new Rendering.Renderable(mesh, true);
            floor.Position.y = -0.15;
            var rand = Math.ceil(Math.random() * 100);
            var zrot = (rand % 4) * (Math.PI/2);
            var xpos = 49 * ((i + 0.5) - (0.5 * arenaSize));
            var zpos = 49 * ((j + 0.5) - (0.5 * arenaSize));
            floor.Position.x = xpos;
            floor.Position.z = zpos;
            floor.Rotation = { x:-(Math.PI/2), y:0, z:zrot };

            // floor plane
            for(var layer = 0; layer < 10; ++layer) {
                var mat = new THREE.MeshBasicMaterial( {
                    color: new THREE.Color().setHSL( 0.2, 0.65, ((layer / 15) * 0.4) + 0.1 ),
                    map: texture,
                    depthTest: false,
                    depthWrite: false,
                    transparent: true
                } );
                var mesh = new THREE.Mesh(geo, mat);
                var floor = new Rendering.Renderable(mesh, true);
                floor.Position.y = layer * 0.15;
                floor.Position.x = xpos;
                floor.Position.z = zpos;
                floor.Rotation = { x:-(Math.PI/2), y:0, z:zrot };
            }
        }
    }
}, {
    GenerateFloor: {
            value: function generateTexture() {
				var canvas = document.createElement( 'canvas' );
				canvas.width = 512;
				canvas.height = 512;
				var context = canvas.getContext( '2d' );
				context.globalAlpha = 0.075;
				context.globalCompositeOperation = 'overlay';
				for ( var i = 0; i < 10000; i ++ ) {
					context.fillStyle = 'hsl(0,0%,' + ( Math.random() * 50 + 50 ) + '%)';
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

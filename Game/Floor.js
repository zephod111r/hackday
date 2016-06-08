(function initFloor(local){

local.Floor = Class.Design(function floorConstructor(arenaSize){
// Constructor
    var texture = new THREE.CanvasTexture( this.GenerateFloor() );
    var geo = new THREE.PlaneBufferGeometry( 50, 50 );

    arenaSize = arenaSize || 50;
    
    arenaSize = (arenaSize/50);

    for( var i = 0; i < arenaSize; ++i) {
        for( var j = 0; j < arenaSize; ++j) {
            var mat = new THREE.MeshBasicMaterial({ color: new THREE.Color( 0x2E2B19 )});
            var mesh = new THREE.Mesh(geo, mat);
    
            var floor = new Rendering.Renderable(mesh, true);
            floor.Position.y = -0.25;
            floor.Position.x = (i - 0.5) * arenaSize;
            floor.Position.z = (j - 0.5) * arenaSize;
            floor.Rotation.x = -Mathematics.convertDegreesToRadians(90);

            // floor plane
            for(var i = 0; i < 10; ++i) {
                var mat = new THREE.MeshBasicMaterial( {
                    color: new THREE.Color().setHSL( 0.3, 0.75, (i / 15) * 0.4 + 0.1 ),
                    map: texture,
                    depthTest: false,
                    depthWrite: false,
                    transparent: true
                } );
                var mesh = new THREE.Mesh(geo, mat);
                mesh.recieveShadow = true;
                var floor = new Rendering.Renderable(mesh, true);
                floor.Position.y = i * 0.25;
                floor.Position.x = (i - 0.5) * arenaSize;
                floor.Position.z = (j - 0.5) * arenaSize;
                floor.Rotation.x = -Mathematics.convertDegreesToRadians(90);
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
				for ( var i = 0; i < 10000; i ++ ) {
					context.fillStyle = 'hsl(0,0%,' + ( Math.random() * 50 + 50 ) + '%)';
					context.beginPath();
					context.arc( Math.random() * canvas.width, Math.random() * canvas.height, Math.random() + 0.15, 0, Math.PI * 2, true );
					context.fill();
				}
				context.globalAlpha = 0.075;
				context.globalCompositeOperation = 'lighter';
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
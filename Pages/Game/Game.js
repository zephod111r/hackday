(function initGame(Root) {

    "use strict";

    Page.Create('./Pages/Game/Game.html', {
        Ready: {
            value: function (element, options) {
                this.clock = new THREE.Clock();
                
                var size = 0.65;
                var torusmaterial = new THREE.ShaderMaterial( Shaders.Lava );
                var torusgeom = new THREE.TorusGeometry( size, 0.3, 30, 30 ); // CircleGeometry(size, 64);
                var torusmesh = new THREE.Mesh(torusgeom, torusmaterial);
         
                var light = new THREE.HemisphereLight(0x66ccff, 0x00aa00, 1);
                new Rendering.Renderable(light, true);
                
                var spotLight = new THREE.SpotLight(0xffffff, 1);
                spotLight.castShadow = true;
                spotLight.distance = 200;
                spotLight.decay = 2;
                spotLight.angle = 50;
                spotLight.shadow.mapSize.width = 1024;
                spotLight.shadow.mapSize.height = 1024;
                spotLight.shadow.camera.near = 30;
                spotLight.shadow.camera.far = 100;
                spotLight.shadow.camera.fov = Mathematics.convertRadiansToDegrees(spotLight.angle);
                spotLight.position.set(10, 35, 10);
                new Rendering.Renderable(spotLight, true);

                new Game.Floor(1000);

                var torus = new Rendering.Renderable(torusmesh, true);
                torus.Rotation.x = -Mathematics.convertDegreesToRadians(15);
                torus.Position.y = 10;
                
                if ( !Detector.webgl ) Detector.addGetWebGLMessage();
                
                this.renderer = new THREE.WebGLRenderer({ antialias: true });
				this.renderer.setPixelRatio( window.devicePixelRatio );
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                this.renderer.gammaInput = true;
                this.renderer.gammaOutput = true;
                
                this.renderer.autoClear = false;
                
                element.appendChild(this.renderer.domElement);
                
                // camera
                this.camera = new THREE.PerspectiveCamera(60, 4/3, 1, 1000);
                this.camera.position.set(0, 75, 100);
                this.camera.lookAt(new THREE.Vector3(0, 0, 0));
                
                this.renderModel = new THREE.RenderPass( Rendering.Scene.Scene, this.camera );
                //this.renderModel.clearColor = new THREE.Color(0.1, 0.2, 0.7);
                
                this.effectBloom = new THREE.BloomPass( 1.25 );
                
                this.effectFilm = new THREE.FilmPass( 0.20, 0.95, 2048, false );
                this.effectFilm.renderToScreen = true;
                
                this.composer = new THREE.EffectComposer( this.renderer );
                this.composer.addPass( this.renderModel );
                this.composer.addPass( this.effectBloom );
                this.composer.addPass( this.effectFilm );
                
                window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
                
                this.onWindowResize();
                
                this.requestId = requestAnimationFrame( this.Animate.bind(this) );
                
            }, writable: false, enumerable: true
        },
        renderSize: {
            value: function () {
                var rect = this.element.getClientRects()[0];
                return rect;
            }
        },
        onWindowResize:
        {
            value: function ( event ) {
                var rect = this.renderSize();
                
                Shaders.onWindowResize(event, rect);
                this.renderer.setSize( rect.width, rect.height );
                this.camera.aspect = rect.width / rect.height;
                this.camera.updateProjectionMatrix();
                this.composer.reset();
            }
        },
        Animate:{
            value: function(){
                var delta = 5 * this.clock.getDelta();
                this.requestId = requestAnimationFrame( this.Animate.bind(this) );
                this.Update(delta);
                this.Render(delta);
            }
        },
        Render: {
            value: function(delta) {
                this.composer.render( delta );
            }
        },
        Update:{
            value: function(delta) {
                Rendering.Scene.Update();
                this.camera.lookAt(Controller.controlVector());
                Shaders.Update(delta);
            }
        },
        Unload: {
            value: function () {
                window.cancelAnimationFrame(this.requestId);
                this.element.removeChild(this.renderer.domElement);
            }, writable: false, enumerable: true
        }
    });

})(this);
/**
 * @author alteredq / http://alteredqualia.com/
 */

(function(Root) {
 "use strict";
Root.THREE = Root.THREE || {};

Root.THREE.ShaderPass = function ( shader, textureID ) {

	Root.THREE.Pass.call( this );

	this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

	if ( shader instanceof Root.THREE.ShaderMaterial ) {

		this.uniforms = shader.uniforms;

		this.material = shader;

	} else if ( shader ) {

		this.uniforms = Root.THREE.UniformsUtils.clone( shader.uniforms );

		this.material = new Root.THREE.ShaderMaterial( {

			defines: shader.defines || {},
			uniforms: this.uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader

		} );

	}

	this.camera = new Root.THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene = new Root.THREE.Scene();

	this.quad = new Root.THREE.Mesh( new Root.THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.scene.add( this.quad );

};

THREE.ShaderPass.prototype = Object.assign( Object.create( Root.THREE.Pass.prototype ), {

	constructor: Root.THREE.ShaderPass,

	render: function( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer.texture;

		}

		this.quad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.render( this.scene, this.camera );

		} else {

			renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		}

	}

} );

})(this);

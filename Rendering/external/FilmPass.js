/**
 * @author alteredq / http://alteredqualia.com/
 */

(function(Root) {
 
Root.THREE = Root.THREE || {};

Root.THREE.FilmPass = function ( noiseIntensity, scanlinesIntensity, scanlinesCount, grayscale ) {

	Root.THREE.Pass.call( this );

	if ( Root.THREE.FilmShader === undefined )
		console.error( "THREE.FilmPass relies on THREE.FilmShader" );

	var shader = Root.THREE.FilmShader;

	this.uniforms = Root.THREE.UniformsUtils.clone( shader.uniforms );

	this.material = new Root.THREE.ShaderMaterial( {

		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader

	} );

	if ( grayscale !== undefined )	this.uniforms.grayscale.value = grayscale;
	if ( noiseIntensity !== undefined ) this.uniforms.nIntensity.value = noiseIntensity;
	if ( scanlinesIntensity !== undefined ) this.uniforms.sIntensity.value = scanlinesIntensity;
	if ( scanlinesCount !== undefined ) this.uniforms.sCount.value = scanlinesCount;

	this.camera = new Root.THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene  = new Root.THREE.Scene();

	this.quad = new Root.THREE.Mesh( new Root.THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.scene.add( this.quad );

};

Root.THREE.FilmPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: Root.THREE.FilmPass,

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		this.uniforms[ "tDiffuse" ].value = readBuffer.texture;
		this.uniforms[ "time" ].value += delta;

		this.quad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.render( this.scene, this.camera );

		} else {

			renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		}

	}

} );

})(this);

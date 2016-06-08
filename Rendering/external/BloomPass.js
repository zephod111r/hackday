(function(Root) {

 Root.THREE = Root.THREE || {};
 
/**
 * @author alteredq / http://alteredqualia.com/
 */

Root.THREE.BloomPass = function ( strength, kernelSize, sigma, resolution ) {

	Root.THREE.Pass.call( this );

	strength = ( strength !== undefined ) ? strength : 1;
	kernelSize = ( kernelSize !== undefined ) ? kernelSize : 25;
	sigma = ( sigma !== undefined ) ? sigma : 4.0;
	resolution = ( resolution !== undefined ) ? resolution : 256;

	// render targets

	var pars = { minFilter: Root.THREE.LinearFilter, magFilter: Root.THREE.LinearFilter, format: Root.THREE.RGBAFormat };

	this.renderTargetX = new Root.THREE.WebGLRenderTarget( resolution, resolution, pars );
	this.renderTargetY = new Root.THREE.WebGLRenderTarget( resolution, resolution, pars );

	// copy material

	if ( Root.THREE.CopyShader === undefined )
		console.error( "THREE.BloomPass relies on THREE.CopyShader" );

	var copyShader = Root.THREE.CopyShader;

	this.copyUniforms = Root.THREE.UniformsUtils.clone( copyShader.uniforms );

	this.copyUniforms[ "opacity" ].value = strength;

	this.materialCopy = new Root.THREE.ShaderMaterial( {

		uniforms: this.copyUniforms,
		vertexShader: copyShader.vertexShader,
		fragmentShader: copyShader.fragmentShader,
		blending: THREE.AdditiveBlending,
		transparent: true

	} );

	// convolution material

	if ( Root.THREE.ConvolutionShader === undefined )
		console.error( "THREE.BloomPass relies on THREE.ConvolutionShader" );

	var convolutionShader = Root.THREE.ConvolutionShader;

	this.convolutionUniforms = Root.THREE.UniformsUtils.clone( convolutionShader.uniforms );

	this.convolutionUniforms[ "uImageIncrement" ].value = Root.THREE.BloomPass.blurX;
	this.convolutionUniforms[ "cKernel" ].value = Root.THREE.ConvolutionShader.buildKernel( sigma );

	this.materialConvolution = new Root.THREE.ShaderMaterial( {

		uniforms: this.convolutionUniforms,
		vertexShader:  convolutionShader.vertexShader,
		fragmentShader: convolutionShader.fragmentShader,
		defines: {
			"KERNEL_SIZE_FLOAT": kernelSize.toFixed( 1 ),
			"KERNEL_SIZE_INT": kernelSize.toFixed( 0 )
		}

	} );

	this.needsSwap = false;

	this.camera = new Root.THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene  = new Root.THREE.Scene();

	this.quad = new Root.THREE.Mesh( new Root.THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.scene.add( this.quad );

};

Root.THREE.BloomPass.prototype = Object.assign( Object.create( Root.THREE.Pass.prototype ), {

	constructor: Root.THREE.BloomPass,

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		if ( maskActive ) renderer.context.disable( renderer.context.STENCIL_TEST );

		// Render quad with blured scene into texture (convolution pass 1)

		this.quad.material = this.materialConvolution;

		this.convolutionUniforms[ "tDiffuse" ].value = readBuffer.texture;
		this.convolutionUniforms[ "uImageIncrement" ].value = Root.THREE.BloomPass.blurX;

		renderer.render( this.scene, this.camera, this.renderTargetX, true );


		// Render quad with blured scene into texture (convolution pass 2)

		this.convolutionUniforms[ "tDiffuse" ].value = this.renderTargetX.texture;
		this.convolutionUniforms[ "uImageIncrement" ].value = Root.THREE.BloomPass.blurY;

		renderer.render( this.scene, this.camera, this.renderTargetY, true );

		// Render original scene with superimposed blur to texture

		this.quad.material = this.materialCopy;

		this.copyUniforms[ "tDiffuse" ].value = this.renderTargetY.texture;

		if ( maskActive ) renderer.context.enable( renderer.context.STENCIL_TEST );

		renderer.render( this.scene, this.camera, readBuffer, this.clear );

	}

} );

Root.THREE.BloomPass.blurX = new Root.THREE.Vector2( 0.001953125, 0.0 );
Root.THREE.BloomPass.blurY = new Root.THREE.Vector2( 0.0, 0.001953125 );
  })(this);

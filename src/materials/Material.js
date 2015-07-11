import { THREE$EventDispatcher } from '../core/EventDispatcher';
import { THREE$SpriteMaterial } from './SpriteMaterial';
import { THREE$ShaderMaterial } from './ShaderMaterial';
import { THREE$NormalBlending, THREE$NoColors, THREE$FrontSide, THREE$SmoothShading, THREE$warn, THREE$AddEquation, THREE$OneMinusSrcAlphaFactor, THREE$SrcAlphaFactor } from '../Three';
import { THREE$PointCloudMaterial } from './PointCloudMaterial';
import { THREE$MeshDepthMaterial } from './MeshDepthMaterial';
import { THREE$MeshNormalMaterial } from './MeshNormalMaterial';
import { THREE$MeshPhongMaterial } from './MeshPhongMaterial';
import { THREE$MeshLambertMaterial } from './MeshLambertMaterial';
import { THREE$MeshBasicMaterial } from './MeshBasicMaterial';
import { THREE$Vector3 } from '../math/Vector3';
import { THREE$Color } from '../math/Color';
import { THREE$Math } from '../math/Math';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

function THREE$Material () {
	this.isMaterial = true;

	Object.defineProperty( this, 'id', { value: THREE$MaterialIdCount() } );

	this.uuid = THREE$Math.generateUUID();

	this.name = '';
	this.type = 'Material';

	this.side = THREE$FrontSide;

	this.opacity = 1;
	this.transparent = false;

	this.blending = THREE$NormalBlending;

	this.blendSrc = THREE$SrcAlphaFactor;
	this.blendDst = THREE$OneMinusSrcAlphaFactor;
	this.blendEquation = THREE$AddEquation;
	this.blendSrcAlpha = null;
	this.blendDstAlpha = null;
	this.blendEquationAlpha = null;

	this.depthTest = true;
	this.depthWrite = true;

	this.colorWrite = true;

	this.polygonOffset = false;
	this.polygonOffsetFactor = 0;
	this.polygonOffsetUnits = 0;

	this.alphaTest = 0;

	this.overdraw = 0; // Overdrawn pixels (typically between 0 and 1) for fixing antialiasing gaps in CanvasRenderer

	this.visible = true;

	this._needsUpdate = true;

};

THREE$Material.prototype = {

	constructor: THREE$Material,

	get needsUpdate () {

		return this._needsUpdate;

	},

	set needsUpdate ( value ) {

		if ( value === true ) this.update();

		this._needsUpdate = value;

	},

	setValues: function ( values ) {

		if ( values === undefined ) return;

		for ( var key in values ) {

			var newValue = values[ key ];

			if ( newValue === undefined ) {

				THREE$warn( "THREE.Material: '" + key + "' parameter is undefined." );
				continue;

			}

			if ( key in this ) {

				var currentValue = this[ key ];

				if ( (currentValue && currentValue.isColor) ) {

					currentValue.set( newValue );

				} else if ( (currentValue && currentValue.isVector3) && (newValue && newValue.isVector3) ) {

					currentValue.copy( newValue );

				} else if ( key == 'overdraw' ) {

					// ensure overdraw is backwards-compatable with legacy boolean type
					this[ key ] = Number( newValue );

				} else {

					this[ key ] = newValue;

				}

			}

		}

	},

	toJSON: function () {

		var output = {
			metadata: {
				version: 4.2,
				type: 'material',
				generator: 'MaterialExporter'
			},
			uuid: this.uuid,
			type: this.type
		};

		if ( this.name !== "" ) output.name = this.name;

		if ( (this && this.isMeshBasicMaterial) ) {

			output.color = this.color.getHex();
			if ( this.vertexColors !== THREE$NoColors ) output.vertexColors = this.vertexColors;
			if ( this.blending !== THREE$NormalBlending ) output.blending = this.blending;
			if ( this.side !== THREE$FrontSide ) output.side = this.side;

		} else if ( (this && this.isMeshLambertMaterial) ) {

			output.color = this.color.getHex();
			output.emissive = this.emissive.getHex();
			if ( this.vertexColors !== THREE$NoColors ) output.vertexColors = this.vertexColors;
			if ( this.shading !== THREE$SmoothShading ) output.shading = this.shading;
			if ( this.blending !== THREE$NormalBlending ) output.blending = this.blending;
			if ( this.side !== THREE$FrontSide ) output.side = this.side;

		} else if ( (this && this.isMeshPhongMaterial) ) {

			output.color = this.color.getHex();
			output.emissive = this.emissive.getHex();
			output.specular = this.specular.getHex();
			output.shininess = this.shininess;
			if ( this.vertexColors !== THREE$NoColors ) output.vertexColors = this.vertexColors;
			if ( this.shading !== THREE$SmoothShading ) output.shading = this.shading;
			if ( this.blending !== THREE$NormalBlending ) output.blending = this.blending;
			if ( this.side !== THREE$FrontSide ) output.side = this.side;

		} else if ( (this && this.isMeshNormalMaterial) ) {

			if ( this.blending !== THREE$NormalBlending ) output.blending = this.blending;
			if ( this.side !== THREE$FrontSide ) output.side = this.side;

		} else if ( (this && this.isMeshDepthMaterial) ) {

			if ( this.blending !== THREE$NormalBlending ) output.blending = this.blending;
			if ( this.side !== THREE$FrontSide ) output.side = this.side;

		} else if ( (this && this.isPointCloudMaterial) ) {

			output.size  = this.size;
			output.sizeAttenuation = this.sizeAttenuation;
			output.color = this.color.getHex();

			if ( this.vertexColors !== THREE$NoColors ) output.vertexColors = this.vertexColors;
			if ( this.blending !== THREE$NormalBlending ) output.blending = this.blending;

		} else if ( (this && this.isShaderMaterial) ) {

			output.uniforms = this.uniforms;
			output.vertexShader = this.vertexShader;
			output.fragmentShader = this.fragmentShader;

		} else if ( (this && this.isSpriteMaterial) ) {

			output.color = this.color.getHex();

		}

		if ( this.opacity < 1 ) output.opacity = this.opacity;
		if ( this.transparent !== false ) output.transparent = this.transparent;
		if ( this.wireframe !== false ) output.wireframe = this.wireframe;

		return output;

	},

	clone: function ( material ) {

		if ( material === undefined ) material = new THREE$Material();

		material.name = this.name;

		material.side = this.side;

		material.opacity = this.opacity;
		material.transparent = this.transparent;

		material.blending = this.blending;

		material.blendSrc = this.blendSrc;
		material.blendDst = this.blendDst;
		material.blendEquation = this.blendEquation;
		material.blendSrcAlpha = this.blendSrcAlpha;
		material.blendDstAlpha = this.blendDstAlpha;
		material.blendEquationAlpha = this.blendEquationAlpha;

		material.depthTest = this.depthTest;
		material.depthWrite = this.depthWrite;

		material.polygonOffset = this.polygonOffset;
		material.polygonOffsetFactor = this.polygonOffsetFactor;
		material.polygonOffsetUnits = this.polygonOffsetUnits;

		material.alphaTest = this.alphaTest;

		material.overdraw = this.overdraw;

		material.visible = this.visible;

		return material;

	},

	update: function () {

		this.dispatchEvent( { type: 'update' } );

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE$EventDispatcher.prototype.apply( THREE$Material.prototype );

var count = 0;
function THREE$MaterialIdCount () { return count++; };


export { THREE$MaterialIdCount, THREE$Material };
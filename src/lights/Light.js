import { THREE$Object3D } from '../core/Object3D';
import { THREE$Color } from '../math/Color';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

function THREE$Light ( color ) {
	this.isLight = true;

	THREE$Object3D.call( this );

	this.type = 'Light';
	
	this.color = new THREE$Color( color );

};

THREE$Light.prototype = Object.create( THREE$Object3D.prototype );
THREE$Light.prototype.constructor = THREE$Light;

THREE$Light.prototype.clone = function ( light ) {

	if ( light === undefined ) light = new THREE$Light();

	THREE$Object3D.prototype.clone.call( this, light );

	light.color.copy( this.color );

	return light;

};


export { THREE$Light };
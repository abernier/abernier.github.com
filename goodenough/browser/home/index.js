var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery');

require('jquery-waypoints');
require('jquery-waypoints-sticky');
require('jquery-hammer');
require('velocity-animate');

var Loop = require('loop');

var THREE = require('three');
window.THREE = THREE;
THREE.CSS3DObject = function ( element ) {

	THREE.Object3D.call( this );

	this.element = element;
  
	//this.element.style.position = 'absolute';
   $(this.element).parentsUntil('#scene').andSelf().each(function (i, el) {
     if ($(el).css('position') === 'static') {
       $(el).css('position', 'relative');
     }
     
     $(el).css('transform-style', 'preserve-3d');
     $(el).css('overflow', 'visible');
   });
  
   /*this.element.style.WebkitTransformStyle = 'preserve-3d';
	this.element.style.MozTransformStyle = 'preserve-3d';
	this.element.style.oTransformStyle = 'preserve-3d';
	this.element.style.transformStyle = 'preserve-3d';*/

	this.addEventListener( 'removed', function ( event ) {

		if ( this.element.parentNode !== null ) {

			this.element.parentNode.removeChild( this.element );

		}

	} );

};
THREE.CSS3DObject.prototype = Object.create( THREE.Object3D.prototype );
THREE.CSS3DSprite = function ( element ) {

	THREE.CSS3DObject.call( this, element );

};
THREE.CSS3DSprite.prototype = Object.create( THREE.CSS3DObject.prototype );
//
THREE.CSS3DRenderer = function (domElement, cameraElement) {

	console.log( 'THREE.CSS3DRenderer', THREE.REVISION );

	var _width, _height;
	var _widthHalf, _heightHalf;

	var matrix = new THREE.Matrix4();
	
	var cache = {
		camera: { fov: 0, style: '' },
		objects: {}
	};

	var domElement = domElement || document.createElement( 'div' );
	this.domElement = domElement;

	domElement.style.overflow = 'hidden';

	domElement.style.WebkitTransformStyle = 'preserve-3d';
	domElement.style.MozTransformStyle = 'preserve-3d';
	domElement.style.oTransformStyle = 'preserve-3d';
	domElement.style.transformStyle = 'preserve-3d';

	var cameraElement = cameraElement || document.createElement( 'div' ) && domElement.appendChild(cameraElement);

	cameraElement.style.WebkitTransformStyle = 'preserve-3d';
	cameraElement.style.MozTransformStyle = 'preserve-3d';
	cameraElement.style.oTransformStyle = 'preserve-3d';
	cameraElement.style.transformStyle = 'preserve-3d';

	if ($(cameraElement).css('position') === 'static') {
     $(cameraElement).css('position', 'relative');
   }
  
   this.setClearColor = function () {

	};

	this.setSize = function ( width, height ) {

		_width = width;
		_height = height;

		_widthHalf = _width / 2;
		_heightHalf = _height / 2;

		domElement.style.width = width + 'px';
		domElement.style.height = height + 'px';

		cameraElement.style.width = width + 'px';
		cameraElement.style.height = height + 'px';

	};

	var epsilon = function ( value ) {

		return Math.abs( value ) < 0.000001 ? 0 : value;

	};

	var getCameraCSSMatrix = function ( matrix ) {

		var elements = matrix.elements;

		return 'matrix3d(' +
			epsilon( elements[ 0 ] ) + ',' +
			epsilon(- elements[ 1 ] ) + ',' +
			epsilon( elements[ 2 ] ) + ',' +
			epsilon( elements[ 3 ] ) + ',' +
			epsilon( elements[ 4 ] ) + ',' +
			epsilon( -elements[ 5 ] ) + ',' +
			epsilon( elements[ 6 ] ) + ',' +
			epsilon( elements[ 7 ] ) + ',' +
			epsilon( elements[ 8 ] ) + ',' +
			epsilon(- elements[ 9 ] ) + ',' +
			epsilon( elements[ 10 ] ) + ',' +
			epsilon( elements[ 11 ] ) + ',' +
			epsilon( elements[ 12 ] ) + ',' +
			epsilon(- elements[ 13 ] ) + ',' +
			epsilon( elements[ 14 ] ) + ',' +
			epsilon( elements[ 15 ] ) +
		')';

	};

	var getObjectCSSMatrix = function (object, matrix ) {

		var elements = matrix.elements;

      var t = '';
    
      if (object.element.parentNode === cameraElement) {
        t = 'translate3d(-50%,-50%,0)';
      }
    
      var el = object.element;
      var $el = $(el);
      if (!$el.data('original-transform')) {
        $el.data('original-transform', $el.css('transform'));
      }
    
      var originalTransform = $el.data('original-transform');
      if (originalTransform === 'none') {
        originalTransform = '';
      }
      t += ' ' + originalTransform;
    
      t += ' matrix3d(' +
			epsilon( elements[ 0 ] ) + ',' +
			epsilon( elements[ 1 ] ) + ',' +
			epsilon( elements[ 2 ] ) + ',' +
			epsilon( elements[ 3 ] ) + ',' +
			epsilon( -elements[ 4 ] ) + ',' +
			epsilon( -elements[ 5 ] ) + ',' +
			epsilon( -elements[ 6 ] ) + ',' +
			epsilon( -elements[ 7 ] ) + ',' +
			epsilon( elements[ 8 ] ) + ',' +
			epsilon( elements[ 9 ] ) + ',' +
			epsilon( elements[ 10 ] ) + ',' +
			epsilon( elements[ 11 ] ) + ',' +
			epsilon( elements[ 12 ] ) + ',' +
			epsilon( elements[ 13 ] ) + ',' +
			epsilon( elements[ 14 ] ) + ',' +
			epsilon( elements[ 15 ] ) +
		')';
    
      return t;

	};

	var renderObject = function ( object, camera ) {

		if ( object instanceof THREE.CSS3DObject ) {

			var style;

			if ( object instanceof THREE.CSS3DSprite ) {

				// http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

				matrix.copy( camera.matrixWorldInverse );
				matrix.transpose();
				matrix.copyPosition( object.matrixWorld );
				matrix.scale( object.scale );

				matrix.elements[ 3 ] = 0;
				matrix.elements[ 7 ] = 0;
				matrix.elements[ 11 ] = 0;
				matrix.elements[ 15 ] = 1;

				style = getObjectCSSMatrix(object, matrix );

			} else {
        
             var t = [];
             $(object.element).parentsUntil('#camera').each(function (i,el) {
               var _t = $(el).css('transform');
               if (_t !== 'none')
                 t.push(_t);
             });

				style = t.reverse().join(' ') + ' ' + getObjectCSSMatrix(object,  object.matrixWorld );
        window.toto=0
        if (window.toto<3) alert(style)
        window.toto++;

			}

			var element = object.element;
			var cachedStyle = cache.objects[ object.id ];

			if ( cachedStyle === undefined || cachedStyle !== style ) {

				element.style.WebkitTransform = style;
				element.style.MozTransform = style;
				element.style.oTransform = style;
				element.style.transform = style;

				cache.objects[ object.id ] = style;

			}

			if ( element.parentNode !== cameraElement ) {

				//cameraElement.appendChild( element );

			}

		}

		for ( var i = 0, l = object.children.length; i < l; i ++ ) {

			renderObject( object.children[ i ], camera );

		}

	};

	this.render = function ( scene, camera ) {

		var fov = 0.5 / Math.tan( THREE.Math.degToRad( camera.fov * 0.5 ) ) * _height;

		if ( cache.camera.fov !== fov ) {

			domElement.style.WebkitPerspective = fov + "px";
			domElement.style.MozPerspective = fov + "px";
			domElement.style.oPerspective = fov + "px";
			domElement.style.perspective = fov + "px";

			cache.camera.fov = fov;

		}

		scene.updateMatrixWorld();

		if ( camera.parent === undefined ) camera.updateMatrixWorld();

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		var style = "translate3d(0,0," + fov + "px)" + getCameraCSSMatrix( camera.matrixWorldInverse ) +
			" translate3d(" + _widthHalf + "px," + _heightHalf + "px, 0)";

		if ( cache.camera.style !== style ) {

			cameraElement.style.WebkitTransform = style;
			cameraElement.style.MozTransform = style;
			cameraElement.style.oTransform = style;
			cameraElement.style.transform = style;
			
			cache.camera.style = style;

		}

		renderObject( scene, camera );

	};

};

var HomeView = Backbone.View.extend({
  initialize: function (options) {
    this.options = options;

    console.log('homeView');

    var $scene = this.$('#scene');
    var $camera = this.$('#camera');
    var $window = $(window);
    (function () {
      
      var WW;
      function setWW() {
        WW = $window.width();
      }
      setWW();
      $window.resize(setWW);

      var WH = $window.height();
      function setWH() {
        WH = $window.height();
      }
      setWH();
      $window.resize(setWH);

      var camera = new THREE.PerspectiveCamera(30, 1, -1000, 1000);
      window.camera = camera;

      camera.position.set(WW/2, WH/2, -1500);
      camera.up.set(0, -1, 0);

      var lookAt = new THREE.Vector3(WW/2,WH/2,0);
      window.lookAt = lookAt;
      camera.lookAt(lookAt);

      var renderer = new THREE.CSS3DRenderer($scene[0], $camera[0]);
      window.renderer = renderer;
      //renderer.domElement.style.position = 'absolute';

      var scene = new THREE.Scene();


      function onresize() {
        camera.aspect = WW/WH;
        camera.updateProjectionMatrix();

        renderer.setSize(WW, WH);
      }
      $window.resize(onresize);
      setTimeout(onresize, 1);

      function update(dt) {
        camera.updateProjectionMatrix();
        //controls && controls.update(dt);
      }
      function render(dt) {
        camera.updateProjectionMatrix();
        
        renderer.render(scene, camera);
      }

      var clock = new THREE.Clock();
      function animate(t) {
        requestAnimationFrame(animate);

        update(clock.getDelta());
        render(clock.getDelta());
      }
      animate();

      var dat = require('dat-gui');
      var gui = new dat.GUI();
      var f1 = gui.addFolder('camera.position');
      f1.add(camera.position, 'x', -1000, 1000);
      f1.add(camera.position, 'y', -1000, 3000);
      f1.add(camera.position, 'z', -5000, 0);

      var f2 = gui.addFolder('camera.rotation');
      f2.add(camera.rotation, 'x', 0, 2*Math.PI);
      f2.add(camera.rotation, 'y', 0, 2*Math.PI);
      f2.add(camera.rotation, 'z', 0, 2*Math.PI);

      var f3 = gui.addFolder('camera.lookAt');
      var cx = f3.add(lookAt, 'x', -1000, 1000);
      var cy = f3.add(lookAt, 'y', -1000, 1000);
      var cz = f3.add(lookAt, 'z', -1000, 1000);
      cx.onChange(function (val) {
        camera.lookAt(lookAt);
      });
      cy.onChange(function (val) {
        camera.lookAt(lookAt);
      });
      cz.onChange(function (val) {
        camera.lookAt(lookAt);
      });

    }).call(this);

    //
    // scale
    //

    var SCALE = 2;
    /*(function () {
      $('.scale').each(function (i, el) {
        var $scale = $(el);
        var $in = $scale.find('>.in');
        var $obj = $in.find('>*').eq(0);

        var dims = {
          w: $obj.width(),
          h: $obj.height(),
          margin: {
            left: parseInt($obj.css('margin-left'), 10),
            top: parseInt($obj.css('margin-top'), 10),
            right: parseInt($obj.css('margin-right'), 10),
            bottom: parseInt($obj.css('margin-bottom'), 10)
          }
        };

        $in.css('font-size', (100*SCALE)+'%');
        $scale.css({
          transform: 'scale(' + (1/SCALE) + ')',
          marginTop: (dims.margin.top - ((dims.h*SCALE - dims.h)/2)),
          marginBottom: (dims.margin.bottom - ((dims.h*SCALE - dims.h)/2)),
          marginLeft: (dims.margin.left - ((dims.w*SCALE - dims.w)/2)),
          marginRight: (dims.margin.right - ((dims.w*SCALE - dims.w)/2))
        });

      });
    }).call(this);*/
  }
});

module.exports = HomeView;
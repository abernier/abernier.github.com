require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery');

require('jquery-waypoints');
require('jquery-waypoints-sticky');
require('jquery-hammer');
require('velocity-animate');

var FTScroller = require('ftscroller');

$.fn.offsetRelative = function offsetRelative(selector) {
  var $el = this;
  var $parent = $el.parent();
  if (selector) {
    $parent = $parent.closest(selector);
  }

  var elOffset     = $el.offset();
  var parentOffset = $parent.offset();

  return {
    left: elOffset.left - parentOffset.left,
    top: elOffset.top - parentOffset.top
  };
};

var Loop = require('loop');

var TWEEN = require('tween');
window.TWEEN = TWEEN;

var THREE = require('three');
window.THREE = THREE;

var epsilon = function ( value ) {
  return Math.abs( value ) < 0.000001 ? 0 : value;
};
THREE.CSS3DObject = function ( element ) {
	THREE.Object3D.call( this );

	this.element = element;
  var $el = $(this.element);

  var offset = $el.offset();
  this.position.set(offset.left, offset.top, 0);
  this.dims = {
    w: $el.width(),
    h: $el.height()
  };
  /*var elements = this.matrixWorld.elements;
  this.rotation.set(epsilon(Math.asin(elements[5])), epsilon(Math.acos(elements[0])));*/
  
	//this.element.style.position = 'absolute';
  $el.parentsUntil('#scene').andSelf().each(function (i, el) {
    if ($el.css('position') === 'static') {
      //$el.css('position', 'relative');
    }
     
    if ($el.css('transform-style') !== 'preserve-3d') {
      $el.css('transform-style', 'preserve-3d');
    }
    if ($el.css('overflow') !== 'visible') {
      $el.css('overflow', 'visible');
    }
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
  $(cameraElement).addClass('cam3d');

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
			epsilon( elements[ 4 ] ) + ',' +
			epsilon( elements[ 5 ] ) + ',' +
			epsilon( elements[ 6 ] ) + ',' +
			epsilon( elements[ 7 ] ) + ',' +
			epsilon( elements[ 8 ] ) + ',' +
			epsilon( elements[ 9 ] ) + ',' +
			epsilon( elements[ 10 ] ) + ',' +
			epsilon( elements[ 11 ] ) + ',' +
			epsilon( elements[ 12 ] - object.position.x ) + ',' +
			epsilon( elements[ 13 ] - object.position.y ) + ',' +
			epsilon( elements[ 14 ] ) + ',' +
			epsilon( elements[ 15 ] ) +
		')';
    
    return t;

	};

	var renderObject = function ( object, camera ) {

		if ( object instanceof THREE.CSS3DObject ) {

			var style;

			var t = [];
      $(object.element).parentsUntil('#camera').each(function (i,el) {
        var _t = $(el).css('transform');
        if (_t !== 'none') {
          //t.push(_t);
        }
      });
      style = t.reverse().join(' ') + ' ' + getObjectCSSMatrix(object,  object.matrixWorld );

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
      console.log('changing camera perspective');

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
      console.log('changing camera transform');
			
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
    true && (function () {

      // http://stackoverflow.com/questions/14614252/how-to-fit-camera-to-object
      function distw(width, fov, aspect) {
        //return 2*height/Math.tan(2*fov/(180 /Math.PI))
        //return 2*height / Math.tan(fov*(180/Math.PI)/2);
        return ((width/aspect)/Math.tan((fov/2)/(180/Math.PI)))/2;
      }
      function disth(height, fov, aspect) {
        return (height/Math.tan((fov/(180/Math.PI))/2))/2;
      }
      
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

      var camera = new THREE.PerspectiveCamera(30, WW/WH, -1000, 1000);
      window.camera = camera;

      camera.position.set(WW/2, WH/2, -distw(WW, camera.fov, camera.aspect)); // camera.position.z === -perspective
      camera.up.set(0, -1, 0);

      var lookAt = new THREE.Vector3(WW/2,WH/2,-1);
      window.lookAt = lookAt;
      camera.lookAt(lookAt);

      var renderer = new THREE.CSS3DRenderer($scene[0], $camera[0]);
      window.renderer = renderer;
      //renderer.domElement.style.position = 'absolute';

      var scene = new THREE.Scene();
      window.scene = scene;

      $('.obj').each(function (i, el) {
        var $el = $(el);

        var obj = new THREE.CSS3DObject(el);
        $el.data('css3dobject', obj);

        //var offset = $el.offset();
        //obj.position.set(offset.left,offset.top,0);

        console.log('obj', obj.getWorldPosition());
        scene.add(obj);
      });


      function onresize() {
        camera.aspect = WW/WH;
        camera.updateProjectionMatrix();

        renderer.setSize(WW, WH);
      }
      onresize();
      $window.resize(onresize);

      function update() {
        camera.updateProjectionMatrix();
      }
      function draw() {
        camera.updateProjectionMatrix();
        
        renderer.render(scene, camera);
      }
      window.draw = draw;
      draw();

      //
      // shading
      //

      var renderlight;
      (function () {
        //
        // Photon
        //
        /*var Photon = require('photon');
        var light = new Photon.Light(100, 200, 500); window.light = light;
        var faces = [];

        var $stabilo = $('.stabilo');
        //var stabilofacegroup = new Photon.FaceGroup($stabilo[0], $stabilo.find('.h, .f').get(), 1, 1, false);
        //faces.push(stabilofacegroup);
        $stabilo.find('.hexa .strip').each(function (i, el) {
          //faces.push(new Photon.Face(el, .5));
          faces.push(new Photon.FaceGroup(el, $(el).find('.h, .f').get(), .5, 0, true));
        });

        var $cube = $('.cube');
        var cubefacegroup = new Photon.FaceGroup($('#camera')[0], $cube.find('>*').get(), .5, 0, true);
        faces.push(cubefacegroup);*/

        //
        // http://keithclark.co.uk/articles/calculating-element-vertex-data-from-css-transforms/demo6/
        //

        /* Returns A, B, C and D vertices of an element
        ---------------------------------------------------------------- */

        function computeVertexData (elem) {
            var w = elem.offsetWidth,
                h = elem.offsetHeight,
                x = elem.offsetLeft,
                y = elem.offsetTop,
                z = 0,
                v = {
                    a: { x: x,     y: y, z: z }, // top left corner
                    b: { x: x+w, y: y,   z: z }, // top right corner
                    c: { x: x+w, y: y+h, z: z }, // bottom right corner
                    d: { x: x,   y: y+h, z: z }  // bottom left corner
                },
                transform;

            while (elem.nodeType === 1) {
                transform = getTransform(elem);
                v.a = addVectors(rotateVector(v.a, transform.rotate), transform.translate);
                v.b = addVectors(rotateVector(v.b, transform.rotate), transform.translate);
                v.c = addVectors(rotateVector(v.c, transform.rotate), transform.translate);
                v.d = addVectors(rotateVector(v.d, transform.rotate), transform.translate);
                elem = elem.parentNode;
            }
            return v;
        }


        /* Returns the rotation and translation components of an element
        ---------------------------------------------------------------- */

        function getTransform (elem) {
            var computedStyle = getComputedStyle(elem, null),
                val = computedStyle.transform ||
                    computedStyle.webkitTransform ||
                    computedStyle.MozTransform ||
                    computedStyle.msTransform,
                matrix = parseMatrix(val),
                rotateY = Math.asin(-matrix.m13),
                rotateX, 
                rotateZ;

                rotateX = Math.atan2(matrix.m23, matrix.m33);
                rotateZ = Math.atan2(matrix.m12, matrix.m11);

            /*if (Math.cos(rotateY) !== 0) {
                rotateX = Math.atan2(matrix.m23, matrix.m33);
                rotateZ = Math.atan2(matrix.m12, matrix.m11);
            } else {
                rotateX = Math.atan2(-matrix.m31, matrix.m22);
                rotateZ = 0;
            }*/

            return {
                transformStyle: val,
                matrix: matrix,
                rotate: {
                    x: rotateX,
                    y: rotateY,
                    z: rotateZ
                },
                translate: {
                    x: matrix.m41,
                    y: matrix.m42,
                    z: matrix.m43
                }
            };
        }


        /* Parses a matrix string and returns a 4x4 matrix
        ---------------------------------------------------------------- */

        function parseMatrix (matrixString) {
            var c = matrixString.split(/\s*[(),]\s*/).slice(1,-1),
                matrix;

            if (c.length === 6) {
                // 'matrix()' (3x2)
                matrix = {
                    m11: +c[0], m21: +c[2], m31: 0, m41: +c[4],
                    m12: +c[1], m22: +c[3], m32: 0, m42: +c[5],
                    m13: 0,     m23: 0,     m33: 1, m43: 0,
                    m14: 0,     m24: 0,     m34: 0, m44: 1
                };
            } else if (c.length === 16) {
                // matrix3d() (4x4)
                matrix = {
                    m11: +c[0], m21: +c[4], m31: +c[8], m41: +c[12],
                    m12: +c[1], m22: +c[5], m32: +c[9], m42: +c[13],
                    m13: +c[2], m23: +c[6], m33: +c[10], m43: +c[14],
                    m14: +c[3], m24: +c[7], m34: +c[11], m44: +c[15]
                };

            } else {
                // handle 'none' or invalid values.
                matrix = {
                    m11: 1, m21: 0, m31: 0, m41: 0,
                    m12: 0, m22: 1, m32: 0, m42: 0,
                    m13: 0, m23: 0, m33: 1, m43: 0,
                    m14: 0, m24: 0, m34: 0, m44: 1
                };
            }
            return matrix;
        }

        /* Adds vector v2 to vector v1
        ---------------------------------------------------------------- */

        function addVectors (v1, v2) {
            return {
                x: v1.x + v2.x,
                y: v1.y + v2.y,
                z: v1.z + v2.z
            };
        }


        /* Rotates vector v1 around vector v2
        ---------------------------------------------------------------- */

        function rotateVector (v1, v2) {
            var x1 = v1.x,
                y1 = v1.y,
                z1 = v1.z,
                angleX = v2.x / 2,
                angleY = v2.y / 2,
                angleZ = v2.z / 2,

                cr = Math.cos(angleX),
                cp = Math.cos(angleY),
                cy = Math.cos(angleZ),
                sr = Math.sin(angleX),
                sp = Math.sin(angleY),
                sy = Math.sin(angleZ),

                w = cr * cp * cy + -sr * sp * -sy,
                x = sr * cp * cy - -cr * sp * -sy,
                y = cr * sp * cy + sr * cp * sy,
                z = cr * cp * sy - -sr * sp * -cy,

                m0 = 1 - 2 * ( y * y + z * z ),
                m1 = 2 * (x * y + z * w),
                m2 = 2 * (x * z - y * w),

                m4 = 2 * ( x * y - z * w ),
                m5 = 1 - 2 * ( x * x + z * z ),
                m6 = 2 * (z * y + x * w ),

                m8 = 2 * ( x * z + y * w ),
                m9 = 2 * ( y * z - x * w ),
                m10 = 1 - 2 * ( x * x + y * y );

            return {
                x: x1 * m0 + y1 * m4 + z1 * m8,
                y: x1 * m1 + y1 * m5 + z1 * m9,
                z: x1 * m2 + y1 * m6 + z1 * m10
            };
        }

        /* Vector functions
        -------------------------------------------------- */

        var Vect3 = {
            create: function(x, y, z) {
                return {x: x || 0, y: y || 0, z: z || 0};
            },
            add: function(v1, v2) {
                return {x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z};
            },
            sub: function(v1, v2) {
                return {x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z};
            },
            mul: function(v1, v2) {
                return {x: v1.x * v2.x, y: v1.y * v2.y, z: v1.z * v2.z};
            },
            div: function(v1, v2) {
                return {x: v1.x / v2.x, y: v1.y / v2.y, z: v1.z / v2.z};
            },
            muls: function(v, s) {
                return {x: v.x * s, y: v.y * s, z: v.z * s};
            },
            divs: function(v, s) {
                return {x: v.x / s, y: v.y / s, z: v.z / s};
            },
            len: function(v) {
                return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
            },
            dot: function(v1, v2) {
                return (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z);
            },
            cross: function(v1, v2) {
                return {x: v1.y * v2.z - v1.z * v2.y, y: v1.z * v2.x - v1.x * v2.z, z: v1.x * v2.y - v1.y * v2.x};
            },
            normalize: function(v) {
                return Vect3.divs(v, Vect3.len(v));
            },
            ang: function(v1, v2) {
                return Math.acos(Vect3.dot(v1, v2) / (Vect3.len(v1) * Vect3.len(v2)));
            },
            copy: function(v) {
                return {x: v.x, y: v.y, z: v.z};
            },
            equal: function(v1,v2) {
                return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
            },
            rotate: function(v1, v2) {
                var x1 = v1.x,
                    y1 = v1.y,
                    z1 = v1.z,
                    angleX = v2.x / 2,
                    angleY = v2.y / 2,
                    angleZ = v2.z / 2,

                    cr = Math.cos(angleX),
                    cp = Math.cos(angleY),
                    cy = Math.cos(angleZ),
                    sr = Math.sin(angleX),
                    sp = Math.sin(angleY),
                    sy = Math.sin(angleZ),

                    w = cr * cp * cy + -sr * sp * sy,
                    x = sr * cp * cy - -cr * sp * sy,
                    y = cr * sp * cy + sr * cp * -sy,
                    z = cr * cp * sy - -sr * sp * cy,

                    m0 = 1 - 2 * ( y * y + z * z ),
                    m1 = 2 * (x * y + z * w),
                    m2 = 2 * (x * z - y * w),

                    m4 = 2 * ( x * y - z * w ),
                    m5 = 1 - 2 * ( x * x + z * z ),
                    m6 = 2 * (z * y + x * w ),

                    m8 = 2 * ( x * z + y * w ),
                    m9 = 2 * ( y * z - x * w ),
                    m10 = 1 - 2 * ( x * x + y * y );

                return {
                    x: x1 * m0 + y1 * m4 + z1 * m8,
                    y: x1 * m1 + y1 * m5 + z1 * m9,
                    z: x1 * m2 + y1 * m6 + z1 * m10
                };
            }
        };

        // Determine the vendor prefixed transform property
        var transformProp = ["transform", "webkitTransform", "MozTransform", "msTransform"].filter(function (prop) {
            return prop in document.documentElement.style;
        })[0];


        // Default positions
        var lightpos = {
          x: WW/2,
          y: WH/2,
          z: 700
        };
        var objpos = {
          x: 0,
          y: 0,
          z: 0
        };

        // Define the light source
        var light = document.querySelector(".light");

        // Grab the x-wing element
        var obj = document.querySelector(".cube");
        

        /* Render
        ---------------------------------------------------------------- */

        function renderlight (startTime) {
          startTime || (startTime = performance.now());

          obj.style[transformProp] = "translateY(" + objpos.y + "px) translateX(" + objpos.x + "px) translateZ(" + objpos.z + "px)";
          light.style[transformProp] = "translateY(" + lightpos.y + "px) translateX(" + lightpos.x + "px) translateZ(" + lightpos.z + "px)";
          // Get the light position
          var lightPosition = getTransform(light).translate;

          // Light each face
          [].slice.call(obj.querySelectorAll(".face")).forEach(function (face, i) {
              var vertices = computeVertexData(face),
                  faceCenter = Vect3.divs(Vect3.sub(vertices.c, vertices.a), 2),
                  faceNormal = Vect3.normalize(Vect3.cross(Vect3.sub(vertices.b, vertices.a), Vect3.sub(vertices.c, vertices.a))),
                  direction = Vect3.normalize(Vect3.sub(lightPosition, faceCenter)),
                  amount = 1 - Math.max(0, Vect3.dot(faceNormal, direction)).toFixed(3);

              face.style.backgroundImage = "linear-gradient(rgba(0,0,0," + amount + "), rgba(0,0,0," + amount + "))";
          });
        }
      }).call(this);

      var clock = new THREE.Clock();
      var renderLoop = new Loop(function (t, t0) {
        //update(clock.getDelta());
        draw();
        TWEEN.update(t);
        //renderlight();
        
        /*var l = faces.length;
        while (l--) {
          faces[l].render(light, true, true);
        }*/
      });
      renderLoop.start();

      var dat = require('dat-gui');
      var gui = new dat.GUI();
      var f1 = gui.addFolder('camera.position');
      var px = f1.add(camera.position, 'x', -1000, 1000);
      var py = f1.add(camera.position, 'y', -1000, 3000);
      var pz = f1.add(camera.position, 'z', -5000, 0);
      px.onChange(function (val) {
        draw();
      });
      py.onChange(function (val) {
        draw();
      });
      pz.onChange(function (val) {
        draw();
      });

      var f2 = gui.addFolder('camera.rotation');
      var rx = f2.add(camera.rotation, 'x', 0, 2*Math.PI);
      var ry = f2.add(camera.rotation, 'y', 0, 2*Math.PI);
      var rz = f2.add(camera.rotation, 'z', 0, 2*Math.PI);
      rx.onChange(function (val) {
        draw();
      });
      ry.onChange(function (val) {
        draw();
      });
      rz.onChange(function (val) {
        draw();
      });

      var f3 = gui.addFolder('camera.lookAt');
      var cx = f3.add(lookAt, 'x', -1000, 1000);
      var cy = f3.add(lookAt, 'y', -1000, 1000);
      var cz = f3.add(lookAt, 'z', -1000, 1000);
      cx.onChange(function (val) {
        camera.lookAt(lookAt);
        rx.updateDisplay();
        draw();
      });
      cy.onChange(function (val) {
        camera.lookAt(lookAt);
        ry.updateDisplay();
        draw();
      });
      cz.onChange(function (val) {
        camera.lookAt(lookAt);
        rz.updateDisplay();
        draw();
      });

      /*var f4 = gui.addFolder('light');
      var lx = f4.add(light, 'x', -5000, 5000);
      var ly = f4.add(light, 'y', -5000, 5000);
      var lz = f4.add(light, 'z', -100, 10000);
      lx.onChange(function (val) {
        light.moveTo(val, light.y, light.z);
      });
      ly.onChange(function (val) {
        light.moveTo(light.x, val, light.z);
      });
      lz.onChange(function (val) {
        light.moveTo(light.x, light.y, val);
      });*/

      // http://stackoverflow.com/questions/14614252/how-to-fit-camera-to-object

      function moveAndLookAt(camera, dstpos, dstlookat, options) {
        options || (options = {duration: 300});

        var origpos = new THREE.Vector3().copy(camera.position); // original position
        var origrot = new THREE.Euler().copy(camera.rotation); // original rotation

        camera.position.set(dstpos.x, dstpos.y, dstpos.z);
        camera.lookAt(dstlookat);
        var dstrot = new THREE.Euler().copy(camera.rotation)

        // reset original position and rotation
        camera.position.set(origpos.x, origpos.y, origpos.z);
        camera.rotation.set(origrot.x, origrot.y, origrot.z);

        //
        // Tweening
        //

        // position
        new TWEEN.Tween(camera.position).to({
          x: dstpos.x,
          y: dstpos.y,
          z: dstpos.z
        }, options.duration).start();;

        // rotation (using slerp)
        (function () {
          var qa = new THREE.Quaternion().copy(camera.quaternion); // src quaternion
          var qb = new THREE.Quaternion().setFromEuler(dstrot); // dst quaternion
          var qm = new THREE.Quaternion();
          //camera.quaternion = qm;

          var o = {t: 0};
          new TWEEN.Tween(o).to({t: 1}, options.duration).onUpdate(function () {
            THREE.Quaternion.slerp(qa, qb, qm, o.t);
            camera.quaternion.set(qm.x, qm.y, qm.z, qm.w);
          }).start();
        }).call(this);
      }

      var activeMacbook;
      this.$('.macbook').on('click', function (e) {
        console.log('click');
      	var $mba = $(this);

        var css3dobject = $mba.data('css3dobject');

        if (activeMacbook !== $mba[0]) {
          activeMacbook = $mba[0];

          
          //new TWEEN.Tween(css3dobject.rotation).to({z: -3*Math.PI/180}, 300).start();
        
          var theta = 60*Math.PI/180;
          var d = disth(WH*Math.cos(theta), camera.fov, camera.aspect);
          moveAndLookAt(
            camera,
            new THREE.Vector3(WW/2, WH/2 + d*Math.sin(theta), -d),
            new THREE.Vector3(WW/2, WH/2, 0)
          );

        } else {
          
          //new TWEEN.Tween(css3dobject.rotation).to({z: 3*Math.PI/180}, 300).start();

          moveAndLookAt(
            camera,
            new THREE.Vector3(WW/2, WH/2, -distw(WW, camera.fov, camera.aspect)),
            new THREE.Vector3(WW/2, WH/2, 0)
          );

          activeMacbook = undefined;
        }
        
      });

      

    }).call(this);

    //
    // scale
    //

    /*(function () {
      var SCALE = 2;

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

    //
    // Scroller
    //

    var $scroller = this.$('#scroller');
    $('html, body').css('overflow', 'hidden');
    var ftscroller = new FTScroller($scroller[0], {
      bouncing: false,
      scrollbars: false,
      scrollingX: false,
      //contentHeight: undefined,
      updateOnWindowResize: true
    });
    ftscroller.addEventListener('scroll', function () {
      console.log('scroll', ftscroller.scrollTop);
    });

  }
});

module.exports = HomeView;
},{"backbone":"backbone","dat-gui":"dat-gui","ftscroller":"ftscroller","jquery":"jquery","jquery-hammer":"jquery-hammer","jquery-waypoints":"jquery-waypoints","jquery-waypoints-sticky":"jquery-waypoints-sticky","loop":"loop","three":"three","tween":"tween","underscore":"underscore","velocity-animate":"velocity-animate"}],"Goodenough":[function(require,module,exports){
var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

require('jquery-waypoints');
require('jquery-waypoints-sticky');

require('jquery-hammer');

var srcset = require('srcset');

var HomeView = require('./home');

function makeRemoveClassHandler(regex) {
  return function (index, classes) {
    return classes.split(/\s+/).filter(function (el) {return regex.test(el);}).join(' ');
  }
}

// http://stackoverflow.com/questions/11381673/javascript-solution-to-detect-mobile-browser
function isMobile() {
  return typeof window.orientation !== 'undefined';
}

function smoothScroll(el, duration) {
  duration || (duration = 600);

  if ($('html').is('.touch')) {
    //duration = 0;
  }

  setTimeout(function () {
    //$(window).scrollTo(el, duration);
    $('html').velocity('stop', true).velocity('scroll', {axis: 'y', offset: $(el).offset().top, duration: duration});
  }, 0);
}

var Router = Backbone.Router.extend({
    initialize: function (options) {
      this.options = options;

      $(function () {
        // DOM ready
        $('html').addClass('domready');
        // just after DOM ready (for styling convenience)
        setTimeout(function () {
          $('html').addClass('justafterdomready');
          $(document).trigger('justafterdomready');
        }, 0);

        if (isMobile()) {
          $('html').addClass('mobile');
        } else {
          $('html').addClass('no-mobile');
        }

        var historyOptions = {
          pushState: true,
          hashChange: false, // no pushState => full refreshes (<=IE9)
          //silent: true
        };
        if (options && options.history && options.history.root) {
        	historyOptions.root = options.history.root;
        }

        Backbone.history.start(historyOptions);
      });

      // Trap anchors
      this.on('target', this.target);
      $(document.body).delegate('a[href^="#"]', 'click', function (e) {
        e.preventDefault();

        var $target = $($(e.currentTarget).attr('href')).eq(0);

        if (!$target.length) {
          return;
        }

        // trig 'target' router event
        this.trigger('target', $(e.currentTarget), $target);
      }.bind(this));
      $(document.body).delegate('a[href="#"]', 'click', function (e) {
        e.preventDefault();

        smoothScroll(document.body);
      });

      //
      // srcset
      //

      (function () {
        var viewportInfo = new srcset.ViewportInfo();
        viewportInfo.compute();

        var windowResizedAt = (new Date).getTime();

        function update($el) {
          var needUpdate = (!$el.data('src-updatedat') || $el.data('src-updatedat') < windowResizedAt);
          if (!$el.is('[src]') || needUpdate) {

            var srcsetInfo = new srcset.SrcsetInfo({
              src: $el[0].src,
              srcset: $el.data('srcset')
            });

            if (srcsetInfo) {
              var imageInfo = viewportInfo.getBestImage(srcsetInfo);

              $el.attr('src', imageInfo.src);
              setTimeout(function () {
                $el.trigger('srcchanged');
              }, 0);
            }

            // Remember when updated to compare with window's resizeAt timestamp
            $el.data('src-updatedat', (new Date).getTime());
          }
        }

        function updateAllSrcset() {
          // update timestamp
          windowResizedAt = (new Date).getTime();
          viewportInfo.compute();

          // Update every images
          $('img[data-srcset]').each(function (i, el) {
            update($(el));
          });
        }
        $(window).resize(_.debounce(updateAllSrcset, 250));
        updateAllSrcset();
      }());

      //
      // .img with srcset change
      //

      $('.img').has('>img[src]').each(function (i, el) {
        var $el = $(el);
        var $img = $el.find('>img').eq(0);

        $el.css('background-image', 'url(' + $img.attr('src') + ')');

        $img.on('srcchanged', function (e) {
          $img.parent().css('background-image', 'url(' + $img.attr('src') + ')');
        });
      });

      //
      // setheight
      //

      /*(function () {
        var previousHeight;

        var $html = $('html');

        // https://gist.github.com/scottjehl/2051999
        function viewportSize() {
          var test = document.createElement( "div" );
         
          test.style.cssText = "position: fixed;top: 0;left: 0;bottom: 0;right: 0;";
          document.documentElement.insertBefore( test, document.documentElement.firstChild );
          
          var dims = { width: test.offsetWidth, height: test.offsetHeight };
          document.documentElement.removeChild( test );
          
          return dims;
        }
        function setHeight() {
          //console.log('setting height...')
          previousHeight = $html.css('height');

          $html.height(viewportSize().height)
          $html.trigger('setheight');
        }
        if (!$html.is('touch')) { // don't resize for mobile since window size can't really change...
          $(window).resize(_.debounce(setHeight, 200));
        }

        $(window).on('orientationchange', _.debounce(setHeight, 200));
        setTimeout(setHeight, 0);
        setTimeout(setHeight, 500); // another try few later in case address bar auto-hiding makes the size change
        setTimeout(setHeight, 1000); // another try few later in case address bar auto-hiding makes the size change
      }).call(this);*/

      //
      // Waypoints
      //

      /*$(function () {
        var $sections = $('[data-waypoint]');

        // Section enters the viewport (from bottom)
        $sections.waypoint({
          handler: function (direction) {
            //console.log(direction);

            if (direction !== 'down') return;
            //console.log('down');

            $(document).trigger('inview', {
              el: this,
              direction: 'down'
            });
          },
          offset: '100%'
        });
        // Section enters the viewport (from the top)
        $sections.waypoint({
          handler: function (direction) {
            //console.log(direction);

            if (direction !== 'up') return;
            //console.log('up');

            $(document).trigger('inview', {
              el: this,
              direction: 'up'
            });
          },
          offset: function () {
            return -1*$(this).outerHeight(true);
          }
        });

        // Section exits the viewport (from top)
        $sections.waypoint({
          handler: function (direction) {
            //console.log(direction);

            if (direction !== 'down') return;
            //console.log('down');

            $(document).trigger('outview', {
              el: this,
              direction: 'down'
            });
          },
          offset: function () {
            return -1*$(this).outerHeight(true);
          }
        });
        // Section exits the viewport (from the bottom)
        $sections.waypoint({
          handler: function (direction) {
            //console.log(direction);

            if (direction !== 'up') return;
            //console.log('up');

            $(document).trigger('outview', {
              el: this,
              direction: 'up'
            });
          },
          offset: '100%'
        });
      }.bind(this));*/

    },
    routes: {
      '(/)(index.html)': 'home'
    },
    home: function () {
      console.log('home');

      new HomeView({el: 'body'});
    },
    target: function (from, to, options) {
      options || (options = {});

      //console.log('target', this, arguments);
      var $to = $(to);

      if (!$to.length) return;

      $('.target').eq(0).removeClass('target');
      $to.addClass('target');

      // scrollTo
      if (options.scroll !== false) {
        smoothScroll($to, options.scroll && options.scroll.duration);  
      }
      
    }
});

this.Goodenough = Router;
if (typeof module !== "undefined" && module !== null) {
  module.exports = this.Goodenough;
}
},{"./home":1,"backbone":"backbone","jquery":"jquery","jquery-hammer":"jquery-hammer","jquery-waypoints":"jquery-waypoints","jquery-waypoints-sticky":"jquery-waypoints-sticky","srcset":"srcset","underscore":"underscore"}]},{},[]);

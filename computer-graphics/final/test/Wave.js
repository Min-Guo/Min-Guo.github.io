<!DOCTYPE HTML>
<html lang="en">
	<head>
		<title>Water/Ocean</title>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="../css/style_no_stats.css">
	</head>

	<body>
		<div id="infobutton">
			<a href="javascript:toggleInfo()"><img src="../general/i.png" border="0"></a>
		</div>
		<div id="info">
				<B>Water/Ocean - WebGL(html5)</B>
				<P>Tried to make something that looks like a water surface.<BR>Using simplex noise and a normal map, not sure this is the way it's done. But hey, I'm learning here.. ;)<BR>It's heavily based on <a href="http://twitter.com/#!/alteredq" target="_blank">@alteredq's</a> noise <a href="http://twitter.com/#!/alteredq/status/104287907157770241" target="_blank">examples</a>.<BR>There is some weird bug with reflection-mapping though, oh well...</P>
				Done using <a href="https://github.com/mrdoob/three.js" target="_blank">three.js</a>.
				<P><B>Note.</B> You need a modern browser that supports WebGL for this to run the way it is intended.<BR>
				For example. <a href="http://www.google.com/landing/chrome/beta/" target="_blank">Google Chrome 9+</a> or <a href="http://www.mozilla.com/firefox/beta/" target="_blank">Firefox 4+</a>.<BR><BR>(If you are already using one of those browsers and it's still not running, it's possible that you<BR>have old blacklisted GPU drivers. Try updating the drivers for your graphic card.<BR>Or try to set a '--ignore-gpu-blacklist' switch for the browser.)</P>
				<font color="#777777">(C) OutsideOfSociety 2011.
		</div>

		<script type="text/javascript" src="../build_r45/Three.js"></script>

		<script type="text/javascript" src="../general/THREEx.WindowResize.js"></script>
		<script type="text/javascript" src="../general/RequestAnimationFrame.js"></script>
		<script type="text/javascript" src="../general/info.js"></script>


		<script id="fragmentShaderNormal" type="x-shader/x-fragment">

			uniform float height;
			uniform vec2 resolution;
			uniform sampler2D heightMap;

			varying vec2 vUv;

			void main( void ) {

				float val = texture2D( heightMap, vUv ).x;

				float valU = texture2D( heightMap, vUv + vec2( 1.0 / resolution.x, 0.0 ) ).x;
				float valV = texture2D( heightMap, vUv + vec2( 0.0, 1.0 / resolution.y ) ).x;

				gl_FragColor = vec4( ( 0.5 * normalize( vec3( val - valU, val - valV, height  ) ) + 0.5 ), 1.0 );

			}

		</script>

		<script id="fragmentShaderColormap" type="x-shader/x-fragment">

			uniform sampler2D colorRamp;
			uniform sampler2D heightMap;

			varying vec2 vUv;

			void main( void ) {

				float v = texture2D( heightMap, vUv ).x;

				vec3 color = texture2D( colorRamp, vec2( v, 0.0 ) ).xyz;

				gl_FragColor = vec4( color, 1.0 );

			}

		</script>

		<script id="fragmentShaderNoise" type="x-shader/x-fragment">

			//
			// Description : Array and textureless GLSL 3D simplex noise function.
			//      Author : Ian McEwan, Ashima Arts.
			//  Maintainer : ijm
			//     Lastmod : 20110409 (stegu)
			//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
			//               Distributed under the MIT License. See LICENSE file.
			//

			uniform float time;
			varying vec2 vUv;

			vec4 permute( vec4 x ) {

				return mod( ( ( x * 34.0 ) + 1.0 ) * x, 289.0 );

			}

			vec4 taylorInvSqrt( vec4 r ) {

				return 1.79284291400159 - 0.85373472095314 * r;

			}

			float snoise( vec3 v ) {

				const vec2 C = vec2( 1.0 / 6.0, 1.0 / 3.0 );
				const vec4 D = vec4( 0.0, 0.5, 1.0, 2.0 );

				// First corner

				vec3 i  = floor( v + dot( v, C.yyy ) );
				vec3 x0 = v - i + dot( i, C.xxx );

				// Other corners

				vec3 g = step( x0.yzx, x0.xyz );
				vec3 l = 1.0 - g;
				vec3 i1 = min( g.xyz, l.zxy );
				vec3 i2 = max( g.xyz, l.zxy );

				vec3 x1 = x0 - i1 + 1.0 * C.xxx;
				vec3 x2 = x0 - i2 + 2.0 * C.xxx;
				vec3 x3 = x0 - 1. + 3.0 * C.xxx;

				// Permutations

				i = mod( i, 289.0 );
				vec4 p = permute( permute( permute(
						 i.z + vec4( 0.0, i1.z, i2.z, 1.0 ) )
					   + i.y + vec4( 0.0, i1.y, i2.y, 1.0 ) )
					   + i.x + vec4( 0.0, i1.x, i2.x, 1.0 ) );

				// Gradients
				// ( N*N points uniformly over a square, mapped onto an octahedron.)

				float n_ = 1.0 / 7.0; // N=7

				vec3 ns = n_ * D.wyz - D.xzx;

				vec4 j = p - 49.0 * floor( p * ns.z *ns.z );  //  mod(p,N*N)

				vec4 x_ = floor( j * ns.z );
				vec4 y_ = floor( j - 7.0 * x_ );    // mod(j,N)

				vec4 x = x_ *ns.x + ns.yyyy;
				vec4 y = y_ *ns.x + ns.yyyy;
				vec4 h = 1.0 - abs( x ) - abs( y );

				vec4 b0 = vec4( x.xy, y.xy );
				vec4 b1 = vec4( x.zw, y.zw );


				vec4 s0 = floor( b0 ) * 2.0 + 1.0;
				vec4 s1 = floor( b1 ) * 2.0 + 1.0;
				vec4 sh = -step( h, vec4( 0.0 ) );

				vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
				vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

				vec3 p0 = vec3( a0.xy, h.x );
				vec3 p1 = vec3( a0.zw, h.y );
				vec3 p2 = vec3( a1.xy, h.z );
				vec3 p3 = vec3( a1.zw, h.w );

				// Normalise gradients

				vec4 norm = taylorInvSqrt( vec4( dot( p0, p0 ), dot( p1, p1 ), dot( p2, p2 ), dot( p3, p3 ) ) );
				p0 *= norm.x;
				p1 *= norm.y;
				p2 *= norm.z;
				p3 *= norm.w;

				// Mix final noise value

				vec4 m = max( 0.6 - vec4( dot( x0, x0 ), dot( x1, x1 ), dot( x2, x2 ), dot( x3, x3 ) ), 0.0 );
				m = m * m;
				return 42.0 * dot( m*m, vec4( dot( p0, x0 ), dot( p1, x1 ),
											  dot( p2, x2 ), dot( p3, x3 ) ) );

			}

			float surface( vec3 coord ) {

				float n = 0.0;

				n += 0.3    * abs( snoise( coord * 5.0 ) );
				//n += 0.3    * abs( snoise( coord ) );

				//n += 0.25   * ( snoise( coord * 2.0 ) );
				//n += 0.125  * abs( snoise( coord * 4.0 ) );
				n += 0.0625 * abs( snoise( coord * 28.0 ) );

				return n;

			}

			void main( void ) {

				vec3 coord = vec3( vUv, -time );

				float n = surface( coord );

				gl_FragColor = vec4( vec3( n, n, n ), 1.0 );

			}

		</script>

		<script id="vertexShader" type="x-shader/x-vertex">

			varying vec2 vUv;
			uniform vec2 scale;

			void main( void ) {

				vUv = uv * scale;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}

		</script>

		<script id="vertexShaderFlip" type="x-shader/x-vertex">

			varying vec2 vUv;
			uniform vec2 scale;

			void main( void ) {

				vUv = vec2( uv.x, 1.0 - uv.y ) * scale;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}

		</script>


		<script type="text/javascript">

			var SCREEN_WIDTH = window.innerWidth;
			var SCREEN_HEIGHT = window.innerHeight;
			var FLOOR = 0;

			var container;
			var stats;

			var camera;
			var scene;
			var webglRenderer;
			var cameraOrtho;

			var pointLight;

			var mouseX = 0;
			var mouseY = 0;
			var tomouseX = 0;
			var tomouseY = 0;
			var mx = -1.57;

			var render_gl = 1;
			var has_gl = 0;

			var r = 0;

			var delta
			var time;
			var oldTime;

			var uniformsNoise, uniformsNormal,
				normalMap, noiseMap,
				quadTarget,
				mesh;

			var uniformsNormalMap;

			var colorRampTexture, specularRampTexture;

			var mlib = {};

			var lightCone;

			var cameraCube, sceneCube, cubeTarget;

			document.addEventListener('mousemove', onDocumentMouseMove, false);

			init(), animate();

			function init() {

				container = document.createElement('div');
				document.body.appendChild(container);

				var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

				camera = new THREE.PerspectiveCamera( 65, aspect, 1, 100000 );

				camera.position.z = 350;
				camera.position.x = -350;
				camera.position.y = 150;

				camTarget = new THREE.Object3D();

				cameraOrtho = new THREE.Camera();
				cameraOrtho.projectionMatrix = THREE.Matrix4.makeOrtho( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
				cameraOrtho.position.z = 100;


				sceneRenderTarget = new THREE.Scene();

				scene = new THREE.Scene();
				scene.fog = new THREE.FogExp2( 0x131313, 0.0001 );


				cameraCube = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 1, 100000 );

				cubeTarget = new THREE.Vector3( 0, 0, 0 );

				sceneCube = new THREE.Scene();

				var path = "../textures/cube/night2/fade3/";
				var format = '.jpg';
				var urls = [
					path + 'px' + format, path + 'nx' + format,
					path + 'py' + format, path + 'ny' + format,
					path + 'pz' + format, path + 'nz' + format
				];

				var textureCube = THREE.ImageUtils.loadTextureCube( urls );

				// Skybox

				var shader = THREE.ShaderUtils.lib[ "cube" ];
				shader.uniforms[ "tCube" ].texture = textureCube;

				var material = new THREE.ShaderMaterial( {

					fragmentShader: shader.fragmentShader,
					vertexShader: shader.vertexShader,
					uniforms: shader.uniforms,
					depthWrite: false

				} ),

				mesh = new THREE.Mesh( new THREE.CubeGeometry( 100, 100, 100 ), material );
				mesh.flipSided = true;
				sceneCube.add( mesh );


				// Lights

				ambientLight = new THREE.AmbientLight( 0x111111 );
				scene.add( ambientLight );

				pointLight = new THREE.PointLight( 0xd9d29d, 1, 0 );
				pointLight.position.y = 10;
				scene.add( pointLight );

				var spotlight = new THREE.SpotLight( 0xd2cfb9, 2, 0 );
				spotlight.position.set( 50, 150, -200 );
				scene.add( spotlight );

				// Noise

				var rx = 512, ry = 512;
				var pars = { minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };

				noiseMap  = new THREE.WebGLRenderTarget( rx, ry, pars );
				normalMap = new THREE.WebGLRenderTarget( rx, ry, pars );
				colorMap  = new THREE.WebGLRenderTarget( rx, ry, pars );
				specularMap = new THREE.WebGLRenderTarget( rx, ry, pars );

				uniformsNoise = {

					time:  { type: "f", value: 1.0 },
					scale: { type: "v2", value: new THREE.Vector2( 2, 2 ) }

				};

				uniformsNormal = {

					height:  	{ type: "f",  value: 0.075 },
					resolution: { type: "v2", value: new THREE.Vector2( rx, ry ) },
					scale: 		{ type: "v2", value: new THREE.Vector2( 1, 1 ) },
					heightMap:  { type: "t",  value: 1, texture: noiseMap }

				};

				var rwidth = 256, rheight = 1, rsize = rwidth * rheight;

				var tcolor = new THREE.Color( 0xffffff );

				// Color ramp data

				/*var dataColor = new Uint8Array( rsize * 3 );

				for ( var i = 0; i < rsize; i ++ ) {

					var h = i / 255;

					tcolor.setHSV( 0.0 + 0.15 * h, 1.0 - h, 0.5 + 0.5 * h );

					dataColor[ i * 3 ] 	  = Math.floor( tcolor.r * 255 );
					dataColor[ i * 3 + 1 ] = Math.floor( tcolor.g * 255 );
					dataColor[ i * 3 + 2 ] = Math.floor( tcolor.b * 255 );

				}*/

				// Specular ramp data

				var dataSpecular = new Uint8Array( rsize * 3 );

				for ( var i = 0; i < rsize; i ++ ) {

					var h = i / 255;

					tcolor.setHSV( 0.0, 0.0, 1 - h );

					dataSpecular[ i * 3 ] 	  = Math.floor( tcolor.r * 255 );
					dataSpecular[ i * 3 + 1 ] = Math.floor( tcolor.g * 255 );
					dataSpecular[ i * 3 + 2 ] = Math.floor( tcolor.b * 255 );

				}

				// Ramp textures

				//colorRampTexture = new THREE.DataTexture( dataColor, rwidth, rheight, THREE.RGBFormat );
				//colorRampTexture.needsUpdate = true;

				specularRampTexture = new THREE.DataTexture( dataSpecular, rwidth, rheight, THREE.RGBFormat );
				specularRampTexture.needsUpdate = true;

				uniformsColor = {

					scale: 		{ type: "v2", value: new THREE.Vector2( 1, 1 ) },
					heightMap:  { type: "t",  value: 1, texture: noiseMap },
					colorRamp:  { type: "t",  value: 2, texture: colorRampTexture }

				};

				var vertexShader = document.getElementById( 'vertexShader' ).textContent;
				var vertexShaderFlip = document.getElementById( 'vertexShaderFlip' ).textContent;

				// Normal

				var normalShader = THREE.ShaderUtils.lib[ "normal" ];

				uniformsNormalMap = THREE.UniformsUtils.clone( normalShader.uniforms );

				uniformsNormalMap[ "tNormal" ].texture = normalMap;
				//uniformsNormalMap[ "uNormalScale" ].value = 100.25;

				uniformsNormalMap[ "tDiffuse" ].texture = colorMap;
				uniformsNormalMap[ "tSpecular" ].texture = specularMap;
				uniformsNormalMap[ "tAO" ].texture = noiseMap;

				uniformsNormalMap[ "enableAO" ].value = true;
				uniformsNormalMap[ "enableDiffuse" ].value = false;
				uniformsNormalMap[ "enableSpecular" ].value = true;

				uniformsNormalMap[ "uDiffuseColor" ].value.setHex( 0x202336 );
				uniformsNormalMap[ "uSpecularColor" ].value.setHex( 0xd2cfb9 );
				uniformsNormalMap[ "uAmbientColor" ].value.setHex( 0x1a1d21 );

				uniformsNormalMap[ "uShininess" ].value = 20;

				uniformsNormalMap[ "enableReflection" ].value = true;
				uniformsNormalMap[ "tCube" ].texture = textureCube;
				uniformsNormalMap[ "uReflectivity" ].value = 0.40;

				uniformsNormalMap[ "tNormal" ].texture.wrapS = uniformsNormalMap[ "tNormal" ].texture.wrapT = THREE.MirroredRepeatWrapping;
				uniformsNormalMap[ "tSpecular" ].texture.wrapS = uniformsNormalMap[ "tSpecular" ].texture.wrapT = THREE.MirroredRepeatWrapping;
				uniformsNormalMap[ "tAO" ].texture.wrapS = uniformsNormalMap[ "tAO" ].texture.wrapT = THREE.MirroredRepeatWrapping;

				uniformsNormalMap[ "uRepeat" ].value = new THREE.Vector2(20,80);

				var size = 1.25,
					params = [
								[ 'noise', 		document.getElementById( 'fragmentShaderNoise' ).textContent, 	vertexShader, uniformsNoise, false, false ],
								[ 'normal', 	document.getElementById( 'fragmentShaderNormal' ).textContent,  vertexShaderFlip, uniformsNormal, false, false ],
								[ 'color', 		document.getElementById( 'fragmentShaderColormap' ).textContent,  vertexShaderFlip, uniformsColor, false, false ],
								[ 'normalmap', 	normalShader.fragmentShader, normalShader.vertexShader, uniformsNormalMap, true, true ]
							 ];

				for( var i = 0; i < params.length; i ++ ) {

					material = new THREE.ShaderMaterial( {

						uniforms: 		params[ i ][ 3 ],
						vertexShader: 	params[ i ][ 2 ],
						fragmentShader: params[ i ][ 1 ],
						lights: 		params[ i ][ 4 ],
						fog: 		params[ i ][ 5 ]
						} );

					mlib[ params[ i ][ 0 ] ] = material;

				}


				// Rendertarget

				var plane = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight );

				quadTarget = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
				quadTarget.position.z = -500;
				sceneRenderTarget.add( quadTarget );

/*				var geometry = new THREE.CubeGeometry( size, size, size );

				geometry.computeFaceNormals();
				geometry.computeVertexNormals();
				geometry.computeTangents();

				var geometryPlane = new THREE.PlaneGeometry( size, size );

				var rx = 0, half = size / 2;

				// NOISE

				mesh = new THREE.Mesh( geometryPlane, new THREE.MeshBasicMaterial( { color: 0xffffff, map: noiseMap  } ) );

				mesh.position.x = -size;
				mesh.position.y = half * 0.75;

				mesh.rotation.x = rx;
				mesh.scale.set( half, half, half );

				//scene.add( mesh );

				// NORMALS

				mesh = new THREE.Mesh( geometryPlane, new THREE.MeshBasicMaterial( { color: 0xffffff, map: normalMap } ) );

				mesh.position.x = -size;
				mesh.position.y = -half * 0.75;

				mesh.rotation.x = rx;
				mesh.scale.set( half, half, half );

				//scene.add( mesh );

				// COLOR

				mesh = new THREE.Mesh( geometryPlane, new THREE.MeshBasicMaterial( { color: 0xffffff, map: colorMap } ) );

				mesh.position.x = -half/2;
				mesh.position.y = half * 0.75;

				mesh.rotation.x = rx;
				mesh.scale.set( half, half, half );

				//scene.add( mesh );

				// SPECULAR

				mesh = new THREE.Mesh( geometryPlane, new THREE.MeshBasicMaterial( { color: 0xffffff, map: specularMap } ) );

				mesh.position.x = -half/2;
				mesh.position.y = -half * 0.75;

				mesh.rotation.x = rx;
				mesh.scale.set( half, half, half );

				//scene.add( mesh );

				// COMPOSITE

				mesh = new THREE.Mesh( geometry, mlib[ "normalmap" ] );

				//mlib[ "normalmap" ].shading = THREE.FlatShading;

				mesh.position.x = size;
				mesh.rotation.x = rx;

				//scene.add( mesh );

*/

				// Surface

				var plane = new THREE.PlaneGeometry( 50000, 50000, 1, 1 );

				plane.computeFaceNormals();
				plane.computeVertexNormals();
				plane.computeTangents();

				//var material2 = new THREE.MeshPhongMaterial( { color: 0x202336, specular: 0xd2cfb9, ambient: 0x1a1d21, shininess: 20, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.5 } );


				var meshPlane = new THREE.Mesh( plane, mlib[ "normalmap" ] );
				//var meshPlane = new THREE.Mesh( plane, material2 );
				meshPlane.rotation.x = -Math.PI / 2;
				scene.add( meshPlane );

				// Models

				var loader = new THREE.JSONLoader();
				loader.load( "lighthouse.js", lighthouseLoaded );
				loader.load( "rock.js", rockLoaded );

				// Ship

				var shipImage = THREE.ImageUtils.loadTexture( "ship.png" );

				var ship = new THREE.Sprite( { map: shipImage, useScreenCoordinates: false } );
				ship.position.set( 20000, 400, 10000 );
				ship.scale.set( 10, 3, 1.5 );
				ship.opacity = 0.15;
				scene.add( ship );


				try {
					webglRenderer = new THREE.WebGLRenderer( { scene: scene, clearColor: 0x131313, clearAlpha: 1.0, antiAlias: false } );
					webglRenderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
					container.appendChild( webglRenderer.domElement );
					webglRenderer.autoClear = false;
					THREEx.WindowResize(webglRenderer, camera);
					THREEx.WindowResize(webglRenderer, cameraCube);
					has_gl = 1;
				}
				catch (e) {
					// need webgl
					document.getElementById('info').innerHTML = "<P><BR><B>Note.</B> You need a modern browser that supports WebGL for this to run the way it is intended.<BR>For example. <a href='http://www.google.com/landing/chrome/beta/' target='_blank'>Google Chrome 9+</a> or <a href='http://www.mozilla.com/firefox/beta/' target='_blank'>Firefox 4+</a>.<BR><BR>If you are already using one of those browsers and still see this message, it's possible that you<BR>have old blacklisted GPU drivers. Try updating the drivers for your graphic card.<BR>Or try to set a '--ignore-gpu-blacklist' switch for the browser.</P><CENTER><BR><img src='../general/WebGL_logo.png' border='0'></CENTER>";
					document.getElementById('info').style.display = "block";
					return;
				}

			}

			function lighthouseLoaded( geometry ) {

				var material = new THREE.MeshFaceMaterial();

				var lighthouse = new THREE.Mesh( geometry, material );

				var scale = 1;
				lighthouse.scale.set(scale,scale,scale);
				lighthouse.position.set(-8000,100,-8000);
				scene.add(lighthouse);

				var pl = new THREE.PlaneGeometry(200,2600,1,1);

				var material = new THREE.MeshBasicMaterial( {color: 0xd9d29d, opacity: 0.45, map: THREE.ImageUtils.loadTexture( "ray.png" ), blending: THREE.AdditiveBlending, transparent: true } );

				var plane1 = new THREE.Mesh( pl, material );
				plane1.rotation.z = -Math.PI/2+0.08;
				plane1.rotation.y = -Math.PI/2;
				plane1.position.z = -1360;
				plane1.doubleSided = true;

				var pl = new THREE.PlaneGeometry(200,200,1,1);

				var material = new THREE.MeshBasicMaterial( {color: 0xd9d29d, opacity: 0.95, map: THREE.ImageUtils.loadTexture( "bob2.png" ), blending: THREE.NormalBlending, transparent: true } );

				var plane2 = new THREE.Mesh( pl, material );
				plane2.position.y = 110;
				plane2.position.z = -70;
				plane2.flipSided = true;

				lightCone = new THREE.Object3D();
				lightCone.position.y = 450;
				lightCone.position.z = -8000;
				lightCone.position.x = -8000;

				lightCone.add(plane1);
				lightCone.add(plane2);

				scene.add( lightCone );

			}

			function rockLoaded( geometry ) {

				var material = new THREE.MeshPhongMaterial( { opacity:1, color: 0x222222, ambient: 0x111111, specular: 0x444444, shininess: 15, shading: THREE.SmoothShading } );

				var rock = new THREE.Mesh( geometry, material );

				var scale = 1;
				rock.scale.set(scale*2,scale*0.6,scale*2);
				rock.position.set(-8000,0,-8000);
				scene.add(rock);

				var rock2 = new THREE.Mesh( geometry, material );
				rock2.scale.set(scale*15,scale*1.4,scale*6);
				rock2.position.set(-14000,0,-12000);
				scene.add(rock2);

				var rock3 = new THREE.Mesh( geometry, material );
				rock3.scale.set(scale*30,scale*3,scale*30);
				rock3.position.set(-25000,0,-5000);
				rock3.rotation.y = Math.PI;
				scene.add(rock3);


			}

			function onDocumentMouseMove(event) {

				tomouseX = ( event.clientX - (window.innerWidth >> 1) );
				tomouseY = ( event.clientY - (window.innerHeight >> 1) );

			}

			function animate() {
				requestAnimationFrame( animate );
				loop();
			}

			function loop() {

				time = new Date().getTime();
				delta = time - oldTime;
				oldTime = time;

				if (isNaN(delta) || delta > 1000 || delta == 0 ) {
					delta = 1000/60;
				}

				r += delta/1500;

				mouseX += (tomouseX-mouseX)/20;
				mouseY += (tomouseY-mouseY)/40;



				uniformsNoise.time.value += delta/20000;
				uniformsNormalMap[ "uOffset" ].value.y -= delta/10000;

				if (lightCone) {

					lightCone.rotation.y -= delta/1500;

					pointLight.position.x = lightCone.position.x +( 2000 * Math.cos( -lightCone.rotation.y-(Math.PI/2) ) );
					pointLight.position.z = lightCone.position.z +( 2000 * Math.sin( -lightCone.rotation.y-(Math.PI/2) ) );

				}


				mx += mouseX/(90000-(delta*1000));
				camTarget.position.x = camera.position.x +( 100000 * Math.cos( mx ) );
				camTarget.position.z = camera.position.z +( 100000 * Math.sin( mx ) );
				camTarget.position.y = camera.position.y - (mouseY*100);

				camera.lookAt(camTarget.position);
				camera.up.x = mouseX/10000;

				camera.position.y = 150+Math.sin(r*8)*1.5;

				cubeTarget.x = - camTarget.position.x;
				cubeTarget.y = + camTarget.position.y;
				cubeTarget.z = - camTarget.position.z;

				cameraCube.lookAt( cubeTarget );
				cameraCube.up.x = -camera.up.x ;


				webglRenderer.clear();
				quadTarget.materials[ 0 ] = mlib[ "noise" ];
				webglRenderer.render( sceneRenderTarget, cameraOrtho, noiseMap, true );

				quadTarget.materials[ 0 ] = mlib[ "normal" ];
				webglRenderer.render( sceneRenderTarget, cameraOrtho, normalMap, true );

				quadTarget.materials[ 0 ] = mlib[ "color" ];
				mlib[ "color" ].uniforms.colorRamp.texture = specularRampTexture;
				webglRenderer.render( sceneRenderTarget, cameraOrtho, specularMap, true );


				if ( render_gl && has_gl ) {
					webglRenderer.clear();
					webglRenderer.render( sceneCube, cameraCube );
					webglRenderer.render( scene, camera );
				}

			}


		</script>

	</body>
</html>

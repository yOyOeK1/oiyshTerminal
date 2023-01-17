import * as THREE from "three";

class T4y_shadersDefs{

  DotScreenShader;
  RedShader;
  InvertShader;


  constructor( fromw ){
    cl("T4y_shadersDefs constructor. fromw["+fromw+"]");
  }

  int_shaDef(){
    this.RedShader = {
      vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4( position, 1.0 );
      }`,
      fragmentShader: /* glsl */`
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      void main() {
        vec4 rgb = texture2D( tDiffuse, vUv );
        float c = (rgb[0]+rgb[1]+rgb[2])/3.0;
        gl_FragColor = vec4( c, rgb[1]*0.1, rgb[2]*0.1, rgb[3] );
      }`
    };
    this.RedInvertShader = {
      vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4( position, 1.0 );
      }`,
      fragmentShader: /* glsl */`
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      void main() {
        vec4 rgb = texture2D( tDiffuse, vUv );
        float m = float(1.0);
        vec4 inv = vec4( m-rgb[0], m-rgb[1], m-rgb[2], rgb[3] );
        float c = inv[0];
        gl_FragColor = vec4( c, inv[1]*0.1, inv[2]*0.1, inv[3] );
      }`
    };
    this.InvertShader = {
      vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4( position, 1.0 );
      }`,
      fragmentShader: /* glsl */`
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      void main() {
        vec4 rgb = texture2D( tDiffuse, vUv );
        float m = float(1.0);
        gl_FragColor = vec4( m-rgb[0], m-rgb[1], m-rgb[2], rgb[3] );
      }`
    };

    this.DotScreenShader = {
    	uniforms: {
    		'tDiffuse': { value: null },
    		'tSize': { value: new THREE.Vector2( 256, 256 ) },
    		'center': { value: new THREE.Vector2( 0.5, 0.5 ) },
    		'angle': { value: 1.57 },
    		'scale': { value: 1.0 }
    	},
    	vertexShader: /* glsl */`
    		varying vec2 vUv;
    		void main() {
    			vUv = uv;
    			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    		}`,

    	fragmentShader: /* glsl */`
    		uniform vec2 center;
    		uniform float angle;
    		uniform float scale;
    		uniform vec2 tSize;
    		uniform sampler2D tDiffuse;
    		varying vec2 vUv;
    		float pattern() {
    			float s = sin( angle ), c = cos( angle );
    			vec2 tex = vUv * tSize - center;
    			vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;
    			return ( sin( point.x ) * sin( point.y ) ) * 4.0;
    		}
    		void main() {
    			vec4 color = texture2D( tDiffuse, vUv );
    			float average = ( color.r + color.g + color.b ) / 3.0;
    			gl_FragColor = vec4( vec3( average * 10.0 - 5.0 + pattern() ), color.a );
    		}`
    };





  }

};

export { T4y_shadersDefs };

import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

// ----------------- Procedural Planet Material -----------------
export const PlanetMaterial = shaderMaterial(
  {
    uType: 0,
    uTime: 0,
    uOpacity: 1,
    uSunPos: new THREE.Vector3(0, 0, -42),
    uBaseColor: new THREE.Color(0x555555),
    uDetailColor: new THREE.Color(0x333333),
    uAccentColor: new THREE.Color(0x111111),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vLocalPosition;
    varying vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vLocalPosition = position;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vLocalPosition;
    varying vec3 vWorldPosition;
    
    uniform int uType;
    uniform float uTime;
    uniform float uOpacity;
    uniform vec3 uSunPos;
    uniform vec3 uBaseColor;
    uniform vec3 uDetailColor;
    uniform vec3 uAccentColor;
    
    // Simplex 3D Noise Helper
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float snoise(vec3 v){ 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod(i, 289.0 ); 
      vec4 p = permute( permute( permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 1.0/7.0;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(uSunPos - vWorldPosition);
      
      // Calculate realistic solar lighting (shadow side dark, day side illuminated)
      float ndl = dot(normal, lightDir);
      float diff = max(0.32, ndl * 1.35); // boosted ambient fill & direct light intensity for clarity
      
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float rim = 1.0 - max(0.0, dot(viewDir, normal));
      float atmosphereGlow = pow(rim, 5.0) * 0.45;
      
      vec3 surfaceColor = uBaseColor;
      
      if (uType == 0) {
        // Mercury: Cratered dark gray rock
        float n1 = snoise(vLocalPosition * 8.0);
        float n2 = snoise(vLocalPosition * 20.0);
        float craters = smoothstep(0.3, 0.7, n1 * n2);
        surfaceColor = mix(uBaseColor, uDetailColor, craters * 0.5);
        
      } else if (uType == 1) {
        // Venus: Swirling bright yellow-orange clouds
        float n1 = snoise(vLocalPosition * 3.5 + vec3(uTime * 0.06, uTime * 0.04, 0.0));
        float bands = sin(vLocalPosition.y * 10.0 + n1 * 2.5) * 0.5 + 0.5;
        surfaceColor = mix(uBaseColor, uDetailColor, bands);
        
      } else if (uType == 2) {
        // Earth: Continents and Oceans
        float n = snoise(vLocalPosition * 2.6);
        if (n > -0.05) {
          // Land
          float elevation = snoise(vLocalPosition * 10.0);
          surfaceColor = mix(uDetailColor, uAccentColor, elevation * 0.5 + 0.5);
        } else {
          // Ocean
          surfaceColor = uBaseColor;
        }
        
      } else if (uType == 3) {
        // Mars: Red sand planet with polar ice caps
        float n = snoise(vLocalPosition * 5.0);
        surfaceColor = mix(uBaseColor, uDetailColor, n * 0.4 + 0.4);
        
        // Polar caps at Y axis extremes
        if (vLocalPosition.y > 0.86) {
          float cap = smoothstep(0.86, 0.93, vLocalPosition.y);
          surfaceColor = mix(surfaceColor, vec3(0.92, 0.92, 1.0), cap);
        }
        if (vLocalPosition.y < -0.86) {
          float cap = smoothstep(-0.86, -0.93, vLocalPosition.y);
          surfaceColor = mix(surfaceColor, vec3(0.92, 0.92, 1.0), cap);
        }
        
      } else if (uType == 4) {
        // Jupiter: Gaseous bands & the Great Red Spot
        float n1 = snoise(vLocalPosition * vec3(1.5, 12.0, 1.5) + vec3(uTime * 0.04));
        float bands = sin(vLocalPosition.y * 25.0 + n1 * 2.0) * 0.5 + 0.5;
        surfaceColor = mix(uBaseColor, uDetailColor, bands);
        
        // Great Red Spot
        float lat = vLocalPosition.y;
        float lon = atan(vLocalPosition.x, vLocalPosition.z);
        float distToSpot = distance(vec2(lon, lat), vec2(0.8, -0.22));
        float spot = smoothstep(0.24, 0.0, distToSpot);
        surfaceColor = mix(surfaceColor, uAccentColor, spot * 0.85);
        
      } else if (uType == 5) {
        // Saturn: Muted gas bands
        float n = snoise(vLocalPosition * vec3(1.0, 8.0, 1.0) + vec3(uTime * 0.02));
        float bands = sin(vLocalPosition.y * 18.0 + n * 1.2) * 0.5 + 0.5;
        surfaceColor = mix(uBaseColor, uDetailColor, bands);
        
      } else if (uType == 6) {
        // Uranus: Soft pale cyan gas giant
        float n = snoise(vLocalPosition * 4.0 + vec3(uTime * 0.01));
        surfaceColor = mix(uBaseColor, uDetailColor, n * 0.1 + 0.1);
        
      } else if (uType == 7) {
        // Neptune: Rich deep blue with faint white cloud storm bands
        float n1 = snoise(vLocalPosition * vec3(1.2, 7.0, 1.2) + vec3(uTime * 0.03));
        float bands = sin(vLocalPosition.y * 16.0 + n1 * 1.8) * 0.5 + 0.5;
        surfaceColor = mix(uBaseColor, uDetailColor, bands);
        
        // Faint white cloud patches
        float n2 = snoise(vLocalPosition * 10.0 + vec3(uTime * 0.07));
        float clouds = smoothstep(0.5, 0.7, n2);
        surfaceColor = mix(surfaceColor, vec3(0.85, 0.9, 1.0), clouds * 0.3);
      }
      
      vec3 finalColor = surfaceColor * diff;
      
      // Inject glowing atmospheric halos (Earth, Venus, Uranus, Neptune)
      if (uType == 2 || uType == 1 || uType == 7 || uType == 6) {
        vec3 glowColor = vec3(0.25, 0.55, 1.0); // Earth
        if (uType == 1) glowColor = vec3(1.0, 0.65, 0.3); // Venus
        if (uType == 6) glowColor = vec3(0.45, 0.85, 0.85); // Uranus
        if (uType == 7) glowColor = vec3(0.15, 0.35, 0.9); // Neptune
        finalColor += glowColor * atmosphereGlow;
      }
      
      gl_FragColor = vec4(finalColor, uOpacity);
    }
  `
);

// ----------------- Earth Clouds Material -----------------
export const EarthCloudsMaterial = shaderMaterial(
  {
    uTime: 0,
    uOpacity: 1,
    uSunPos: new THREE.Vector3(0, 0, -42),
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    varying vec3 vLocalPosition;
    varying vec3 vWorldPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vLocalPosition = position;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec3 vNormal;
    varying vec3 vLocalPosition;
    varying vec3 vWorldPosition;
    
    uniform float uTime;
    uniform float uOpacity;
    uniform vec3 uSunPos;
    
    // Simplex 3D Noise Helper
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float snoise(vec3 v){ 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod(i, 289.0 ); 
      vec4 p = permute( permute( permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 1.0/7.0;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(uSunPos - vWorldPosition);
      float diff = max(0.35, dot(normal, lightDir) * 1.35);
      
      // Floating clouds using simplex noise
      float n1 = snoise(vLocalPosition * 3.5 + vec3(0.0, uTime * 0.03, uTime * 0.02));
      float n2 = snoise(vLocalPosition * 7.0 - vec3(uTime * 0.015, 0.0, -uTime * 0.025));
      float clouds = smoothstep(0.15, 0.45, (n1 + n2) * 0.5 + 0.1);
      
      // Atmosphere rim light
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float rim = 1.0 - max(0.0, dot(viewDir, normal));
      float glow = pow(rim, 4.0) * 0.35;
      
      vec3 cloudColor = vec3(0.95, 0.95, 1.0);
      float alpha = clouds * uOpacity * 0.85;
      
      gl_FragColor = vec4(cloudColor * diff + vec3(0.3, 0.55, 1.0) * glow, alpha);
    }
  `
);

// ----------------- Saturn Ring Material -----------------
export const SaturnRingMaterial = shaderMaterial(
  {
    uOpacity: 1,
    uRingColor: new THREE.Color(0xbfa57d),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vLocalPosition;
    
    void main() {
      vUv = uv;
      vLocalPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying vec3 vLocalPosition;
    
    uniform float uOpacity;
    uniform vec3 uRingColor;
    
    void main() {
      // Local ring geometry radius calculation
      float r = length(vLocalPosition.xy);
      
      // Cassini division & dust lanes procedural ring map
      float ring = sin(r * 150.0) * 0.25 + 0.75;
      float alpha = smoothstep(1.3, 1.4, r) * smoothstep(2.5, 2.3, r);
      
      // Cassini Division
      if (r > 1.82 && r < 1.95) {
        alpha *= 0.03;
      }
      
      // Encke Gap
      if (r > 2.22 && r < 2.25) {
        alpha *= 0.08;
      }
      
      vec3 finalColor = uRingColor * ring;
      gl_FragColor = vec4(finalColor, alpha * uOpacity * 0.65);
    }
  `
);

// ----------------- Living Sun Material -----------------
export const LivingSunMaterial = shaderMaterial(
  {
    uTime: 0,
    uOpacity: 1,
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    varying vec3 vLocalPosition;
    varying vec3 vWorldPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vLocalPosition = position;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec3 vNormal;
    varying vec3 vLocalPosition;
    varying vec3 vWorldPosition;
    
    uniform float uTime;
    uniform float uOpacity;
    
    // Simplex 3D Noise Helper
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float snoise(vec3 v){ 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod(i, 289.0 ); 
      vec4 p = permute( permute( permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 1.0/7.0;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }
    
    void main() {
      // Hot convection thermal cell textures
      float n1 = snoise(vLocalPosition * 2.5 - vec3(0.0, uTime * 0.22, uTime * 0.15));
      float n2 = snoise(vLocalPosition * 5.0 + vec3(uTime * 0.08, uTime * 0.32, 0.0));
      float cells = (n1 + n2) * 0.5 + 0.5;
      
      vec3 yellowCore = vec3(0.9, 0.78, 0.5); // reduced brightness
      vec3 deepFlame = vec3(0.7, 0.22, 0.01); // reduced brightness
      vec3 sunColor = mix(deepFlame, yellowCore, cells);
      
      // Intense corona edge rim glow (toned down slightly to prevent overlay washout)
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
      rim = pow(rim, 3.2);
      sunColor += vec3(0.9, 0.35, 0.05) * rim * 0.45; // reduced rim glow brightness and factor
      
      gl_FragColor = vec4(sunColor * 0.85, uOpacity); // scaled down base brightness
    }
  `
);

// ----------------- Sun Corona Glow Material -----------------
export const SunCoronaMaterial = shaderMaterial(
  {
    uOpacity: 1,
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    uniform float uOpacity;
    
    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float rim = 1.0 - max(0.0, dot(viewDir, normalize(vNormal)));
      float glow = pow(rim, 3.5) * 0.22; // reduced from 0.42
      
      vec3 coronaColor = vec3(0.9, 0.35, 0.02) * glow; // reduced saturation and brightness
      gl_FragColor = vec4(coronaColor, glow * uOpacity);
    }
  `
);

// ----------------- Procedural Starry Sky Material -----------------
export const StarrySkyMaterial = shaderMaterial(
  {
    uTime: 0,
  },
  // Vertex Shader
  `
    varying vec3 vLocalPosition;
    
    void main() {
      vLocalPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec3 vLocalPosition;
    uniform float uTime;
    
    // Simplex 3D Noise Helper
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float snoise(vec3 v){ 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod(i, 289.0 ); 
      vec4 p = permute( permute( permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 1.0/7.0;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    // Hash function for stars
    float hash(vec3 p) {
      p = fract(p * vec3(443.8975, 397.2973, 491.1871));
      p += dot(p.xyz, p.yzx + 19.19);
      return fract(p.x * p.y * p.z);
    }
    
    void main() {
      vec3 dir = normalize(vLocalPosition);
      
      // Nebular space clouds
      float nebulaNoise = snoise(dir * 1.6 + vec3(0.0, uTime * 0.012, uTime * 0.008));
      vec3 spaceIndigo = vec3(0.006, 0.008, 0.024);
      vec3 spaceMagenta = vec3(0.016, 0.004, 0.026);
      vec3 spaceBackground = mix(vec3(0.001, 0.0015, 0.003), mix(spaceIndigo, spaceMagenta, nebulaNoise * 0.5 + 0.5), 0.42);
      
      // Grid-based anti-aliased procedural starry points
      float starColorSum = 0.0;
      float starDensity = 0.9975;
      
      vec3 scaledPos = dir * 65.0; // scale controls star density grid
      vec3 cellId = floor(scaledPos);
      float n = hash(cellId);
      
      if (n > starDensity) {
        float twinkle = sin(uTime * (1.6 + n * 2.2) + n * 80.0) * 0.45 + 0.55;
        vec3 cellOffset = fract(scaledPos) - 0.5;
        float dist = length(cellOffset);
        float starShape = smoothstep(0.45, 0.0, dist);
        
        // Varying star color weights
        vec3 col = vec3(1.0);
        if (n > 0.9994) col = vec3(0.68, 0.85, 1.0); // blue-white
        else if (n < 0.9982) col = vec3(1.0, 0.92, 0.75); // warm gold
        
        spaceBackground += col * starShape * twinkle * 0.92;
      }
      
      gl_FragColor = vec4(spaceBackground, 1.0);
    }
  `
);

// ----------------- Atmospheric Glow Material -----------------
export const AtmosphereGlowMaterial = shaderMaterial(
  {
    uGlowColor: new THREE.Color(0x3b82f6),
    uOpacity: 1.0,
    uIntensity: 1.0,
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    uniform vec3 uGlowColor;
    uniform float uOpacity;
    uniform float uIntensity;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      
      // Fresnel edge halo glow intensity
      float intensity = dot(viewDir, normal);
      intensity = clamp(1.0 - intensity, 0.0, 1.0);
      intensity = pow(intensity, 3.2); // thicker halo
      
      vec3 finalGlow = uGlowColor * intensity * uIntensity;
      gl_FragColor = vec4(finalGlow, intensity * uOpacity * 0.82 * uIntensity);
    }
  `
);

// ----------------- Spiral Galaxy Material -----------------
export const SpiralGalaxyMaterial = shaderMaterial(
  {
    uTime: 0,
    uOpacity: 1.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uOpacity;
    
    // Simplex 3D Noise Helper
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float snoise(vec3 v){ 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod(i, 289.0 ); 
      vec4 p = permute( permute( permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 1.0/7.0;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }
    
    void main() {
      // Coordinate shift to center
      vec2 uv = vUv - 0.5;
      float r = length(uv) * 2.0; // r ranges 0 to 1
      
      if (r > 1.0) discard;
      
      float theta = atan(uv.y, uv.x);
      
      // Spiral Arm Generation (3 arms)
      float arms = 3.0;
      float spiral = theta - r * 9.5 + uTime * 0.35;
      float armPattern = sin(spiral * arms) * 0.5 + 0.5;
      
      // Dynamic noise for detailed nebulae lanes
      float detailNoise = snoise(vec3(uv * 18.0, uTime * 0.08)) * 0.2 + 0.8;
      float armGlow = armPattern * detailNoise;
      
      // Volumetric core sphere glow
      float coreGlow = smoothstep(0.8, 0.0, r * 3.5);
      
      // Harmonious galaxy color palette
      vec3 coreCol = vec3(1.0, 0.95, 0.9);   // bright hot core
      vec3 midCol = vec3(0.55, 0.18, 0.72);   // cosmic violet
      vec3 outerCol = vec3(0.08, 0.45, 0.82); // deep space blue
      
      vec3 finalColor;
      if (r < 0.3) {
        finalColor = mix(coreCol, midCol, r / 0.3);
      } else {
        finalColor = mix(midCol, outerCol, (r - 0.3) / 0.7);
      }
      
      // Radial glow + arm details
      float edgeFade = smoothstep(1.0, 0.82, r);
      float glow = pow(1.0 - r, 2.2);
      float alpha = (armGlow * 0.45 + coreGlow * 0.85 + glow * 0.3) * edgeFade * uOpacity;
      
      gl_FragColor = vec4(finalColor * (glow * 1.5 + 0.5), alpha);
    }
  `
);

// Extend materials to RTF namespace
extend({ 
  PlanetMaterial, 
  EarthCloudsMaterial, 
  SaturnRingMaterial, 
  LivingSunMaterial, 
  SunCoronaMaterial,
  StarrySkyMaterial,
  AtmosphereGlowMaterial,
  SpiralGalaxyMaterial
});

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

// ============================================
// SHADER SOURCES
// ============================================

const vertexShader = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Water ripple transition + simple circle mouse follower with subtle glow
const fragmentShader = `
  precision highp float;
  
  uniform sampler2D u_image1;
  uniform sampler2D u_image2;
  uniform vec2 u_resolution;
  uniform vec2 u_clickOrigin;
  uniform float u_time;
  uniform float u_showingImage2;
  uniform float u_globalTime;
  
  // Circle follower uniforms
  uniform vec2 u_mousePos;
  uniform float u_enableCircle;
  uniform float u_circleRadius;
  uniform float u_edgeSoftness;
  uniform float u_glowIntensity;
  uniform float u_glowSize;
  
  // Ripple control uniforms
  uniform float u_numWaves;
  uniform float u_amplitude;
  
  // Cursor trail uniforms
  #define MAX_TRAIL_POINTS 20
  uniform vec2 u_trailPositions[MAX_TRAIL_POINTS];
  uniform float u_trailAges[MAX_TRAIL_POINTS];
  uniform int u_trailCount;
  uniform float u_trailWaves;
  uniform float u_trailAmplitude;
  uniform float u_trailRadius;
  
  varying vec2 v_uv;
  
  #define PI 3.14159265359
  
  // ============================================
  // RIPPLE FUNCTIONS
  // ============================================
  
  vec2 cursorRipple(vec2 uv, vec2 center, float age) {
    float ratio = u_resolution.y / u_resolution.x;
    
    vec2 texCoord = uv;
    vec2 centreAdjusted = center;
    
    texCoord.y *= ratio;
    centreAdjusted.y *= ratio;
    
    float dist = distance(texCoord, centreAdjusted);
    
    float maxRadius = u_trailRadius;
    float currentRadius = age * maxRadius;
    
    vec2 displacement = vec2(0.0);
    
    if (dist < currentRadius && dist > 0.001) {
      float phase = (dist - currentRadius) * u_trailWaves * PI * 2.0 / maxRadius;
      float wave = sin(phase);
      
      float distFromFront = currentRadius - dist;
      float envelope = exp(-distFromFront * 8.0);
      
      float ageFade = 1.0 - smoothstep(0.3, 1.0, age);
      float startFade = smoothstep(0.0, 0.01, dist);
      
      float finalAmplitude = u_trailAmplitude * wave * envelope * ageFade * startFade;
      
      vec2 dir = normalize(texCoord - centreAdjusted);
      dir.y /= ratio;
      
      displacement = dir * finalAmplitude;
    }
    
    return displacement;
  }
  
  vec2 getCursorTrailDisplacement(vec2 uv) {
    vec2 totalDisplacement = vec2(0.0);
    
    for (int i = 0; i < MAX_TRAIL_POINTS; i++) {
      if (i >= u_trailCount) break;
      
      float age = u_trailAges[i];
      if (age < 1.0 && age > 0.0) {
        vec2 pos = u_trailPositions[i];
        totalDisplacement += cursorRipple(uv, pos, age);
      }
    }
    
    return totalDisplacement;
  }
  
  vec2 waterRipple(vec2 uv, vec2 center, float time) {
    float ratio = u_resolution.y / u_resolution.x;
    
    vec2 texCoord = uv;
    vec2 centreAdjusted = center;
    
    texCoord.y *= ratio;
    centreAdjusted.y *= ratio;
    
    float dist = distance(texCoord, centreAdjusted);
    
    float maxRadius = 1.5;
    float currentRadius = time * maxRadius;
    
    vec2 displacement = vec2(0.0);
    
    if (dist < currentRadius && dist > 0.001) {
      float phase = (dist - currentRadius) * u_numWaves * PI * 2.0 / maxRadius;
      float wave = sin(phase);
      
      float distFromFront = currentRadius - dist;
      float envelope = exp(-distFromFront * 3.0);
      
      float timeFade = 1.0 - time * 0.6;
      float startFade = smoothstep(0.0, 0.02, dist);
      
      float finalAmplitude = u_amplitude * wave * envelope * timeFade * startFade;
      
      vec2 dir = normalize(texCoord - centreAdjusted);
      dir.y /= ratio;
      
      displacement = dir * finalAmplitude;
    }
    
    return displacement;
  }
  
  vec4 sampleWithRipple(sampler2D tex, vec2 uv, vec2 center, float time) {
    vec2 clickDisplacement = waterRipple(uv, center, time);
    vec2 trailDisplacement = getCursorTrailDisplacement(uv);
    vec2 totalDisplacement = clickDisplacement + trailDisplacement;
    
    vec2 distortedUV = clamp(uv + totalDisplacement, 0.0, 1.0);
    
    vec2 flippedUV = vec2(distortedUV.x, 1.0 - distortedUV.y);
    vec4 color = texture2D(tex, flippedUV);
    
    float brightness = length(totalDisplacement) * 8.0;
    color.rgb += brightness * vec3(1.0, 1.0, 1.0);
    
    return color;
  }
  
  void main() {
    float time = u_time;
    float ratio = u_resolution.y / u_resolution.x;
    
    // Sample both images with water ripple effects
    vec4 img1 = sampleWithRipple(u_image1, v_uv, u_clickOrigin, time);
    vec4 img2 = sampleWithRipple(u_image2, v_uv, u_clickOrigin, time);
    
    // ============================================
    // CLICK TRANSITION MASK
    // ============================================
    
    vec2 texCoord = v_uv;
    vec2 centreAdjusted = u_clickOrigin;
    texCoord.y *= ratio;
    centreAdjusted.y *= ratio;
    
    float dist = distance(texCoord, centreAdjusted);
    
    float maxRadius = 1.5;
    float edgeWidth = 0.12;
    float transitionRadius = time * maxRadius - edgeWidth * 2.0;
    
    float localTransition = smoothstep(
      transitionRadius - edgeWidth,
      transitionRadius + edgeWidth,
      dist
    );
    localTransition = 1.0 - localTransition;
    
    // Base color from transition
    vec4 color;
    if (u_showingImage2 < 0.5) {
      color = mix(img1, img2, localTransition);
    } else {
      color = mix(img2, img1, localTransition);
    }
    
    // Transition edge glow
    float edgeDist = abs(dist - transitionRadius);
    if (edgeDist < edgeWidth && time > 0.02 && time < 0.95) {
      float edgeGlow = (1.0 - edgeDist / edgeWidth) * 0.1;
      edgeGlow *= (1.0 - time);
      color.rgb += edgeGlow * vec3(0.8, 0.9, 1.0);
    }
    
    // ============================================
    // SIMPLE CIRCLE MOUSE FOLLOWER WITH SUBTLE GLOW
    // ============================================
    
    if (u_enableCircle > 0.5) {
      // Screen-space coordinates
      vec2 st = v_uv - vec2(0.5);
      st.y *= ratio;
      
      // Mouse position in same coordinate space
      vec2 mouse = u_mousePos - vec2(0.5);
      mouse.y *= ratio;
      
      // Distance from mouse cursor
      float mouseDist = length(st - mouse);
      
      // Inner circle mask - sharp edge
      float circleMask = 1.0 - smoothstep(
        u_circleRadius - u_edgeSoftness,
        u_circleRadius + u_edgeSoftness,
        mouseDist
      );
      
      // Subtle outer glow - soft falloff beyond circle edge
      float glowMask = 1.0 - smoothstep(
        u_circleRadius,
        u_circleRadius + u_glowSize,
        mouseDist
      );
      glowMask *= u_glowIntensity;
      // Don't add glow inside the circle
      glowMask *= (1.0 - circleMask);
      
      // Sample the OTHER image with the same ripple distortion for the circle interior
      vec2 clickDisp = waterRipple(v_uv, u_clickOrigin, time);
      vec2 trailDisp = getCursorTrailDisplacement(v_uv);
      vec2 totalDisp = clickDisp + trailDisp;
      vec2 distortedUV = clamp(v_uv + totalDisp, 0.0, 1.0);
      vec2 flippedUV = vec2(distortedUV.x, 1.0 - distortedUV.y);
      
      vec4 img1Sample = texture2D(u_image1, flippedUV);
      vec4 img2Sample = texture2D(u_image2, flippedUV);
      
      // Add ripple brightness
      float brightness = length(totalDisp) * 8.0;
      img1Sample.rgb += brightness;
      img2Sample.rgb += brightness;
      
      // Inside circle: show the opposite image, respecting the transition
      vec4 peekImage;
      if (u_showingImage2 < 0.5) {
        // Currently showing img1, transitioning to img2
        // Circle shows: img2 (where ripple hasn't reached), img1 (where it has)
        peekImage = mix(img2Sample, img1Sample, localTransition);
      } else {
        // Currently showing img2, transitioning to img1
        peekImage = mix(img1Sample, img2Sample, localTransition);
      }
      
      // Blend circle content
      color = mix(color, peekImage, circleMask);
      
      // Add subtle glow (just a soft white/light blend at the edge)
      color.rgb = mix(color.rgb, vec3(1.0), glowMask * 0.3);
    }
    
    gl_FragColor = color;
  }
`;

// ============================================
// WEBGL HELPER FUNCTIONS
// ============================================

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  
  const program = gl.createProgram();
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    return null;
  }
  
  return program;
}

function loadImageTexture(gl, src) {
  return new Promise((resolve) => {
    const texture = gl.createTexture();
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      resolve(texture);
    };
    image.src = src;
  });
}

// ============================================
// TRAIL POINT CLASS
// ============================================

const MAX_TRAIL_POINTS = 20;

class TrailPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.age = 0;
    this.maxAge = 1.0;
  }
  
  update(deltaTime, decaySpeed) {
    this.age += deltaTime * decaySpeed;
    return this.age < this.maxAge;
  }
}

// ============================================
// REACT COMPONENT
// ============================================

/**
 * ImageContainer - Water ripple transition + simple circle mouse follower
 * 
 * @param {string} baseImage - URL of the first image
 * @param {string} revealImage - URL of the second image
 * @param {number} duration - Animation duration in seconds (default: 2.5)
 * @param {number} numWaves - Number of ripple waves (default: 12)
 * @param {number} amplitude - Distortion strength (default: 0.025)
 * 
 * Cursor trail parameters:
 * @param {boolean} enableTrail - Enable/disable cursor trail (default: true)
 * @param {number} trailWaves - Number of waves in trail ripples (default: 6)
 * @param {number} trailAmplitude - Strength of trail ripple distortion (default: 0.008)
 * @param {number} trailRadius - Max radius of each trail ripple (default: 0.15)
 * @param {number} trailDecay - How fast trail ripples fade (default: 1.5)
 * @param {number} trailSpawnRate - Min distance to spawn new trail point (default: 0.03)
 * 
 * Circle follower parameters:
 * @param {boolean} enableCircle - Enable/disable circle mouse follower (default: true)
 * @param {number} circleRadius - Radius of the circle (default: 0.05)
 * @param {number} edgeSoftness - Softness of the circle edge (default: 0.005)
 * @param {number} mouseSmoothing - How smoothly circle follows mouse (default: 0.15)
 * @param {number} glowIntensity - Intensity of subtle outer glow (default: 0.5)
 * @param {number} glowSize - How far the glow extends (default: 0.03)
 */
export const ImageContainer = ({ 
  baseImage, 
  revealImage,
  duration = 2.5,
  numWaves = 12,
  amplitude = 0.025,
  // Cursor trail options
  enableTrail = true,
  trailWaves = 6,
  trailAmplitude = 0.008,
  trailRadius = 0.15,
  trailDecay = 1.5,
  trailSpawnRate = 0.03,
  // Circle follower options
  enableCircle = true,
  circleRadius = 0.05,
  edgeSoftness = 0.005,
  mouseSmoothing = 0.15,
  glowIntensity = 0.5,
  glowSize = 0.03,
}) => {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const stateRef = useRef({
    program: null,
    imageTextures: [null, null],
    quadBuffer: null,
    animationId: null,
    clickOrigin: [0.5, 0.5],
    time: 0,
    globalTime: 0,
    showingImage2: 0,
    isTransitioning: false,
    gsapTimeline: null,
    // Trail state
    trailPoints: [],
    lastTrailPos: null,
    lastFrameTime: performance.now(),
    // Mouse follower state
    mousePos: [0.5, 0.5],
    targetMousePos: [0.5, 0.5],
  });

  const propsRef = useRef({ 
    duration, numWaves, amplitude,
    enableTrail, trailWaves, trailAmplitude, trailRadius, trailDecay, trailSpawnRate,
    enableCircle, circleRadius, edgeSoftness, mouseSmoothing, glowIntensity, glowSize
  });
  
  useEffect(() => {
    propsRef.current = { 
      duration, numWaves, amplitude,
      enableTrail, trailWaves, trailAmplitude, trailRadius, trailDecay, trailSpawnRate,
      enableCircle, circleRadius, edgeSoftness, mouseSmoothing, glowIntensity, glowSize
    };
  }, [duration, numWaves, amplitude, enableTrail, trailWaves, trailAmplitude, trailRadius, trailDecay, trailSpawnRate, enableCircle, circleRadius, edgeSoftness, mouseSmoothing, glowIntensity, glowSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
    });
    
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }
    
    glRef.current = gl;
    const state = stateRef.current;

    state.program = createProgram(gl, vertexShader, fragmentShader);

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW);
    state.quadBuffer = quadBuffer;

    const handleResize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);

    Promise.all([
      loadImageTexture(gl, baseImage),
      loadImageTexture(gl, revealImage),
    ]).then(([tex1, tex2]) => {
      state.imageTextures = [tex1, tex2];
    });

    const render = () => {
      if (!state.program || !state.imageTextures[0] || !state.imageTextures[1]) {
        state.animationId = requestAnimationFrame(render);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;
      const props = propsRef.current;
      
      const currentTime = performance.now();
      const deltaTime = (currentTime - state.lastFrameTime) / 1000;
      state.lastFrameTime = currentTime;
      
      // Update global time
      state.globalTime += deltaTime;
      
      // Smooth mouse following
      state.mousePos[0] += (state.targetMousePos[0] - state.mousePos[0]) * props.mouseSmoothing;
      state.mousePos[1] += (state.targetMousePos[1] - state.mousePos[1]) * props.mouseSmoothing;
      
      // Update trail points
      if (props.enableTrail) {
        state.trailPoints = state.trailPoints.filter(point => 
          point.update(deltaTime, props.trailDecay)
        );
      }

      gl.useProgram(state.program);
      gl.viewport(0, 0, width, height);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, state.imageTextures[0]);
      gl.uniform1i(gl.getUniformLocation(state.program, "u_image1"), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, state.imageTextures[1]);
      gl.uniform1i(gl.getUniformLocation(state.program, "u_image2"), 1);

      gl.uniform2f(gl.getUniformLocation(state.program, "u_resolution"), width, height);
      gl.uniform2f(gl.getUniformLocation(state.program, "u_clickOrigin"), state.clickOrigin[0], state.clickOrigin[1]);
      gl.uniform1f(gl.getUniformLocation(state.program, "u_time"), state.time);
      gl.uniform1f(gl.getUniformLocation(state.program, "u_globalTime"), state.globalTime);
      gl.uniform1f(gl.getUniformLocation(state.program, "u_showingImage2"), state.showingImage2);
      
      // Circle follower uniforms
      gl.uniform2f(gl.getUniformLocation(state.program, "u_mousePos"), state.mousePos[0], state.mousePos[1]);
      gl.uniform1f(gl.getUniformLocation(state.program, "u_enableCircle"), props.enableCircle ? 1.0 : 0.0);
      gl.uniform1f(gl.getUniformLocation(state.program, "u_circleRadius"), props.circleRadius);
      gl.uniform1f(gl.getUniformLocation(state.program, "u_edgeSoftness"), props.edgeSoftness);
      gl.uniform1f(gl.getUniformLocation(state.program, "u_glowIntensity"), props.glowIntensity);
      gl.uniform1f(gl.getUniformLocation(state.program, "u_glowSize"), props.glowSize);
      
      // Ripple uniforms
      gl.uniform1f(gl.getUniformLocation(state.program, "u_numWaves"), props.numWaves);
      gl.uniform1f(gl.getUniformLocation(state.program, "u_amplitude"), props.amplitude);
      
      // Trail uniforms
      gl.uniform1f(gl.getUniformLocation(state.program, "u_trailWaves"), props.trailWaves);
      gl.uniform1f(gl.getUniformLocation(state.program, "u_trailAmplitude"), props.trailAmplitude);
      gl.uniform1f(gl.getUniformLocation(state.program, "u_trailRadius"), props.trailRadius);
      gl.uniform1i(gl.getUniformLocation(state.program, "u_trailCount"), state.trailPoints.length);
      
      const positions = new Float32Array(MAX_TRAIL_POINTS * 2);
      const ages = new Float32Array(MAX_TRAIL_POINTS);
      
      for (let i = 0; i < state.trailPoints.length && i < MAX_TRAIL_POINTS; i++) {
        const point = state.trailPoints[i];
        positions[i * 2] = point.x;
        positions[i * 2 + 1] = point.y;
        ages[i] = point.age;
      }
      
      for (let i = 0; i < MAX_TRAIL_POINTS; i++) {
        gl.uniform2f(
          gl.getUniformLocation(state.program, `u_trailPositions[${i}]`),
          positions[i * 2],
          positions[i * 2 + 1]
        );
        gl.uniform1f(
          gl.getUniformLocation(state.program, `u_trailAges[${i}]`),
          ages[i]
        );
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, state.quadBuffer);
      const posLoc = gl.getAttribLocation(state.program, "a_position");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      state.animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (state.animationId) {
        cancelAnimationFrame(state.animationId);
      }
      if (state.gsapTimeline) {
        state.gsapTimeline.kill();
      }
    };
  }, [baseImage, revealImage]);

  const getUVCoords = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height;
    return [x, y];
  }, []);

  const handleMouseMove = useCallback((e) => {
    const state = stateRef.current;
    const props = propsRef.current;
    
    const [x, y] = getUVCoords(e);
    
    // Update target mouse position for the circle
    state.targetMousePos = [x, y];
    
    // Handle trail spawning
    if (!props.enableTrail) return;
    
    if (state.lastTrailPos) {
      const dx = x - state.lastTrailPos[0];
      const dy = y - state.lastTrailPos[1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < props.trailSpawnRate) {
        return;
      }
    }
    
    if (state.trailPoints.length < MAX_TRAIL_POINTS) {
      state.trailPoints.push(new TrailPoint(x, y));
    } else {
      const oldest = state.trailPoints.reduce((min, p, i, arr) => 
        p.age > arr[min].age ? i : min, 0);
      state.trailPoints[oldest] = new TrailPoint(x, y);
    }
    
    state.lastTrailPos = [x, y];
  }, [getUVCoords]);
  
  const handleMouseLeave = useCallback(() => {
    stateRef.current.lastTrailPos = null;
  }, []);

  const handleClick = useCallback((e) => {
    const state = stateRef.current;
    const props = propsRef.current;
    
    if (state.isTransitioning) return;
    
    const [x, y] = getUVCoords(e);
    
    if (state.gsapTimeline) {
      state.gsapTimeline.kill();
    }
    
    state.clickOrigin = [x, y];
    state.time = 0;
    state.isTransitioning = true;
    
    const tl = gsap.timeline({
      onComplete: () => {
        state.isTransitioning = false;
        state.showingImage2 = state.showingImage2 === 0 ? 1 : 0;
        state.time = 0;
      }
    });
    
    tl.to(state, {
      time: 1,
      duration: props.duration,
      ease: "power1.out",
    });
    
    state.gsapTimeline = tl;
    
  }, [getUVCoords]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        cursor: "pointer",
      }}
    />
  );
};

export default ImageContainer;
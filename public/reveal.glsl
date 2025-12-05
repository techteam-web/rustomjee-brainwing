#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_radius;
uniform float u_time;

// Ripple click uniforms
uniform float u_rippleTime;
uniform vec2 u_rippleOrigin;
uniform float u_rippleActive;
uniform float u_transitionState;

uniform sampler2D u_image1;
uniform sampler2D u_image2;

#define PI 3.14159265359
#define TAU 6.28318530718

// ============================================
// REALISTIC WATER PHYSICS
// ============================================

// Wave dispersion relation for deep water: omega = sqrt(g * k)
// This means higher frequency waves travel slower - key to realistic water
float waveSpeed(float frequency) {
    float k = frequency * TAU;
    float g = 9.8;
    return sqrt(g / k) * 0.15; // scaled for visual effect
}

// Gerstner wave - physically accurate ocean/water wave model
// Returns both height (z) and horizontal displacement (xy)
vec3 gerstnerWave(vec2 pos, float time, float frequency, float amplitude, float steepness) {
    float k = frequency * TAU;
    float speed = waveSpeed(frequency);
    float phase = k * length(pos) - speed * time * k;
    
    // Gerstner waves have horizontal motion too
    vec2 dir = normalize(pos + 0.0001);
    float cosPhase = cos(phase);
    float sinPhase = sin(phase);
    
    // Horizontal displacement (creates the rolling motion)
    vec2 horizontal = dir * steepness * amplitude * cosPhase;
    // Vertical displacement
    float vertical = amplitude * sinPhase;
    
    return vec3(horizontal, vertical);
}

// Multi-frequency ripple with dispersion (realistic spreading)
// In real water, ripples spread out and separate by frequency
vec3 waterRipple(vec2 pos, vec2 center, float time) {
    vec2 diff = pos - center;
    float dist = length(diff);
    
    if (time <= 0.0) return vec3(0.0);
    
    vec3 totalWave = vec3(0.0);
    
    // Multiple wave frequencies with proper dispersion
    // Lower frequencies travel faster (dispersion)
    const int NUM_WAVES = 6;
    float frequencies[6];
    frequencies[0] = 3.0;
    frequencies[1] = 5.0;
    frequencies[2] = 8.0;
    frequencies[3] = 12.0;
    frequencies[4] = 18.0;
    frequencies[5] = 25.0;
    
    for (int i = 0; i < NUM_WAVES; i++) {
        float freq = frequencies[i];
        float speed = waveSpeed(freq);
        
        // Wave packet - waves exist in an expanding ring
        float wavePos = speed * time;
        float packetWidth = 0.08 + time * 0.15; // Packet spreads over time
        
        // Gaussian envelope for wave packet (waves don't exist everywhere)
        float envelope = exp(-pow(dist - wavePos, 2.0) / (2.0 * packetWidth * packetWidth));
        
        // Damping - waves lose energy over time and distance
        float damping = exp(-time * 0.8) * exp(-dist * 1.2);
        
        // Amplitude decreases with frequency (high freq waves are smaller)
        float amplitude = 0.025 / (1.0 + float(i) * 0.4);
        
        // Steepness for Gerstner (0 = sine wave, 1 = sharp peaks)
        float steepness = 0.6 - float(i) * 0.08;
        
        vec3 wave = gerstnerWave(diff, time, freq, amplitude * envelope * damping, steepness);
        totalWave += wave;
    }
    
    return totalWave;
}

// Surface normal from height displacement (for refraction/lighting)
vec3 calculateNormal(vec2 uv, vec2 center, float time, float aspect) {
    float eps = 0.002;
    
    vec2 uvRight = uv + vec2(eps, 0.0);
    vec2 uvUp = uv + vec2(0.0, eps);
    
    vec3 waveCenter = waterRipple(uv * vec2(aspect, 1.0), center * vec2(aspect, 1.0), time);
    vec3 waveRight = waterRipple(uvRight * vec2(aspect, 1.0), center * vec2(aspect, 1.0), time);
    vec3 waveUp = waterRipple(uvUp * vec2(aspect, 1.0), center * vec2(aspect, 1.0), time);
    
    float dzdx = (waveRight.z - waveCenter.z) / eps;
    float dzdy = (waveUp.z - waveCenter.z) / eps;
    
    return normalize(vec3(-dzdx, -dzdy, 1.0));
}

// Fresnel effect - reflection varies with viewing angle
float fresnel(vec3 normal, vec3 viewDir, float power) {
    return pow(1.0 - max(dot(normal, viewDir), 0.0), power);
}

// Caustics - light patterns from wave focusing
float caustics(vec2 uv, float time) {
    vec2 p = uv * 8.0;
    float t = time * 0.5;
    
    float c = 0.0;
    for (int i = 0; i < 3; i++) {
        float fi = float(i);
        vec2 offset = vec2(sin(t + fi), cos(t + fi * 1.3)) * 0.5;
        c += sin(p.x * (1.0 + fi * 0.5) + sin(p.y * 2.0 + t)) * 
             sin(p.y * (1.2 + fi * 0.3) + sin(p.x * 1.8 + t * 1.1));
    }
    
    return c * 0.15;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float aspect = u_resolution.x / u_resolution.y;
    
    // Normalized mouse position
    vec2 mouse = u_mouse / u_resolution;
    
    // ============================================
    // HOVER EFFECT - subtle surface disturbance
    // ============================================
    vec2 hoverDistort = vec2(0.0);
    float hoverMask = 0.0;
    
    if (u_radius > 0.0) {
        vec2 hoverDiff = uv - mouse;
        hoverDiff.x *= aspect;
        float hoverDist = length(hoverDiff);
        
        // Gentle surface waves around cursor
        float hoverWave = 0.0;
        for (int i = 0; i < 3; i++) {
            float fi = float(i);
            float freq = 20.0 + fi * 10.0;
            float phase = hoverDist * freq - u_time * (3.0 + fi);
            float amp = 0.003 / (1.0 + fi);
            hoverWave += sin(phase) * amp * smoothstep(u_radius * 2.0, 0.0, hoverDist);
        }
        
        vec2 hoverDir = normalize(hoverDiff + 0.0001);
        hoverDir.x /= aspect;
        hoverDistort = hoverDir * hoverWave;
        
        // Reveal mask for hover peek
        hoverMask = smoothstep(u_radius * 1.3, u_radius * 0.5, hoverDist);
    }
    
    // ============================================
    // CLICK RIPPLE - physically accurate waves
    // ============================================
    vec2 clickDistort = vec2(0.0);
    float transitionMask = 0.0;
    float causticEffect = 0.0;
    
    if (u_rippleActive > 0.5 && u_rippleTime > 0.0) {
        // Ripple center in normalized coordinates
        vec2 rippleCenter = u_rippleOrigin / u_resolution;
        
        // Calculate wave displacement
        vec3 wave = waterRipple(
            uv * vec2(aspect, 1.0), 
            rippleCenter * vec2(aspect, 1.0), 
            u_rippleTime
        );
        
        // Apply horizontal displacement (Gerstner wave motion)
        clickDistort = wave.xy;
        clickDistort.x /= aspect;
        
        // Add refraction based on surface normal
        vec3 normal = calculateNormal(uv, rippleCenter, u_rippleTime, aspect);
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        
        // Index of refraction for water is ~1.33
        float ior = 1.33;
        vec2 refraction = normal.xy * (1.0 / ior - 1.0) * 0.1;
        clickDistort += refraction;
        
        // Transition mask - expands outward with the fastest wave
        vec2 rippleDiff = uv - rippleCenter;
        rippleDiff.x *= aspect;
        float rippleDist = length(rippleDiff);
        
        float leadingEdge = waveSpeed(3.0) * u_rippleTime; // Fastest wave
        float edgeSoftness = 0.1 + u_rippleTime * 0.05;
        transitionMask = smoothstep(leadingEdge + edgeSoftness, leadingEdge - edgeSoftness, rippleDist);
        
        // Caustics during ripple
        causticEffect = caustics(uv + clickDistort, u_rippleTime) * exp(-u_rippleTime * 0.5);
        causticEffect *= (1.0 - transitionMask) * 0.5 + 0.5; // Stronger at wave front
    }
    
    // ============================================
    // COMPOSE FINAL IMAGE
    // ============================================
    
    // Apply all distortions
    vec2 distortedUV = uv + hoverDistort + clickDistort;
    distortedUV = clamp(distortedUV, 0.001, 0.999);
    
    // Sample both images
    vec4 img1 = texture2D(u_image1, distortedUV);
    vec4 img2 = texture2D(u_image2, distortedUV);
    
    // Determine base and reveal images based on current state
    vec4 baseColor, revealColor;
    if (u_transitionState > 0.5) {
        baseColor = img2;
        revealColor = img1;
    } else {
        baseColor = img1;
        revealColor = img2;
    }
    
    // Apply click transition (ripple reveals the other image)
    float clickBlend = u_rippleActive > 0.5 ? transitionMask : 0.0;
    vec4 transitioned = mix(baseColor, revealColor, clickBlend);
    
    // Apply hover peek (only when not clicking)
    float hoverBlend = hoverMask * (1.0 - u_rippleActive);
    vec4 finalColor = mix(transitioned, revealColor, hoverBlend);
    
    // Add caustic highlights
    finalColor.rgb += vec3(causticEffect) * u_rippleActive;
    
    // Subtle specular highlight on wave peaks
    if (u_rippleActive > 0.5) {
        vec3 normal = calculateNormal(uv, u_rippleOrigin / u_resolution, u_rippleTime, aspect);
        float specular = pow(max(normal.z, 0.0), 32.0) * 0.15;
        finalColor.rgb += specular * exp(-u_rippleTime * 0.8);
    }
    
    gl_FragColor = finalColor;
}

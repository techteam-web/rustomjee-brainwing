import React, { useRef, useMemo, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const BLOOM_LAYER = 1

export function MainBuilding(props) {
  const { nodes, materials } = useGLTF('models/Main-building-ao.glb')
  const materialRef = useRef()
  const meshRef = useRef()

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.layers.enable(BLOOM_LAYER)
    }
  }, [])

  const { minY, maxY } = useMemo(() => {
    const geometry = nodes['Main-Building_Baked'].geometry
    geometry.computeBoundingBox()
    const box = geometry.boundingBox
    return { minY: box.min.y, maxY: box.max.y }
  }, [nodes])

  const originalTexture = useMemo(() => {
    const mat = materials['Main-Building_Baked']
    return mat.map || null
  }, [materials])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMap: { value: originalTexture },
    uHasMap: { value: originalTexture ? 1.0 : 0.0 },
    uMinY: { value: minY },
    uMaxY: { value: maxY },
    uHue: { value: 0.58 },
    uSaturation: { value: 0.5 },
    uBrightness: { value: 0.5 },
    uPulseSpeed: { value: 1.5 },
    uPulseFrequency: { value: 1 },
    uPulseSharpness: { value: 8.0 },
    uPulseIntensity: { value: 0.8 },
    uBaseGlow: { value: 0.3 },
  }), [originalTexture, minY, maxY])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms,
      toneMapped: false,
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform sampler2D uMap;
        uniform float uHasMap;
        uniform float uMinY;
        uniform float uMaxY;
        uniform float uHue;
        uniform float uSaturation;
        uniform float uBrightness;
        uniform float uPulseSpeed;
        uniform float uPulseFrequency;
        uniform float uPulseSharpness;
        uniform float uPulseIntensity;
        uniform float uBaseGlow;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        vec3 hsb2rgb(vec3 c) {
          vec3 rgb = clamp(
            abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
            0.0,
            1.0
          );
          rgb = rgb * rgb * (3.0 - 2.0 * rgb);
          return c.z * mix(vec3(1.0), rgb, c.y);
        }
        
        void main() {
          vec3 texColor = vec3(1.0);
          if (uHasMap > 0.5) {
            texColor = texture2D(uMap, vUv).rgb;
          }
          
          float normalizedY = (vPosition.y - uMinY) / (uMaxY - uMinY);
          
          vec3 baseColor = hsb2rgb(vec3(uHue, uSaturation, uBrightness));
          
          // Offset Y slightly to avoid division issues at the bottom
          float y = (normalizedY + 0.1) * uPulseFrequency;
          
          float a = pow(y, 2.0);
          float b = sin(y * 0.8 - 1.6);
          float c = sin(y - 0.01);
          
          // Add small epsilon to prevent division by zero
          float s = sin(a - uTime * uPulseSpeed + b) * c;
          s = sign(s) * max(abs(s), 0.05);
          
          float pulse = abs(1.0 / (s * uPulseSharpness)) - 0.01;
          pulse = clamp(pulse, 0.0, 1.0);
          
          // Stronger edge fade, especially at bottom
          float bottomFade = smoothstep(0.0, 0.15, normalizedY);
          float topFade = smoothstep(1.0, 0.9, normalizedY);
          pulse *= bottomFade * topFade;
          
          vec3 pulseColor = mix(baseColor * 1.5, vec3(1.0), pulse * 0.7);
          
          vec3 finalColor = baseColor * texColor * (uBaseGlow + 0.5);
          finalColor += pulseColor * pulse * uPulseIntensity;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    })
  }, [uniforms])

  useEffect(() => {
    if (materialRef.current && originalTexture) {
      materialRef.current.uniforms.uMap.value = originalTexture
      materialRef.current.uniforms.uHasMap.value = 1.0
    }
  }, [originalTexture])

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        geometry={nodes['Main-Building_Baked'].geometry}
        position={[-0.86, 100.58, 7.849]}
        rotation={[-Math.PI, 0, -Math.PI]}
      >
        <primitive object={shaderMaterial} ref={materialRef} attach="material" />
      </mesh>
    </group>
  )
}

useGLTF.preload('models/Main-building-ao.glb')
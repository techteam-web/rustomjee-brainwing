import React, { useEffect, useRef } from "react";
import { usePaths } from "./PathsContext";
import { pathData } from "./PathData";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from 'three'

const categorycamera = {
  portfolio: {
    position: {
      x: -1170.7995943968986,
      y:  1905.0565385960772,
      z: -1626.4931434681566,
    },
    target: {
      x: 453.31294763492673,
      y: -0.33334938766427147,
      z: -1450.405127126683,
    },
  },
  historical: {
    position: {
      x: 263.8662604526274,
      y: 1693.9989258271416,
      z: -753.6446428086755,
    },
    target: {
      x: 263.86793278797086,
      y: 18.214577345245967,
      z: -753.6445353485361,
    },
  },
  recreational: {
    position: {
      x
      : 
      1062.3398290677258,
      y
      : 
      5230.103676894297,
      z
      : 
      -368.75148449153477,
    },
    target: {
      x
      : 
      1062.334829397268,
      y
      : 
      -351.837128647595,
      z
      : 
      -368.7539666999206
    },
  },
  clubs: {
    position: {
      x: 1778.0234893201803,
      y: 2418.4384036178562,
      z: -420.7899669016788,
    },
    target: {
      x: 1639.606074718079,
      y: -64.74498555560595,
      z: -997.8790879002545,
    },
  },
  schools: {
    position: {
      x: 1773.3947139278193,
      y: 2712.690361664751,
      z: 779.7860166024109,
    },
    target: {
      x: 2114.617869674974,
      y: -606.1434587693626,
      z: -1203.7889575206918,
    },
  },
  hotels: {
    position: {
      x: -742.5149910168099,
      y: 1640.8254803239188,
      z: 415.5704602201766,
    },
    target: {
      x: -205.63996004956763,
      y: -597.4355166502778,
      z: 94.97689164856017,
    },
  },
  hospitals: {
    position: {
      x
      : 
      -670.0788074527104,
      y
      : 
      2392.8387277404017,
      z
      : 
      -2762.1229954277305,
    },
    target: {
      x
      : 
      1167.653193244467,
      y
      : 
      -192.79745736202545,
      z
      : 
      -1384.5922421716277,
    },
  },
  connectivity_present: {
    position: {
      x: 1891.6725139583014,
      y: 1492.4722514889793,
      z: 787.0325111973762,
    },
    target: {
      x: 906.2004230592254,
      y: -301.239367485342,
      z: -1314.7525021354181,
    },
  },
};

const CameraAnimations = ({ cameraControlRef }) => {
  const disableAutoRotate = useRef(false);
  const rotationOffset = useRef(0);
  const lastTime = useRef(0);
  const { selectedPath, selectedCategory } = usePaths();
  
  // Parallax state
  const mouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });
  const { gl } = useThree();

  // Parallax settings - adjust these to your liking
  const PARALLAX_STRENGTH = 35; // How much the camera moves (in world units)
  const PARALLAX_SMOOTHING = 0.05; // Lower = smoother/slower (0.01-0.1 range)

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (event) => {
      // Normalize mouse position to -1 to 1 range
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const canvas = gl.domElement;
    canvas.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl]);

  const goToPosition = (px, py, pz, tx, ty, tz) => {
    if (!cameraControlRef.current) return;
    const cam = cameraControlRef.current;
    cam.smoothTime = 1.2;
    cam.setLookAt(px, py, pz, tx, ty, tz, true);
  };

  const resetPosition = () => {
    const x = -1844.5376947483708;
    const y = 563.2002337610148;
    const z = 881.884785452135;

    const tx = 13.893999128697848;
    const ty = -92.36630585124054;
    const tz = 112.90388205168148;

    goToPosition(x, y, z, tx, ty, tz);
  };

  useEffect(() => {
    const cameraData = selectedPath
      ? pathData[selectedCategory].find((path) => path.name === selectedPath)
      : categorycamera[selectedCategory];

    if (cameraData) {
      const { x: px, y: py, z: pz } = cameraData.position;
      const { x: tx, y: ty, z: tz } = cameraData.target;

      if (cameraControlRef.current) {
        rotationOffset.current = cameraControlRef.current.azimuthAngle;
      }

      goToPosition(px, py, pz, tx, ty, tz);
    } else {
      if (cameraControlRef.current) {
        rotationOffset.current = cameraControlRef.current.azimuthAngle;
        lastTime.current = 0;
      }
      resetPosition();
    }
  }, [selectedCategory, selectedPath]);

  useFrame((state, delta) => {
    if (!cameraControlRef.current) return;

    const cam = cameraControlRef.current;

    // Smoothly interpolate mouse position (lerp)
    smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * PARALLAX_SMOOTHING;
    smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * PARALLAX_SMOOTHING;

    // Apply parallax offset to the camera's focal offset
    // This moves what the camera is looking at slightly based on mouse position
    cam.setFocalOffset(
      smoothMouse.current.x * PARALLAX_STRENGTH,
      -smoothMouse.current.y * PARALLAX_STRENGTH,
      0,
      false // Don't animate, we're doing smooth lerp ourselves
    );

    // Auto-rotate logic (only when no category/path selected)
    if (!selectedCategory && !selectedPath && !disableAutoRotate.current) {
      const rotationSpeed = 0.1;
      lastTime.current += delta;
      const rotation = lastTime.current * rotationSpeed;
      cam.azimuthAngle = (rotationOffset.current - rotation) % (Math.PI * 2);
    }

    cam.update(delta);
  });

  return null;
};

export default CameraAnimations;
import React, { useEffect, useRef } from "react";
import { AdaptiveDpr, CameraControls, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import City from "./City";
import { Birds } from "./Birds";
import Effects from "./Effects";
import CameraAnimations from "./CameraAnimations";
import { useSceneReady } from "./SceneReadyContext";
import { button, useControls } from "leva";

const Scene = () => {
  const cameraControlRef = useRef();
  const disableAutoRotate = useRef(false);
  const targetMouse = useRef({ x: 0, y: 0 });

  //  if you want to log camera positions
  // useControls({
  //   "Log Camera Pos/Target": button(
  //     () => {
  //       if (!cameraControlRef.current) return;

  //       const pos = cameraControlRef.current.getPosition();
  //       const target = cameraControlRef.current.getTarget();

  //       console.log("📌 Camera Position:", pos);
  //       console.log("🎯 Camera Target:", target);
  //     },
  //     { collapsed: true }
  //   ),
  // });

  // const {posx, posz} = useControls({
  //   posx:{
  //     value:390,
  //     min: -1000,
  //     max: 2000
  //   },
  //   posz:{
  //     value:1830,
  //     min: -1000,
  //     max: 2000
  //   }
  // })
  
  // ✅ Scene ready signal
  const { setSceneReady } = useSceneReady();
  const frameCount = useRef(0);
  const hasSignaledReady = useRef(false);

  // ✅ Wait for a few frames before signaling ready
  useFrame(() => {
    if (!hasSignaledReady.current) {
      frameCount.current++;
      // Wait for 10 frames to ensure everything is rendered
      if (frameCount.current >= 10) {
        hasSignaledReady.current = true;
        setSceneReady(true);
      }
    }
  });

  // ✅ Track mouse movement for parallax
  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      targetMouse.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ✅ Smooth camera fly on load
  useEffect(() => {
    if (!cameraControlRef.current) return;

    const cam = cameraControlRef.current;

    const x = -1844.5376947483708;
    const y = 563.2002337610148;
    const z = 881.884785452135;

    const tx = 13.893999128697848;
    const ty = -92.36630585124054;
    const tz = 112.90388205168148;

    cam.setLookAt(
      cam.camera.position.x,
      cam.camera.position.y,
      cam.camera.position.z,
      tx,
      ty,
      tz,
      false
    );

    cam.setLookAt(x, y, z, tx, ty, tz, false);

    const onControlStart = () => {
      disableAutoRotate.current = true;
    };

    const onControlEnd = () => {
      disableAutoRotate.current = false;
    };

    cam.addEventListener("controlstart", onControlStart);
    cam.addEventListener("controlend", onControlEnd);

    return () => {
      cam.removeEventListener("controlstart", onControlStart);
      cam.removeEventListener("controlend", onControlEnd);
    };
  }, []);

  return (
    <>
      <CameraControls
        makeDefault
        ref={cameraControlRef}
        mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }}
        touches={{ one: 0, two: 0, three: 0 }}
      />
      <Html center position={[0, 270, 0]} distanceFactor={1900} zIndexRange={[999, 1000]} occlude={false}>
        {/* <div className="w-40 pointer-events-none drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
          <img className="w-full" src="images/Cliff-tower.png" />
        </div> */}

        <div className="w-40 pointer-events-none bg-gray-300 backdrop-blur-lg rounded-sm shadow-[0_0_50px_rgba(59,130,246,0.6)] ">
  <img className="w-full drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]" src="images/Cliff-tower.png" />
</div>
      </Html>
      <CameraAnimations cameraControlRef={cameraControlRef} />
      <City />
      <Effects />
      <directionalLight position={[0, 5, 0]} />
      <ambientLight />
      <Birds radius={1000} />
      <Birds position={[390, 0, 1830]} radius={800} />
      <AdaptiveDpr pixelated />
    </>
  );
};

export default Scene;
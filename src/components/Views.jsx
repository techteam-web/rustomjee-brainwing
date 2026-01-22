// Views.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

// Scene data from your Marzipano export
const APP_DATA = {
  scenes: [
    {
      id: "0-day",
      name: "Day",
      levels: [
        { tileSize: 256, size: 256, fallbackOnly: true },
        { tileSize: 512, size: 512 },
        { tileSize: 512, size: 1024 },
        { tileSize: 512, size: 2048 },
      ],
      faceSize: 2048,
      initialViewParameters: { pitch: 0, yaw: 0, fov: 1.5707963267948966 },
    },
    {
      id: "1-sunset",
      name: "Sunset",
      levels: [
        { tileSize: 256, size: 256, fallbackOnly: true },
        { tileSize: 512, size: 512 },
        { tileSize: 512, size: 1024 },
        { tileSize: 512, size: 2048 },
      ],
      faceSize: 2048,
      initialViewParameters: { pitch: 0, yaw: 0, fov: 1.5707963267948966 },
    },
  ],
};

const Views = () => {
  const navigate = useNavigate();
  const panoRef = useRef(null);
  const viewerRef = useRef(null);
  const scenesRef = useRef([]);
  const autorotateRef = useRef(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAutorotating, setIsAutorotating] = useState(true);

  // Refs for liquid animation
  const liquidRefs = useRef({});
  const iconRefs = useRef({});
  const textRefs = useRef({});

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/marzipano/marzipano.js";
    script.async = true;
    script.onload = initViewer;
    document.body.appendChild(script);

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Set initial active state for first scene
  useEffect(() => {
    if (isLoaded) {
      // Small delay to ensure refs are set
      setTimeout(() => {
        animateFill("0-day", true);
      }, 100);
    }
  }, [isLoaded]);

  const initViewer = () => {
    const Marzipano = window.Marzipano;
    if (!Marzipano || !panoRef.current) return;

    const viewer = new Marzipano.Viewer(panoRef.current, {
      controls: { mouseViewMode: "drag" },
    });
    viewerRef.current = viewer;

    const autorotate = Marzipano.autorotate({
      yawSpeed: 0.03,
      targetPitch: 0,
      targetFov: Math.PI / 2,
    });
    autorotateRef.current = autorotate;

    const scenes = APP_DATA.scenes.map((sceneData) => {
      const source = Marzipano.ImageUrlSource.fromString(
        `/marzipano/tiles/${sceneData.id}/{z}/{f}/{y}/{x}.jpg`,
        { cubeMapPreviewUrl: `/marzipano/tiles/${sceneData.id}/preview.jpg` }
      );

      const geometry = new Marzipano.CubeGeometry(sceneData.levels);
      const limiter = Marzipano.RectilinearView.limit.traditional(
        sceneData.faceSize,
        (100 * Math.PI) / 180,
        (120 * Math.PI) / 180
      );
      const view = new Marzipano.RectilinearView(
        sceneData.initialViewParameters,
        limiter
      );

      const scene = viewer.createScene({
        source,
        geometry,
        view,
        pinFirstLevel: true,
      });

      return { data: sceneData, scene, view };
    });

    scenesRef.current = scenes;
    scenes[0].scene.switchTo();
    setIsLoaded(true);
    startAutorotate();
  };

  const startAutorotate = () => {
    if (viewerRef.current && autorotateRef.current) {
      viewerRef.current.startMovement(autorotateRef.current);
      viewerRef.current.setIdleMovement(3000, autorotateRef.current);
    }
  };

  const stopAutorotate = () => {
    if (viewerRef.current) {
      viewerRef.current.stopMovement();
      viewerRef.current.setIdleMovement(Infinity);
    }
  };

  // Animate fill/unfill
  const animateFill = (id, fill) => {
    const liquid = liquidRefs.current[id];
    const icon = iconRefs.current[id];
    const text = textRefs.current[id];

    if (liquid) {
      gsap.killTweensOf(liquid);
      gsap.to(liquid, {
        scaleY: fill ? 1 : 0,
        duration: fill ? 0.6 : 0.4,
        ease: fill ? "elastic.out(1, 0.5)" : "power2.inOut",
      });
    }
    if (icon) {
      gsap.to(icon, {
        stroke: fill ? "#FFFFFF" : "#4A5568",
        duration: 0.3,
      });
    }
    if (text) {
      gsap.to(text, {
        color: fill ? "#FFFFFF" : "#4A5568",
        duration: 0.3,
      });
    }
  };

  // Hover handlers
  const handleMouseEnter = (id) => {
    animateFill(id, true);
  };

  const handleMouseLeave = (id) => {
    const isActiveScene = APP_DATA.scenes[currentScene]?.id === id;
    if (isActiveScene) return;
    animateFill(id, false);
  };

  const switchScene = (index) => {
    const scene = scenesRef.current[index];
    if (scene) {
      // Reset previous scene button
      const prevId = APP_DATA.scenes[currentScene]?.id;
      if (prevId && prevId !== APP_DATA.scenes[index]?.id) {
        animateFill(prevId, false);
      }

      // Fill new scene button
      const newId = APP_DATA.scenes[index]?.id;
      if (newId) {
        animateFill(newId, true);
      }

      stopAutorotate();
      scene.view.setParameters(scene.data.initialViewParameters);
      scene.scene.switchTo();
      setCurrentScene(index);
      if (isAutorotating) {
        startAutorotate();
      }
    }
  };

  const handleClose = () => {
    navigate("/home");
  };

  return (
    <div className="w-full h-screen relative bg-[#1a1a1a] font-futura-medium tracking-widest">
      {/* Close Button - Top Right */}
      <button
        onClick={handleClose}
        className="fixed top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 group"
        aria-label="Close and return to home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-[#ffffff] group-hover:text-white transition-colors duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Title - Top Left */}
      <div className="absolute top-6 left-6 z-50">
        <div className="bg-white px-4 py-2 rounded-md shadow-lg">
          <h1 className="text-[#4A5568] text-lg uppercase">
            360° View
          </h1>
        </div>
      </div>

      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-[#1a1a1a]">
          <div className="w-12 h-12 border-2 border-[#4A5568] border-t-white rounded-full animate-spin mb-4"></div>
          <div className="text-white/70 text-sm tracking-widest uppercase">
            Loading View...
          </div>
        </div>
      )}

      {/* Marzipano Panorama Container */}
      <div ref={panoRef} className="w-full h-full" />

      {/* Bottom Controls Bar */}
      {isLoaded && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="flex gap-1 bg-white p-1 rounded-md shadow-2xl text-[#4A5568]">
            {/* Day Button */}
            <button
              onClick={() => switchScene(0)}
              onMouseEnter={() => handleMouseEnter("0-day")}
              onMouseLeave={() => handleMouseLeave("0-day")}
              className="p-2 w-20 flex flex-col items-center justify-center gap-1 rounded-md relative overflow-hidden"
            >
              {/* Liquid Fill */}
              <div
                ref={(el) => (liquidRefs.current["0-day"] = el)}
                className="absolute inset-0 bg-[#4A5568] rounded-md origin-bottom"
                style={{ transform: "scaleY(0)" }}
              />
              {/* Content */}
              <svg
                ref={(el) => (iconRefs.current["0-day"] = el)}
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#4A5568"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
              <span
                ref={(el) => (textRefs.current["0-day"] = el)}
                className="text-sm text-center uppercase z-10"
                style={{ color: "#4A5568" }}
              >
                Day
              </span>
            </button>

            {/* Sunset Button */}
            <button
              onClick={() => switchScene(1)}
              onMouseEnter={() => handleMouseEnter("1-sunset")}
              onMouseLeave={() => handleMouseLeave("1-sunset")}
              className="p-2 w-20 flex flex-col items-center justify-center gap-1 rounded-md relative overflow-hidden"
            >
              {/* Liquid Fill */}
              <div
                ref={(el) => (liquidRefs.current["1-sunset"] = el)}
                className="absolute inset-0 bg-[#4A5568] rounded-md origin-bottom"
                style={{ transform: "scaleY(0)" }}
              />
              {/* Content */}
              <svg
                ref={(el) => (iconRefs.current["1-sunset"] = el)}
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#4A5568"
                strokeWidth={2}
              >
                <path d="M12 10V2M4.93 10.93l1.41 1.41M2 18h2M20 18h2M19.07 10.93l-1.41 1.41M22 22H2M16 18a4 4 0 1 0-8 0" />
              </svg>
              <span
                ref={(el) => (textRefs.current["1-sunset"] = el)}
                className="text-sm text-center uppercase z-10"
                style={{ color: "#4A5568" }}
              >
                Sunset
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Drag Hint - Bottom Left */}
      {isLoaded && (
        <div className="absolute bottom-8 left-6 z-50">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md flex items-center gap-2 text-[#4A5568] text-sm uppercase shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Drag to Explore
          </div>
        </div>
      )}
    </div>
  );
};

export default Views;
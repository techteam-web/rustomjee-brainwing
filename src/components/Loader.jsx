import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const Loader = ({ children, mediaSelectors = ["img", "video"] }) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    const mediaElements = mediaSelectors.flatMap((selector) =>
      Array.from(document.querySelectorAll(selector))
    );

    if (mediaElements.length === 0) {
      setProgress(100);
      setIsLoaded(true);
      return;
    }

    let loadedCount = 0;
    const total = mediaElements.length;

    const handleLoaded = () => {
      loadedCount++;
      const newProgress = Math.floor((loadedCount / total) * 100);
      setProgress(newProgress);
      if (loadedCount === total) {
        setIsLoaded(true);
      }
    };

    mediaElements.forEach((el) => {
      if (el.tagName === "IMG") {
        if (el.complete) {
          handleLoaded();
        } else {
          el.onload = handleLoaded;
          el.onerror = handleLoaded;
        }
      } else if (el.tagName === "VIDEO") {
        if (el.readyState >= 3) {
          handleLoaded();
        } else {
          el.oncanplaythrough = handleLoaded;
          el.onerror = handleLoaded;
        }
      }
    });
  }, [mediaSelectors]);

  // Animate loader out with GSAP
  useEffect(() => {
    if (isLoaded) {
      gsap.to(loaderRef.current, {
        y: "-100%",
        duration: 1.2,
        ease: "power3.inOut",
        onComplete: () => {
          loaderRef.current.style.display = "none";
        },
      });
    }
  }, [isLoaded]);

  return (
    <>
      {/* Loader Screen */}
      <div
        ref={loaderRef}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white"
      >
        <div className="text-center">
          <div className="mb-6 text-3xl font-semibold tracking-wide">
            Loading {progress}%
          </div>
          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="loader-spin mt-8"></div>
      </div>

      {/* Main Content */}
      <div
        className={`${
          !isLoaded ? "opacity-0" : "opacity-100"
        } transition-opacity duration-700`}
      >
        {children}
      </div>
    </>
  );
};

export default Loader;

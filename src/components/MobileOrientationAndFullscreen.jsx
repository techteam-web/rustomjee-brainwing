// components/OrientationLock.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";

// Device detection
const isMobile = () =>
  /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );

const isTablet = () => {
  const ua = navigator.userAgent;
  return /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua);
};

// Helper to check fullscreen status across browsers
const isInFullscreen = () => {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
};

// Check if fullscreen is supported
const isFullscreenSupported = () => {
  return !!(
    document.documentElement.requestFullscreen ||
    document.documentElement.webkitRequestFullscreen ||
    document.documentElement.mozRequestFullScreen ||
    document.documentElement.msRequestFullscreen
  );
};

const OrientationLock = ({ children, onReady }) => {
  const [isLandscape, setIsLandscape] = useState(
    () => window.innerWidth > window.innerHeight
  );
  const [isFullscreen, setIsFullscreen] = useState(isInFullscreen);
  const [showOverlay, setShowOverlay] = useState(true);
  const [deviceType, setDeviceType] = useState("desktop");
  const resizeTimer = useRef(null);
  const hasCalledReady = useRef(false);

  /* -------------------------------
     Device Detection
     ------------------------------- */
  useEffect(() => {
    if (isMobile() && !isTablet()) {
      setDeviceType("mobile");
    } else if (isTablet()) {
      setDeviceType("tablet");
    } else {
      setDeviceType("desktop");
    }
  }, []);

  /* -------------------------------
     Orientation Detection
     ------------------------------- */
  useEffect(() => {
    const updateOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    const onResize = () => {
      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(updateOrientation, 120);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", () => {
      setTimeout(updateOrientation, 100);
    });

    return () => {
      clearTimeout(resizeTimer.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", updateOrientation);
    };
  }, []);

  /* -------------------------------
     Fullscreen Detection
     ------------------------------- */
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(isInFullscreen());
    };

    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    document.addEventListener("mozfullscreenchange", handler);
    document.addEventListener("MSFullscreenChange", handler);

    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
      document.removeEventListener("mozfullscreenchange", handler);
      document.removeEventListener("MSFullscreenChange", handler);
    };
  }, []);

  /* -------------------------------
     Kiosk Protections
     ------------------------------- */
  useEffect(() => {
    const preventContext = (e) => e.preventDefault();
    document.addEventListener("contextmenu", preventContext);

    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    document.body.style.webkitTouchCallout = "none";

    return () => {
      document.removeEventListener("contextmenu", preventContext);
    };
  }, []);

  /* -------------------------------
     Core Enforcement Logic
     ------------------------------- */
  useEffect(() => {
    const fullscreenSupported = isFullscreenSupported();
    let conditionsMet = false;

    if (deviceType === "mobile" || deviceType === "tablet") {
      if (fullscreenSupported) {
        conditionsMet = isLandscape && isFullscreen;
      } else {
        conditionsMet = isLandscape;
      }
    } else {
      if (fullscreenSupported) {
        conditionsMet = isFullscreen;
      } else {
        conditionsMet = true;
      }
    }

    setShowOverlay(!conditionsMet);

    // Call onReady callback when conditions are met (only once)
    if (conditionsMet && !hasCalledReady.current) {
      hasCalledReady.current = true;
      onReady?.();
    }

    // Reset if user exits fullscreen
    if (!conditionsMet) {
      hasCalledReady.current = false;
    }
  }, [isLandscape, isFullscreen, deviceType, onReady]);

  /* -------------------------------
     Fullscreen Request
     ------------------------------- */
  const requestFullscreen = useCallback(() => {
    const el = document.documentElement;

    const request =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;

    if (request) {
      request.call(el).catch((err) => {
        console.warn("Fullscreen request failed:", err);
      });
    }
  }, []);

  // Overlay styles (now using viewport units, no scaling)
  const overlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "#000",
    zIndex: 99999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    textAlign: "center",
    cursor: "pointer",
  };

  return (
    <>
      {/* App Content - renders at native resolution */}
      {!showOverlay && children}

      {/* Fullscreen Guard Overlay */}
      {showOverlay && (
        <div style={overlayStyles} onClick={requestFullscreen}>
          {/* Mobile/Tablet: Rotate message */}
          {(deviceType === "mobile" || deviceType === "tablet") && !isLandscape && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "80px",
                  height: "40px",
                  border: "4px solid rgba(255,255,255,0.7)",
                  borderRadius: "12px",
                  transform: "rotate(90deg)",
                }}
              />
              <p style={{ fontSize: "20px", fontWeight: "600" }}>
                Rotate your device to <span style={{ color: "#60a5fa" }}>landscape</span>
              </p>
            </div>
          )}

          {/* Fullscreen prompt */}
          {(deviceType === "desktop" ||
            ((deviceType === "mobile" || deviceType === "tablet") && isLandscape)) &&
            !isFullscreen && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
                <img
                  src="/images/logo.svg"
                  alt="Logo"
                  style={{ height: "56px", opacity: 0.8, marginBottom: "16px" }}
                />

                <p style={{ fontSize: "24px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Click anywhere to enter
                </p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px" }}>
                  Fullscreen mode required for best experience
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    requestFullscreen();
                  }}
                  style={{
                    marginTop: "16px",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    padding: "16px 40px",
                    borderRadius: "12px",
                    color: "white",
                    fontSize: "16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <svg style={{ width: "24px", height: "24px" }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                  Enter Fullscreen
                </button>

                {deviceType === "desktop" && (
                  <p style={{ marginTop: "24px", color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
                    Press F11 or click the button above
                  </p>
                )}
              </div>
            )}
        </div>
      )}
    </>
  );
};

export default OrientationLock;
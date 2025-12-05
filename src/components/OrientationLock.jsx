import { useEffect } from "react";

const OrientationLock = () => {
  useEffect(() => {
    const handleOrientation = () => {
      // Get current orientation
      const isLandscape = window.matchMedia("(orientation: landscape)").matches;

      // Optional: show a notice if user is in portrait
      if (!isLandscape) {
        document.getElementById("orientation-warning")?.classList.remove("hidden");
      } else {
        document.getElementById("orientation-warning")?.classList.add("hidden");
      }
    };

    // Listen for orientation change
    window.addEventListener("orientationchange", () => {
      // Delay lets browser stabilize layout before re-check
      setTimeout(handleOrientation, 200);
    });

    handleOrientation(); // initial check

    return () => {
      window.removeEventListener("orientationchange", handleOrientation);
    };
  }, []);

  return (
    <div
      id="orientation-warning"
      className="hidden fixed inset-0 z-[9999] bg-black bg-opacity-90 flex flex-col items-center justify-center text-white text-center p-8"
    >
      <h1 className="text-2xl font-bold mb-4">Please rotate your device</h1>
      <p className="text-base">This experience is best viewed in landscape mode.</p>
    </div>
  );
};

export default OrientationLock;

// Views.jsx (or Views360.jsx)
import { useNavigate } from "react-router-dom";

const Views = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/home");
  };

  return (
    <div className="w-full h-screen relative">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-20 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 group cursor-pointer"
        aria-label="Close and return to home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white group-hover:scale-110 transition-transform"
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

      {/* 360 View iframe */}
      <iframe
        src="https://view.pixeldo.com/RustomjeeCliffTower/"
        className="w-full h-full border-none"
        title="360 View"
        allowFullScreen
      />
    </div>
  );
};

export default Views;
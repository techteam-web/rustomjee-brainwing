import React from "react";

const FloorPlanIcon = ({ size, className, title, onClick }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-floor-plan-icon lucide-floor-plan ${className || ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {title && <title>{title}</title>}
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
      <path d="M9 3v7" />
      <path d="M21 10h-7" />
      <path d="M3 15h9" />
    </svg>
  );
};

export { FloorPlanIcon };

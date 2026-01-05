// RadarViewIndicator.jsx
import { useEffect, useRef } from "react";
import gsap from "gsap";

// Direction mapping for balcony points - customize angles for each floor type
// Angles: 0=South, 45=Southwest, 90=West, 135=Northwest, 180=North, 225=Northeast, 270=East, 315=Southeast
const DIRECTION_MAP = {
  // For 1st floor - 4 points
  "1st": {
    1: 179,      // Point 1 direction
    2: 137,    // Point 2 direction
    3: 90,    // Point 3 direction
    4: 55,     // Point 4 direction
  },
  // For 2nd and 9th floors - 2 points
  "2nd-9th": {
    1: 179,    // Point 1 direction
    2: 125,    // Point 2 direction
  },
  // For 16th floor - 2 points
  "16th": {
    1: 179,    // Point 1 direction
    2: 125,    // Point 2 direction
  },
  // For multiple floors (3-8, 10-15, 17) - 4 points
  "multiple": {
    1: 179,      // Point 1 direction
    2: 137,    // Point 2 direction
    3: 90,    // Point 3 direction
    4: 55,     // Point 4 direction
  },
  "18th": {
    1: 179,      // Point 1 direction
    2: 137,    // Point 2 direction
    3: 75,    // Point 3 direction
    4: 65,     // Point 4 direction
  },
  "19th": {
    1: 179,      // Point 1 direction
    2: 137,    // Point 2 direction
    3: 110,    // Point 3 direction
    4: 65,     // Point 4 direction
  },
  "20th": {
    1: 179,      // Point 1 direction
    2: 137,    // Point 2 direction
    3: 110,    // Point 3 direction
    4: 65,    // Point 4 direction
  },
};

// Position configuration for radar on each floor type's unit plan image
// Using percentage-based width like Unit Plan SVG overlays for consistent scaling
// top/left are percentage positions, width is percentage of parent container
export const RADAR_POSITION_CONFIG = {
  "1st": {
    top: "48%",
    left: "84%",
    width: "75%",  // Percentage width like unit plan SVGs
  },
  "2nd-9th": {
    top: "46%",
    left: "61%",
    width: "60%",
  },
  "16th": {
    top: "43%",
    left: "64%",
    width: "40%",
  },
  "multiple": {
    top: "56%",
    left: "84%",
    width: "75%",
  },
  "18th": {
    top: "56%",
    left: "63.6%",
    width: "75%",
  },
  "19th": {
    top: "56%",
    left: "64%",
    width: "75%",
  },
  "20th": {
    top: "56%",
    left: "64%",
    width: "75%",
  },
};

// Get rotation angle based on point and floor type
const getRotationAngle = (point, floorType) => {
  const mapping = DIRECTION_MAP[floorType] || DIRECTION_MAP["multiple"];
  return mapping[point] || 0;
};

// Get position config based on floor type
export const getRadarPositionConfig = (floorType) => {
  return RADAR_POSITION_CONFIG[floorType] || RADAR_POSITION_CONFIG["multiple"];
};

export default function RadarViewIndicator({ 
  currentPoint = 1, 
  floorType = "multiple",
  className = ""
}) {
  const radarRef = useRef(null);
  const prevPointRef = useRef(currentPoint);
  const prevFloorTypeRef = useRef(floorType);

  // Get the position config for this floor type
  const positionConfig = getRadarPositionConfig(floorType);

  // Animate entire radar rotation when point changes
  useEffect(() => {
    if (radarRef.current) {
      const targetAngle = getRotationAngle(currentPoint, floorType);
      const prevAngle = getRotationAngle(prevPointRef.current, prevFloorTypeRef.current);
      
      // Calculate the shortest rotation path
      let angleDiff = targetAngle - prevAngle;
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;
      
      // Get current rotation and add the difference
      const currentRotation = gsap.getProperty(radarRef.current, "rotation") || prevAngle;
      const newRotation = currentRotation + angleDiff;

      gsap.to(radarRef.current, {
        rotation: newRotation,
        duration: 0.6,
        ease: "power2.inOut",
        transformOrigin: "center center"
      });

      prevPointRef.current = currentPoint;
      prevFloorTypeRef.current = floorType;
    }
  }, [currentPoint, floorType]);

  // Initial animation on mount
  useEffect(() => {
    if (radarRef.current) {
      const initialAngle = getRotationAngle(currentPoint, floorType);
      gsap.set(radarRef.current, { rotation: initialAngle });
      
      // Pulse animation on mount
      gsap.fromTo(radarRef.current, 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, []);

  return (
    <svg 
      ref={radarRef}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 400 400"
      className={`absolute pointer-events-none ${className}`}
      style={{
        top: positionConfig.top,
        left: positionConfig.left,
        width: positionConfig.width,
        height: "auto",
        transform: "translate(-50%, -50%)",
        overflow: "visible",
        zIndex: 15,
      }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Gradient for the cone spreading effect */}
        <linearGradient id="coneGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#C4A35A" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="#C4A35A" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#C4A35A" stopOpacity="0.1"/>
        </linearGradient>
        
        {/* Gradient for radar scan lines */}
        <linearGradient id="scanLineGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#C4A35A" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#C4A35A" stopOpacity="0"/>
        </linearGradient>
      </defs>
      
      {/* CONE RADAR - rotates as one unit */}
      
      {/* Main cone shape */}
      <path 
        d="M 200 200 Q 200 280 120 380 L 280 380 Q 200 280 200 200 Z"
        fill="url(#coneGradient)" 
        stroke="none"
      />
      
      {/* Radar arc lines */}
      <path d="M 170 250 Q 200 250 230 250" fill="none" stroke="#C4A35A" strokeWidth="1" strokeOpacity="0.3"/>
      <path d="M 150 300 Q 200 300 250 300" fill="none" stroke="#C4A35A" strokeWidth="1" strokeOpacity="0.25"/>
      <path d="M 130 350 Q 200 350 270 350" fill="none" stroke="#C4A35A" strokeWidth="1" strokeOpacity="0.2"/>
      
      {/* Scan line rays */}
      <line x1="200" y1="200" x2="130" y2="380" stroke="url(#scanLineGradient)" strokeWidth="0.5"/>
      <line x1="200" y1="200" x2="165" y2="380" stroke="url(#scanLineGradient)" strokeWidth="0.5"/>
      <line x1="200" y1="200" x2="200" y2="380" stroke="url(#scanLineGradient)" strokeWidth="0.5"/>
      <line x1="200" y1="200" x2="235" y2="380" stroke="url(#scanLineGradient)" strokeWidth="0.5"/>
      <line x1="200" y1="200" x2="270" y2="380" stroke="url(#scanLineGradient)" strokeWidth="0.5"/>
      
      {/* Outer cone edge lines */}
      <line x1="200" y1="200" x2="120" y2="380" stroke="#C4A35A" strokeWidth="1.5" strokeOpacity="0.6"/>
      <line x1="200" y1="200" x2="280" y2="380" stroke="#C4A35A" strokeWidth="1.5" strokeOpacity="0.6"/>
      
      {/* Dashed arc */}
      <ellipse cx="200" cy="340" rx="50" ry="15" fill="none" stroke="#C4A35A" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="5,5"/>
      
      {/* Center point indicator (small dot where cone originates) */}
      <circle cx="200" cy="200" r="4" fill="#C4A35A" fillOpacity="0.8"/>
    </svg>
  );
}
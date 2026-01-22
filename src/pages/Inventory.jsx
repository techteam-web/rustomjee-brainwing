// Inventory.jsx
import { useState, useRef, useCallback, useEffect } from "react";
import { data } from "../constants/data";
import FloorComparisonPanel from "../components/FloorComparisonPanel";
import NavigationBar from "../components/Nav";
import Loader from "../components/Loader";
import OrientationLock from "../components/OrientationLock";

export default function Inventory() {
  const [layers] = useState(data);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [hoveredLayer, setHoveredLayer] = useState(null);
  const [floorCentroids, setFloorCentroids] = useState({});
  const [showComparison, setShowComparison] = useState(false);
  const [lockedFloor, setLockedFloor] = useState(null);
  const svgRef = useRef(null);

  // Calculate centroid of each floor path
  useEffect(() => {
    const centroids = {};
    
    layers.forEach(layer => {
      if (layer.d && layer.floor_number) {
        // Parse the path data to get coordinates
        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("d", layer.d);
        
        try {
          const bbox = pathElement.getBBox();
          centroids[layer.path_id] = {
            x: bbox.x + bbox.width / 2,
            y: bbox.y + bbox.height / 2,
            floorNumber: layer.floor_number
          };
        } catch (e) {
          console.warn(`Could not calculate centroid for ${layer.path_id}`);
        }
      }
    });
    
    setFloorCentroids(centroids);
  }, [layers]);

  const getClassColor = useCallback((layer) => {
    const classColors = {
      'cls-1': 'rgba(29, 41, 56, 0.60)',
      'cls-2': 'rgba(29, 41, 56, 0.60)',
      'cls-3': 'rgba(29, 41, 56, 0.60)',
      'cls-4': '#f3ea0b',
      'cls-5': '#f7ec13',
      'cls-6': '#f4ea11',
      'cls-7': 'rgba(181, 209, 141, 0.60)',
      'cls-8': '#3b4b9f',
      'cls-9': 'rgba(204, 256, 252, 0.60)',
    };
    return classColors[layer.class] || '#d0aa2d';
  }, []);

  const getFill = useCallback((layer) => {
    const active = selectedLayer === layer.path_id || hoveredLayer === layer.path_id;
    return active ? getClassColor(layer) : "rgba(0, 0, 0, 0.1)";
  }, [selectedLayer, hoveredLayer, getClassColor]);

  const getOpacity = useCallback((layer) => {
    const active = selectedLayer === layer.path_id || hoveredLayer === layer.path_id;
    return active ? 0.9 : 1;
  }, [selectedLayer, hoveredLayer]);

  const handleLayerMouseEnter = useCallback((pathId) => {
    setHoveredLayer(pathId);
  }, []);

  const handleLayerMouseLeave = useCallback(() => {
    setHoveredLayer(null);
  }, []);

  const handleLayerClick = useCallback((layer) => {
    if (['cls-1', 'cls-2', 'cls-3'].includes(layer.class)) {
      const floor = {
        id: layer.path_id,
        d: layer.d,
        floor_number: layer.floor_number,
        info: {
          bhk: layer.bhk || 'Duplex',
          floorNumber: layer.floor_number || 'XX',
          price: layer.price || 'XX Cr',
          area: layer.area || 'XXXX sq.ft',
          availability: layer.availability !== false
        }
      };
      
      setLockedFloor(floor);
      setShowComparison(true);
    }
    
    setSelectedLayer(prev => prev === layer.path_id ? null : layer.path_id);
  }, []);

  const closeComparison = useCallback(() => {
    setShowComparison(false);
    setLockedFloor(null);
  }, []);

  return (
    <>
    <OrientationLock />
    <Loader>
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#dedbd4] font-futura-medium">
      {/* Logo */}
      <div className="fixed top-4 right-10 z-40">
        <img 
          src="/images/logo.png" 
          alt="Logo" 
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-30 md:h-30 object-contain" 
        />
      </div>

      {/* Building SVG */}
      <div className="fixed inset-0 w-full h-full flex items-center justify-center">
        <svg
          ref={svgRef}
          viewBox="0 0 6826 3840"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          style={{ shapeRendering: 'optimizeSpeed', pointerEvents: 'auto' }}
        >
          <image
            href="/images/3.3.1.jpg"
            x="0"
            y="0"
            width="6826"
            height="3840"
            preserveAspectRatio="xMidYMid slice"
          />

          <g style={{ transform: 'translate(2050px, -10px) scale(0.85)' }}>
            {layers.map((layer) => (
              <path
                key={layer.path_id}
                id={layer.path_id}
                d={layer.d}
                fill={getFill(layer)}          
                stroke="none"
                strokeWidth="0"
                opacity={getOpacity(layer)}      
                style={{
                  cursor: 'pointer',
                  transition: 'opacity 120ms ease-out, fill 120ms ease-out',
                }}
                onMouseEnter={() => handleLayerMouseEnter(layer.path_id)}
                onMouseLeave={handleLayerMouseLeave}
                onClick={() => handleLayerClick(layer)}
              />
            ))}

            {/* Glowing Floor Numbers - Only show on hover */}
            {hoveredLayer && floorCentroids[hoveredLayer] && (
              <g>
                <text
                x={-100}
                y={1500}
                textAnchor="start"
                dominantBaseline="middle"
                className="floor-number-glow font-futura-medium "
                style={{
                  fontSize: '700px',
                  fontWeight: 'bold',
                  fill: 'rgba(0, 0, 20, 0.4)',
                  filter: '',
                  pointerEvents: 'none',
                  // opacity:0.5,
                  // fontFamily: 'Arial, sans-serif'
                }}
              >
                {floorCentroids[hoveredLayer].floorNumber}
              </text>
              </g>
            )}
          </g>

          {/* SVG Filter for Blue Glow Effect */}
          <defs>
            <filter id="blue-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
              <feFlood floodColor="#3b4b9f" floodOpacity="0.8"/>
              <feComposite in2="coloredBlur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode/>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      {showComparison && (
        <FloorComparisonPanel
          show={showComparison}
          onClose={closeComparison}
          floors={data}
          lockedFloor={lockedFloor}
        />
      )}
      <NavigationBar className="!opacity-100" />
    </div>
    </Loader>
    </>
  );
}
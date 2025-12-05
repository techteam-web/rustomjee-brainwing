// FloorComparisonPanel.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

export default function FloorComparisonPanel({ 
  show, 
  onClose, 
  floors, 
  lockedFloor = null 
}) {
  const [firstFloor, setFirstFloor] = useState(null);
  const [secondFloor, setSecondFloor] = useState(null);
  const [hoveredFloor, setHoveredFloor] = useState(null);
  const [firstFloorZoom, setFirstFloorZoom] = useState(1);
  const [secondFloorZoom, setSecondFloorZoom] = useState(1);
  const [firstFloorPan, setFirstFloorPan] = useState({ x: 0, y: 0 });
  const [secondFloorPan, setSecondFloorPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeDragFloor, setActiveDragFloor] = useState(null);
  const panelRef = useRef(null);
  const overlayRef = useRef(null);
  const svgRef = useRef(null);

  // Calculate pan limits based on zoom level
  const getPanLimits = (zoom) => {
    // The image can only pan as much as it extends beyond the container
    // At zoom 1, no panning allowed. At zoom 2, can pan up to 50% of container size, etc.
    const maxPanPercent = (zoom - 1) / zoom;
    // Using a base value of 600px for more drag distance
    const maxPan = maxPanPercent * 2800;
    return maxPan;
  };

  // Clamp pan values to limits
  const clampPan = (pan, zoom) => {
    const limit = getPanLimits(zoom);
    return {
      x: Math.max(-limit, Math.min(limit, pan.x)),
      y: Math.max(-limit, Math.min(limit, pan.y))
    };
  };

  // Zoom controls - smaller increment (10%)
  const zoomIn = (setZoom) => {
    setZoom(prev => Math.min(prev + 0.1, 5));
  };

  const zoomOut = (setZoom, setPan, currentZoom, currentPan) => {
    const newZoom = Math.max(currentZoom - 0.1, 0.5);
    setZoom(newZoom);
    // Reset pan if zooming back to 1 or below, otherwise clamp to new limits
    if (newZoom <= 1) {
      setPan({ x: 0, y: 0 });
    } else {
      // Clamp pan to new (smaller) limits
      const limit = getPanLimits(newZoom);
      setPan({
        x: Math.max(-limit, Math.min(limit, currentPan.x)),
        y: Math.max(-limit, Math.min(limit, currentPan.y))
      });
    }
  };

  const resetZoom = (setZoom, setPan) => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Drag/Pan handlers
  const handleMouseDown = (e, floorType) => {
    if ((floorType === 'first' && firstFloorZoom > 1) || (floorType === 'second' && secondFloorZoom > 1)) {
      setIsDragging(true);
      setActiveDragFloor(floorType);
      setDragStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  // Mouse wheel zoom handler
  const handleWheel = (e, floorType) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1; // Scroll down = zoom out, scroll up = zoom in
    
    if (floorType === 'first') {
      const newZoom = Math.max(0.5, Math.min(5, firstFloorZoom + zoomDelta));
      setFirstFloorZoom(newZoom);
      // Clamp pan to new limits or reset if zoom <= 1
      if (newZoom <= 1) {
        setFirstFloorPan({ x: 0, y: 0 });
      } else {
        setFirstFloorPan(prev => clampPan(prev, newZoom));
      }
    } else if (floorType === 'second') {
      const newZoom = Math.max(0.5, Math.min(5, secondFloorZoom + zoomDelta));
      setSecondFloorZoom(newZoom);
      // Clamp pan to new limits or reset if zoom <= 1
      if (newZoom <= 1) {
        setSecondFloorPan({ x: 0, y: 0 });
      } else {
        setSecondFloorPan(prev => clampPan(prev, newZoom));
      }
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !activeDragFloor) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    if (activeDragFloor === 'first') {
      setFirstFloorPan(prev => {
        const newPan = { x: prev.x + deltaX, y: prev.y + deltaY };
        return clampPan(newPan, firstFloorZoom);
      });
    } else if (activeDragFloor === 'second') {
      setSecondFloorPan(prev => {
        const newPan = { x: prev.x + deltaX, y: prev.y + deltaY };
        return clampPan(newPan, secondFloorZoom);
      });
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, activeDragFloor, dragStart, firstFloorZoom, secondFloorZoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setActiveDragFloor(null);
  }, []);

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Helper function to extract floor number from various data structures
  const extractFloorNumber = (floorData) => {
    if (!floorData) return null;
    return floorData.floor_number || 
           floorData.floorNumber || 
           floorData.info?.floorNumber || 
           floorData.info?.floor_number ||
           null;
  };

  // Get floor plan image based on floor number
  const getFloorPlanImage = useCallback((floorNumber) => {
    const floor = parseInt(floorNumber);
    
    // 2nd and 9th floor
    if (floor === 2 || floor === 9) {
      return '/floors-images/2ND-and-9TH.png';
    }
    
    // 16th floor
    if (floor === 16) {
      return '/floors-images/16th.png';
    }
    
    // 3rd to 8th, 10th to 15th, and 17th floor
    if ((floor >= 3 && floor <= 8) || (floor >= 10 && floor <= 15) || floor === 17) {
      return '/floors-images/multiple.png';
    }
    
    // Default fallback
    return '/floors-images/multiple.png';
  }, []);

  // Helper to check if two floors have different images (can be compared)
  const canCompareFloors = useCallback((floorNumber1, floorNumber2) => {
    if (!floorNumber1 || !floorNumber2) return true;
    return getFloorPlanImage(floorNumber1) !== getFloorPlanImage(floorNumber2);
  }, [getFloorPlanImage]);

  // Check if a floor is selectable (has different image than first floor)
  const isFloorSelectable = useCallback((floor) => {
    if (!firstFloor) return true;
    const firstFloorNumber = extractFloorNumber(firstFloor);
    const currentFloorNumber = floor.floor_number;
    return canCompareFloors(firstFloorNumber, currentFloorNumber);
  }, [firstFloor, canCompareFloors]);

  // Initialize first floor from lockedFloor prop
  useEffect(() => {
    if (show && lockedFloor) {
      const floorNum = extractFloorNumber(lockedFloor);
      
      const floorWithCorrectNumber = {
        ...lockedFloor,
        info: {
          ...lockedFloor.info,
          floorNumber: floorNum
        }
      };
      setFirstFloor(floorWithCorrectNumber);
      setSecondFloor(null);
      setFirstFloorZoom(1);
      setSecondFloorZoom(1);
      setFirstFloorPan({ x: 0, y: 0 });
      setSecondFloorPan({ x: 0, y: 0 });
    } else if (show && !lockedFloor) {
      setFirstFloor(null);
      setSecondFloor(null);
      setFirstFloorZoom(1);
      setSecondFloorZoom(1);
      setFirstFloorPan({ x: 0, y: 0 });
      setSecondFloorPan({ x: 0, y: 0 });
    }
  }, [show, lockedFloor]);

  // Entrance animation
  useEffect(() => {
    if (show && panelRef.current && overlayRef.current) {
      // Set initial states
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(panelRef.current, { x: '100%' });

      // Animate in
      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(panelRef.current, {
        x: '0%',
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.15");
    }
  }, [show]);

  const getClassColor = useCallback((floor) => {
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
    return classColors[floor.class] || '#d0aa2d';
  }, []);

  const handleFloorToggle = useCallback((floor) => {
    // Don't allow clicking on the first (locked) floor
    if (firstFloor && floor.path_id === firstFloor.id) {
      return;
    }

    // Don't allow selection if floor has same image as first floor
    if (!isFloorSelectable(floor)) {
      return;
    }

    const floorNum = floor.floor_number;
    
    const floorData = {
      id: floor.path_id,
      d: floor.d,
      info: {
        bhk: floor.bhk || 'Duplex',
        floorNumber: floorNum,
        price: floor.price || 'XX Cr',
        area: floor.area || 'XXXX sq.ft',
        availability: floor.availability !== false
      }
    };

    // If clicking on already selected second floor, deselect it
    if (secondFloor && secondFloor.id === floor.path_id) {
      setSecondFloor(null);
      setSecondFloorZoom(1);
      setSecondFloorPan({ x: 0, y: 0 });
    } else {
      // Set as second floor for comparison
      setSecondFloor(floorData);
      setSecondFloorZoom(1);
      setSecondFloorPan({ x: 0, y: 0 });
    }
    
    if ('vibrate' in navigator) navigator.vibrate(30);
  }, [firstFloor, secondFloor, isFloorSelectable]);

  const getFloorFillColor = useCallback((floor) => {
    const isSecondFloor = secondFloor && secondFloor.id === floor.path_id;
    const isHovered = hoveredFloor === floor.path_id;
    const isFirstFloor = firstFloor && firstFloor.id === floor.path_id;
    const selectable = isFloorSelectable(floor);

    if (isFirstFloor) {
      return "rgba(193, 154, 64, 0.8)";
    }

    if (isSecondFloor) {
      return "rgba(29, 41, 56, 0.8)";
    }

    // Non-selectable floors (same image type as first floor)
    if (firstFloor && !selectable) {
      return "rgba(0, 0, 0, 0.05)";
    }

    if (isHovered && selectable) {
      return "rgba(59, 130, 246, 0.7)";
    }

    // Selectable floors get highlighted color
    if (firstFloor && selectable) {
      return "rgba(59, 130, 246, 0.3)";
    }

    return getClassColor(floor);
  }, [firstFloor, secondFloor, hoveredFloor, getClassColor, isFloorSelectable]);

  const getFloorOpacity = useCallback((floor) => {
    const isSecondFloor = secondFloor && secondFloor.id === floor.path_id;
    const isHovered = hoveredFloor === floor.path_id;
    const isFirstFloor = firstFloor && firstFloor.id === floor.path_id;
    const selectable = isFloorSelectable(floor);
    
    if (isFirstFloor || isSecondFloor) {
      return 1;
    }
    
    if (isHovered && selectable) {
      return 1;
    }
    
    // Dim non-selectable floors
    if (firstFloor && !selectable) {
      return 0.3;
    }
    
    return 0.85;
  }, [firstFloor, secondFloor, hoveredFloor, isFloorSelectable]);

  // Exit animation
  const handleClose = () => {
    if (panelRef.current && overlayRef.current) {
      const tl = gsap.timeline({
        onComplete: onClose
      });
      
      tl.to(panelRef.current, {
        x: '100%',
        duration: 0.4,
        ease: "power3.in"
      })
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in"
      }, "-=0.2");
    } else {
      onClose();
    }
  };

  if (!show) return null;

  const hasFirstFloor = !!firstFloor;
  const hasSecondFloor = !!secondFloor;
  const hasBothFloors = hasFirstFloor && hasSecondFloor;

  return createPortal(
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div 
        ref={panelRef}
        className="bg-[#FFFBF5] w-full h-full overflow-hidden flex"
      >
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-[#C7BED6] hover:bg-[#B0A5C5] rounded-full transition-colors cursor-pointer"
        >
          <svg 
            className="w-6 h-6 text-white"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>

        {/* Left Panel - Floor Plan Comparison */}
        <div className="w-2/3 bg-white uppercase font-futura-medium overflow-y-auto left-panel">
          <div className="p-6 h-full flex flex-col">
            
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <div>
                <h3 className="text-3xl font-bold text-[#000000]">
                  {hasBothFloors ? (
                    <>Comparing Floor {firstFloor?.info.floorNumber} to {secondFloor?.info.floorNumber}</>
                  ) : hasFirstFloor ? (
                    <>Floor {firstFloor?.info.floorNumber}</>
                  ) : (
                    <>Floor Plan Comparison</>
                  )}
                </h3>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              {hasFirstFloor ? (
                <div className={`grid gap-6 h-full ${hasBothFloors ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {/* First Floor */}
                  <div className="bg-white rounded-lg shadow-sm relative overflow-hidden flex flex-col border-2" style={{ borderColor: '#C19A40' }}>
                    {/* Zoom Controls */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                      <button
                        onClick={() => zoomIn(setFirstFloorZoom)}
                        className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                        title="Zoom In"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => zoomOut(setFirstFloorZoom, setFirstFloorPan, firstFloorZoom, firstFloorPan)}
                        className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                        title="Zoom Out"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => resetZoom(setFirstFloorZoom, setFirstFloorPan)}
                        className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                        title="Reset Zoom"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                    {/* Zoom indicator */}
                    <div className="absolute bottom-3 left-3 z-10 bg-white/80 px-2 py-1 rounded text-xs text-gray-600">
                      {Math.round(firstFloorZoom * 100)}%
                    </div>
                    <div 
                      className="relative bg-white flex-1 min-h-0 overflow-hidden"
                      onMouseDown={(e) => handleMouseDown(e, 'first')}
                      onWheel={(e) => handleWheel(e, 'first')}
                      style={{ cursor: firstFloorZoom > 1 ? (isDragging && activeDragFloor === 'first' ? 'grabbing' : 'grab') : 'zoom-in' }}
                    >
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{ minHeight: '100%' }}
                      >
                        <img
                          src={getFloorPlanImage(firstFloor.info.floorNumber)}
                          alt={`Floor ${firstFloor.info.floorNumber} Plan`}
                          className="object-contain p-4 select-none"
                          draggable={false}
                          style={{ 
                            transform: `scale(${firstFloorZoom}) translate(${firstFloorPan.x / firstFloorZoom}px, ${firstFloorPan.y / firstFloorZoom}px)`,
                            transformOrigin: 'center center',
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Second Floor (if selected) */}
                  {hasSecondFloor && (
                    <div className="bg-white rounded-lg shadow-sm relative overflow-hidden flex flex-col border-2" style={{ borderColor: '#BDD1B1' }}>
                      {/* Zoom Controls */}
                      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                        <button
                          onClick={() => zoomIn(setSecondFloorZoom)}
                          className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                          title="Zoom In"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => zoomOut(setSecondFloorZoom, setSecondFloorPan, secondFloorZoom, secondFloorPan)}
                          className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                          title="Zoom Out"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => resetZoom(setSecondFloorZoom, setSecondFloorPan)}
                          className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                          title="Reset Zoom"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </div>
                      {/* Zoom indicator */}
                      <div className="absolute bottom-3 left-3 z-10 bg-white/80 px-2 py-1 rounded text-xs text-gray-600">
                        {Math.round(secondFloorZoom * 100)}%
                      </div>
                      <div 
                        className="relative bg-white flex-1 min-h-0 overflow-hidden"
                        onMouseDown={(e) => handleMouseDown(e, 'second')}
                        onWheel={(e) => handleWheel(e, 'second')}
                        style={{ cursor: secondFloorZoom > 1 ? (isDragging && activeDragFloor === 'second' ? 'grabbing' : 'grab') : 'zoom-in' }}
                      >
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ minHeight: '100%' }}
                        >
                          <img
                            src={getFloorPlanImage(secondFloor.info.floorNumber)}
                            alt={`Floor ${secondFloor.info.floorNumber} Plan`}
                            className="object-contain p-4 select-none"
                            draggable={false}
                            style={{ 
                              transform: `scale(${secondFloorZoom}) translate(${secondFloorPan.x / secondFloorZoom}px, ${secondFloorPan.y / secondFloorZoom}px)`,
                              transformOrigin: 'center center',
                              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center bg-[#E8F4FE] rounded-lg border-2 border-[#C4E0FD]">
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h4 className="text-xl font-semibold text-[#000000] mb-2">
                      {firstFloor ? 'Select a Floor to Compare' : 'Select Floors from Building'}
                    </h4>
                    <p className="text-[#3F3F41] max-w-md">
                      {firstFloor 
                        ? 'Click on a highlighted floor in the building view to compare different floor plans.'
                        : 'Use the building visualization to select floors for comparison.'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Building SVG */}
        <div className="w-1/3 p-6 flex flex-col right-panel">
          <div className="flex-1 flex items-stretch justify-stretch w-full h-full">
            <div className="relative w-full h-full overflow-hidden">
              <svg
                ref={svgRef}
                viewBox="0 0 6826 3840"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid slice"
                style={{ 
                  shapeRendering: 'optimizeSpeed', 
                  pointerEvents: 'auto',
                  objectFit: 'cover'
                }}
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
                  {floors.map((floor) => {
                    const isHovered = hoveredFloor === floor.path_id;
                    const isFirstFloorPath = firstFloor && firstFloor.id === floor.path_id;
                    const isSecondFloorPath = secondFloor && secondFloor.id === floor.path_id;
                    const selectable = isFloorSelectable(floor);
                    const canInteract = selectable || isFirstFloorPath;
                    
                    return (
                      <path
                        key={floor.path_id}
                        id={floor.path_id}
                        d={floor.d}
                        fill={getFloorFillColor(floor)}
                        stroke={(isHovered && canInteract) || isSecondFloorPath || isFirstFloorPath ? "#ffffff" : "none"}
                        strokeWidth={(isHovered && canInteract) || isSecondFloorPath || isFirstFloorPath ? "3" : "0"}
                        opacity={getFloorOpacity(floor)}
                        style={{
                          cursor: canInteract ? 'pointer' : 'not-allowed',
                          transition: 'opacity 150ms ease-out, fill 150ms ease-out, stroke 150ms ease-out',
                          filter: (isHovered && canInteract) ? 'brightness(1.1)' : 'none'
                        }}
                        onMouseEnter={() => canInteract && setHoveredFloor(floor.path_id)}
                        onMouseLeave={() => setHoveredFloor(null)}
                        onClick={() => handleFloorToggle(floor)}
                      />
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
import { forwardRef, useState } from 'react';
import { IoHomeOutline } from "react-icons/io5";
import { MdOutline360, MdOutlineInventory } from "react-icons/md";
import { GrGallery } from "react-icons/gr";
import { FloorPlanIcon } from "./Icons";
import { LuMapPin } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';

const NavigationBar = forwardRef(({ 
  className = "",
  iconSize = "text-xl xl:text-2xl",
  gap = "gap-5",
  padding = "p-2 py-2 xl:p-4",
  bgColor = "",
  textColor = "text-white",
  position = "absolute bottom-[0.3vw] left-1/2 -translate-x-1/2",
  showIcons = {
    home: true,
    inventory: true,
    view360: true,
    gallery: true,
    floorPlan: true,
    amenities: true,
    location: true
  }
}, ref) => {
  const navigate = useNavigate();
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleNavigation = (route, isExternal = false) => {
    if (isExternal) {
      window.open(route, '_blank');
    } else {
      navigate(route);
    }
  };

  const iconConfig = [
    { key: 'home', Icon: IoHomeOutline, label: 'Home', route: '/home', show: showIcons.home },
    { key: 'inventory', Icon: MdOutlineInventory, label: 'Features', route: '/features', show: showIcons.inventory },
    { 
      key: 'view360', 
      Icon: MdOutline360, 
      label: 'Views', 
      route: '/views', 
      show: showIcons.view360,
    },
    { key: 'gallery', Icon: GrGallery, label: 'Gallery', route: '/gallery', show: showIcons.gallery },
    { key: 'floorPlan', Icon: FloorPlanIcon, label: 'Floor Plan', route: '/floorplan', show: showIcons.floorPlan, isCustom: true },
    { key: 'map', Icon: LuMapPin, label: 'Map', route: '/map', show: showIcons.location }
  ];

  return (
    <div
      ref={ref}
      className={`${position} z-50 opacity-0 flex ${gap} xl:gap-15 xl:px-6 items-center ${padding} rounded-xs ${bgColor} ${textColor} ${className}`}
      style={{
        backdropFilter: "blur(7px)",
        backgroundColor: "rgba(255, 255, 255, 0.10)",
      }}
    >
      {iconConfig.map(({ key, Icon, label, route, show, isCustom, isExternal }) => (
        show && (
          <div
            key={key}
            className="relative flex flex-col items-center group"
            onMouseEnter={() => setHoveredIcon(key)}
            onMouseLeave={() => setHoveredIcon(null)}
            onClick={() => handleNavigation(route, isExternal)}
          >
            <Icon
              title={label}
              className={`${
                isCustom 
                  ? 'h-5 xl:h-7 hover:cursor-pointer' 
                  : `text-xl xl:text-2xl ${iconSize}`
              } hover:cursor-pointer transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-2`}
            />
            
            <span
              className={`absolute -bottom-3  whitespace-nowrap pb-1 text-sm font-futura-medium tracking-wider transition-all duration-200 ${
                hoveredIcon === key
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-1 pointer-events-none'
              }`}
              style={{ color: '#ffff' }}
            >
              {label}
            </span>
          </div>
        )
      ))}
    </div>
  );
});

NavigationBar.displayName = 'NavigationBar';

export default NavigationBar;
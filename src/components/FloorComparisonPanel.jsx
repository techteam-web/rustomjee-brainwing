// FloorComparisonPanel.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import RadarViewIndicator, {
  getRadarPositionConfig,
} from "./RadarViewIndicator";

// Unit Plan SVG Configuration for each floor type
// Each entry contains the SVG paths and their corresponding balcony view points
const UNIT_PLAN_SVG_CONFIG = {
  // For 1st floor - 4 SVG regions
  "1st": {
    totalPoints: 4,
    regions: [
      {
        id: "1st_floor_1st",
        point: 1,
        viewBox: "0 0 55.473228 49.194225",
        transform: "translate(-221.17132,-9.9018209)",
        path: "m 276.60621,9.9171724 -37.04355,-0.015351 -0.69083,0.2763296 -0.55266,0.429847 -0.4759,0.506605 -0.16887,0.291681 -0.19957,0.521956 -0.0768,0.583364 0.0307,15.581933 -1.96502,0.245629 -1.10532,0.184219 -1.79614,0.598715 -1.70403,0.782934 -0.99786,0.521956 -0.76758,0.491255 -0.98251,0.660119 -0.79829,0.62942 -0.87504,0.813636 -0.56801,0.568013 -0.81364,0.936451 -0.56801,0.721529 -0.53731,0.875043 -0.59872,0.967155 -0.52195,1.089967 -0.49125,1.136023 -0.4145,1.013211 -0.32238,1.105318 -0.42985,1.949662 v 3.208496 l 7.66843,-0.01236 -0.0543,12.516117 46.40625,-0.03256 -0.0593,-26.019037 1.51215,-0.0077 V 9.9094998 Z",
        position: { top: "8.0%", left: "77.6%", width: "13.28%" },
      },
      {
        id: "1st_floor_2nd",
        point: 2,
        viewBox: "0 0 38.279106 48.732872",
        transform: "translate(-182.65401,-54.316146)",
        path: "m 220.88289,54.319736 h -17.78092 l -20.37116,34.812003 -0.0768,0.107461 0.23028,0.153517 0.0307,0.107463 -0.004,13.54883 38.01514,-0.0108 0.007,-48.72207 z",
        position: { top: "20.3%", left: "68.5%", width: "9.2%" },
      },
      {
        id: "1st_floor_3rd",
        point: 3,
        viewBox: "0 0 41.011173 34.27026",
        transform: "translate(-150.30196,-147.40362)",
        path: "m 191.3023,147.66414 -41.00033,-0.26052 0.0368,33.66921 0.22369,0.004 v -1.83454 h 9.44408 l 0.0326,2.33389 v 0.0543 l 31.27401,0.0434 z",
        position: { top: "48.4%", left: "60.7%", width: "9.9%" },
      },
      {
        id: "1st_floor_4th",
        point: 4,
        viewBox: "0 0 42.778641 34.053108",
        transform: "translate(-117.95329,-205.57684)",
        path: "m 125.18289,205.59868 h -7.2296 l 0.0109,34.03125 42.76774,-0.006 -0.009,-34.0471 z",
        position: { top: "66%", left: "53%", width: "10.3%" },
      },
    ],
  },
  // For 2nd and 9th floors - 2 SVG regions
  "2nd-9th": {
    totalPoints: 2,
    regions: [
      {
        id: "2nd_9th_floor_1st",
        point: 1,
        viewBox: "0 0 110.47819 30.530424",
        transform: "translate(-101.0753,-19.669739)",
        path: "m 195.87237,19.669737 -79.07694,0.04179 -1.25884,0.153516 -2.17993,0.521957 -1.8729,0.644769 -1.10532,0.521957 -1.16673,0.675473 -0.64477,0.46055 -0.9518,0.675473 -0.76759,0.706176 -0.67547,0.64477 -1.01321,1.074616 -0.64477,0.798285 -0.79828,1.105321 -0.67548,1.19743 -0.52195,1.166725 -0.39915,0.997858 -0.41449,1.289539 -0.23027,0.951804 -0.12282,0.82899 -0.0921,0.491252 -0.10746,0.675473 -0.0768,2.425563 7.40131,-0.04041 -0.0597,12.521546 95.77056,-0.0163 V 37.66775 l 7.34303,0.01289 0.023,-2.325777 -0.18422,-1.281864 -0.22361,-1.23584 -0.52105,-1.628288 -0.83586,-2.073357 -0.53191,-0.922697 -0.74901,-1.161513 -1.09638,-1.378618 -1.28092,-1.346052 -1.2375,-1.096382 -1.5143,-1.031762 -2.25669,-1.212781 -2.71724,-0.890397 -1.71939,-0.322385 z",
        position: { top: "13.76%", left: "49.2%", width: "23.8%" },
      },
      {
        id: "2nd_9th_floor_2nd",
        point: 2,
        viewBox: "0 0 37.892307 48.012825",
        transform: "translate(-63.202785,-40.04507)",
        path: "M 100.97566,40.055921 H 83.194736 L 63.202785,74.179223 64.35,74.803618 v 13.254276 l 36.69079,-0.08684 0.0543,-47.925987 z",
        position: { top: "20%", left: "41.32%", width: "7.9%" },
      },
    ],
  },
  // For 16th floor - 2 SVG regions
  "16th": {
    totalPoints: 2,
    regions: [
      {
        id: "16th_floor_1st",
        point: 1,
        viewBox: "0 0 110.47819 30.530424",
        transform: "translate(-101.0753,-19.669739)",
        path: "m 195.87237,19.669737 -79.07694,0.04179 -1.25884,0.153516 -2.17993,0.521957 -1.8729,0.644769 -1.10532,0.521957 -1.16673,0.675473 -0.64477,0.46055 -0.9518,0.675473 -0.76759,0.706176 -0.67547,0.64477 -1.01321,1.074616 -0.64477,0.798285 -0.79828,1.105321 -0.67548,1.19743 -0.52195,1.166725 -0.39915,0.997858 -0.41449,1.289539 -0.23027,0.951804 -0.12282,0.82899 -0.0921,0.491252 -0.10746,0.675473 -0.0768,2.425563 7.40131,-0.04041 -0.0597,12.521546 95.77056,-0.0163 V 37.66775 l 7.34303,0.01289 0.023,-2.325777 -0.18422,-1.281864 -0.22361,-1.23584 -0.52105,-1.628288 -0.83586,-2.073357 -0.53191,-0.922697 -0.74901,-1.161513 -1.09638,-1.378618 -1.28092,-1.346052 -1.2375,-1.096382 -1.5143,-1.031762 -2.25669,-1.212781 -2.71724,-0.890397 -1.71939,-0.322385 z",
        position: { top: "14%", left: "53.8%", width: "20.5%" },
      },
      {
        id: "16th_floor_2nd",
        point: 2,
        viewBox: "0 0 37.892307 48.012825",
        transform: "translate(-63.202785,-40.04507)",
        path: "M 100.97566,40.055921 H 83.194736 L 63.202785,74.179223 64.35,74.803618 v 13.254276 l 36.69079,-0.08684 0.0543,-47.925987 z",
        position: { top: "20%", left: "46.79%", width: "7%" },
      },
    ],
  },
  // For multiple floors (3-8, 10-15, 17) - 4 SVG regions
  multiple: {
    totalPoints: 4,
    regions: [
      {
        id: "multiple_floor_1st",
        point: 1,
        viewBox: "0 0 55.515442 31.198036",
        transform: "translate(-221.03321,-32.04474)",
        path: "m 276.33157,32.131579 -39.25262,-0.08684 -3.36527,0.715706 -3.74581,1.627275 -3.07033,2.241344 -1.8422,1.934308 -0.85969,1.136023 -1.04392,1.719386 -0.79828,1.688682 -0.58337,1.596573 -0.30703,1.228132 -0.18422,0.951804 -0.15352,1.19743 -0.0921,0.767583 v 1.750089 0.122814 h 7.69119 l -0.0366,12.499166 47.86086,0.02172 -0.0109,-31.105758 z",
        position: { top: "13.7%", left: "77.62%", width: "13.27%" },
      },
      {
        id: "multiple_floor_2nd",
        point: 2,
        viewBox: "0 0 38.279106 48.732872",
        transform: "translate(-182.65401,-54.316146)",
        path: "m 220.88289,54.319736 h -17.78092 l -20.37116,34.812003 -0.0768,0.107461 0.23028,0.153517 0.0307,0.107463 -0.004,13.54883 38.01514,-0.0108 0.007,-48.72207 z",
        position: { top: "20.8%", left: "68.5%", width: "9.1%" },
      },
      {
        id: "multiple_floor_3rd",
        point: 3,
        viewBox: "0 0 41.011173 34.27026",
        transform: "translate(-150.30196,-147.40362)",
        path: "m 191.3023,147.66414 -41.00033,-0.26052 0.0368,33.66921 0.22369,0.004 v -1.83454 h 9.44408 l 0.0326,2.33389 v 0.0543 l 31.27401,0.0434 z",
        position: { top: "49.7%", left: "60.8%", width: "9.8%" },
      },
      {
        id: "multiple_floor_4th",
        point: 4,
        viewBox: "0 0 42.778641 34.053108",
        transform: "translate(-117.95329,-205.57684)",
        path: "m 125.18289,205.59868 h -7.2296 l 0.0109,34.03125 42.76774,-0.006 -0.009,-34.0471 z",
        position: { top: "67.72%", left: "53.02%", width: "10.3%" },
      },
    ],
  },
  // For 18th, 19th, 20th floors - no SVG regions (balcony views coming later)
  "18th": {
  totalPoints: 4,
  regions: [
    {
      id: "18th_1st",
      point: 1,
      viewBox: "0 0 121.71675 38.157799",
      transform: "translate(-161.16494,14.649136)",
      path: "m 274.79013,23.508662 -105.26656,-0.261208 -0.0653,-18.2192124 -8.29333,0.065302 0.0333,-2.0806005 0.10389,-0.9581388 0.1039,-0.6349114 0.11543,-0.53101677 0.0346,-0.35785914 0.0808,-0.41557836 0.0693,-0.35785914 0.0923,-0.3232276 0.0577,-0.28859609 0.0923,-0.2885961 0.0808,-0.3001399 0.11544,-0.2308769 0.0577,-0.2539645 0.0924,-0.2655084 0.0923,-0.219333 0.1039,-0.2077892 0.10389,-0.2424207 0.0577,-0.1616139 0.0808,-0.1731576 0.10389,-0.1731576 0.0577,-0.2655083 0.0808,-0.1616139 0.35786,-0.6118238 0.28859,-0.5541044 0.4733,-0.7849812 0.35786,-0.60028 0.68109,-0.9235075 1.45452,-1.6276817 1.06203,-1.0735776 1.316,-1.0851216 1.1313,-0.681087 1.45452,-0.854244 0.92351,-0.473297 1.24674,-0.496386 1.29291,-0.404034 1.37371,-0.323228 1.62768,-0.265508 2.04326,-0.09235 83.86603,0.08081 1.24673,-0.03463 0.87733,0.08081 1.52379,0.277053 1.44298,0.277052 0.98123,0.369403 1.14285,0.438666 1.48915,0.715718 1.09667,0.60028 1.17745,0.761894 0.73882,0.565648 1.50069,1.2929105 1.29292,1.396805 0.86579,1.1082091 0.93504,1.4545241 0.60029,1.1197529 0.62335,1.2698227 0.58875,1.7084887 0.36942,1.43143659 0.24241,1.47761191 0.21934,1.916278 -0.0116,1.5699626 -8.17303,-0.011544 z",
      // TODO: Adjust these position values based on where this region should appear on 18th.png
      position: { top: "14.8%", left: "52.2%", width: "21.85%" },
    },
    {
      id: "18th_2nd",
      point: 2,
      viewBox: "0 0 47.539764 51.818043",
      transform: "translate(-120.66147,-8.8310401)",
      path: "m 161.08331,8.8483992 -18.96128,-0.017359 -21.46056,37.2230808 0.049,14.594961 47.44178,-0.0653 0.049,-37.075119 -7.10157,-0.04898 z",
      // TODO: Adjust these position values based on where this region should appear on 18th.png
      position: { top: "21.2%", left: "45%", width: "8.56%" },
    },
    {
      id: "18th_3rd",
      point: 3,
      viewBox: "0 0 13.233574 36.166428",
      transform: "translate(-51.833337,-169.36015)",
      path: "m 65.061099,205.52658 -13.227764,-0.005 0.01633,-36.16089 7.65308,-5.3e-4 0.0058,3.13416 5.558362,-0.0173 z",
      // TODO: Adjust these position values based on where this region should appear on 18th.png
      position: { top: "64%", left: "32.73%", width: "2.45%" },
    },
    {
      id: "18th_4th",
      point: 4,
      viewBox: "0 0 12.303158 33.710907",
      transform: "translate(-36.781262,-205.52947)",
      path: "m 49.08442,239.24038 -12.303159,-0.007 0.01632,-33.70391 10.676851,0.0163 0.01632,3.16714 1.591731,-0.008 z",
      // TODO: Adjust these position values based on where this region should appear on 18th.png
      position: { top: "73.8%", left: "30%", width: "2.24%" },
    },
  ],
},
  // 19th floor config - copy this into your UNIT_PLAN_SVG_CONFIG

"19th": {
  totalPoints: 4,
  regions: [
    {
      id: "19th_1st",
      point: 1,
      viewBox: "0 0 121.71392 45.944496",
      transform: "translate(-108.40104,-1.985541)",
      path: "m 228.67199,47.930038 -117.2335,-0.01154 v -7.855815 h 5.19059 V 21.745512 h -8.22803 l 0.088,-2.236417 0.23087,-1.962453 0.48485,-2.054804 0.83115,-2.239506 0.99277,-1.847015 0.9466,-1.4545242 1.15438,-1.5468751 2.28568,-2.1471548 2.35495,-1.6392255 2.60891,-1.3390859 1.98554,-0.6233676 1.80084,-0.4155783 3.16301,-0.2539646 h 84.10844 l 2.53965,0.1847015 1.47761,0.3232276 1.29291,0.369403 1.98554,0.6926305 1.52379,0.7849814 1.80084,1.1082089 1.61614,1.2929105 1.98553,2.0317164 1.8932,2.7243472 0.71572,1.408349 0.66954,1.569962 0.64645,2.077892 0.32323,2.170243 0.20779,2.147154 v 0.946596 h -8.14995 v 18.285447 h 6.71851 z",
      // TODO: Adjust position values to match where this region appears on 19th.png
      position: { top: "14.8%", left: "52.2%", width: "21.85%" },
    },
    {
      id: "19th_2nd",
      point: 2,
      viewBox: "0 0 40.537605 53.194031",
      transform: "translate(-67.835992,-25.488807)",
      path: "M 108.35051,25.488806 H 89.349346 L 67.835993,62.751027 v 14.500371 h 20.358968 v 1.431438 H 108.3736 Z",
      // TODO: Adjust position values to match where this region appears on 19th.png
      position: { top: "21.2%", left: "45%", width: "7.3%" },
    },
    {
      id: "19th_3rd",
      point: 3,
      viewBox: "0 0 31.676308 13.615387",
      transform: "translate(-56.345498,-110.94788)",
      path: "m 88.021804,110.94788 v 13.61538 H 56.345499 v -13.60384 z",
      // TODO: Adjust position values to match where this region appears on 19th.png
      position: { top: "44%", left: "43%", width: "5.6%" },
    },
    {
      id: "19th_4th",
      point: 4,
      viewBox: "0 0 12.288028 32.080673",
      transform: "translate(14.279734,-223.80049)",
      path: "m -1.9917061,255.88117 v -30.65513 h -3.2977428 v -1.42555 h -8.9902851 v 32.08034 z",
      // TODO: Adjust position values to match where this region appears on 19th.png
      position: { top: "74.3%", left: "30.24%", width: "2.24%" },
    },
  ],
},
  // 20th floor config - copy this into your UNIT_PLAN_SVG_CONFIG

"20th": {
  totalPoints: 4,
  regions: [
    {
      id: "20th_1st",
      point: 1,
      viewBox: "0 0 59.551178 10.392628",
      transform: "translate(-111.09476,30.521934)",
      path: "m 170.64595,-20.202756 v -6.326115 l -0.0857,-0.555067 -0.26121,-0.767297 -0.57955,-1.036666 -0.36733,-0.342834 -0.33467,-0.285697 -0.43119,-0.301316 -0.63491,-0.288594 -0.62337,-0.253965 -0.57719,-0.138526 -0.68109,-0.0231 h -50.55078 l -1.01218,0.10759 -0.63669,0.228555 -0.8979,0.424463 -0.66934,0.604042 -0.35917,0.473437 -0.42446,0.571392 -0.2612,0.636693 -0.16326,0.701995 v 6.644462 z",
      // TODO: Adjust position values to match where this region appears on 20th.png
      position: { top: "24.3%", left: "57.8%", width: "10.7%" },
    },
    {
      id: "20th_2nd",
      point: 2,
      viewBox: "0 0 40.368641 53.211979",
      transform: "translate(-39.52612,42.129889)",
      path: "M 79.89476,-42.129889 V 11.082089 H 59.704758 V -4.5713618 H 39.52612 l 0.04617,-0.4155784 21.429897,-37.1176708 z",
      // TODO: Adjust position values to match where this region appears on 20th.png
      position: { top: "21.2%", left: "45%", width: "7.3%" },
    },
    {
      id: "20th_3rd",
      point: 3,
      viewBox: "0 0 40.34021 13.680737",
      transform: "translate(-27.932862,-43.262469)",
      path: "M 27.932861,43.327769 V 56.943204 H 68.273072 V 43.262467 Z",
      // TODO: Adjust position values to match where this region appears on 20th.png
      position: { top: "44%", left: "43%", width: "7.34%" },
    },
    {
      id: "20th_4th",
      point: 4,
      viewBox: "0 0 13.950108 33.663116",
      transform: "translate(44.405252,-154.60209)",
      path: "m -30.455145,188.2652 v -30.59939 h -3.299052 V 154.6021 H -44.40525 v 33.6631 z",
      // TODO: Adjust position values to match where this region appears on 20th.png
      position: { top: "74%", left: "30%", width: "2.46%" },
    },
  ],
},
};

// Single Unit Plan SVG Region Component
function UnitPlanSvgRegion({
  region,
  onRegionClick,
  isSelected = false,
  selectedPoint = null,
}) {
  const pathRef = useRef(null);

  const isThisRegionSelected = selectedPoint === region.point;

  const handleMouseEnter = () => {
    if (pathRef.current && !isThisRegionSelected) {
      gsap.to(pathRef.current, {
        fill: "rgba(76, 175, 80, 0.6)",
        stroke: "#4CAF50",
        strokeWidth: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (pathRef.current && !isThisRegionSelected) {
      gsap.to(pathRef.current, {
        fill: "rgba(76, 175, 80, 0.3)",
        stroke: "rgba(76, 175, 80, 0.5)",
        strokeWidth: 0.5,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();

    if (pathRef.current) {
      gsap.to(pathRef.current, {
        scale: 1.05,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        transformOrigin: "center center",
      });
    }

    onRegionClick?.(region.point);
  };

  useEffect(() => {
    if (pathRef.current) {
      gsap.to(pathRef.current, {
        fill: isThisRegionSelected
          ? "rgba(76, 175, 80, 0.7)"
          : "rgba(76, 175, 80, 0.3)",
        stroke: isThisRegionSelected ? "#2E7D32" : "rgba(76, 175, 80, 0.5)",
        strokeWidth: isThisRegionSelected ? 1.5 : 0.5,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isThisRegionSelected]);

  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        top: region.position.top,
        left: region.position.left,
        width: region.position.width,
        height: "auto",
        zIndex: 10,
      }}
      viewBox={region.viewBox}
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform={region.transform}>
        <path
          ref={pathRef}
          d={region.path}
          fill={
            isThisRegionSelected
              ? "rgba(76, 175, 80, 0.7)"
              : "rgba(76, 175, 80, 0.3)"
          }
          stroke={isThisRegionSelected ? "#2E7D32" : "rgba(76, 175, 80, 0.5)"}
          strokeWidth={isThisRegionSelected ? 1.5 : 0.5}
          style={{
            cursor: "pointer",
            pointerEvents: "auto",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      </g>
    </svg>
  );
}

// Unit Plan Overlay Component
function UnitPlanOverlay({
  floorType = "multiple",
  onRegionClick,
  selectedPoint = null,
}) {
  const config =
    UNIT_PLAN_SVG_CONFIG[floorType] || UNIT_PLAN_SVG_CONFIG["multiple"];

  return (
    <>
      {config.regions.map((region) => (
        <UnitPlanSvgRegion
          key={region.id}
          region={region}
          onRegionClick={onRegionClick}
          selectedPoint={selectedPoint}
        />
      ))}
    </>
  );
}

const getTotalBalconyPoints = (floorType) => {
  const config =
    UNIT_PLAN_SVG_CONFIG[floorType] || UNIT_PLAN_SVG_CONFIG["multiple"];
  return config.totalPoints;
};

// Balcony Point Tabs Component - RESPONSIVE: smaller on mobile, aligned right
function BalconyPointTabs({
  currentPoint,
  onPointChange,
  totalPoints,
  accentColor = "#C19A40",
  isInteractive = true,
}) {
  const tabsRef = useRef([]);
  const maxPoints = 4;

  const handleTabClick = (point) => {
    if (isInteractive && point <= totalPoints) {
      if (tabsRef.current[point - 1]) {
        gsap.to(tabsRef.current[point - 1], {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        });
      }
      onPointChange(point);
      if ("vibrate" in navigator) navigator.vibrate(20);
    }
  };

  return (
    <div className="absolute sm:top-0 right-0 z-30 flex justify-end sm:left-0 sm:right-0 sm:justify-center lg:top-10 xl:top-0">
      <div className="flex bg-white/90 backdrop-blur-sm rounded-bl-lg sm:rounded-b-lg shadow-md overflow-hidden">
        {Array.from({ length: maxPoints }, (_, i) => i + 1).map(
          (point, index) => {
            const isAvailable = point <= totalPoints;
            const isActive = point === currentPoint;
            const showAsActive = isActive && isAvailable;
            const showAsUnavailableActive = isActive && !isAvailable;

            return (
              <button
                key={point}
                ref={(el) => (tabsRef.current[index] = el)}
                onClick={() => handleTabClick(point)}
                disabled={!isInteractive || !isAvailable}
                className={`
                relative px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium transition-all duration-200
                ${
                  isInteractive && isAvailable
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                }
                ${
                  showAsActive
                    ? "text-white"
                    : showAsUnavailableActive
                    ? "text-white"
                    : isAvailable
                    ? isInteractive
                      ? "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      : "text-gray-500"
                    : "text-gray-300"
                }
              `}
                style={{
                  backgroundColor: showAsActive
                    ? accentColor
                    : showAsUnavailableActive
                    ? "#9CA3AF"
                    : "transparent",
                  minWidth: "28px",
                }}
                title={
                  !isInteractive
                    ? `Viewing Point ${point}`
                    : isAvailable
                    ? `View Point ${point}`
                    : `Point ${point} not available for this floor`
                }
              >
                <span className="relative z-10">{point}</span>
                {showAsActive && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: accentColor }}
                  />
                )}
                {!isAvailable && !showAsUnavailableActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 sm:w-6 h-px bg-gray-300 rotate-45" />
                  </div>
                )}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}
// Balcony View Carousel Component - RESPONSIVE
function BalconyViewCarousel({
  floorNumber,
  currentPoint,
  onPointChange,
  totalPoints = 4,
  accentColor = "#C19A40",
  isMaster = true,
  masterTotalPoints = 4,
}) {
  const imageRef = useRef(null);
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const [lastValidPoint, setLastValidPoint] = useState(1);

  useEffect(() => {
    if (currentPoint <= totalPoints) {
      setLastValidPoint(currentPoint);
    }
  }, [currentPoint, totalPoints]);

  const isViewAvailable = currentPoint <= totalPoints;

  const getBalconyViewImage = (floor, point) => {
    return `/balcony-views/Point ${point}/Floor ${floor}.webp`;
  };

  useEffect(() => {
    if (imageRef.current && isViewAvailable) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [currentPoint, isViewAvailable]);

  const handlePrevPoint = (e) => {
    e.stopPropagation();
    if (!isMaster) return;

    if (prevButtonRef.current) {
      gsap.to(prevButtonRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }

    const newPoint = currentPoint === 1 ? masterTotalPoints : currentPoint - 1;
    onPointChange(newPoint);
    if ("vibrate" in navigator) navigator.vibrate(20);
  };

  const handleNextPoint = (e) => {
    e.stopPropagation();
    if (!isMaster) return;

    if (nextButtonRef.current) {
      gsap.to(nextButtonRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }

    const newPoint = currentPoint === masterTotalPoints ? 1 : currentPoint + 1;
    onPointChange(newPoint);
    if ("vibrate" in navigator) navigator.vibrate(20);
  };

  return (
    <div className="relative w-full h-full">
      {/* Balcony Point Tabs - aligned right on mobile */}
      <BalconyPointTabs
        currentPoint={currentPoint}
        onPointChange={onPointChange}
        totalPoints={totalPoints}
        accentColor={accentColor}
        isInteractive={isMaster}
      />

      {/* Balcony View Image - smaller top padding on mobile */}
      <div
        ref={imageRef}
        className="relative inline-block w-full h-full pt-6 sm:pt-10"
      >
        {isViewAvailable ? (
          <img
            src={getBalconyViewImage(floorNumber, currentPoint)}
            alt={`Floor ${floorNumber} Balcony View - Point ${currentPoint}`}
            className="block select-none w-full h-full object-contain"
            draggable={false}
          />
        ) : (
          <div className="relative w-full h-full">
            <img
              src={getBalconyViewImage(floorNumber, lastValidPoint)}
              alt={`Floor ${floorNumber} - Last valid view`}
              className="block select-none w-full h-full object-contain filter blur-sm opacity-40"
              draggable={false}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black/20 via-black/30 to-black/20">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-6 sm:py-4 shadow-lg border border-gray-200 text-center max-w-xs">
                <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </div>
                <h4 className="text-gray-800 font-semibold text-xs sm:text-sm mb-1">
                  View Not Available
                </h4>
                <p className="text-gray-500 text-[10px] sm:text-xs">
                  Point {currentPoint} doesn't exist for Floor {floorNumber}
                </p>
                <p className="text-gray-400 text-[10px] sm:text-xs mt-1 sm:mt-2">
                  This floor only has {totalPoints} viewpoint
                  {totalPoints > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Arrows - smaller on mobile */}
      {isMaster && (
        <>
          <button
            ref={prevButtonRef}
            onClick={handlePrevPoint}
            className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-30 w-6 h-6 sm:w-8 sm:h-8 bg-[#FFFBF5]/80 hover:bg-[#FFFBF5] border border-[#C19A40]/30 rounded-full flex items-center justify-center cursor-pointer group"
            title="Previous viewpoint"
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-[#C19A40] group-hover:text-[#A37F2D]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            ref={nextButtonRef}
            onClick={handleNextPoint}
            className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-30 w-6 h-6 sm:w-8 sm:h-8 bg-[#FFFBF5]/80 hover:bg-[#FFFBF5] border border-[#C19A40]/30 rounded-full flex items-center justify-center cursor-pointer group"
            title="Next viewpoint"
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-[#C19A40] group-hover:text-[#A37F2D]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

// Plan Type Toggle Component - RESPONSIVE: smaller on mobile
function PlanTypeToggle({ isUnitPlan, onToggle, borderColor = "#C19A40" }) {
  const toggleRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (sliderRef.current) {
      gsap.to(sliderRef.current, {
        left: isUnitPlan ? "calc(100% - 18px)" : "2px",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isUnitPlan]);

  const handleToggle = () => {
    if (toggleRef.current) {
      gsap.to(toggleRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }
    onToggle();
    if ("vibrate" in navigator) navigator.vibrate(20);
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <span
        className={`text-[9px] sm:text-xs font-medium transition-colors uppercase ${
          !isUnitPlan ? "text-gray-800" : "text-gray-400"
        }`}
      >
        Floor Plan
      </span>
      <button
        ref={toggleRef}
        onClick={handleToggle}
        className="relative w-9 h-5 sm:w-14 sm:h-7 rounded-full cursor-pointer transition-colors"
        style={{
          backgroundColor: isUnitPlan ? borderColor : "#E5E7EB",
          border: `2px solid ${isUnitPlan ? borderColor : "#D1D5DB"}`,
        }}
        title={isUnitPlan ? "Switch to Floor Plan" : "Switch to Unit Plan"}
      >
        <div
          ref={sliderRef}
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 sm:w-5 sm:h-5 bg-white rounded-full shadow-md"
          style={{ left: isUnitPlan ? "calc(100% - 18px)" : "2px" }}
        />
      </button>
      <span
        className={`text-[9px] sm:text-xs font-medium transition-colors uppercase ${
          isUnitPlan ? "text-gray-800" : "text-gray-400"
        }`}
      >
        Unit Plan
      </span>
    </div>
  );
}
export default function FloorComparisonPanel({
  show,
  onClose,
  floors,
  lockedFloor = null,
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

  const [firstFloorViewMode, setFirstFloorViewMode] = useState("unitplan");
  const [secondFloorViewMode, setSecondFloorViewMode] = useState("unitplan");

  const [firstFloorBalconyPoint, setFirstFloorBalconyPoint] = useState(1);
  const [secondFloorBalconyPoint, setSecondFloorBalconyPoint] = useState(1);

  const [firstFloorSelectedPoint, setFirstFloorSelectedPoint] = useState(null);
  const [secondFloorSelectedPoint, setSecondFloorSelectedPoint] =
    useState(null);

  const [isRightPanelHidden, setIsRightPanelHidden] = useState(false);

  const [firstFloorIsUnitPlan, setFirstFloorIsUnitPlan] = useState(true);
  const [secondFloorIsUnitPlan, setSecondFloorIsUnitPlan] = useState(true);

  const panelRef = useRef(null);
  const overlayRef = useRef(null);
  const svgRef = useRef(null);

  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const toggleArrowRef = useRef(null);
  const headerRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const gridRef = useRef(null);

  const getFloorType = (floorNumber) => {
    const floor = parseInt(floorNumber);
    if (floor === 1) return "1st";
    if (floor === 2 || floor === 9) return "2nd-9th";
    if (floor === 16) return "16th";
    if (floor === 18) return "18th";
    if (floor === 19) return "19th";
    if (floor === 20) return "20th";
    return "multiple";
  };

  const isInBalconyViewMode = useCallback(() => {
    return (
      firstFloorViewMode === "balcony" || secondFloorViewMode === "balcony"
    );
  }, [firstFloorViewMode, secondFloorViewMode]);

  const handleFirstFloorRegionClick = (point) => {
    setFirstFloorSelectedPoint(point);
    setFirstFloorBalconyPoint(point);
    setFirstFloorViewMode("balcony");
    setFirstFloorZoom(1);
    setFirstFloorPan({ x: 0, y: 0 });

    if (secondFloor) {
      const secondFloorType = getFloorType(secondFloor.info.floorNumber);
      const secondFloorTotalPoints = getTotalBalconyPoints(secondFloorType);
      const secondPoint = point <= secondFloorTotalPoints ? point : 1;
      setSecondFloorSelectedPoint(secondPoint);
      setSecondFloorBalconyPoint(secondPoint);
      setSecondFloorViewMode("balcony");
      setSecondFloorZoom(1);
      setSecondFloorPan({ x: 0, y: 0 });
    }

    if ("vibrate" in navigator) navigator.vibrate(30);
  };

  const handleSecondFloorRegionClick = (point) => {
    setSecondFloorSelectedPoint(point);
    setSecondFloorBalconyPoint(point);
    setSecondFloorViewMode("balcony");
    setSecondFloorZoom(1);
    setSecondFloorPan({ x: 0, y: 0 });

    const firstFloorType = getFloorType(firstFloor.info.floorNumber);
    const firstFloorTotalPoints = getTotalBalconyPoints(firstFloorType);
    const firstPoint = point <= firstFloorTotalPoints ? point : 1;
    setFirstFloorSelectedPoint(firstPoint);
    setFirstFloorBalconyPoint(firstPoint);
    setFirstFloorViewMode("balcony");
    setFirstFloorZoom(1);
    setFirstFloorPan({ x: 0, y: 0 });

    if ("vibrate" in navigator) navigator.vibrate(30);
  };

  const handleUnitPlanThumbnailClick = () => {
    setFirstFloorSelectedPoint(null);
    setFirstFloorViewMode("unitplan");
    setFirstFloorIsUnitPlan(true);
    setFirstFloorZoom(1);
    setFirstFloorPan({ x: 0, y: 0 });

    if (secondFloor) {
      setSecondFloorSelectedPoint(null);
      setSecondFloorViewMode("unitplan");
      setSecondFloorIsUnitPlan(true);
      setSecondFloorZoom(1);
      setSecondFloorPan({ x: 0, y: 0 });
    }

    if ("vibrate" in navigator) navigator.vibrate(30);
  };

  const handleFirstFloorPlanToggle = () => {
    const newValue = !firstFloorIsUnitPlan;
    setFirstFloorIsUnitPlan(newValue);
    setFirstFloorViewMode(newValue ? "unitplan" : "floorplan");
    setFirstFloorZoom(1);
    setFirstFloorPan({ x: 0, y: 0 });
    if (secondFloor) {
      setSecondFloorIsUnitPlan(newValue);
      setSecondFloorViewMode(newValue ? "unitplan" : "floorplan");
      setSecondFloorZoom(1);
      setSecondFloorPan({ x: 0, y: 0 });
    }
  };

  const handleSecondFloorPlanToggle = () => {
    const newValue = !secondFloorIsUnitPlan;
    setSecondFloorIsUnitPlan(newValue);
    setSecondFloorViewMode(newValue ? "unitplan" : "floorplan");
    setSecondFloorZoom(1);
    setSecondFloorPan({ x: 0, y: 0 });
    setFirstFloorIsUnitPlan(newValue);
    setFirstFloorViewMode(newValue ? "unitplan" : "floorplan");
    setFirstFloorZoom(1);
    setFirstFloorPan({ x: 0, y: 0 });
  };

  const getPanLimits = (zoom) => {
    const maxPanPercent = (zoom - 1) / zoom;
    const maxPan = maxPanPercent * 2800;
    return maxPan;
  };

  const clampPan = (pan, zoom) => {
    const limit = getPanLimits(zoom);
    return {
      x: Math.max(-limit, Math.min(limit, pan.x)),
      y: Math.max(-limit, Math.min(limit, pan.y)),
    };
  };

  const zoomIn = (setZoom) => {
    setZoom((prev) => Math.min(prev + 0.1, 5));
  };

  const zoomOut = (setZoom, setPan, currentZoom, currentPan) => {
    const newZoom = Math.max(currentZoom - 0.1, 0.5);
    setZoom(newZoom);
    if (newZoom <= 1) {
      setPan({ x: 0, y: 0 });
    } else {
      const limit = getPanLimits(newZoom);
      setPan({
        x: Math.max(-limit, Math.min(limit, currentPan.x)),
        y: Math.max(-limit, Math.min(limit, currentPan.y)),
      });
    }
  };

  const resetZoom = (setZoom, setPan) => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e, floorType) => {
    if (floorType === "first") {
      if (firstFloorZoom > 1) {
        setIsDragging(true);
        setActiveDragFloor(floorType);
        setDragStart({ x: e.clientX, y: e.clientY });
        e.preventDefault();
      }
    } else if (floorType === "second") {
      if (secondFloorZoom > 1) {
        setIsDragging(true);
        setActiveDragFloor(floorType);
        setDragStart({ x: e.clientX, y: e.clientY });
        e.preventDefault();
      }
    }
  };

  const handleImageClick = (e, floorType) => {
    if (!isDragging) {
      if (floorType === "first" && firstFloorZoom <= 1) {
        setFirstFloorZoom((prev) => Math.min(prev + 0.3, 5));
      } else if (floorType === "second" && secondFloorZoom <= 1) {
        setSecondFloorZoom((prev) => Math.min(prev + 0.3, 5));
      }
    }
  };

  const handleWheel = (e, floorType) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;

    if (floorType === "first") {
      const newZoom = Math.max(0.5, Math.min(5, firstFloorZoom + zoomDelta));
      setFirstFloorZoom(newZoom);
      if (newZoom <= 1) {
        setFirstFloorPan({ x: 0, y: 0 });
      } else {
        setFirstFloorPan((prev) => clampPan(prev, newZoom));
      }
    } else if (floorType === "second") {
      const newZoom = Math.max(0.5, Math.min(5, secondFloorZoom + zoomDelta));
      setSecondFloorZoom(newZoom);
      if (newZoom <= 1) {
        setSecondFloorPan({ x: 0, y: 0 });
      } else {
        setSecondFloorPan((prev) => clampPan(prev, newZoom));
      }
    }
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !activeDragFloor) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      if (activeDragFloor === "first") {
        setFirstFloorPan((prev) => {
          const newPan = { x: prev.x + deltaX, y: prev.y + deltaY };
          return clampPan(newPan, firstFloorZoom);
        });
      } else if (activeDragFloor === "second") {
        setSecondFloorPan((prev) => {
          const newPan = { x: prev.x + deltaX, y: prev.y + deltaY };
          return clampPan(newPan, secondFloorZoom);
        });
      }

      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [isDragging, activeDragFloor, dragStart, firstFloorZoom, secondFloorZoom]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setActiveDragFloor(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const extractFloorNumber = (floorData) => {
    if (!floorData) return null;
    return (
      floorData.floor_number ||
      floorData.floorNumber ||
      floorData.info?.floorNumber ||
      floorData.info?.floor_number ||
      null
    );
  };

  const getFloorPlanImage = useCallback((floorNumber, isUnitPlan = false) => {
    const floor = parseInt(floorNumber);
    const suffix = isUnitPlan ? "_unit" : "";

    if (floor === 1) {
      return `/floors-images/1st${suffix}.png`;
    }

    if (floor === 2 || floor === 9) {
      return `/floors-images/2ND-and-9TH${suffix}.png`;
    }

    if (floor === 16) {
      return `/floors-images/16th${suffix}.png`;
    }
    if (floor === 18) {
      return `/floors-images/18th${suffix}.png`;
    }
    if (floor === 19) {
      return `/floors-images/19th${suffix}.png`;
    }
    if (floor === 20) {
      return `/floors-images/20th${suffix}.png`;
    }

    if (
      (floor >= 3 && floor <= 8) ||
      (floor >= 10 && floor <= 15) ||
      floor === 17
    ) {
      return `/floors-images/multiple${suffix}.png`;
    }

    return `/floors-images/multiple${suffix}.png`;
  }, []);

  const canCompareFloors = useCallback(
    (floorNumber1, floorNumber2) => {
      if (!floorNumber1 || !floorNumber2) return true;
      return (
        getFloorPlanImage(floorNumber1) !== getFloorPlanImage(floorNumber2)
      );
    },
    [getFloorPlanImage]
  );

  const isFloorSelectable = useCallback(
    (floor) => {
      if (!firstFloor) return true;
      if (isInBalconyViewMode()) return true;

      const firstFloorNumber = extractFloorNumber(firstFloor);
      const currentFloorNumber = floor.floor_number;
      return canCompareFloors(firstFloorNumber, currentFloorNumber);
    },
    [firstFloor, canCompareFloors, isInBalconyViewMode]
  );

  useEffect(() => {
    if (show && lockedFloor) {
      const floorNum = extractFloorNumber(lockedFloor);

      const floorWithCorrectNumber = {
        ...lockedFloor,
        info: {
          ...lockedFloor.info,
          floorNumber: floorNum,
        },
      };
      setFirstFloor(floorWithCorrectNumber);
      setSecondFloor(null);
      setFirstFloorZoom(1);
      setSecondFloorZoom(1);
      setFirstFloorPan({ x: 0, y: 0 });
      setSecondFloorPan({ x: 0, y: 0 });
      setFirstFloorViewMode("unitplan");
      setSecondFloorViewMode("unitplan");
      setFirstFloorBalconyPoint(1);
      setSecondFloorBalconyPoint(1);
      setFirstFloorSelectedPoint(null);
      setSecondFloorSelectedPoint(null);
      setFirstFloorIsUnitPlan(true);
      setSecondFloorIsUnitPlan(true);
    } else if (show && !lockedFloor) {
      setFirstFloor(null);
      setSecondFloor(null);
      setFirstFloorZoom(1);
      setSecondFloorZoom(1);
      setFirstFloorPan({ x: 0, y: 0 });
      setSecondFloorPan({ x: 0, y: 0 });
      setFirstFloorViewMode("unitplan");
      setSecondFloorViewMode("unitplan");
      setFirstFloorBalconyPoint(1);
      setSecondFloorBalconyPoint(1);
      setFirstFloorSelectedPoint(null);
      setSecondFloorSelectedPoint(null);
      setFirstFloorIsUnitPlan(true);
      setSecondFloorIsUnitPlan(true);
    }
  }, [show, lockedFloor]);

  useEffect(() => {
    if (show && panelRef.current && overlayRef.current) {
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(panelRef.current, { x: "100%" });

      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      }).to(
        panelRef.current,
        {
          x: "0%",
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.15"
      );
    }
  }, [show]);

  useEffect(() => {
    if (
      !leftPanelRef.current ||
      !rightPanelRef.current ||
      !toggleButtonRef.current
    )
      return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
    });

    if (isRightPanelHidden) {
      tl.to(leftPanelRef.current, { width: "100%", duration: 0.5 }, 0)
        .to(
          rightPanelRef.current,
          { width: "0%", opacity: 0, padding: 0, duration: 0.5 },
          0
        )
        .to(toggleButtonRef.current, { right: "8px", duration: 0.5 }, 0)
        .to(
          toggleArrowRef.current,
          { rotation: 180, duration: 0.4, ease: "back.out(1.7)" },
          0.1
        )
        .to(contentWrapperRef.current, { padding: "16px", duration: 0.4 }, 0)
        .to(headerRef.current, { fontSize: "1.5rem", duration: 0.4 }, 0)
        .to(gridRef.current, { gap: "16px", duration: 0.4 }, 0);
    } else {
      tl.to(leftPanelRef.current, { width: "66.666%", duration: 0.5 }, 0)
        .to(
          rightPanelRef.current,
          { width: "33.333%", opacity: 1, padding: "24px", duration: 0.5 },
          0
        )
        .to(
          toggleButtonRef.current,
          { right: "calc(33.333% - 12px)", duration: 0.5 },
          0
        )
        .to(
          toggleArrowRef.current,
          { rotation: 0, duration: 0.4, ease: "back.out(1.7)" },
          0.1
        )
        .to(contentWrapperRef.current, { padding: "24px", duration: 0.4 }, 0)
        .to(headerRef.current, { fontSize: "1.875rem", duration: 0.4 }, 0)
        .to(gridRef.current, { gap: "24px", duration: 0.4 }, 0);
    }
  }, [isRightPanelHidden]);

  const getClassColor = useCallback((floor) => {
    const classColors = {
      "cls-1": "rgba(29, 41, 56, 0.60)",
      "cls-2": "rgba(29, 41, 56, 0.60)",
      "cls-3": "rgba(29, 41, 56, 0.60)",
      "cls-4": "#f3ea0b",
      "cls-5": "#f7ec13",
      "cls-6": "#f4ea11",
      "cls-7": "rgba(181, 209, 141, 0.60)",
      "cls-8": "#3b4b9f",
      "cls-9": "rgba(204, 256, 252, 0.60)",
    };
    return classColors[floor.class] || "#d0aa2d";
  }, []);

  const handleFloorToggle = useCallback(
    (floor) => {
      if (firstFloor && floor.path_id === firstFloor.id) {
        return;
      }

      if (!isFloorSelectable(floor)) {
        return;
      }

      const floorNum = floor.floor_number;

      const floorData = {
        id: floor.path_id,
        d: floor.d,
        info: {
          bhk: floor.bhk || "Duplex",
          floorNumber: floorNum,
          price: floor.price || "XX Cr",
          area: floor.area || "XXXX sq.ft",
          availability: floor.availability !== false,
        },
      };

      const currentlyInBalconyMode = isInBalconyViewMode();

      if (secondFloor && secondFloor.id === floor.path_id) {
        setSecondFloor(null);
        setSecondFloorZoom(1);
        setSecondFloorPan({ x: 0, y: 0 });
        setSecondFloorViewMode("unitplan");
        setSecondFloorBalconyPoint(1);
        setSecondFloorSelectedPoint(null);
        setSecondFloorIsUnitPlan(true);
      } else {
        setSecondFloor(floorData);
        setSecondFloorZoom(1);
        setSecondFloorPan({ x: 0, y: 0 });
        setFirstFloorZoom(1);
        setFirstFloorPan({ x: 0, y: 0 });

        if (currentlyInBalconyMode) {
          const newFloorType = getFloorType(floorNum);
          const newFloorTotalPoints = getTotalBalconyPoints(newFloorType);
          const newPoint =
            firstFloorBalconyPoint <= newFloorTotalPoints
              ? firstFloorBalconyPoint
              : 1;
          setSecondFloorViewMode("balcony");
          setSecondFloorBalconyPoint(newPoint);
          setSecondFloorSelectedPoint(newPoint);
        } else {
          setSecondFloorViewMode("unitplan");
          setSecondFloorBalconyPoint(1);
          setSecondFloorSelectedPoint(null);
        }
        setSecondFloorIsUnitPlan(firstFloorIsUnitPlan);
      }

      if ("vibrate" in navigator) navigator.vibrate(30);
    },
    [
      firstFloor,
      secondFloor,
      isFloorSelectable,
      isInBalconyViewMode,
      firstFloorIsUnitPlan,
      firstFloorBalconyPoint,
    ]
  );

  const getFloorFillColor = useCallback(
    (floor) => {
      const isSecondFloor = secondFloor && secondFloor.id === floor.path_id;
      const isHovered = hoveredFloor === floor.path_id;
      const isFirstFloor = firstFloor && firstFloor.id === floor.path_id;
      const selectable = isFloorSelectable(floor);
      const inBalconyMode = isInBalconyViewMode();

      if (isFirstFloor) return "rgba(193, 154, 64, 0.8)";
      if (isSecondFloor) return "rgba(29, 41, 56, 0.8)";
      if (firstFloor && !selectable) return "rgba(0, 0, 0, 0.05)";
      if (isHovered && selectable) {
        return inBalconyMode
          ? "rgba(76, 175, 80, 0.7)"
          : "rgba(59, 130, 246, 0.7)";
      }
      if (firstFloor && selectable) {
        return inBalconyMode
          ? "rgba(76, 175, 80, 0.3)"
          : "rgba(59, 130, 246, 0.3)";
      }
      return getClassColor(floor);
    },
    [
      firstFloor,
      secondFloor,
      hoveredFloor,
      getClassColor,
      isFloorSelectable,
      isInBalconyViewMode,
    ]
  );

  const getFloorOpacity = useCallback(
    (floor) => {
      const isSecondFloor = secondFloor && secondFloor.id === floor.path_id;
      const isHovered = hoveredFloor === floor.path_id;
      const isFirstFloor = firstFloor && firstFloor.id === floor.path_id;
      const selectable = isFloorSelectable(floor);

      if (isFirstFloor || isSecondFloor) return 1;
      if (isHovered && selectable) return 1;
      if (firstFloor && !selectable) return 0.3;
      if (isInBalconyViewMode() && selectable) return 0.9;
      return 0.85;
    },
    [
      firstFloor,
      secondFloor,
      hoveredFloor,
      isFloorSelectable,
      isInBalconyViewMode,
    ]
  );

  const handleClose = () => {
    if (panelRef.current && overlayRef.current) {
      const tl = gsap.timeline({ onComplete: onClose });
      tl.to(panelRef.current, {
        x: "100%",
        duration: 0.4,
        ease: "power3.in",
      }).to(
        overlayRef.current,
        { opacity: 0, duration: 0.25, ease: "power2.in" },
        "-=0.2"
      );
    } else {
      onClose();
    }
  };

  if (!show) return null;

  const hasFirstFloor = !!firstFloor;
  const hasSecondFloor = !!secondFloor;
  const hasBothFloors = hasFirstFloor && hasSecondFloor;

  const firstFloorType = hasFirstFloor
    ? getFloorType(firstFloor.info.floorNumber)
    : "multiple";
  const secondFloorType = hasSecondFloor
    ? getFloorType(secondFloor.info.floorNumber)
    : "multiple";
  const firstFloorTotalPoints = getTotalBalconyPoints(firstFloorType);
  const secondFloorTotalPoints = getTotalBalconyPoints(secondFloorType);
  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        ref={panelRef}
        className="bg-[#FFFBF5] w-full h-full overflow-hidden flex"
      >
        {/* Close Button - RESPONSIVE */}
        <button
          onClick={handleClose}
          className={`absolute top-2 sm:top-4 z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[#C7BED6] hover:bg-[#B0A5C5] rounded-full transition-all duration-500 cursor-pointer ${
            isRightPanelHidden ? "right-2 sm:right-4" : "right-2 sm:right-4"
          }`}
        >
          <svg
            className="w-4 h-4 sm:w-6 sm:h-6 text-white"
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
        <div
          ref={leftPanelRef}
          className="bg-white uppercase font-futura-medium overflow-y-auto left-panel"
          style={{ width: "66.666%" }}
        >
          <div
            ref={contentWrapperRef}
            className="h-full flex flex-col p-2 sm:p-4 md:p-6"
            style={{ padding: "24px" }}
          >
            {/* Header - RESPONSIVE */}
            <div className="flex items-center justify-between mb-2 sm:mb-4 flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
                <h3
                  ref={headerRef}
                  className="font-bold text-[#000000] text-sm sm:text-xl md:text-3xl"
                  style={{ fontSize: "1.875rem" }}
                >
                  {hasBothFloors ? (
                    <>
                      <span className="hidden sm:inline">
                        Comparing Floor {firstFloor?.info.floorNumber} to{" "}
                        {secondFloor?.info.floorNumber}
                      </span>
                      <span className="sm:hidden">
                        Floor {firstFloor?.info.floorNumber} vs{" "}
                        {secondFloor?.info.floorNumber}
                      </span>
                    </>
                  ) : hasFirstFloor ? (
                    <>Floor {firstFloor?.info.floorNumber}</>
                  ) : (
                    <>Floor Plan Comparison</>
                  )}
                </h3>
                {hasFirstFloor && firstFloorViewMode !== "balcony" && (
                  <PlanTypeToggle
                    isUnitPlan={firstFloorIsUnitPlan}
                    onToggle={handleFirstFloorPlanToggle}
                    borderColor="#C19A40"
                  />
                )}
              </div>
              {(firstFloorViewMode === "balcony" ||
                secondFloorViewMode === "balcony") && (
                <p className="text-[10px] sm:text-sm text-green-600 normal-case hidden sm:block">
                  {firstFloorViewMode === "balcony" &&
                  secondFloorViewMode === "balcony"
                    ? "Viewing balconies for both floors"
                    : firstFloorViewMode === "balcony"
                    ? "Viewing balcony for first floor"
                    : "Viewing balcony for second floor"}
                  <span className="text-gray-500 ml-2">
                    • Click unit plan in sidebar to switch back
                  </span>
                </p>
              )}
            </div>

            <div className="flex-1 min-h-0">
              {hasFirstFloor ? (
                <div
                  ref={gridRef}
                  className={`grid h-full ${
                    hasBothFloors ? "grid-cols-2" : "grid-cols-1"
                  } gap-2 sm:gap-4 md:gap-6`}
                  style={{ gap: "24px" }}
                >
                  {/* First Floor */}
                  <div
                    className="bg-white rounded-lg shadow-sm relative overflow-hidden flex flex-col border-2"
                    style={{ borderColor: "#C19A40" }}
                  >
                    {/* Zoom Controls - RESPONSIVE: bottom-right on mobile, top-right on desktop */}
                    {firstFloorViewMode !== "balcony" && (
                      <div className="absolute bottom-2 right-2 sm:top-3 sm:right-3 sm:bottom-auto z-20 flex flex-row sm:flex-col gap-1 sm:gap-2">
                        <button
                          onClick={() => zoomIn(setFirstFloorZoom)}
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                          title="Zoom In"
                        >
                          <svg
                            className="w-3.5 h-3.5 sm:w-5 sm:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            zoomOut(
                              setFirstFloorZoom,
                              setFirstFloorPan,
                              firstFloorZoom,
                              firstFloorPan
                            )
                          }
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                          title="Zoom Out"
                        >
                          <svg
                            className="w-3.5 h-3.5 sm:w-5 sm:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            resetZoom(setFirstFloorZoom, setFirstFloorPan)
                          }
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                          title="Reset Zoom"
                        >
                          <svg
                            className="w-3.5 h-3.5 sm:w-5 sm:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                    {/* Zoom indicator - RESPONSIVE */}
                    {firstFloorViewMode !== "balcony" && (
                      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-20 bg-white/80 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs text-gray-600">
                        {Math.round(firstFloorZoom * 100)}%
                      </div>
                    )}
                    {/* View mode indicator - RESPONSIVE */}
                    <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 z-20 bg-[#C19A40] text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[9px] sm:text-xs hidden lg:block">
                      {firstFloorViewMode === "balcony"
                        ? `Balcony - Pt ${firstFloorBalconyPoint}`
                        : firstFloorIsUnitPlan
                        ? "Unit Plan"
                        : "Floor Plan"}
                    </div>

                    <div className="relative bg-white flex-1 min-h-0 flex flex-col">
                      <div
                        className="relative flex-1 min-h-0 overflow-hidden"
                        onMouseDown={(e) =>
                          firstFloorViewMode !== "balcony" &&
                          handleMouseDown(e, "first")
                        }
                        onWheel={(e) =>
                          firstFloorViewMode !== "balcony" &&
                          handleWheel(e, "first")
                        }
                        onClick={(e) =>
                          firstFloorViewMode !== "balcony" &&
                          handleImageClick(e, "first")
                        }
                        style={{
                          cursor:
                            firstFloorViewMode === "balcony"
                              ? "default"
                              : firstFloorZoom > 1
                              ? isDragging && activeDragFloor === "first"
                                ? "grabbing"
                                : "grab"
                              : "zoom-in",
                        }}
                      >
                        <div
                          className="w-full h-full flex items-center justify-center p-1 sm:p-2"
                          style={{ minHeight: "100%" }}
                        >
                          {firstFloorViewMode === "balcony" ? (
                            <BalconyViewCarousel
                              floorNumber={firstFloor.info.floorNumber}
                              currentPoint={firstFloorBalconyPoint}
                              onPointChange={(point) => {
                                setFirstFloorBalconyPoint(point);
                                setFirstFloorSelectedPoint(point);
                                if (secondFloor) {
                                  setSecondFloorBalconyPoint(point);
                                  setSecondFloorSelectedPoint(point);
                                }
                              }}
                              totalPoints={firstFloorTotalPoints}
                              accentColor="#C19A40"
                              isMaster={true}
                              masterTotalPoints={firstFloorTotalPoints}
                            />
                          ) : (
                            <div
                              className="relative"
                              style={{
                                transform: `scale(${firstFloorZoom}) translate(${
                                  firstFloorPan.x / firstFloorZoom
                                }px, ${firstFloorPan.y / firstFloorZoom}px)`,
                                transformOrigin: "center center",
                                display: "inline-block",
                                lineHeight: 0,
                              }}
                            >
                              <img
                                src={getFloorPlanImage(
                                  firstFloor.info.floorNumber,
                                  firstFloorIsUnitPlan
                                )}
                                alt={`Floor ${firstFloor.info.floorNumber} ${
                                  firstFloorIsUnitPlan ? "Unit" : "Floor"
                                } Plan`}
                                className="block select-none"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "calc(100vh - 200px)",
                                  width: "auto",
                                  height: "auto",
                                  objectFit: "contain",
                                }}
                                draggable={false}
                              />
                              {firstFloorIsUnitPlan && (
                                <UnitPlanOverlay
                                  floorType={firstFloorType}
                                  onRegionClick={handleFirstFloorRegionClick}
                                  selectedPoint={firstFloorSelectedPoint}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Second Floor (if selected) */}
                  {hasSecondFloor && (
                    <div
                      className="bg-white rounded-lg shadow-sm relative overflow-hidden flex flex-col border-2"
                      style={{ borderColor: "#BDD1B1" }}
                    >
                      {secondFloorViewMode !== "balcony" && (
                        <div className="absolute bottom-2 right-2 sm:top-3 sm:right-3 sm:bottom-auto z-20 flex flex-row sm:flex-col gap-1 sm:gap-2">
                          <button
                            onClick={() => zoomIn(setSecondFloorZoom)}
                            className="w-6 h-6 sm:w-8 sm:h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                            title="Zoom In"
                          >
                            <svg
                              className="w-3.5 h-3.5 sm:w-5 sm:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              zoomOut(
                                setSecondFloorZoom,
                                setSecondFloorPan,
                                secondFloorZoom,
                                secondFloorPan
                              )
                            }
                            className="w-6 h-6 sm:w-8 sm:h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                            title="Zoom Out"
                          >
                            <svg
                              className="w-3.5 h-3.5 sm:w-5 sm:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              resetZoom(setSecondFloorZoom, setSecondFloorPan)
                            }
                            className="w-6 h-6 sm:w-8 sm:h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                            title="Reset Zoom"
                          >
                            <svg
                              className="w-3.5 h-3.5 sm:w-5 sm:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                      {secondFloorViewMode !== "balcony" && (
                        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-20 bg-white/80 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs text-gray-600">
                          {Math.round(secondFloorZoom * 100)}%
                        </div>
                      )}
                      <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 z-20 bg-[#BDD1B1] text-gray-800 px-1.5 py-0.5 hidden sm:px-2 sm:py-1 rounded text-[9px] sm:text-xs lg:block ">
                        {secondFloorViewMode === "balcony"
                          ? `Balcony - Pt ${secondFloorBalconyPoint}`
                          : secondFloorIsUnitPlan
                          ? "Unit Plan"
                          : "Floor Plan"}
                      </div>

                      <div className="relative bg-white flex-1 min-h-0 flex flex-col">
                        <div
                          className="relative flex-1 min-h-0 overflow-hidden"
                          onMouseDown={(e) =>
                            secondFloorViewMode !== "balcony" &&
                            handleMouseDown(e, "second")
                          }
                          onWheel={(e) =>
                            secondFloorViewMode !== "balcony" &&
                            handleWheel(e, "second")
                          }
                          onClick={(e) =>
                            secondFloorViewMode !== "balcony" &&
                            handleImageClick(e, "second")
                          }
                          style={{
                            cursor:
                              secondFloorViewMode === "balcony"
                                ? "default"
                                : secondFloorZoom > 1
                                ? isDragging && activeDragFloor === "second"
                                  ? "grabbing"
                                  : "grab"
                                : "zoom-in",
                          }}
                        >
                          <div
                            className="w-full h-full flex items-center justify-center p-1 sm:p-2"
                            style={{ minHeight: "100%" }}
                          >
                            {secondFloorViewMode === "balcony" ? (
                              <BalconyViewCarousel
                                floorNumber={secondFloor.info.floorNumber}
                                currentPoint={firstFloorBalconyPoint}
                                onPointChange={() => {}}
                                totalPoints={secondFloorTotalPoints}
                                accentColor="#BDD1B1"
                                isMaster={false}
                                masterTotalPoints={firstFloorTotalPoints}
                              />
                            ) : (
                              <div
                                className="relative"
                                style={{
                                  transform: `scale(${secondFloorZoom}) translate(${
                                    secondFloorPan.x / secondFloorZoom
                                  }px, ${
                                    secondFloorPan.y / secondFloorZoom
                                  }px)`,
                                  transformOrigin: "center center",
                                  display: "inline-block",
                                  lineHeight: 0,
                                }}
                              >
                                <img
                                  src={getFloorPlanImage(
                                    secondFloor.info.floorNumber,
                                    secondFloorIsUnitPlan
                                  )}
                                  alt={`Floor ${secondFloor.info.floorNumber} ${
                                    secondFloorIsUnitPlan ? "Unit" : "Floor"
                                  } Plan`}
                                  className="block select-none"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "calc(100vh - 200px)",
                                    width: "auto",
                                    height: "auto",
                                    objectFit: "contain",
                                  }}
                                  draggable={false}
                                />
                                {secondFloorIsUnitPlan && (
                                  <UnitPlanOverlay
                                    floorType={secondFloorType}
                                    onRegionClick={handleSecondFloorRegionClick}
                                    selectedPoint={secondFloorSelectedPoint}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center bg-[#E8F4FE] rounded-lg border-2 border-[#C4E0FD]">
                  <div className="bg-white p-4 sm:p-8 rounded-lg shadow-sm">
                    <h4 className="text-base sm:text-xl font-semibold text-[#000000] mb-2">
                      {firstFloor
                        ? "Select a Floor to Compare"
                        : "Select Floors from Building"}
                    </h4>
                    <p className="text-xs sm:text-base text-[#3F3F41] max-w-md">
                      {firstFloor
                        ? "Click on a highlighted floor in the building view to compare different floor plans."
                        : "Use the building visualization to select floors for comparison."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toggle Button for Right Panel - RESPONSIVE */}
        <button
          ref={toggleButtonRef}
          onClick={() => setIsRightPanelHidden(!isRightPanelHidden)}
          className="absolute top-1/2 -translate-y-1/2 z-30 w-5 h-12 sm:w-6 sm:h-16 bg-[#FFFBF5] hover:bg-[#F5EFE6] border border-[#C19A40]/30 rounded-lg flex items-center justify-center cursor-pointer group shadow-md"
          style={{ right: "calc(33.333% - 12px)" }}
          title={
            isRightPanelHidden ? "Show building view" : "Hide building view"
          }
        >
          <svg
            ref={toggleArrowRef}
            className="w-3 h-3 sm:w-4 sm:h-4 text-[#C19A40] group-hover:text-[#A37F2D]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Right Panel - Building SVG */}
        <div
          ref={rightPanelRef}
          className="flex flex-col right-panel overflow-hidden p-2 sm:p-4 md:p-6"
          style={{ width: "33.333%", padding: "24px", opacity: 1 }}
        >
          <div className="h-3/5 flex items-stretch justify-stretch w-full">
            <div className="relative w-full h-full overflow-hidden">
              <svg
                ref={svgRef}
                viewBox="0 0 6826 3840"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid slice"
                style={{
                  shapeRendering: "optimizeSpeed",
                  pointerEvents: "auto",
                  objectFit: "cover",
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
                <g
                  style={{ transform: "translate(2050px, -10px) scale(0.85)" }}
                >
                  {floors.map((floor) => {
                    const isHovered = hoveredFloor === floor.path_id;
                    const isFirstFloorPath =
                      firstFloor && firstFloor.id === floor.path_id;
                    const isSecondFloorPath =
                      secondFloor && secondFloor.id === floor.path_id;
                    const selectable = isFloorSelectable(floor);
                    const canInteract = selectable || isFirstFloorPath;

                    return (
                      <path
                        key={floor.path_id}
                        id={floor.path_id}
                        d={floor.d}
                        fill={getFloorFillColor(floor)}
                        stroke={
                          (isHovered && canInteract) ||
                          isSecondFloorPath ||
                          isFirstFloorPath
                            ? "#ffffff"
                            : "none"
                        }
                        strokeWidth={
                          (isHovered && canInteract) ||
                          isSecondFloorPath ||
                          isFirstFloorPath
                            ? "3"
                            : "0"
                        }
                        opacity={getFloorOpacity(floor)}
                        style={{
                          cursor: canInteract ? "pointer" : "not-allowed",
                          transition:
                            "opacity 150ms ease-out, fill 150ms ease-out, stroke 150ms ease-out",
                          filter:
                            isHovered && canInteract
                              ? "brightness(1.1)"
                              : "none",
                        }}
                        onMouseEnter={() =>
                          canInteract && setHoveredFloor(floor.path_id)
                        }
                        onMouseLeave={() => setHoveredFloor(null)}
                        onClick={() => handleFloorToggle(floor)}
                      />
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>

          {/* Unit Plan Thumbnail - RESPONSIVE label */}
          <div className="h-2/5 mt-2 sm:mt-4 rounded-lg overflow-hidden shadow-md bg-white border-2 border-[#C19A40]/30 flex items-center justify-center">
            {(firstFloorViewMode === "balcony" ||
              secondFloorViewMode === "balcony") &&
            hasFirstFloor ? (
              <div
                className="relative w-full h-full cursor-pointer group flex items-center justify-center p-2 sm:p-4"
                onClick={handleUnitPlanThumbnailClick}
              >
                {/* Aspect-ratio locked wrapper - keeps radar position consistent */}
                <div
                  className="relative max-w-full max-h-full"
                  style={{ aspectRatio: "4 / 3" }}
                >
                  <img
                    src={getFloorPlanImage(firstFloor.info.floorNumber, true)}
                    alt="Unit Plan"
                    className="w-full h-full object-contain"
                  />
                  {/* Radar now positioned relative to this aspect-ratio locked container */}
                  <RadarViewIndicator
                    currentPoint={firstFloorBalconyPoint}
                    floorType={firstFloorType}
                    className="drop-shadow-lg"
                  />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                  <span className="text-white text-[10px] sm:text-sm font-medium bg-black/50 px-2 py-1 sm:px-3 sm:py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to view Unit Plan
                  </span>
                </div>
                {/* Label */}
                <div className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 bg-[#C19A40] text-white px-1.5 py-0.5 sm:px-3 sm:py-1 rounded text-[8px] sm:text-xs whitespace-nowrap">
                  Unit Plan - Floor {firstFloor.info.floorNumber}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 p-2 sm:p-4">
                <svg
                  className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-1 sm:mb-2 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <p className="text-[10px] sm:text-sm">
                  Select a balcony viewpoint to see the unit plan here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Features.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { type1SlidesData } from "../constants/featuresData";
import Loader from "../components/Loader";

// Register GSAP plugins
gsap.registerPlugin(useGSAP, CustomEase);

// Create custom ease
CustomEase.create(
  "hop",
  "M0,0 C0.083,0.294 0.117,0.767 0.413,0.908 0.606,1 0.752,1 1,1"
);

// ============================================
// CLOSE BUTTON COMPONENT
// ============================================
const CloseButton = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/home");
  };

  return (
    <button
      onClick={handleClose}
      className="fixed top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-50 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 group"
      aria-label="Close and return to home"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white group-hover:scale-110 transition-transform"
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
  );
};

// ============================================
// ACCENT SQUARES COMPONENT (Reusable)
// Renders 2 color squares + 1 seaBox image
// Position of seaBox depends on squaresPosition prop
// - "left" = squares on left side of page, seaBox on rightmost
// - "right" = squares on right side of page, seaBox on leftmost
// ============================================
const AccentSquares = ({ accentSquares, seaBoxSrc, squaresPosition }) => {
  if (!accentSquares) return null;

  const isLeft = squaresPosition === "left";

  return (
    <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'} gap-0.5 sm:gap-1`}>
      {isLeft ? (
        // Squares on LEFT side of page: [color1] [color2] [seaBox]
        <>
          {accentSquares.map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-element"
              style={{ backgroundColor: color }}
            />
          ))}
          {seaBoxSrc && (
            <img
              src={seaBoxSrc}
              alt=""
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 object-cover text-element"
            />
          )}
        </>
      ) : (
        // Squares on RIGHT side of page: [seaBox] [color1] [color2]
        <>
          {seaBoxSrc && (
            <img
              src={seaBoxSrc}
              alt=""
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 object-cover text-element"
            />
          )}
          {accentSquares.map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-element"
              style={{ backgroundColor: color }}
            />
          ))}
        </>
      )}
    </div>
  );
};

// ============================================
// SLIDE TYPE: splitBackground (Slide 1) - UPDATED LAYOUT
// Matches the brochure exactly: Single background, image left-center, text right-aligned
// ============================================
const SplitBackgroundSlide = ({ data }) => {
  return (
    <div className="relative w-full h-full">
      {/* Single Background covering entire slide */}
      <img
        src={data.rightSection.backgroundSrc}
        className="object-cover w-full h-full absolute inset-0"
        alt=""
      />

      {/* Content Layer */}
      <div className="absolute inset-0 flex">
        {/* Left Section - Image (vertically centered) */}
        <div className="w-[38%] sm:w-[40%] md:w-[42%] lg:w-[45%] xl:w-[45%] relative h-full flex items-center justify-start">
          {/* Person Image with hover effect - positioned left-center */}
          <div className="h-[55%] sm:h-[58%] md:h-[60%] lg:h-[65%] xl:h-[70%] w-full overflow-hidden group">
            <img
              src={data.leftSection.imageSrc}
              className="w-full h-full object-cover object-[50%_30%] text-element transition-all duration-700 ease-out group-hover:scale-105"
              alt=""
            />
            {/* Subtle shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </div>
        </div>

        {/* Right Section - Text Content */}
        <div className="w-[62%] sm:w-[60%] md:w-[58%] lg:w-[55%] xl:w-[55%] relative h-full">
          {/* Content Container - Right aligned text */}
          <div className="h-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12 xl:px-14 xl:py-16 flex flex-col justify-between">
            
            {/* Top Section - Heading (keeping original heading) */}
            <div className="text-right">
              <h2 className="text-black text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-futura-md tracking-wide text-element">
                {data.rightSection.topText}
              </h2>
              <p className="text-black text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base font-futura-md tracking-wide opacity-70 mt-0.5 sm:mt-1 whitespace-pre-line text-element">
                {data.rightSection.topSubtext}
              </p>
            </div>

            {/* Middle Section - Paragraphs */}
            <div className="flex-1 flex flex-col justify-center py-2 sm:py-3 md:py-4 lg:py-6">
              <div className="text-right space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4 xl:space-y-5">
                {data.rightSection.paragraphs?.map((paragraph, index) => (
                  <p 
                    key={index} 
                    className="text-black text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm font-futura-md leading-relaxed text-element"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Bottom Section - Signature Area */}
            <div className="text-right">
              {/* ============================================
                  SIGNATURE SECTION (Uncomment to enable)
                  To use: Add signature object to data in featuresData.js
                  ============================================ */}
              {data.rightSection.signature && (
                <div className="mb-2 sm:mb-3 md:mb-4">
                  {/* Optional: Signature Image */}
                  {data.rightSection.signature.signatureImageSrc && (
                    <img 
                      src={data.rightSection.signature.signatureImageSrc}
                      alt="Signature"
                      className="h-6 sm:h-7 md:h-8 lg:h-10 xl:h-12 ml-auto mb-1 text-element"
                    />
                  )}
                  {/* Signature Name (cursive/script style) */}
                  <p className="text-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-serif italic tracking-wide text-element">
                    {data.rightSection.signature.name}
                  </p>
                  {/* Title */}
                  <p className="text-black text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs font-futura-md uppercase tracking-wider opacity-80 mt-0.5 text-element">
                    {data.rightSection.signature.title}
                  </p>
                  {/* Company */}
                  <p className="text-black text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs font-futura-md uppercase tracking-wider opacity-80 text-element">
                    {data.rightSection.signature.company}
                  </p>
                </div>
              )}

              {/* Accent Squares with seaBox */}
              <div className="mt-2 sm:mt-3 md:mt-4">
                <AccentSquares 
                  accentSquares={data.rightSection.accentSquares} 
                  seaBoxSrc={data.rightSection.seaBoxSrc} 
                  squaresPosition={data.rightSection.squaresPosition} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SLIDE TYPE: threeArchitects (Slide 2)
// Layout: Title + squares on left, 3 architect cards on right
// ============================================
const ThreeArchitectsSlide = ({ data }) => {
  return (
    <div className="relative w-full h-full">
      {/* Background */}
      <img
        src={data.backgroundSrc}
        className="object-cover w-full h-full absolute inset-0"
        alt=""
      />

      <div className="absolute inset-0 flex">
        {/* Left Section - Title and Accent Squares */}
        <div className="w-[28%] sm:w-[30%] md:w-[32%] lg:w-[33%] xl:w-[35%] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12 xl:px-14 xl:py-16 flex flex-col justify-between h-full">
          {/* Title at top */}
          <div>
            <h2 className="text-black text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl font-futura-md uppercase tracking-wide whitespace-pre-line leading-tight text-element">
              {data.title}
            </h2>
          </div>

          {/* Accent Squares at bottom left */}
          <AccentSquares 
            accentSquares={data.accentSquares} 
            seaBoxSrc={data.seaBoxSrc} 
            squaresPosition={data.squaresPosition} 
          />
        </div>

        {/* Right Section - 3 Architect Cards */}
        <div className="w-[72%] sm:w-[70%] md:w-[68%] lg:w-[67%] xl:w-[65%] flex items-center justify-center py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12 pr-4 sm:pr-6 md:pr-8 lg:pr-10 xl:pr-14">
          <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 w-full items-start">
            {data.architects.map((architect, index) => (
              <div key={index} className="flex-1 flex flex-col group cursor-pointer">
                {/* Photo - Fixed height container to ensure all photos are equal size */}
                <div className="w-full h-36 sm:h-44 md:h-52 lg:h-64 xl:h-72 overflow-hidden relative flex-shrink-0">
                  <img
                    src={architect.src}
                    className="w-full h-full object-cover object-[50%_0%] text-element transition-all duration-700 ease-out group-hover:scale-105"
                    alt={architect.name}
                  />
                  {/* Elegant overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </div>
                
                {/* Name */}
                <p className="text-black text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base uppercase font-futura-md tracking-wide mt-2 sm:mt-2.5 md:mt-3 lg:mt-4 text-center transition-all duration-300 group-hover:tracking-wider text-element">
                  {architect.name}
                </p>
                
                {/* Title */}
                <p className="text-black text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs uppercase font-futura-md opacity-60 mt-0.5 sm:mt-1 text-center tracking-wider text-element">
                  {architect.title}
                </p>
                
                {/* Description */}
                {architect.description && (
                  <p className="text-black text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] xl:text-[11px] font-futura-md leading-relaxed mt-2 sm:mt-2.5 md:mt-3 lg:mt-4 text-justify text-element">
                    {architect.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SLIDE TYPE: architectIndividual (Slides 3, 4, 5)
// Layout: Image on one side, Name/Title/Paragraphs/Squares on other
// ============================================
const ArchitectIndividualSlide = ({ data }) => {
  const isImageLeft = data.layoutDirection === "imageLeft";

  return (
    <div className="relative w-full h-full">
      {/* Background */}
      <img
        src={data.backgroundSrc}
        className="object-cover w-full h-full absolute inset-0"
        alt=""
      />

      <div className="absolute inset-0 flex">
        {isImageLeft ? (
          <>
            {/* Left - Image */}
            <div className="w-[45%] sm:w-[48%] md:w-[50%] lg:w-[50%] xl:w-[50%] relative h-full overflow-hidden group cursor-pointer">
              <img
                src={data.imageSrc}
                className="w-full h-full object-cover object-[50%_0%] text-element transition-all duration-700 ease-out group-hover:scale-105"
                alt=""
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </div>
            {/* Right - Text */}
            <div className="w-[55%] sm:w-[52%] md:w-[50%] lg:w-[50%] xl:w-[50%] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12 xl:px-14 xl:py-16 flex flex-col justify-between h-full">
              {/* Top - Name and Title */}
              <div className="text-right">
                <h2 className="text-black text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-futura-md uppercase tracking-widest text-element">
                  {data.name}
                </h2>
                <p className="text-black text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm font-futura-md uppercase tracking-wider opacity-60 mt-0.5 sm:mt-1 text-element">
                  {data.title}
                </p>
              </div>

              {/* Middle - Paragraphs */}
              <div className="flex-1 flex flex-col justify-center py-2 sm:py-3 md:py-4">
                <div className="text-right space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4">
                  {data.paragraphs?.map((paragraph, index) => (
                    <p 
                      key={index} 
                      className="text-black text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs font-futura-md leading-relaxed text-element"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Bottom - Accent Squares */}
              <AccentSquares 
                accentSquares={data.accentSquares} 
                seaBoxSrc={data.seaBoxSrc} 
                squaresPosition={data.squaresPosition} 
              />
            </div>
          </>
        ) : (
          <>
            {/* Left - Text */}
            <div className="w-[55%] sm:w-[52%] md:w-[50%] lg:w-[50%] xl:w-[50%] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12 xl:px-14 xl:py-16 flex flex-col justify-between h-full">
              {/* Top - Name and Title */}
              <div className="text-left">
                <h2 className="text-black text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-futura-md uppercase tracking-widest text-element">
                  {data.name}
                </h2>
                <p className="text-black text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm font-futura-md uppercase tracking-wider opacity-60 mt-0.5 sm:mt-1 text-element">
                  {data.title}
                </p>
              </div>

              {/* Middle - Paragraphs */}
              <div className="flex-1 flex flex-col justify-center py-2 sm:py-3 md:py-4">
                <div className="text-left space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4">
                  {data.paragraphs?.map((paragraph, index) => (
                    <p 
                      key={index} 
                      className="text-black text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs font-futura-md leading-relaxed text-element"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Bottom - Accent Squares */}
              <AccentSquares 
                accentSquares={data.accentSquares} 
                seaBoxSrc={data.seaBoxSrc} 
                squaresPosition={data.squaresPosition} 
              />
            </div>
            {/* Right - Image */}
            <div className="w-[45%] sm:w-[48%] md:w-[50%] lg:w-[50%] xl:w-[50%] relative h-full overflow-hidden group cursor-pointer">
              <img
                src={data.imageSrc}
                className="w-full h-full object-cover object-[50%_0%] text-element transition-all duration-700 ease-out group-hover:scale-105"
                alt=""
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================
// SLIDE TYPE: buildingShowcase (Slide 6)
// Layout: Large image LEFT, Title + squares RIGHT
// ============================================
const BuildingShowcaseSlide = ({ data }) => {
  return (
    <div className="relative w-full h-full">
      {/* Background for entire slide */}
      <img
        src={data.backgroundSrc}
        className="object-cover w-full h-full absolute inset-0"
        alt=""
      />

      <div className="absolute inset-0 flex">
        {/* Left - Building/Cityscape Image */}
        <div className="w-[60%] sm:w-[62%] md:w-[65%] lg:w-[65%] xl:w-[65%] relative h-full overflow-hidden group cursor-pointer">
          <img
            src={data.buildingImageSrc}
            className="w-full h-full object-cover object-[80%_50%] text-element transition-all duration-700 ease-out group-hover:scale-105"
            alt=""
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
        </div>

        {/* Right - Title and Squares */}
        <div className="w-[40%] sm:w-[38%] md:w-[35%] lg:w-[35%] xl:w-[35%] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12 xl:px-14 xl:py-16 flex flex-col justify-between h-full">
          {/* Title at top */}
          <div className="text-right">
            <h2 className="text-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-futura-md uppercase tracking-wide whitespace-pre-line leading-tight text-element">
              {data.title}
            </h2>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Accent Squares at bottom right */}
          <AccentSquares 
            accentSquares={data.accentSquares} 
            seaBoxSrc={data.seaBoxSrc} 
            squaresPosition={data.squaresPosition} 
          />
        </div>
      </div>
    </div>
  );
};

// ============================================
// SLIDE TYPE: buildingElements (Slide 7)
// Layout: Elements LEFT, Main building CENTER, Title+Description+Squares RIGHT
// ============================================
const BuildingElementsSlide = ({ data }) => {
  return (
    <div className="relative w-full h-full">
      {/* Background */}
      <img
        src={data.backgroundSrc}
        className="object-cover w-full h-full absolute inset-0"
        alt=""
      />

      <div className="absolute inset-0 flex">
        {/* Left Section - Element thumbnails with text */}
        <div className="w-[18%] sm:w-[18%] md:w-[18%] lg:w-[18%] xl:w-[18%] px-2 py-4 sm:px-3 sm:py-6 md:px-4 md:py-8 lg:px-5 lg:py-10 xl:px-6 xl:py-12 flex flex-col justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 h-full">
          {data.elements.map((element, index) => (
            <div key={index} className="flex flex-col group cursor-pointer">
              <div className="overflow-hidden relative flex-shrink-0 w-14 h-12 sm:w-16 sm:h-14 md:w-20 md:h-16 lg:w-24 lg:h-20 xl:w-28 xl:h-24">
                <img
                  src={element.src}
                  className="w-full h-full object-cover text-element transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-110"
                  alt=""
                />
              </div>
              <p className="text-black text-[5px] sm:text-[6px] md:text-[7px] lg:text-[8px] xl:text-[9px] font-futura-md leading-snug mt-1 sm:mt-1.5 md:mt-2 uppercase tracking-wide text-element">
                {element.text}
              </p>
            </div>
          ))}
        </div>

        {/* Center Section - Main Building Image */}
        <div className="w-[47%] sm:w-[47%] md:w-[47%] lg:w-[47%] xl:w-[47%] h-full flex items-center justify-center p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 overflow-hidden group cursor-pointer">
          <img
            src={data.mainImageSrc}
            className="h-full object-contain text-element transition-all duration-700 ease-out group-hover:scale-105"
            alt=""
          />
        </div>

        {/* Right Section - Title, Description, Squares */}
        <div className="w-[35%] sm:w-[35%] md:w-[35%] lg:w-[35%] xl:w-[35%] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12 xl:px-14 xl:py-16 flex flex-col justify-between h-full">
          {/* Title at top */}
          <div className="text-right">
            <h2 className="text-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-futura-md uppercase tracking-wide text-element">
              {data.title}
            </h2>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Description and Squares at bottom */}
          <div className="text-right">
            {data.description && (
              <p className="text-black text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs font-futura-md leading-relaxed mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-element">
                {data.description}
              </p>
            )}
            
            {/* Accent Squares */}
            <AccentSquares 
              accentSquares={data.accentSquares} 
              seaBoxSrc={data.seaBoxSrc} 
              squaresPosition={data.squaresPosition} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SLIDE TYPE: fullImage (Slide 8)
// ============================================
const FullImageSlide = ({ data }) => {
  return (
    <div className="w-full h-full relative">
      <img
        src={data.imageSrc}
        className="object-cover w-full h-full text-element"
        alt=""
      />
    </div>
  );
};

// ============================================
// SLIDE TYPE: mapSlide (Slide 9)
// Layout: Title + Distances + Squares LEFT, Map RIGHT
// ============================================
const MapSlide = ({ data }) => {
  return (
    <div className="relative w-full h-full">
      {/* Background */}
      <img
        src={data.backgroundSrc}
        className="object-cover w-full h-full absolute inset-0"
        alt=""
      />

      <div className="absolute inset-0 flex">
        {/* Left Section - Title, Distances, Squares */}
        <div className="w-[35%] sm:w-[35%] md:w-[35%] lg:w-[35%] xl:w-[35%] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12 xl:px-14 xl:py-16 flex flex-col justify-between h-full">
          {/* Title at top */}
          <div>
            <h2 className="text-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-futura-md uppercase tracking-wide whitespace-pre-line leading-tight text-element">
              {data.title}
            </h2>
          </div>

          {/* Distances list */}
          {data.distances && (
            <div className="space-y-1 sm:space-y-1.5 md:space-y-2 lg:space-y-2.5">
              {data.distances.map((item, index) => (
                <p 
                  key={index} 
                  className="text-black text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm font-futura-md text-element"
                >
                  {item.place}: {item.distance}
                </p>
              ))}
            </div>
          )}

          {/* Accent Squares at bottom left */}
          <AccentSquares 
            accentSquares={data.accentSquares} 
            seaBoxSrc={data.seaBoxSrc} 
            squaresPosition={data.squaresPosition} 
          />
        </div>

        {/* Right Section - Map Image */}
        <div className="w-[65%] sm:w-[65%] md:w-[65%] lg:w-[65%] xl:w-[65%] relative h-full overflow-hidden group cursor-pointer">
          <img
            src={data.mapImageSrc}
            className="w-full h-full object-cover text-element transition-all duration-700 ease-out group-hover:scale-105"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

// ============================================
// SLIDE TYPE: portfolioSlide (Slide 10)
// Layout: 3 building images LEFT, Text + Squares RIGHT
// ============================================
const PortfolioSlide = ({ data }) => {
  return (
    <div className="relative w-full h-full">
      {/* Background Image */}
      <img
        src={data.backgroundSrc}
        className="object-cover w-full h-full absolute inset-0"
        alt=""
      />

      <div className="absolute inset-0 flex">
        {/* Left Section - 3 Building Images */}
        <div className="w-[65%] sm:w-[65%] md:w-[65%] lg:w-[65%] xl:w-[65%] relative h-full">
          <div className="flex gap-0 h-full">
            {data.buildings.map((building, index) => (
              <div key={index} className="flex-1 flex flex-col group cursor-pointer relative h-full overflow-hidden">
                {/* Full height image - using object-contain to show full building */}
                <img
                  src={building.src}
                  className="w-full h-full object-cover text-element transition-all duration-700 ease-out group-hover:scale-105"
                  style={{ 
                    objectPosition: building.objectPosition || '50% 50%' 
                  }}
                  alt={building.name}
                />
                {/* Elegant dark overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                
                {/* Label at TOP of image */}
                <div className="absolute top-3 sm:top-4 md:top-5 lg:top-6 xl:top-8 left-0 right-0 text-center">
                  <p className="text-white text-[7px] sm:text-[8px] md:text-[9px] lg:text-xs xl:text-sm uppercase font-futura-md tracking-wider text-element drop-shadow-lg">
                    {building.name}
                  </p>
                  <p className="text-white text-[6px] sm:text-[7px] md:text-[8px] lg:text-[10px] xl:text-xs uppercase font-futura-md opacity-80 tracking-wider text-element drop-shadow-lg">
                    {building.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Text and Squares */}
        <div className="w-[35%] sm:w-[35%] md:w-[35%] lg:w-[35%] xl:w-[35%] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12 xl:px-14 xl:py-16 flex flex-col justify-between h-full">
          {/* Spacer */}
          <div></div>

          {/* Text lines - centered vertically */}
          <div className="text-right">
            {data.textLines.map((line, index) => (
              <p key={index} className="text-black text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-lg font-futura-md tracking-wider uppercase text-element leading-relaxed">
                {line}
              </p>
            ))}
          </div>

          {/* Accent Squares at bottom right */}
          <AccentSquares 
            accentSquares={data.accentSquares} 
            seaBoxSrc={data.seaBoxSrc} 
            squaresPosition={data.squaresPosition} 
          />
        </div>
      </div>
    </div>
  );
};

// ============================================
// SLIDE ROUTER - Renders correct component based on slideType
// ============================================
const Slide = ({ data }) => {
  switch (data.slideType) {
    case "splitBackground":
      return <SplitBackgroundSlide data={data} />;
    case "threeArchitects":
      return <ThreeArchitectsSlide data={data} />;
    case "architectIndividual":
      return <ArchitectIndividualSlide data={data} />;
    case "buildingShowcase":
      return <BuildingShowcaseSlide data={data} />;
    case "buildingElements":
      return <BuildingElementsSlide data={data} />;
    case "fullImage":
      return <FullImageSlide data={data} />;
    case "mapSlide":
      return <MapSlide data={data} />;
    case "portfolioSlide":
      return <PortfolioSlide data={data} />;
    default:
      return <div className="w-full h-full bg-gray-200 flex items-center justify-center">Unknown slide type</div>;
  }
};

// ============================================
// MAIN FEATURES COMPONENT
// ============================================
const Features = () => {
  const containerRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const totalSlides = type1SlidesData.length;

  // Direction patterns for animations
  const getDirection = (index) => {
    // Alternating pattern: even from top, odd from bottom
    return index % 2 === 0 ? "fromTop" : "fromBottom";
  };

  const directions = {
    fromTop: {
      initial: { clipPath: "inset(0 0 100% 0)" },
      animate: { clipPath: "inset(0 0 0% 0)" },
      exit: { clipPath: "inset(100% 0 0 0)" },
    },
    fromBottom: {
      initial: { clipPath: "inset(100% 0 0 0)" },
      animate: { clipPath: "inset(0% 0 0 0)" },
      exit: { clipPath: "inset(0 0 100% 0)" },
    },
  };

  // Navigate to specific slide (with looping)
  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;

    // Enable looping: if index goes below 0, loop to last slide; if above last, loop to first
    let targetIndex = index;
    if (index < 0) {
      targetIndex = totalSlides - 1; // Loop to last slide
    } else if (index >= totalSlides) {
      targetIndex = 0; // Loop to first slide
    }

    setIsAnimating(true);

    const currentSlideEl = containerRef.current?.querySelector(
      `[data-slide-index="${currentSlide}"]`
    );
    const nextSlideEl = containerRef.current?.querySelector(
      `[data-slide-index="${targetIndex}"]`
    );

    if (!currentSlideEl || !nextSlideEl) {
      setIsAnimating(false);
      return;
    }

    const direction = directions[getDirection(targetIndex)];

    // Get text elements from both slides
    const currentTextElements = currentSlideEl.querySelectorAll(".text-element");
    const nextTextElements = nextSlideEl.querySelectorAll(".text-element");

    // Immediately hide next slide's elements before it becomes visible
    gsap.set(nextTextElements, { opacity: 0 });

    // Set next slide to initial state and make visible
    gsap.set(nextSlideEl, {
      clipPath: direction.initial.clipPath,
      zIndex: 2,
    });

    // Animate next slide in
    gsap.to(nextSlideEl, {
      clipPath: direction.animate.clipPath,
      duration: 1.2,
      ease: "hop",
      onComplete: () => {
        // Reset z-indices
        gsap.set(currentSlideEl, { zIndex: 0 });
        gsap.set(nextSlideEl, { zIndex: 1 });
        // Reset current slide elements to hidden for when we return
        gsap.set(currentTextElements, { opacity: 0 });
        setCurrentSlide(targetIndex);
        setIsAnimating(false);
      },
    });

    // Fade in next slide's elements with stagger
    gsap.to(nextTextElements, {
      opacity: 1,
      duration: 0.8,
      stagger: 0.06,
      delay: 0.5,
      ease: "power1.out",
    });
  };

  // Navigation handlers
  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  // Wheel navigation
  useEffect(() => {
    let wheelTimeout;
    const handleWheel = (e) => {
      if (isAnimating) return;

      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }, 50);
    };

    const container = containerRef.current;
    container?.addEventListener("wheel", handleWheel, { passive: true });
    return () => container?.removeEventListener("wheel", handleWheel);
  }, [currentSlide, isAnimating]);

  // Touch navigation
  useEffect(() => {
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e) => {
      if (isAnimating) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };

    const container = containerRef.current;
    container?.addEventListener("touchstart", handleTouchStart);
    container?.addEventListener("touchend", handleTouchEnd);
    return () => {
      container?.removeEventListener("touchstart", handleTouchStart);
      container?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentSlide, isAnimating]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnimating) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, isAnimating]);

  // Initialize slides
  useGSAP(
    () => {
      const slides = containerRef.current?.querySelectorAll(".slide");
      
      // First, hide ALL text elements across all slides
      const allTextElements = containerRef.current?.querySelectorAll(".text-element");
      gsap.set(allTextElements, { opacity: 0 });
      
      slides?.forEach((slide, index) => {
        if (index === 0) {
          // First slide visible
          gsap.set(slide, {
            clipPath: "inset(0 0 0 0)",
            zIndex: 1,
          });
          // Fade in first slide's elements
          const textElements = slide.querySelectorAll(".text-element");
          gsap.to(textElements, {
            opacity: 1,
            duration: 0.8,
            stagger: 0.06,
            delay: 0.3,
            ease: "power1.out",
          });
        } else {
          // Other slides hidden
          const direction = directions[getDirection(index)];
          gsap.set(slide, {
            clipPath: direction.initial.clipPath,
            zIndex: 0,
          });
        }
      });
    },
    { scope: containerRef }
  );

  // ============================================
  // RENDER
  // ============================================
  return (
    <Loader>
      <CloseButton />

      <div ref={containerRef} className="h-screen overflow-hidden relative font-futura-md">
        <div className="relative w-full h-full">
          {/* Render all slides */}
          {type1SlidesData.map((slideData, index) => (
            <div
              key={slideData.id}
              data-slide-index={index}
              className="slide absolute inset-0 w-full h-full overflow-hidden"
            >
              <div className="slide-content absolute inset-0 w-full h-full">
                <Slide data={slideData} />
              </div>
            </div>
          ))}

          {/* Progress Indicator */}
          <div className="bottom-3 sm:bottom-4 md:bottom-5 lg:bottom-6 w-[85%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 absolute left-1/2 -translate-x-1/2 z-50">
            <div className="relative w-full h-0.5 sm:h-[3px] md:h-1 bg-gray-300 rounded-none overflow-hidden opacity-70">
              <div
                className="h-full bg-gray-500 transition-all duration-300 ease-out rounded-none"
                style={{
                  width: `${((currentSlide + 1) / totalSlides) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* 
            === OPTIONAL: SLIDE COUNTER ===
            Uncomment to show current slide number
          */}
          {/*
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 lg:bottom-6 right-3 sm:right-4 md:right-5 lg:right-6 z-50 text-gray-500 text-[10px] sm:text-xs md:text-sm font-light">
            {currentSlide + 1} / {totalSlides}
          </div>
          */}
        </div>
      </div>
    </Loader>
  );
};

export default Features;
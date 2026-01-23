import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { ImageContainer } from "../components/ImageContainer";
import { slidesData } from "../constants/data";
import Loader from "../components/Loader";
import OrientationLock from "../components/OrientationLock";

// Register plugins
gsap.registerPlugin(useGSAP, CustomEase);

// Create custom ease outside component (runs once)
CustomEase.create(
  "hop",
  "M0,0 C0.083,0.294 0.117,0.767 0.413,0.908 0.606,1 0.752,1 1,1 "
);

// Helper function to check if a source is a video
const isVideo = (src) => {
  if (!src) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return videoExtensions.some(ext => src.toLowerCase().endsWith(ext));
};

export default function StorySlider({
  slides = slidesData,
  duration = 2.0,
  throttleDelay = 500,
}) {
  const navigate = useNavigate();
  const containerRef = useRef();
  const animatingRef = useRef(false);
  const [currentCategory, setCurrentCategory] = useState("amenities");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Touch handling
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const touchEndY = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 50;

  // Accumulated delta for touchpad
  const accumulatedDelta = useRef(0);
  const SCROLL_THRESHOLD = 100;

  // ✅ Add useEffect to control overflow locally
  useEffect(() => {
    // Store original values
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlHeight = document.documentElement.style.height;

    // Apply slider-specific styles
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.documentElement.style.height = "100vh";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.height = originalHtmlHeight;
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, []);

  // Calculate category boundaries
  const categorySlideCount = slides.reduce((acc, slide) => {
    acc[slide.category] = (acc[slide.category] || 0) + 1;
    return acc;
  }, {});

  const totalSlides = slides.length;

  const amenitiesWidth = (categorySlideCount.amenities / totalSlides) * 100;
  const apartmentWidth = (categorySlideCount.apartment / totalSlides) * 100;

  const overallProgress = ((currentSlideIndex + 1) / totalSlides) * 100;

  // Animate text elements when slide becomes active
  const animateTextElements = (slideElement) => {
    const title = slideElement.querySelector(".slide-title");

    if (!title) return;

    gsap.set(title, {
      opacity: 0,
      y: 30,
    });

    gsap.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.1,
      ease: "power3.out",
    });
  };

  const { contextSafe } = useGSAP(
    () => {
      const slider = containerRef.current.querySelector(".slider");
      let slideElements = slider.querySelectorAll(".slide");

      slideElements.forEach((slide, index) => {
        if (index > 0) {
          gsap.set(slide, {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          });
          // Reset title opacity for non-active slides
          const title = slide.querySelector(".slide-title");
          if (title) {
            gsap.set(title, { opacity: 0, y: 30 });
          }
        }
      });

      const firstSlide = slideElements[0];
      if (firstSlide) {
        animateTextElements(firstSlide);
      }

      const handleSliderNext = () => {
        if (animatingRef.current) return;
        animatingRef.current = true;

        slideElements = slider.querySelectorAll(".slide");

        const firstSlide = slideElements[0];
        const secondSlide = slideElements[1];

        if (slideElements.length > 1) {
          const nextCategory = secondSlide.getAttribute("data-category");
          const nextSlideIndex = parseInt(
            secondSlide.getAttribute("data-slide-index")
          );

          setCurrentCategory(nextCategory);
          setCurrentSlideIndex(nextSlideIndex);

          const firstAnimTarget = firstSlide.querySelector(".slide-content");
          const secondAnimTarget = secondSlide.querySelector(".slide-content");

          gsap.set(secondAnimTarget, { y: 500 });

          gsap.to(secondAnimTarget, {
            y: 0,
            duration: duration,
            ease: "hop",
          });

          gsap.to(firstAnimTarget, {
            y: -500,
            duration: duration,
            ease: "hop",
          });

          gsap.to(secondSlide, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: duration,
            ease: "hop",
            onUpdate: function () {
              const progress = this.progress();
              if (progress >= 0.33 && !secondSlide.dataset.textAnimated) {
                secondSlide.dataset.textAnimated = "true";
                animateTextElements(secondSlide);
              }
            },
            onComplete: function () {
              // Reset the title of the slide being moved to the back
              const firstSlideTitle = firstSlide.querySelector(".slide-title");
              if (firstSlideTitle) {
                gsap.set(firstSlideTitle, { opacity: 0, y: 30 });
              }

              firstSlide.remove();
              slider.appendChild(firstSlide);

              gsap.set(firstSlide, {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              });

              delete secondSlide.dataset.textAnimated;

              animatingRef.current = false;
            },
          });
        } else {
          animatingRef.current = false;
        }
      };

      const handleSliderPrev = () => {
        if (animatingRef.current) return;
        animatingRef.current = true;

        slideElements = slider.querySelectorAll(".slide");

        const lastSlide = slideElements[slideElements.length - 1];
        const currentSlide = slideElements[0];

        if (slideElements.length > 1) {
          const prevCategory = lastSlide.getAttribute("data-category");
          const prevSlideIndex = parseInt(
            lastSlide.getAttribute("data-slide-index")
          );

          setCurrentCategory(prevCategory);
          setCurrentSlideIndex(prevSlideIndex);

          const currentAnimTarget =
            currentSlide.querySelector(".slide-content");
          const lastAnimTarget = lastSlide.querySelector(".slide-content");

          // Reset the title of the incoming slide before animating
          const lastSlideTitle = lastSlide.querySelector(".slide-title");
          if (lastSlideTitle) {
            gsap.set(lastSlideTitle, { opacity: 0, y: 30 });
          }

          slider.removeChild(lastSlide);
          slider.insertBefore(lastSlide, currentSlide);

          gsap.set(lastSlide, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          });
          gsap.set(lastAnimTarget, { y: -500 });
          gsap.set(currentAnimTarget, { y: 0 });

          gsap.to(lastAnimTarget, {
            y: 0,
            duration: duration,
            ease: "hop",
          });

          gsap.to(currentAnimTarget, {
            y: 500,
            duration: duration,
            ease: "hop",
          });

          gsap.to(currentSlide, {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            duration: duration,
            ease: "hop",
            onUpdate: function () {
              const progress = this.progress();
              if (progress >= 0.33 && !lastSlide.dataset.textAnimated) {
                lastSlide.dataset.textAnimated = "true";
                animateTextElements(lastSlide);
              }
            },
            onComplete: function () {
              // Reset the title of the slide that just left
              const currentSlideTitle =
                currentSlide.querySelector(".slide-title");
              if (currentSlideTitle) {
                gsap.set(currentSlideTitle, { opacity: 0, y: 30 });
              }

              gsap.set(currentAnimTarget, { y: 0 });
              delete lastSlide.dataset.textAnimated;
              animatingRef.current = false;
            },
          });
        } else {
          animatingRef.current = false;
        }
      };

      const handleWheel = contextSafe((event) => {
        if (animatingRef.current) {
          accumulatedDelta.current = 0;
          return;
        }

        const delta = event.deltaY;
        accumulatedDelta.current += delta;

        if (Math.abs(accumulatedDelta.current) >= SCROLL_THRESHOLD) {
          if (accumulatedDelta.current > 0) {
            handleSliderNext();
          } else {
            handleSliderPrev();
          }

          accumulatedDelta.current = 0;
        }
      });

      window.addEventListener("wheel", handleWheel, { passive: true });
      window.handleSliderNext = handleSliderNext;
      window.handleSliderPrev = handleSliderPrev;

      return () => {
        window.removeEventListener("wheel", handleWheel);
        delete window.handleSliderNext;
        delete window.handleSliderPrev;
      };
    },
    { scope: containerRef }
  );
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current) return;

    const deltaY = touchStartY.current - touchEndY.current;
    const deltaX = touchStartX.current - touchEndX.current;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY > minSwipeDistance) {
        if (window.handleSliderNext) {
          window.handleSliderNext();
        }
      } else if (deltaY < -minSwipeDistance) {
        if (window.handleSliderPrev) {
          window.handleSliderPrev();
        }
      }
    }

    touchStartY.current = 0;
    touchStartX.current = 0;
    touchEndY.current = 0;
    touchEndX.current = 0;
  };

  const jumpToCategory = contextSafe((category) => {
    if (animatingRef.current || currentCategory === category) return;

    const slider = containerRef.current.querySelector(".slider");
    const slideElements = Array.from(slider.querySelectorAll(".slide"));

    const targetIndex = slideElements.findIndex(
      (slide) => slide.getAttribute("data-category") === category
    );

    if (targetIndex === -1 || targetIndex === 0) return;

    const targetSlide = slideElements[targetIndex];
    const targetSlideIndex = parseInt(
      targetSlide.getAttribute("data-slide-index")
    );

    setCurrentCategory(category);
    setCurrentSlideIndex(targetSlideIndex);

    animatingRef.current = true;

    const currentSlide = slideElements[0];

    const currentAnimTarget = currentSlide.querySelector(".slide-content");
    const targetAnimTarget = targetSlide.querySelector(".slide-content");

    gsap.set(targetAnimTarget, { x: 250 });

    gsap.to(targetAnimTarget, {
      x: 0,
      duration: duration,
      ease: "hop",
    });

    gsap.to(currentAnimTarget, {
      x: -500,
      duration: duration,
      ease: "hop",
    });

    gsap.to(targetSlide, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: duration,
      ease: "hop",
      onUpdate: function () {
        const progress = this.progress();
        if (progress >= 0.33 && !targetSlide.dataset.textAnimated) {
          targetSlide.dataset.textAnimated = "true";
          animateTextElements(targetSlide);
        }
      },
      onComplete: function () {
        for (let i = 0; i < targetIndex; i++) {
          const slideToMove = slider.querySelector(".slide");
          slideToMove.remove();
          slider.appendChild(slideToMove);
          gsap.set(slideToMove, {
            clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
          });
        }

        delete targetSlide.dataset.textAnimated;
        animatingRef.current = false;
      },
    });
  });

  const renderSlideContent = (slide) => {
    const slideIsVideo = isVideo(slide.src);

    return (
      <div className="slide-content absolute top-0 left-0 w-screen h-screen bg-black flex items-center justify-center">
        {/* Media Layer - Video or Image */}
        {slide.revealImage ? (
          <>
            <ImageContainer
              baseImage={slide.src}
              revealImage={slide.revealImage}
              duration={2.5}
              numWaves={8}
              amplitude={0.015}
              enableTrail={false}
              trailWaves={4}
              trailAmplitude={0.008}
              trailRadius={0.15}
              trailDecay={1.0}
              trailSpawnRate={0.03}
              circleRadius={0.03}
              glowIntensity={0.5}
              glowSize={0.03}
            />
            {/* Click to Transition Indicator - Only for shader images */}
            <div className="absolute bottom-24 sm:bottom-36 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
              <div className="flex flex-col items-center gap-4 animate-pulse px-6 py-4 rounded-full">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
                <span className="text-white text-base sm:text-lg lg:text-xl tracking-widest uppercase font-semibold font-futura-medium drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  Click to reveal
                </span>
              </div>
            </div>
          </>
        ) : slideIsVideo ? (
          // Video element - muted, looped, autoplay, responsive
          <video
            src={slide.src}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            style={{
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        ) : (
          // Image element
          <img
            src={slide.src}
            alt={`Slide ${slide.id}`}
            className="w-full h-full object-cover"
            style={{
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        )}

        {/* Title - Left Bottom */}
        {slide.title && (
          <div className="absolute left-6 sm:left-10 md:left-20 lg:left-30 bottom-16 sm:bottom-20 md:bottom-28 lg:bottom-40 z-30">
            <h2 className="slide-title text-white tracking-wide font-futura-medium text-lg sm:text-xl md:text-2xl lg:text-4xl uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-0">
              {slide.title}
            </h2>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <OrientationLock />
      <Loader>
        <div
          ref={containerRef}
          className="fixed inset-0 w-screen h-screen bg-black overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            overscrollBehavior: "none",
            overscrollBehaviorY: "none",
            touchAction: "none",
          }}
        >
          {/* Logo - Top Left */}
          <div className="fixed top-4 left-4 z-50 flex justify-start items-start">
            <img
              src="/images/logo.svg"
              alt="Rustomjee"
              className="h-8 sm:h-10 md:h-12 w-auto"
            />
          </div>

          {/* Close Button - Top Right */}
          <button
            onClick={() => navigate("/home")}
            className="fixed top-4 right-4 z-50 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black/40 backdrop-blur-sm hover:bg-[#1d2938] rounded-full transition-all duration-300 cursor-pointer group"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform"
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

          <div className="slider absolute top-0 left-0 w-full h-full overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                data-category={slide.category}
                data-slide-index={index}
                className="slide absolute top-0 left-0 w-full h-full overflow-hidden will-change-transform"
              >
                {renderSlideContent(slide)}
              </div>
            ))}

            <div className="bottom-4 sm:bottom-6 w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] px-4 sm:px-12 absolute left-1/2 -translate-x-1/2 z-50">
              <div className="relative w-full h-1 bg-white/30 rounded-none overflow-hidden opacity-50">
                <div
                  className="h-full bg-white transition-all duration-300 ease-out rounded-none"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Loader>
    </>
  );
}
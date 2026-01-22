// Broucher.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { type1SlidesData } from "../constants/data";
import Loader from "../components/Loader";

// Register GSAP plugins
gsap.registerPlugin(useGSAP, CustomEase);

// Create custom ease
CustomEase.create(
  "hop",
  "M0,0 C0.083,0.294 0.117,0.767 0.413,0.908 0.606,1 0.752,1 1,1 "
);

// GoldLine Component
const GoldLine = ({ className = "" }) => {
  return (
    <div
      className={`h-[2px] ${className}`}
      style={{
        background:
          "linear-gradient(to right, #C9A961 0%, #D4B574 30%, rgba(201, 169, 97, 0.5) 70%, transparent 100%)",
      }}
    />
  );
};

// Close Button Component
const CloseButton = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/home");
  };

  return (
    <button
      onClick={handleClose}
      className="fixed top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 group"
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
  );
};

const Type1Slide = ({ data }) => {
  // ... (keeping all slide type rendering logic unchanged)

  // ✅ Handle split background type (Slide 2)
  if (data.slideType === "splitBackground") {
    return (
      <div className="flex w-full h-full">
        <div className={`${data.leftSection.widthClassName} relative h-full`}>
          <img
            src={data.leftSection.background.src}
            className={data.leftSection.background.className}
            alt=""
          />

          {data.leftSection.image && (
            <div className={data.leftSection.image.position}>
              <img
                src={data.leftSection.image.src}
                className={`${data.leftSection.image.className} text-element`}
                alt=""
              />
            </div>
          )}
        </div>

        <div className={`${data.rightSection.widthClassName} relative h-full`}>
          <img
            src={data.rightSection.background.src}
            className={data.rightSection.background.className}
            alt=""
          />

          <div
            className={`absolute inset-0 ${data.rightSection.contentClassName} flex flex-col`}
          >
            {data.rightSection.topText && (
              <div
                className={`${data.rightSection.topText.className} text-element mb-2`}
              >
                {data.rightSection.topText.text}
              </div>
            )}

            {data.rightSection.topSubtext && (
              <div
                className={`${data.rightSection.topSubtext.className} text-element mb-8`}
              >
                {data.rightSection.topSubtext.text}
              </div>
            )}

            {data.rightSection.midText && (
              <div
                className={`${data.rightSection.midText.className} text-element mt-auto`}
              >
                {data.rightSection.midText.text}
              </div>
            )}

            {data.rightSection.bottomBoxes && (
              <div
                className={`${data.rightSection.bottomBoxesContainerClassName} text-element`}
              >
                {data.rightSection.bottomBoxes.map((box, index) => (
                  <div key={index} className={box.className} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (data.slideType === "threeImages") {
    return (
      <div className="relative w-full h-full">
        <div
          className={data.imageContainerClassName || "w-full h-full relative"}
        >
          <img src={data.image.src} className={data.image.className} alt="" />

          <div className={data.contentClassName}>
            {data.title?.text && (
              <h2 className={`${data.title.className} text-element`}>
                {data.title.text}
              </h2>
            )}
          </div>

          {data.middleImages && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pt-10">
              <div className={data.middleImagesContainerClassName}>
                {data.middleImages.map((img, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-element flex-1"
                  >
                    <div className={data.imageWrapperClassName}>
                      <img src={img.src} className={img.className} alt="" />
                    </div>

                    {img.subtext && (
                      <div className="mt-4 text-center">
                        <div className={img.subtextClassName}>
                          {img.subtext}
                        </div>
                        {img.subTextSecondLine && (
                          <div className={img.subtextSecondLineClassName}>
                            {img.subTextSecondLine}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.bottomLine?.show && (
            <div
              className={`absolute bottom-10 left-20 right-20 w-auto ${data.bottomLine.className} z-20`}
            />
          )}
        </div>
      </div>
    );
  }

  if (data.slideType === "splitWithLists") {
    return (
      <div className="relative w-full h-full">
        <div
          className={data.imageContainerClassName || "w-full h-full relative"}
        >
          <img src={data.image.src} className={data.image.className} alt="" />

          <div className="absolute inset-0 flex">
            <div className={`${data.leftSection.widthClassName} relative`}>
              <div className={data.leftSection.contentClassName}>
                {data.leftSection.title && (
                  <h2
                    className={`${data.leftSection.title.className} text-element`}
                  >
                    {data.leftSection.title.text}
                  </h2>
                )}

                {data.leftSection.lists && (
                  <div className={data.leftSection.listsContainerClassName}>
                    {data.leftSection.lists.map((list, listIndex) => (
                      <div key={listIndex} className="text-element">
                        <h3 className={list.headingClassName}>
                          {list.heading}
                        </h3>

                        <ul className="list-none">
                          {list.items.map((item, itemIndex) => (
                            <li key={itemIndex} className={list.itemClassName}>
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div
              className={`${data.rightSection.widthClassName} relative flex items-center justify-center`}
            >
              <img
                src={data.rightSection.image.src}
                className={data.rightSection.image.className}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div className={data.imageContainerClassName || "w-full h-full relative"}>
        <img
          src={data.image.src}
          className={data.image.className}
          alt={data.title?.text || ""}
        />

        <div className={data.contentClassName}>
          {data.title?.text && (
            <h2 className={`${data.title.className} text-element`}>
              {data.title.text}
            </h2>
          )}
        </div>

        {data.centerImage && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className={data.centerImage.containerClassName}>
              <img
                src={data.centerImage.src}
                className={data.centerImage.className}
                alt="Center"
              />
              {data.bottomLine?.show && (
                <div
                  className={`absolute bottom-1/5 left-20 right-20 w-auto ${data.bottomLine.className} z-20`}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Broucher Component
const Broucher = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef(null);
  const isAnimating = useRef(false);
  const currentSlideRef = useRef(0);

  const totalSlides = type1SlidesData.length;

  // ... (all your existing logic stays the same)

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  const getRandomDirection = () => {
    const directions = [
      {
        initial: {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          y: 500,
        },
        final: {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          y: 0,
        },
      },
      {
        initial: {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          y: -500,
        },
        final: {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          y: 0,
        },
      },
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  };

  const slideDirections = useRef(
    type1SlidesData.map(() => getRandomDirection())
  );

  useEffect(() => {
    slideDirections.current = type1SlidesData.map(() => getRandomDirection());
  }, []);

  const animateToSlide = (targetIndex) => {
    const current = currentSlideRef.current;

    if (targetIndex === current || isAnimating.current) return;
    if (targetIndex < 0 || targetIndex >= totalSlides) return;

    isAnimating.current = true;

    gsap.killTweensOf([".slide", ".slide-content", ".text-element"]);

    const currentSlideEl = document.querySelector(
      `[data-slide-index="${current}"]`
    );
    const targetSlideEl = document.querySelector(
      `[data-slide-index="${targetIndex}"]`
    );

    if (!currentSlideEl || !targetSlideEl) {
      isAnimating.current = false;
      return;
    }

    const currentContent = currentSlideEl.querySelector(".slide-content");
    const targetContent = targetSlideEl.querySelector(".slide-content");
    const targetTexts = targetSlideEl.querySelectorAll(".text-element");

    const targetDirection = slideDirections.current[targetIndex];
    const currentDirection = slideDirections.current[current];

    gsap.set(targetSlideEl, {
      clipPath: targetDirection.initial.clipPath,
      zIndex: 10,
    });
    gsap.set(targetContent, {
      y: targetDirection.initial.y || 0,
    });
    gsap.set(targetTexts, { opacity: 0, y: 30 });
    gsap.set(currentSlideEl, { zIndex: 5 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(currentSlideEl, {
          clipPath: currentDirection.initial.clipPath,
          zIndex: 1,
        });
        gsap.set(currentContent, {
          y: currentDirection.initial.y || 0,
        });
        gsap.set(targetSlideEl, { zIndex: 1 });
        isAnimating.current = false;
      },
    });

    tl.to(
      currentContent,
      {
        y: currentDirection.initial.y || -500,
        duration: 2,
        ease: "hop",
      },
      0
    )

      .to(
        targetSlideEl,
        {
          clipPath: targetDirection.final.clipPath,
          duration: 2,
          ease: "hop",
        },
        0
      )

      .to(
        targetContent,
        {
          y: targetDirection.final.y || 0,
          duration: 2,
          ease: "hop",
        },
        0
      )

      .to(
        targetTexts,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "hop",
        },
        0.8
      );

    setCurrentSlide(targetIndex);
  };

  const handlePrevSlide = () => {
    const current = currentSlideRef.current;
    if (current === 0) {
      animateToSlide(totalSlides - 1);
    } else {
      animateToSlide(current - 1);
    }
  };

  const handleNextSlide = () => {
    const current = currentSlideRef.current;
    if (current === totalSlides - 1) {
      animateToSlide(0);
    } else {
      animateToSlide(current + 1);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout = null;
    let accumulatedDelta = 0;
    const scrollThreshold = 50;

    const handleWheel = (e) => {
      e.preventDefault();

      if (isAnimating.current) return;

      accumulatedDelta += e.deltaY;

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(() => {
        if (Math.abs(accumulatedDelta) >= scrollThreshold) {
          if (accumulatedDelta > 0) {
            handleNextSlide();
          } else {
            handlePrevSlide();
          }
        }
        accumulatedDelta = 0;
      }, 50);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;
    let touchEndY = 0;
    const swipeThreshold = 50;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
    };

    const handleTouchEnd = (e) => {
      if (isAnimating.current) return;

      touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) >= swipeThreshold) {
        if (deltaY > 0) {
          handleNextSlide();
        } else {
          handlePrevSlide();
        }
      }
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnimating.current) return;

      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowRight" ||
        e.key === "PageDown" ||
        e.key === " "
      ) {
        e.preventDefault();
        handleNextSlide();
      } else if (
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "PageUp"
      ) {
        e.preventDefault();
        handlePrevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useGSAP(
    () => {
      const slideElements = document.querySelectorAll(".slide");

      slideElements.forEach((slide, index) => {
        const direction = slideDirections.current[index];

        if (index === 0) {
          gsap.set(slide, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          });
          gsap.set(slide.querySelector(".slide-content"), { y: 0 });

          const firstTexts = slide.querySelectorAll(".text-element");
          gsap.set(firstTexts, { opacity: 0, y: 30 });
          gsap.to(firstTexts, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "hop",
            delay: 0.3,
          });
        } else {
          gsap.set(slide, {
            clipPath: direction.initial.clipPath,
          });
          gsap.set(slide.querySelector(".slide-content"), {
            y: direction.initial.y || 0,
          });
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <Loader>
      {/* ✅ Close Button Added Here */}
      <CloseButton />

      <div ref={containerRef} className="h-screen overflow-hidden relative">
        <div className="relative w-full h-full">
          {type1SlidesData.map((slideData, index) => (
            <div
              key={slideData.id}
              data-slide-index={index}
              className="slide absolute inset-0 w-full h-full overflow-hidden"
            >
              <div className="slide-content absolute inset-0 w-full h-full">
                <Type1Slide data={slideData} />
              </div>
            </div>
          ))}

          {/* Slide Indicators */}
          <div className="bottom-6 w-[90%] sm:w-[50%] px-4 sm:px-12 absolute left-1/2 -translate-x-1/2 z-50">
            <div className="relative w-full h-1 bg-gray-300 rounded-none overflow-hidden opacity-70">
              <div
                className="h-full bg-gray-500 transition-all duration-300 ease-out rounded-none"
                style={{
                  width: `${((currentSlide + 1) / totalSlides) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Loader>
  );
};

export default Broucher;

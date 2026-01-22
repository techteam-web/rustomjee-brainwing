import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import ReactLenis from "lenis/react";
import OrientationLock from "../components/OrientationLock";
import Loader from "../components/Loader";
import NavigationBar from "../components/Nav";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/all";

// REGISTER PLUGINS
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const Home = () => {
  const container = useRef(null);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  // --- SECTIONS ---
  const section1 = useRef(null);
  const section2 = useRef(null);
  const section3 = useRef(null);
  

  // --- ELEMENTS ---
  const heroImage = useRef(null);
  const heroVideo = useRef(null);
  const dreamInBandra = useRef(null);
  
  const introLogo = useRef(null);
  const introText1 = useRef(null);
  const introText2 = useRef(null);
  const scrollIndicator = useRef(null);
  
  const midText = useRef(null);
  const midVideo = useRef(null);
  
  const skyImage = useRef(null);
  const bottomLogo = useRef(null);
  const bottomNavbar = useRef(null);
  
  // NEW: Sticky RERA image ref
  const stickyImage = useRef(null);


  const width = window.innerWidth;

  let scaleValue;
  let yValue;
  let startValue;
  let midTextStart;
  let bandraStart;
  let bandraHeight="190vh";

  if(width >=3840){
    scaleValue = 1.25;
    yValue = -500;
    startValue = "95% top";
    midTextStart= "55% 40%";
    bandraStart = "10% top";
  }
  else if(width>=2960){
    scaleValue = 1.1;
    yValue = -70;
    startValue = "95% top";
    midTextStart= "55% 40%";
    bandraStart = "10% top";
  }
  else if(width>=2560){
    scaleValue = 1.25;
    yValue = -340;
    startValue = "95% top";
    midTextStart= "55% 40%";
    bandraStart = "10% top";
  }   
  else if(width>=1440){
    scaleValue = 1.1;
    yValue = -20;
    startValue = "75% top";
    midTextStart= "55% 40%";
    bandraStart = "10% top";
  }
  else if(width==1366 || width==1368){
    scaleValue = 1.2;
    yValue = -130;
    startValue = "80% top";
    midTextStart= "55% 40%";
    bandraStart = "10% top";
  }
  else if (width >= 1280) {
    scaleValue = 1.03;
    yValue = -10;
    startValue = "80% top";
    midTextStart= "55% 40%";
    bandraStart = "bottom 145%";
  } 
  else if (width >= 1024) {
    scaleValue = 1.1;
    yValue = -40;
    startValue = "70% top";
    midTextStart = "55% 40%";
    bandraStart= "20% top";
  } 
  else if(width==914){
    scaleValue= 1.03;
    yValue = 20;
    startValue= "95% top";
    midTextStart="55% top";
    bandraStart = "bottom 145%";
    bandraHeight= "200vh";
  }
  else if(width>=800){
    scaleValue= 1.03;
    yValue = 20;
    startValue= "95% top";
    midTextStart="55% top";
    bandraStart = "bottom 145%";
  }
  else if(width==740){
    scaleValue= 1.03;
    yValue = 5;
    startValue= "95% top";
    midTextStart="40% top";
    bandraStart = "bottom 145%";
  }
  else if(width==720){
    scaleValue= 1.2;
    yValue = -60;
    startValue= "70% top";
    midTextStart="40% top";
    bandraStart = "20% top";
    bandraHeight = "200vh";
  }
  else if (width >= 640) {
    scaleValue = 1.03;
    yValue = -10;
    startValue= "85% top";
    midTextStart= "30% top";
    bandraStart = "bottom 145%";
  } else {
    scaleValue = 1.03;
    yValue = -10;
    startValue = "100% top";
    bandraStart = "bottom 145%";
  }

  // ========================================================
  // 1. INTRO ANIMATION
  // ========================================================
  useGSAP(
    () => {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "auto";
          setScrollEnabled(true);
           // Refresh ScrollTrigger after intro completes
          //  setTimeout(() => {
          //   ScrollTrigger.refresh(true);
          // }, 100);
        },
      });

      if (introLogo.current) {
        tl.fromTo(introLogo.current, { opacity: 0 }, { opacity: 1, duration: 2, delay: 0.5, ease: "power1.inOut" });
      }
      if (introText1.current) {
        tl.fromTo(introText1.current, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: "power1.inOut" }, "+=0.3")
          .to(introText1.current, { opacity: 0, duration: 1.5, delay: 1, ease: "power1.inOut" }, "+=0");
      }
      if (introText2.current) {
        tl.fromTo(introText2.current, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: "power1.inOut" }, "+=0.2")
          .to(introText2.current, { opacity: 0, duration: 1.5, delay: 1, ease: "power1.inOut" }, "+=0");
      }
      if (scrollIndicator.current) {
        tl.fromTo(scrollIndicator.current, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: "power1.inOut" }, "+=0.2");
      }

      return () => {
        document.body.style.overflow = "auto";
      };
    },
    { scope: container }
  );

  // ========================================================
  // 2. MID TEXT ANIMATION
  // ========================================================
  useEffect(() => {
    
    if (!midText.current || !section1.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        midText.current,
        { opacity: 1 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            markers: false,
            trigger: section1.current,
            start: bandraStart,
            end: "bottom 130%", 
            scrub: 1, 
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  // ========================================================
  // 3. BOTTOM ANIMATION (includes sticky RERA image)
  // ========================================================
  useEffect(() => {
    if(!scrollEnabled) return;
    if (!section3.current || !bottomLogo.current || !skyImage.current) return;

    const ctx = gsap.context(() => {
      const navTarget = ".bottom-nav";

      // Initial States
      gsap.set(bottomLogo.current, { opacity: 0, yPercent: 50, scale: 0.9 });
      gsap.set(navTarget, { opacity: 0, yPercent: 100 });
      gsap.set(stickyImage.current, { opacity: 0 }); // Hide RERA image initially

      // --- TIMELINE 1: LOGO ANIMATION ---
      const tlLogo = gsap.timeline({
        scrollTrigger: {
          trigger: section3.current,
          // markers: true,
          start: "top top",
          end: "70% bottom",
          scrub: 2,
        },
      });

      tlLogo.to(bottomLogo.current, {
        opacity: 1,
        yPercent: 0,
        scale: 1,
        ease: "circ.out",
        duration: 1,
      })
      .to(bottomLogo.current, {
        yPercent: -100, 
        opacity: 0,     
        ease: "",
        duration: 2,    
      }, "+=1.5");

      // --- TIMELINE 2: ZOOM & NAVBAR ANIMATION ---
      const tlNav = gsap.timeline({
        scrollTrigger: {
          trigger: skyImage.current,
          // markers: true,
          start: "top top", 
          end: "bottom bottom",
          scrub: 2, 
          invalidateOnRefresh: true,
          immediateRender: false,
          onEnter: () => {}, // Ensures animation only plays on scroll
        },
      });

      tlNav.to(skyImage.current, {
        y: yValue,
        scale: scaleValue, 
        ease: "power3.in",
        duration: 10,
        immediateRender: false,
      });

      tlNav.to(navTarget, {
        opacity: 1,
        yPercent: 0,
        ease: "power1.in",
        duration: 1,
        immediateRender: false,
      }, "-=9");

      // --- STICKY RERA IMAGE ANIMATION ---
      // Appears after navbar animation completes
      tlNav.to(stickyImage.current, {
        opacity: 1,
        ease: "power2.out",
        duration: 2,
        // immediateRender: false,
      }, "-=2");
      
    }, container);
    
    return () => ctx.revert();
  }, [scrollEnabled]);

  return (
    <>
      <OrientationLock />
      <Loader>
        {scrollEnabled && <ReactLenis root options={{ duration: 3 }} />}
        
        <div ref={container} className="w-full overflow-hidden bg-[#dedbd4] font-futura-medium tracking-wider">
          
          {/* --- SECTION 1: INTRO --- */}
          <section ref={section1} className="w-full relative overflow-hidden z-10 -mb-[28vh]">
            
            <img 
              ref={heroImage} 
              src="/images/TopSea1.png" 
              className="w-full h-auto block relative z-0 pointer-events-none" 
              alt="Hero Background" 
            />
            
            <video
              ref={heroVideo}
              muted loop playsInline autoPlay
              className="
                absolute top-0 left-0 w-full h-auto z-10 
                [mask-image:url(/images/AlphaMask.jpg)] [-webkit-mask-image:url(/images/AlphaMask.jpg)] 
                [mask-mode:luminance] [-webkit-mask-mode:luminance] 
                [mask-size:100%_100%] [-webkit-mask-size:100%_100%] 
                [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat] 
                [mask-position:center] [-webkit-mask-position:center]
              "
            >
              <source src="/video/beachfinal2.mp4" type="video/mp4" />
            </video>

            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
              <img ref={introLogo} src="/images/logo.svg" alt="Rustomjee" className="h-12 xl:h-18 lg:h-16 w-auto opacity-0 3xl:h-30 4xl:h-45" />
            </div>

            {/* OVERLAY CONTAINER: Covers entire Section 1 */}
            <div className={`absolute top-0 left-0 w-full h-[200vh]  max-lg:h-[200vh] max-md:h-[200vh] max-xl:h-[160vh] max-2xl:h-[155vh] 3xl:h-[200vh] z-60 pointer-events-none flex flex-col`}>
            
              {/* --- TOP HALF: INTRO TEXT & SCROLL --- */}
              <div className="flex-1 relative w-full flex flex-col justify-end pb-10">
                
                <div className="relative w-full h-20"> 
                  {/* Intro Text 1 */}
                  <h1 
                    ref={introText1} 
                    className="absolute bottom-0 w-full text-center text-4xl max-md:text-2xl max-lg:text-2xl max-xl:text-3xl 3xl:text-4xl 4xl:text-6xl text-white opacity-0 uppercase" 
                     
                  >
                    A quiet statement perched above the tides of time.
                  </h1>

                  {/* Intro Text 2 */}
                  <h1 
                    ref={introText2} 
                    className="absolute bottom-0 w-full text-center text-4xl max-md:text-2xl max-lg:text-2xl 3xl:text-4xl 4xl:text-6xl text-white opacity-0 uppercase " 
                     
                  >
                    Where the sea tells its secrets
                  </h1>

                  {/* Scroll Indicator */}
                  <div
                    ref={scrollIndicator}
                    className={`scroll-indicator absolute bottom-0 w-full flex flex-col items-center opacity-0 cursor-pointer ${scrollEnabled? 'pointer-events-auto': 'pointer-events-none'}`}
                    onClick={() => gsap.to(window, { duration: 2, scrollTo: dreamInBandra.current, ease: "power3.inOut" })}
                  >
                    <p className="uppercase max-md:text-xl  w-full text-center text-2xl 3xl:text-4xl 4xl:text-6xl text-white">Scroll</p>
                    <div className="flex flex-col -space-y-5 4xl:-space-y-13">
                      <svg className="w-7 h-7 xl:w-8 xl:h-8 max-md:w-5 4xl:w-20 4xl:h-20" fill="white" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                      <svg className="w-7 h-7 xl:w-8 xl:h-8 max-md:w-5 4xl:w-20 4xl:h-20" fill="white" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- BOTTOM HALF: MID TEXT --- */}
              <div 
                ref={dreamInBandra}
                className="flex-1 relative max-md:bottom-32 w-full flex items-center justify-center"
              >
                <h1
                  ref={midText}
                  className=" text-5xl max-md:text-2xl tracking-wider max-lg:text-2xl 3xl:text-7xl 4xl:text-[120px] text-[#ffffff] opacity-0 text-center uppercase"
                   
                >
                  A DREAM IN BANDRA
                </h1>
              </div>

            </div>
          </section>

          {/* --- SECTION 2: MID --- */}
          <section ref={section2} className="w-full h-auto relative -mb-[20vh] z-0">
            <video ref={midVideo} autoPlay loop muted playsInline className="w-full object-cover">
              <source src="/video/newcenter2.mp4" />
            </video>
          </section>

          {/* --- SECTION 3: BOTTOM --- */}
          <section ref={section3} className="w-full h-auto relative overflow-hidden z-20">
            <div
              ref={bottomLogo}
              className="absolute top-120 max-md:top-55 max-lg:top-100 3xl:top-210 4xl:top-380 3xl:text-7xl 4xl:text-9xl left-1/2 overflow-hidden -translate-x-1/2 text-5xl max-md:text-2xl max-lg:text-2xl text-black text-center z-30 opacity-0 mt-10"
            >
              <img src="/images/Cliff-tower.png" alt="Logo" className="h-60 w-auto max-md:h-20 max-lg:h-30  3xl:h-70 4xl:h-80 mx-auto mb-4 " />
              
            </div>

            <div className="relative w-full">
              <img
                ref={skyImage}
                src="/images/SkyToBuilding1.2.png" 
                alt="Cliff Tower Image" 
                className="w-full" 
              />
            </div>
            
            {/* Navbar Wrapper */}
            <div className="absolute bottom-5 max-md:bottom-2 max-lg:bottom-2 left-0 w-full 4xl:bottom-20 px-10 z-50">
              <NavigationBar className="bottom-nav opacity-0 3xl:scale-150 4xl:scale-250 " />
            </div>
          </section>

          {/* --- STICKY RERA IMAGE: TOP RIGHT, BIGGER --- */}
          <img
            ref={stickyImage}
            src="/images/Rera.svg"
            alt="RERA Information"
            className="fixed top-6 p-2 right-6 w-36 h-auto z-[100] opacity-0 pointer-events-auto cursor-pointer 
                       max-md:w-24 max-md:top-4 max-md:right-4
                       lg:w-50 lg:top-8 lg:right-8
                       xl:w-90 xl:top-10 xl:right-10
                       3xl:w-64 3xl:top-12 3xl:right-12
                       4xl:w-80 4xl:top-16 4xl:right-16
                       hover:scale-105 transition-transform duration-300 "
          />

        </div>
      </Loader>
    </>
  );
};

export default Home;
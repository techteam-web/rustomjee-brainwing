import NavigationBar from "../components/Nav";
import OrientationLock from "../components/OrientationLock";
import Loader from "../components/Loader";

const HomeNav = () => {
  return (
    <>
      {/* <OrientationLock /> */}
      <Loader />

      <div className="w-full h-screen overflow-hidden bg-[#7fa4c9] relative">
        
        {/* Background Image - Fixed size, anchored to bottom center */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            backgroundImage: 'url("/images/SkyToBuilding1.2.2.png")',
            backgroundPosition: 'bottom center',
            backgroundSize: 'cover',  // Keeps original image size
            backgroundRepeat: 'no-repeat'
            
          }}
        />

        {/* Logo - Top Center */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-40 cursor-pointer hover:scale-105 transition-transform duration-300 text-center font-balgin font-bold uppercase flex flex-col "
        >
          <img
            src="/images/logo.png"
            alt="Rustomjee"
            className="h-12 xl:h-18 lg:h-16 w-auto 3xl:h-30 4xl:h-45"
          />
          <p className="text-2xl ">Cliff Tower</p>
        </div>

        {/* RERA Image - Top Right */}
        

        {/* Navigation Bar - Bottom */}
        <div className="absolute bottom-5 max-md:bottom-2 max-lg:bottom-2 left-0 w-full 4xl:bottom-20 px-10 z-50">
          <NavigationBar className="3xl:scale-150 4xl:scale-250 opacity-100" />
        </div>
      </div>
    </>
  );
};

export default HomeNav;
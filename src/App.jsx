import { BrowserRouter, Route, Routes } from "react-router-dom";
import Inventory from "./pages/Inventory";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Features from "./pages/Features";
import Map from "./pages/Map";
import ScrollToTop from "./components/ScrollToTop";
import OrientationLock from "./components/MobileOrientationAndFullscreen";
import MusicController from "./components/MusicController";
import HomeNav from "./pages/HomeNav";
import BackButtonHandler from "./components/BackButtonHandler ";
import Views from "./components/Views";

// Global logo component
const GlobalLogo = () => (
  <img
    src="/images/Brainwing-logo.webp"  // Update this path
    alt="Logo"
     className="fixed bottom-7 right-20 w-40 h-auto opacity-50 z-[9999] pointer-events-none"
  />
);

const App = () => {
  return (
    <OrientationLock>
      <MusicController play={true}/>
      <GlobalLogo />
      <BrowserRouter>
        <ScrollToTop />
        <BackButtonHandler />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Main home with navbar - after close button */}
        <Route path="/home" element={<HomeNav />} />

          <Route path="/floorplan" element={<Inventory />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/features" element={<Features />} />
          <Route path="/map" element={<Map />} />
          <Route path="/views" element={<Views />} />
        </Routes>
      </BrowserRouter>
    </OrientationLock>
  );
};
export default App;

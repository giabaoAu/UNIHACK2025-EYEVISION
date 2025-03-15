import Navbar from "@/components/Navbar";

import {Background} from "@/components/AuroraBackground";
import Footer from "@/components/Footer";
import { LandingBackground } from "@/components/LandingBackground";

export default function Home() {
  return (
    <>
      <LandingBackground imagePath='/hero_bg.jpg'>
        <Navbar />
        <Background />
        <Footer />
      </LandingBackground>
    </> 
  );
}


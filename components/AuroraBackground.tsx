/*"use client";

import { motion } from "motion/react";
import React from "react";
import { AuroraBackground } from "./ui/aurora-background";
import Camera from "@/components/Camera";

export function AuroraBackgroundDemo() {
  return (
    <AuroraBackground className="border bg-[#00635D] rounded-xl">
      { <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
      </motion.div> }
      <div className="text-3xl md:text-7xl font-bold text-white dark:text-white text-center">
          EYEVISION: AI-Powered <br />  Assistance for the blind
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          And this, is chemical burn.
        </div>
        <Camera />
    </AuroraBackground>
  );
} */


"use client";
import React from "react";
import Camera from "@/components/Camera";

export function Background() {
  return (
    <div className="gap-2 bg-transparent py-5 text-xl">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="text-3xl lg:text-5xl font-bold text-white text-center float-in pt-10">  
            EYEVISION: AI POWER ASSISSTANT <br></br>
            <span className="typing-effect">Your vision, our mission</span>
            <div className="font-extralight text-base md:text-4xl text-neutral-200 py-4 float-in">
              Take a photo, and here comes the magic
            </div>
          </div>
        <Camera />
      </div>
    </div>
  );
}



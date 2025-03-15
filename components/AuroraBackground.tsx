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
import { cn } from "@/lib/utils";

import localFont from "next/font/local";

const calFont = localFont({
  src: "../public/fonts/CalSans-SemiBold.woff2",
  variable: "--font-cal",
  preload: true,
  display: "swap",
});


export function Background() {
  return (  
    <div className="bg-transparent py-2 text-xl">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className={cn("flex justify-center items-center text-3xl lg:text-5xl font-bold text-white text-center", calFont.className)}>  
          <div className="float-in">
            <h2>EYEVISION: AI-POWERED ASSISTANCE <br></br></h2>
            <span className=" typing-effect">Your vision, our mission</span>
            <div className="font-extralight text-base md:text-4xl text-neutral-200 py-4">
              Take a photo, and here comes the magic
            </div>
          </div>
        </div>

        <div className="fade-in">
          <Camera/>
        </div>
      </div>
    </div>
  );
}



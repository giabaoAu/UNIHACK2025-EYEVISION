"use client";

import { motion } from "motion/react";
import React from "react";
import { AuroraBackground } from "./ui/aurora-background";
import Camera from "@/components/Camera";

export function AuroraBackgroundDemo() {
  return (
    <AuroraBackground className="border bg-[#00635D] rounded-xl">
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold text-white dark:text-white text-center">
          EYEVISION: AI-Powered Assistance for the blind
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          And this, is chemical burn.
        </div>
        <Camera />

      </motion.div>
    </AuroraBackground>
  );
}

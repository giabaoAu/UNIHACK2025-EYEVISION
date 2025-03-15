import { ReactNode } from "react";
import Image from "next/image";

interface BackgroundImageProps {
  children: ReactNode;
  imagePath: string;
}

export function LandingBackground({
  children,
  imagePath,
}: BackgroundImageProps) {
  return (
    <div className="relative min-h-screen w-full">
      <Image
        src='/background.png'
        alt="Background"
        fill
        priority
        className="object-cover z-0"
        quality={100}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

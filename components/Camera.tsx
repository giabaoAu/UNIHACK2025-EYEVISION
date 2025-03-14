"use client";

import React, { useRef, useState, useEffect } from "react";
import { speakText } from "./Speech";
import {useRouter} from "next/navigation";

let front = false;

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_API_KEY; 
const Camera = () => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showCapturedPhoto, setShowCapturedPhoto] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null); 

  const startCamera = async () => {
    try {

      if(stream){
        stopCamera(); 
      }

      const constraints = { video: { facingMode: front ? "user" : "environment" } };

      const userStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }
      setStream(userStream);

    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);


  const flipCamera = () =>{
    front = !front;
    startCamera(); 
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const capturedImage = canvas.toDataURL("image/png");
        setPhoto(capturedImage);
        setShowCapturedPhoto(true);


        analyzePhoto(capturedImage);
      }
    }
  };

  const analyzePhoto = async (imageBase64: string) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    inlineData: {
                      mimeType: "image/png",
                      data: imageBase64.split(",")[1], 
                    },
                  },
                ],
                role: "user", 
              },
            ],
            generationConfig: {
              temperature: 0.7, 
              maxOutputTokens: 256, 
            },
          }),
        }
      );
  
      const data = await response.json();
      console.log("Gemini AI Full Response:", data); 
  
      const description = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (description) {
        setAnalysisResult(description);
      } else {
        setAnalysisResult("Gemini could not analyze the image.");
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      setAnalysisResult("Error analyzing image.");
    }
  };

  return (
    <div className="relative flex flex-col items-center space-y-4">

      <div className="relative w-100 h-120 border border-gray-500 rounded-4xl">
        <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover" />
        
        {showCapturedPhoto && photo && (
          <img src={photo} alt="Captured" className="absolute top-0 left-0 w-full h-full object-cover" />
        )}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={takePhoto}
          className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2"
        >
          Capture Photo
        </button>
        <button onClick={flipCamera}
          className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">flip</button>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {analysisResult && (
        <div className="mt-4 p-4 bg-gray-800 text-white rounded-md w-80 text-center">
          <h3 className="text-lg py-2 font-bold">AI Analysis:</h3>
          <p>{analysisResult}</p>
          <button 
            onClick={() => speakText(analysisResult)}
            className="bg-black dark:bg-white rounded-full w-[50vw] text-white dark:text-black md:max-w-full px-4 py-4"
          >
            Speak
          </button> 
        </div>
        
      )}
    </div>
  );
};

export default Camera;

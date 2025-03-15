"use client";

import { useRef, useState, useEffect } from "react";
import { speakText } from "./Speech";
import Image from 'next/image'

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string; image?: string }[]
  >([]);
  const [isListening, setIsListening] = useState(false);

  const [showPhoto, setShowPhoto] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);

  const toggleViewPhoto = () => {
    setShowPhoto((prev) => !prev);
  }

  const recognition =
    typeof window !== "undefined" &&
    new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event: { results: { transcript: any }[][] }) => {
      const transcript = event.results[0][0].transcript;
      setUserQuery(transcript);
      handleUserQuery(transcript);
    };
  }

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    }
  };

  // const startCamera = async () => {
  //   try {
  //     if (stream) stopCamera();
  //     const userStream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //     });
  //     if (videoRef.current) videoRef.current.srcObject = userStream;
  //     setStream(userStream);
  //   } catch (error) {
  //     console.error("Error accessing the camera:", error);
  //   }
  // };

  const startCamera = async () => {
    try {
      if (stream) stopCamera();
      
      const constraints: MediaStreamConstraints = {
        video: { facingMode: isFrontCamera ? "user" : "environment" }
      };
  
      const userStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) videoRef.current.srcObject = userStream;
      setStream(userStream);
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const flipCamera = () => {
    setIsFrontCamera((prev) => !prev);
    stopCamera();
    startCamera();
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
  }, [isFrontCamera]);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const capturedImage = canvas.toDataURL("image/png");
        setPhoto(capturedImage);
        analyzePhoto(capturedImage);
      }
    }
  };

  const captureAgain = () => {
    setShowChat(false);
    setAnalysisResult(null);
    setUserQuery("");
    setChatHistory([]);
    
    if (stream) {
      stopCamera();
    }

    startCamera();
  }

  const analyzePhoto = async (imageBase64: string) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: "Analyze this picture in detail.",
                  },
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
            generationConfig: { temperature: 0.7, maxOutputTokens: 256 },
          }),
        }
      );
  
      const data = await response.json();
      const fullDescription =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Could not analyze the image."
  
      // Update chat history with the full description
      setChatHistory([
        ...chatHistory,
        { role: "user", content: "Sent a photo", image: imageBase64 },
        { role: "AI", content: `Image Description: ${fullDescription}` }, // Store full description
      ]);
  
      // Set the summarized description
      setAnalysisResult(fullDescription);
      //speakText(fullDescription);
      setShowChat(true);
    } catch (error) { 
      console.error("Error analyzing image:", error);
    }
  };
  
  
  const handleUserQuery = async (query: string = userQuery) => {
    if (!query.trim()) return;

    const lastImageDescription = [...chatHistory].reverse().find((msg) => msg.content.startsWith("Image Description:"))?.content;

  
    console.log(
      "Last Image Description:",
      lastImageDescription || "No Description Found"
    );
  
    try {
      let finalContents = [];
  
      if (lastImageDescription) {
        finalContents.push({
          role: "user",
          parts: [{ text: lastImageDescription }],
        });
      }
  
      // Add the user’s question
      finalContents.push({
        role: "user",
        parts: [{ text: `Base on the photo description provided, answer questions. You are an AI assisting a blind user. Be short and concise in your response: ${query}` }],
      });
  
  
      console.log("Final Contents for AI Request:");
      console.log(JSON.stringify(finalContents, null, 2));
  
      const finalResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: finalContents,
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 256,
              topP: 0.8,
              topK: 40,
            },
          }),
        }
      );
  
      const finalData = await finalResponse.json();
      console.log("FULL Gemini AI Response:", JSON.stringify(finalData, null, 2));
  
      const aiResponse =
        finalData?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
  
      console.log("AI Answer:", aiResponse);
      setChatHistory([
        ...chatHistory,
        { role: "user", content: query },
        { role: "AI", content: aiResponse },
      ]);
  
      speakText(aiResponse);
    } catch (error) {
      console.error("Error getting response:", error);
    }
  };
  
  return (
    <div className="relative w-full h-full px-4 mx-auto flex flex-col items-center justify-center bg-transparent text-white">
      {!showChat ? (
        <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="border-2 border-gray-500 rounded-3xl"
            />
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

            {/* <button
             onClick={takePhoto}
             className="mt-4 cursor-pointer"
            >
              <Image src="/Camera.png" alt="test" className='rounded-4xl' width={100} height={100} />  
            </button> */}

            <div className="flex gap-16 flex-row ">
              <button
                onClick={takePhoto}
                className="flex flex-col items-center mt-4 cursor-pointer"
              >
                <Image
                  src="/Camera.png"
                  alt="camera"
                  className="rounded-4xl"
                  width={100}
                  height={100}
                />
                <span className="text-base mt-2">Take Photo</span> {/* Text under the icon */}
              </button>

              <button
                onClick={flipCamera}
                className="flex flex-col items-center mt-4 cursor-pointer"
              >
                <Image
                  src="/Camera.png"
                  alt="camera"
                  className="rounded-4xl"
                  width={100}
                  height={100}
                />
                <span className="text-base mt-2">Flip Camera</span> {/* Text under the icon */}
              </button>
            </div>
        </>
      ) : (
            <div className="relative w-full f-full bg-transparent flex flex-col h-full min-h-2xl space-y-4">
              <div className="relative flex flex-col h-full min-h-2xl space-y-4">
                <button 
                  onClick={toggleViewPhoto} 
                  className="p-2 text-base bg-[#3B3B3B] text-white rounded-[48px] border-1 border-[#4D4D4D]">
                  {showPhoto ? "Hide Photo" : "Show Photo"}
                </button>
              
                  {showPhoto && photo && (
                    <img
                      src={photo}
                      alt="Captured"
                      className="w-full max-h-100 object-contain mb-4 rounded-3xl"
                    />
                )}

                <h2 className="text-xl font-bold">Chat about the Image</h2>
                <div className="p-2 overflow-auto h-[300px] bg-transparent rounded-md">
                  {chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`my-2 mx-2 text-sm rounded-md w-fit px-2 ${
                        msg.role === "user"
                          ? "bg-gray-600 ml-auto text-white text-right"
                          : "bg-gray-300 text-black text-left"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                </div>

                <div className="flex justify-center space-x-2 gap-2">

                {/* Voice Button */}
                <button
                  onClick={isListening ? stopListening : startListening}
                  className="flex flex-col items-center p-2 cursor-pointer"
                >
                  {isListening ? (
                    <Image
                      src="/StopMicrophone.png"
                      alt="stop microphone"
                      className="rounded-4xl"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <Image
                      src="/Microphone.png"
                      alt="microphone"
                      className="rounded-4xl"
                      width={100}
                      height={100}
                    />
                  )}
                  <span className="text-base mt-2">{isListening ? "Stop" : "Voice"}</span> {/* Text under the icon */}
                </button>

                {/* Retake Button */}
                <button
                  onClick={captureAgain}
                  className="flex flex-col items-center p-2 cursor-pointer"
                >
                  <Image
                    src="/GoBack.png"
                    alt="retake"
                    className="rounded-4xl"
                    width={100}
                    height={100}
                  />
                  <span className="text-base mt-2">Retake</span> {/* Text under the icon */}
                </button>
              </div>


                
                {/* <div className="flex justify-center space-x-2 gap-2">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className="p-2 cursor-pointer"
                  >
                    
                    {isListening ? <Image src="/StopMicrophone.png" alt="test" className='rounded-4xl' width={100} height={100} /> : 
                    <Image src="/Microphone.png" alt="test" className='rounded-4xl' width={100} height={100} />  }
                  </button>
                  
                
                  <button
                  onClick={captureAgain}
                  className="p-2 cursor-pointer"
                  >
                    <Image src="/GoBack.png" alt="test" className='rounded-4xl' width={100} height={100} />  
                  </button>
                </div> */}

                
            </div>
      </div>
    )}
  </div>
)}
export default Camera;
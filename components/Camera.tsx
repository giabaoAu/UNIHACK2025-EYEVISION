"use client";

import { useRef, useState, useEffect } from "react";
import { speakText } from "./Speech";

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
    { role: string; content: string }[]
  >([]);
  const [isListening, setIsListening] = useState(false);

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

  const startCamera = async () => {
    try {
      if (stream) stopCamera();
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) videoRef.current.srcObject = userStream;
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
                    text: "You are an AI assisting a blind user in understanding an image.",
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
      const description =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Could not analyze the image.";
      setAnalysisResult(description);
      setChatHistory([{ role: "AI", content: description }]);
      setShowChat(true);
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
  };

  const handleUserQuery = async (query: string = userQuery) => {
    if (!query.trim()) return;
    const newChatHistory = [...chatHistory, { role: "user", content: query }];

    console.log('here', analysisResult)

    try {
      // Include the full conversation history, but limit to last 10 messages for context
      const conversationHistory = chatHistory.slice(-10);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              // First, provide context about the image if it exists
              ...(analysisResult
                ? [
                    {
                      role: "model",
                      parts: [{ text: `The image shows: ${analysisResult}` }],
                    },
                  ]
                : []),
              
              ...conversationHistory.map((msg) => ({
                role: msg.role.toLowerCase() === "ai" ? "model" : "user",
                parts: [{ text: msg.content }],
              })),
         
              {
                role: "user",
                parts: [{ text: `${query}` }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 256,
              topP: 0.8,
              topK: 40,
            },
          }),
        }
      );

      const data = await response.json();
      const aiResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
      setChatHistory([...newChatHistory, { role: "AI", content: aiResponse }]);
      speakText(aiResponse);
    } catch (error) {
      console.error("Error getting response:", error);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black text-white">
      {!showChat ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-auto"
          />
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          <button
            onClick={takePhoto}
            className="mt-4 px-6 py-3 bg-blue-600 rounded-lg"
          >
            Capture Photo
          </button>
        </>
      ) : (
        <div className="absolute inset-0 bg-gray-900 flex flex-col p-6 space-y-4">
          {photo && (
            <img
              src={photo}
              alt="Captured"
              className="w-full max-h-60 object-contain mb-4"
            />
          )}
          <h2 className="text-xl font-bold">Chat about the Image</h2>
          <div className="flex-1 overflow-auto p-4 bg-gray-800 rounded-md">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-2 rounded-md ${
                  msg.role === "user"
                    ? "bg-blue-600 text-right"
                    : "bg-gray-600 text-left"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={isListening ? stopListening : startListening}
              className="p-2 bg-red-600 w-full rounded-md"
            >
              {isListening ? "Stop 🎙️" : "Speak 🎤"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Camera;

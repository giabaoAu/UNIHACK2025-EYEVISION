// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import { speakText } from "./Speech";
// import {useRouter} from "next/navigation";

// let front = false;

// const GEMINI_API_KEY = process.env.NEXT_PUBLIC_API_KEY; 
// const Camera = () => {

//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [photo, setPhoto] = useState<string | null>(null);
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [showCapturedPhoto, setShowCapturedPhoto] = useState(false);
//   const [analysisResult, setAnalysisResult] = useState<string | null>(null); 

//   // for speaking into mic
//   const [userQuery, setUserQuery] = useState("");
//   const [chatHistory, setChatHistory] = useState<{ role:string; content: string }[]>([]);

//   const startCamera = async () => {
//     try {

//       if(stream){
//         stopCamera(); 
//       }

//       const constraints = { video: { facingMode: front ? "user" : "environment" } };

//       const userStream = await navigator.mediaDevices.getUserMedia(constraints);

//       if (videoRef.current) {
//         videoRef.current.srcObject = userStream;
//       }
//       setStream(userStream);

//     } catch (error) {
//       console.error("Error accessing the camera:", error);
//     }
//   };

//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       setStream(null);
//     }
//   };

//   useEffect(() => {
//     startCamera();
//     return () => stopCamera();
//   }, []);


//   const flipCamera = () =>{
//     front = !front;
//     startCamera(); 
//   };

//   const takePhoto = () => {
//     if (videoRef.current && canvasRef.current) {
//       const canvas = canvasRef.current;
//       const video = videoRef.current;

//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;

//       const ctx = canvas.getContext("2d");
//       if (ctx) {
//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//         const capturedImage = canvas.toDataURL("image/png");
//         setPhoto(capturedImage);
//         setShowCapturedPhoto(true);
//         analyzePhoto(capturedImage);
//       }
//     }
//   };

//   const analyzePhoto = async (imageBase64: string) => {
//     try {
//       const response = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             contents: [
//               {
//                 parts: [
//                   {
//                     inlineData: {
//                       mimeType: "image/png",
//                       data: imageBase64.split(",")[1], 
//                     },
//                   },
//                 ],
//                 role: "user", 
//               },
//             ],
//             generationConfig: {
//               temperature: 0.7, 
//               maxOutputTokens: 256, 
//             },
//           }),
//         }
//       );
  
//       const data = await response.json();
//       console.log("Gemini AI Full Response:", data); 
  
//       const description = data?.candidates?.[0]?.content?.parts?.[0]?.text;
//       if (description) {
//         setAnalysisResult(description);
//       } else {
//         setAnalysisResult("Gemini could not analyze the image.");
//       }
//     } catch (error) {
//       console.error("Error analyzing image:", error);
//       setAnalysisResult("Error analyzing image.");
//     }
//   };

//   const handleUserQuery = async() => {

//     if (!userQuery.trim()) return;
//     const newChatHistory = [...chatHistory, { role:"user", content: userQuery }];

//       try {
//         const response = await fetch(
//           `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               contents: newChatHistory.map(({ role, content }) => ({ role, parts: [{ text: content }] })),
//               generationConfig: { temperature: 0.7, maxOutputTokens: 256 },
//             }),
//           }
//         );
        
//         const data = await response.json();
//         const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
//         if (aiResponse) {
//           setChatHistory([...newChatHistory, { role: "AI", content: aiResponse }]);
//           speakText(aiResponse);
//         }
//       } catch (error) {
//         console.error("Error getting response:", error);
//       }

//       setUserQuery("");
//   };

//   const startListening = () => {
//     const recognition = new (window as any).webkitSpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.onresult = (event: any) => {
//       setUserQuery(event.results[0][0].transcript);
//     };
//     recognition.start();
//   }
//   return (
//     <div className="relative flex flex-col items-center space-y-4">

//       <div className="relative w-100 h-120 border border-gray-500 rounded-4xl">
//         <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover" />
        
//         {showCapturedPhoto && photo && (
//           <img src={photo} alt="Captured" className="absolute top-0 left-0 w-full h-full object-cover" />
//         )}
//       </div>

//       <div className="flex space-x-4">
//         <button
//           onClick={takePhoto}
//           className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2"
//         >
//           Capture Photo
//         </button>
//         <button onClick={flipCamera}
//           className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">flip</button>
//       </div>

//       <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

//         {analysisResult && (
//           <div className="mt-4 p-4 bg-gray-800 text-white rounded-md w-80 text-center">
//             <h3 className="text-lg py-2 font-bold">AI Analysis:</h3>
//             <p>{analysisResult}</p>
//             <button 
//               onClick={() => speakText(analysisResult)}
//               className="bg-black dark:bg-white rounded-full w-[50vw] text-white dark:text-black md:max-w-full px-4 py-4"
//             >
//               Speak
//             </button> 
//           </div>
//         )}

//       <div className="w-80 mt-4 p-4 bg-gray-700 text-white rounded-md">
//           <h3 className="text-lg font-bold mb-2">Chat About the Image:</h3>
//           <div className="space-y-2 max-h-40 overflow-auto">
//             {chatHistory.map((chat, index) => (
//               <div key={index} className={`p-2 rounded-md ${chat.role === "AI" ? "bg-blue-600" : "bg-gray-500"}`}>
//                 <strong>{chat.role}: </strong>{chat.content}
//               </div>
//             ))}
//           </div>
      
//        <input 
//           type="text" 
//           value={userQuery} 
//           onChange={(e) => setUserQuery(e.target.value)} 
//           placeholder="Ask a question..." 
//           className="mt-2 w-full p-2 text-black rounded-md"
//         />

//         <div className="flex space-x-2 mt-2">
//           <button onClick={handleUserQuery} className="bg-black dark:bg-white rounded-md px-4 py-2 text-white dark:text-black">Send</button>
//           <button onClick={startListening} className="bg-green-500 rounded-md px-4 py-2 text-white">🎤 Speak</button>
//         </div>

//       </div>
//    </div>
//   );
// };

// export default Camera;

"use client";

import React, { useRef, useState, useEffect } from "react";
import { speakText } from "./Speech";
import { useRouter } from "next/navigation";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [isListening, setIsListening] = useState(false);

  const recognition = typeof window !== "undefined" && new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event: { results: { transcript: any; }[][]; }) => {
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
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true });
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
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ inlineData: { mimeType: "image/png", data: imageBase64.split(",")[1] } }], role: "user" }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 256 },
          }),
        }
      );

      const data = await response.json();
      const description = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Could not analyze the image.";
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

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: newChatHistory.map(({ role, content }) => ({ role, parts: [{ text: content }] })),
            generationConfig: { temperature: 0.7, maxOutputTokens: 256 },
          }),
        }
      );

      const data = await response.json();
      const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
      setChatHistory([...newChatHistory, { role: "AI", content: aiResponse }]);
      speakText(aiResponse);
    } catch (error) {
      console.error("Error getting response:", error);
    }

    setUserQuery("");
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black text-white">
      {!showChat ? (
        <>
          <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          <button onClick={takePhoto} className="mt-4 px-6 py-3 bg-blue-600 rounded-lg">Capture Photo</button>
        </>
      ) : (
        <div className="absolute inset-0 bg-gray-900 flex flex-col p-6 space-y-4">
          {photo && <img src={photo} alt="Captured" className="w-full max-h-60 object-contain mb-4" />}
          <h2 className="text-xl font-bold">Chat about the Image</h2>
          <div className="flex-1 overflow-auto p-4 bg-gray-800 rounded-md">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`p-2 my-2 rounded-md ${msg.role === "user" ? "bg-blue-600 text-right" : "bg-gray-600 text-left"}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            {/* <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 rounded-md bg-gray-700 text-white"
            />
            <button onClick={() => handleUserQuery()} className="p-2 bg-green-600 rounded-md">Send</button> */}
            <button onClick={isListening ? stopListening : startListening} className="p-2 bg-red-600 w-full rounded-md">
              {isListening ? "Stop 🎙️" : "Speak 🎤"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Camera;

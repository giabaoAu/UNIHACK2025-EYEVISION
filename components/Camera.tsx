// "use client";

// import { useRef, useState, useEffect } from "react";
// import { speakText } from "./Speech";

// const GEMINI_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// const Camera = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [photo, setPhoto] = useState<string | null>(null);
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [showChat, setShowChat] = useState(false);
//   const [analysisResult, setAnalysisResult] = useState<string | null>(null);
//   const [userQuery, setUserQuery] = useState("");
//   const [chatHistory, setChatHistory] = useState<
//     { role: string; content: string; image?: string}[]
//   >([]);
//   const [isListening, setIsListening] = useState(false);

//   const recognition =
//     typeof window !== "undefined" &&
//     new (window.SpeechRecognition || window.webkitSpeechRecognition)();

//   if (recognition) {
//     recognition.continuous = false;
//     recognition.interimResults = false;
//     recognition.lang = "en-US";
//     recognition.onresult = (event: { results: { transcript: any }[][] }) => {
//       const transcript = event.results[0][0].transcript;
//       setUserQuery(transcript);
//       handleUserQuery(transcript);
//     };
//   }

//   const startListening = () => {
//     if (recognition) {
//       setIsListening(true);
//       recognition.start();
//     }
//   };

//   const stopListening = () => {
//     if (recognition) {
//       setIsListening(false);
//       recognition.stop();
//     }
//   };

//   const startCamera = async () => {
//     try {
//       if (stream) stopCamera();
//       const userStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//       });
//       if (videoRef.current) videoRef.current.srcObject = userStream;
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

//   const takePhoto = () => {
//     if (videoRef.current && canvasRef.current) {
//       const canvas = canvasRef.current;
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//       const ctx = canvas.getContext("2d");
//       if (ctx) {
//         ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//         const capturedImage = canvas.toDataURL("image/png");
//         setPhoto(capturedImage);
//         setShowChat(false);
//         analyzePhoto(capturedImage);
//       }
//     }
//   };

//   const analyzePhoto = async (imageBase64: string) => {
//     try {
//       const response = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             contents: [
//               {
//                 parts: [
//                   {
//                     text: "Analyze this picture. Try to be as human-like as possible. Be short and concise in your answer",
//                   },
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
//             generationConfig: { temperature: 0.7, maxOutputTokens: 256 },
//           }),
//         }
//       );

//       const data = await response.json();
//       const description =
//         data?.candidates?.[0]?.content?.parts?.[0]?.text ||
//         "Could not analyze the image.";
//       setAnalysisResult(description);
//       speakText(description); 
//       setChatHistory([
//         ...chatHistory,
//         { role: "user", content: "Sent a photo", image: imageBase64 }, 
//         { role: "AI", content: description }  
//       ]);
//       setShowChat(true);
//     } catch (error) {
//       console.error("Error analyzing image:", error);
//     }
//   };

//   const handleUserQuery = async (query: string = userQuery) => {
//     if (!query.trim()) return;

//     const lastPhoto = [...chatHistory].reverse().find(msg => msg.image)?.image;

//     console.log(' Last Sent Image:', lastPhoto ? lastPhoto.substring(0, 50) + "..." : "No Image Found");

  
//     const lowerCaseQuery = query.toLowerCase();
//     const isImageRelated = lowerCaseQuery.includes("image") || lowerCaseQuery.includes("photo");

//     console.log("Should Send Image:", isImageRelated ? "Yes" : "No");

//     try {
//       const conversationHistory = chatHistory.slice(-10);


//       let finalContents = [];

//       if (isImageRelated && lastPhoto) {
//         finalContents.push({
//           role: "user",
//           parts: [
//             { text: "This image is relevant to the question. Use it when answering." },
//             { inlineData: { mimeType: "image/png", data: lastPhoto.split(",")[1] } }
//           ]
//         });
//       }

      
//       finalContents.push({
//         role: "user",
//         parts: [{ text: `You are an AI assisting a blind user. Be short and concise in your response: ${query}` }]
//       });

//       finalContents = [
//         ...finalContents,
//         ...conversationHistory.map(msg => ({
//           role: msg.role.toLowerCase() === "ai" ? "model" : "user",
//           parts: [{ text: msg.content }],
//         }))
//       ];

//       // finalContents = [
//       //   ...finalContents,
//       //   ...conversationHistory.map((msg) => ({
//       //     role: msg.role.toLowerCase() === "ai" ? "model" : "user",
//       //     parts: msg.image
//       //       ? [{ text: msg.content }, { inlineData: { mimeType: "image/png", data: msg.image.split(",")[1] } }]
//       //       : [{ text: msg.content }],
//       //   }))
//       // ];
      
//       console.log('Final Contents for AI Request:');
//       console.log(JSON.stringify(finalContents, null, 2));
    


//       const finalResponse = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             contents: finalContents,
//             generationConfig: {
//               temperature: 0.3,
//               maxOutputTokens: 256,
//               topP: 0.8,
//               topK: 40,
//             },
//           }),
//         }
//       );

//       const finalData = await finalResponse.json();
//       console.log('FULL Gemini AI Response:', JSON.stringify(finalData, null, 2));

//       const aiResponse =
//         finalData?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

//       console.log("AI Answer:", aiResponse);
//       setChatHistory([
//         ...conversationHistory,
//         { role: "user", content: query },  
//         { role: "AI", content: aiResponse }
//       ]);

//       speakText(aiResponse);
//     } catch (error) {
//       console.error("Error getting response:", error);
//     }
// };





//   return (
//     <div className="relative w-screen h-screen px-4  flex flex-col items-center justify-center bg-transparent text-white">
//       {!showChat ? (
//         <>
//             <video
//               ref={videoRef}
//               autoPlay
//               playsInline
//               className=" border-2 border-gray-500 rounded-lg"
//             />
//             <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
//             <button
//             onClick={takePhoto}
//             className=" w-auto h-auto mt-4 px-2 py-2 bg-white text-black rounded-lg"
//           >
//             Capture Photo
//           </button>

//         </>
//       ) : (
//         <div className="absolute inset-0 bg-gray-900 flex flex-col p-6 space-y-4">
//           {photo && (
//             <img
//               src={photo}
//               alt="Captured"
//               className="w-full max-h-100 object-contain mb-4"
//             />
//           )}
//           <h2 className="text-xl font-bold">Chat about the Image</h2>
//           <div className="flex-1 overflow-auto p-4 bg-gray-800 rounded-md">
//             {chatHistory.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`p-2 my-2 rounded-md ${
//                   msg.role === "user"
//                     ? "bg-blue-600 text-right"
//                     : "bg-gray-600 text-left"
//                 }`}
//               >
//                 {msg.content}
//               </div>
//             ))}
//           </div>
//           <div className="flex space-x-2">
//             <button
//               onClick={isListening ? stopListening : startListening}
//               className="p-2 bg-red-600 w-full rounded-md"
//             >
//               {isListening ? "Stop 🎙️" : "Speak 🎤"}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Camera;

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
    { role: string; content: string; image?: string }[]
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
                    text: "Analyze this picture. Try to be as human-like as possible. Be short and concise in your answer",
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
      speakText(description);
      setChatHistory([
        ...chatHistory,
        { role: "user", content: "Sent a photo", image: imageBase64 },
        { role: "AI", content: description },
      ]);
      setShowChat(true);
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
  };

  const handleUserQuery = async (query: string = userQuery) => {
    if (!query.trim()) return;

    const lastPhoto = [...chatHistory].reverse().find((msg) => msg.image)
      ?.image;

    console.log(
      " Last Sent Image:",
      lastPhoto ? lastPhoto.substring(0, 50) + "..." : "No Image Found"
    );

    const lowerCaseQuery = query.toLowerCase();
    const isImageRelated =
      lowerCaseQuery.includes("image") || lowerCaseQuery.includes("photo");

    console.log("Should Send Image:", isImageRelated ? "Yes" : "No");

    try {
      const conversationHistory = chatHistory.slice(-10);

      let finalContents = [];

      if (isImageRelated && lastPhoto) {
        finalContents.push({
          role: "user",
          parts: [
            {
              text: "This image is relevant to the question. Use it when answering.",
            },
            {
              inlineData: {
                mimeType: "image/png",
                data: lastPhoto.split(",")[1],
              },
            },
          ],
        });
      }

      finalContents.push({
        role: "user",
        parts: [
          {
            text: `You are an AI assisting a blind user. Be short and concise in your response: ${query}`,
          },
        ],
      });

      finalContents = [
        ...finalContents,
        ...conversationHistory.map((msg) => ({
          role: msg.role.toLowerCase() === "ai" ? "model" : "user",
          parts: [{ text: msg.content }],
        })),
      ];

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
        finalData?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response.";

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
    <div className="relative w-screen h-screen px-4  flex flex-col items-center justify-center bg-transparent text-white">
      {!showChat ? (
        <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className=" border-2 border-gray-500 rounded-lg"
            />
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <button
            onClick={takePhoto}
            className=" w-auto h-auto mt-4 px-2 py-2 bg-white text-black rounded-lg"
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
              className="w-full max-h-100 object-contain mb-4"
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
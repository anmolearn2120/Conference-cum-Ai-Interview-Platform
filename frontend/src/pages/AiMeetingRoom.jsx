import { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import aisocket from "../socketAI";
import "../styles/AiMeetingRoom.css";

import MicWaveform from "../components/MicWaveForm";
import AiWaveform from "../components/AiWaveForm";

import * as faceapi from "face-api.js";
import * as tf from "@tensorflow/tfjs";


export default function AiMeetingRoom () {
    const { aiCode } = useParams();

    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    const localVideoRef = useRef(null);
    const localStream = useRef(null);
    const peerConnections = useRef({});
    const recognitionRef = useRef(null);
    const attentionInterval = useRef(null);
  const silenceTimer = useRef(null);
  const transcriptRef = useRef("");
  const answerSentRef = useRef(false);
  const answerTimeout = useRef(null);
const timerInterval = useRef(null);
const aiStateRef = useRef("idle");
const hasSpokenRef = useRef(false);
const isMountedRef = useRef(true); // 👈 Ye track karega ki component zinda hai ya nahi
    
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [canSpeak, setCanSpeak] = useState(false);
  const [aiState, setAiState] = useState("idle");
  const [question, setQuestion] = useState("");
  const [interviewId, setInterviewId] = useState(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const [warning, setWarning] = useState("");

  const [responseTimer, setResponseTimer] = useState(20);
  const [hasStartedSpeaking, setHasStartedSpeaking] = useState(false);
  const [micStream, setMicStream] = useState(null);

  const [timerNotice, setTimerNotice] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isWarning, setIsWarning] = useState(false);

  const role = user.role === "interviewer" ? "interviewer" : "candidate";


  const loadModels = async () => {
    try {
      await tf.setBackend("cpu");
      await tf.ready();

      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");

      console.log("FaceAPI models loaded");
    } catch (err) {
      console.error("FaceAPI model load error:", err);
    }
  };

  const initCamera = async () => {
    if (role !== "candidate") return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStream.current = stream;
      setMicStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      startAttentionDetection();
    } catch (err) {
      console.error("Camera/Mic error:", err);

      alert(
        "Camera or microphone not detected. Please check your device permissions.",
      );
    }
  };

  const startAttentionDetection = () => {
    attentionInterval.current = setInterval(async () => {
      if (!localVideoRef.current) return;

      if (!localVideoRef.current || localVideoRef.current.readyState !== 4)
        return;

      const detections = await faceapi.detectAllFaces(
        localVideoRef.current,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 224 }),
      );

      if (detections.length === 0) {
        setWarning("Face not detected");
      } else {
        setWarning("");
      }
    }, 2000);
  };

  const setup = async () => {
    await loadModels();

    await initCamera();
  };


  useEffect(() => {
  aiStateRef.current = aiState;
}, [aiState]);

  useEffect(() => {

    aisocket.connect();
console.log("AI CODE:", aiCode);
    aisocket.emit("join-ai-room" , {
        aiCode,
        role,
        userId : user._id,

    });

    aisocket.on("ai-joined", ({ interviewId }) => {
      setInterviewId(interviewId);

      // start AI interview
      aisocket.emit("ai:start", { interviewId });
      console.log("AI START EMITTED");
    });


    aisocket.on("ai-user-joined" , async({ socketId , role}) => {
        if(role === "interviewer")
        {
            const pc = createPeerConnection(socketId);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            aisocket.emit("ai-offer" , {
                to : socketId,
                offer
            });
        }

    });


    aisocket.on("ai-offer", async({ from , offer})=> {
        const pc = createPeerConnection(from);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        aisocket.emit("ai-answer" , {
            to : from,
            answer
        });
    });


    aisocket.on("ai-answer" , async({from , answer}) => {
        const pc = peerConnections.current[from];
        if(pc)
             await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });


    aisocket.on("ai-ice-candidate" , async({from , candidate})=> {
        const pc = peerConnections.current[from];

        if(pc)
             await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });


    aisocket.on("ai:timer-started", ({ autoCompleteAt, remainingTime }) => {

  const minutes = Math.floor(remainingTime / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  let message;

  if (hours >= 1 && mins >= 59) {
    message = "Please complete the interview within 2 hours.";
  } else {
    message = `Interview resumed. Time remaining: ${hours}h ${mins}m`;
  }

  setTimerNotice(message);

  setTimeout(() => {
    setTimerNotice(null);
  }, 6000);


  const end = new Date(autoCompleteAt).getTime();

  const updateTimer = () => {
    const now = Date.now();
    const diff = end - now;

    if (diff <= 0) {
  setTimeLeft("00:00:00");

  if (timerInterval.current) {
    clearInterval(timerInterval.current);
  }

  return;
}

// 🔴 last 10 minutes warning
if (diff <= 10 * 60 * 1000) {
  setIsWarning(true);
}

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    setTimeLeft(
      `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`
    );
  };

  updateTimer();

if (timerInterval.current) {
  clearInterval(timerInterval.current);
}

timerInterval.current = setInterval(updateTimer, 1000);
});



    aisocket.on("ai:speaking", ({ question }) => {
  console.log("AI QUESTION RECEIVED:", question);

  setAiState("speaking");
  setQuestion(question);

  // ✅ YAHAN CLEAR KARO TRANSCRIPT AUR FLAGS KO
  transcriptRef.current = ""; 
  answerSentRef.current = false;
  hasSpokenRef.current = false;
  setHasStartedSpeaking(false);
  setResponseTimer(20);

  if (answerTimeout.current) clearTimeout(answerTimeout.current);
  if (silenceTimer.current) clearTimeout(silenceTimer.current);

  if (recognitionRef.current) {
    try {
      recognitionRef.current.abort();
    } catch {}
  }

  speak(question);
});

    


    aisocket.on("ai-error", ({ message }) => {
      console.error("AI error:", message);
      alert(message);
    });
    aisocket.on("ai:thinking", () => {
      setAiState("thinking");
      setCanSpeak(false);

      if (localStream.current) {
        localStream.current.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });
      }


      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }


    });

    aisocket.on("ai-completed" , ({score}) => {
        alert("Interview Completed");
        navigate("/ai/activity");
    });

    
    setup();

    return ()=> cleanup();



  } , []);


 useEffect(() => {
   if (aiState !== "listening" || hasStartedSpeaking) return;

   const interval = setInterval(() => {
     setResponseTimer((t) => (t > 0 ? t - 1 : 0));
   }, 1000);

   return () => clearInterval(interval);
 }, [aiState, hasStartedSpeaking]);

  

  const createPeerConnection = (socketId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnections.current[socketId] = pc;

    if(localStream.current)
    {
        localStream.current?.getTracks().forEach(track => {
            pc.addTrack(track,localStream.current);
        });


    }


    pc.ontrack = (event) => {
         setRemoteStreams((prev) => {
           const exists = prev.find((s) => s.socketId === socketId);

           if (exists) return prev;

           return [
             ...prev,
             {
               socketId,
               stream: event.streams[0],
             },
           ];
         });
    };


    pc.onicecandidate = (event) => {
        if(event.candidate)
        {
            aisocket.emit("ai-ice-candidate" , {
                to : socketId,
                candidate : event.candidate
            });
        }
    };

    return pc;

  };
const startNoResponseTimer = () => {
  if (answerTimeout.current) {
    clearTimeout(answerTimeout.current);
  }

  answerTimeout.current = setTimeout(() => {
    if (hasSpokenRef.current) return;

    console.log("No response detected");

    aisocket.emit("ai:answer", {
      interviewId,
      answer: "No response",
    });

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
  }, 20000);
};

  const speak = (text) => {

    if (speechSynthesis.speaking) {
  speechSynthesis.cancel();
}

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onend = () => {
  setAiState("listening");
  setCanSpeak(true);

  if (localStream.current?.getAudioTracks) {
    localStream.current.getAudioTracks().forEach((track) => {
      track.enabled = true;
    });
  }

  startListening();
  startNoResponseTimer(); // 👈 start timer here
};

    speechSynthesis.speak(utterance);
  };


  


  const toggleAudio = () => {
    localStream.current?.getAudioTracks().forEach((track) => {
      track.enabled = isMuted; // toggle
    });

    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    localStream.current?.getVideoTracks().forEach((track) => {
      track.enabled = isVideoOff;
    });

    setIsVideoOff(!isVideoOff);
  };


  
  const startListening = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition not supported");
    return;
  }

  if (recognitionRef.current) {
    try {
      recognitionRef.current.abort();
    } catch {}
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = true;
  // ✅ Pura game yahan hai: Isko TRUE karna hai
  recognition.interimResults = true; 

  recognition.onstart = () => {
    console.log("🎤 Speech recognition started");
  };

  // ✅ NAYA EVENT: Jaise hi aawaz detect hogi (bina word process hue), timer cancel!
  recognition.onspeechstart = () => {
    console.log("🗣️ Speech detected! Cancelling 20s timer...");
    if (!hasSpokenRef.current) {
      hasSpokenRef.current = true;
      setHasStartedSpeaking(true);

      if (answerTimeout.current) {
        clearTimeout(answerTimeout.current);
        console.log("🛑 20 sec No-Response timer cancelled (via speechstart)!");
      }
    }
  };

  recognition.onresult = (event) => {
    // ⏱️ Backup: Agar onspeechstart miss ho jaye, toh interim result aate hi timer cancel karo
    if (!hasSpokenRef.current) {
      hasSpokenRef.current = true;
      setHasStartedSpeaking(true);

      if (answerTimeout.current) {
        clearTimeout(answerTimeout.current);
        console.log("🛑 20 sec No-Response timer cancelled (via onresult)!");
      }
    }

    // 🧠 Transcript me sirf FINAL words add karenge taaki duplicate na ho
    let finalTranscriptChunk = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscriptChunk += event.results[i][0].transcript + " ";
      }
    }

    if (finalTranscriptChunk.trim() !== "") {
      console.log("🗣️ Final word processed:", finalTranscriptChunk);
      transcriptRef.current += finalTranscriptChunk;
    }

    // ⏱️ Har interim aur final word pe 7-sec silence timer reset karo
    // Isse jab tak tum bolte rahoge (chahe atak-atak ke), AI wait karega
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
    }

    silenceTimer.current = setTimeout(() => {
      console.log("⏳ 7 seconds silence detected. Sending answer...");
      sendAnswer(recognition);
    }, 7000);
  };

  recognition.onerror = (e) => {
    if (e.error === "aborted" || e.error === "no-speech") return;
    console.log("⚠️ Speech error:", e.error);
  };

  recognition.onend = () => {
  console.log("🛑 Speech recognition ended (Chrome stopped it)");

  // 🛡️ NAYA CHECK: Agar user page chhod chuka hai, toh chup chaap exit kar jao!
  if (!isMountedRef.current) {
    console.log("Component unmounted, completely shutting down mic.");
    return;
  }

  if (answerSentRef.current) return;
  if (aiStateRef.current !== "listening") return;

  setTimeout(() => {
    // 🛡️ Double Check: 300ms ke baad bhi check karo ki user gaya toh nahi
    if (!isMountedRef.current) return;

    if (!answerSentRef.current && aiStateRef.current === "listening") {
      startListening(); 
    }
  }, 300);
};

  recognitionRef.current = recognition;
  
  try {
    recognition.start();
  } catch(e) {
    console.error("Failed to start recognition", e);
  }
};

  
  const sendAnswer = (recognition) => {
    if (answerSentRef.current) return;

    const answer = transcriptRef.current.trim() || "No response";

    answerSentRef.current = true;

    console.log("Sending answer:", answer);

    aisocket.emit("ai:answer", {
      interviewId,
      answer,
    });

    transcriptRef.current = "";

    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    if (answerTimeout.current) clearTimeout(answerTimeout.current);

    recognition.stop();
  };

  const cleanup = () => {
  // 🔴 1. KILL SWITCH ON: Ab koi bhi naya process start nahi hoga
  isMountedRef.current = false; 
  aiStateRef.current = "idle"; // State ko bhi idle kar do

  if (timerInterval.current) {
    clearInterval(timerInterval.current);
  }

  speechSynthesis.cancel();

  // 🔴 2. STOP ki jagah ABORT use karo
  if (recognitionRef.current) {
    try {
      recognitionRef.current.abort(); // Hard stop, no processing
    } catch {}
  }

  if (localStream.current) {
    localStream.current.getTracks().forEach((track) => track.stop());
  }

  if (attentionInterval.current) {
    clearInterval(attentionInterval.current);
  }

  Object.values(peerConnections.current).forEach((pc) => pc.close());
  peerConnections.current = {};

  aisocket.off("ai:speaking");
  aisocket.off("ai:thinking");
  aisocket.off("ai:timer-started");
  aisocket.off("ai-error");
  aisocket.off("ai-completed");

  aisocket.disconnect();
};

  const leaveInterview = () => {

  cleanup();

  navigate("/ai/dashboard");

};

  return (
    
    <div className="ai-room">
      <div className="ai-top">
        {/* 🔔 Notification */}
{timerNotice && (
  <div className="ai-timer-notice">
    ⏳ {timerNotice}
  </div>
)}

{/* ⏳ Timer */}
{timeLeft && (
  <div className={`interview-timer ${isWarning ? "timer-warning" : ""}`}>
    ⏳ Time Remaining: {timeLeft}
  </div>
)}

        <div className={`ai-avatar ${aiState}`}>
          {aiState === "thinking" && <span>🤔 Thinking...</span>}
          {aiState === "speaking" && <span>AI</span>}

          <AiWaveform active={aiState === "speaking"} />
        </div>

        <div className="ai-question">
          {aiState === "thinking"
            ? "AI is thinking..."
            : question || "Waiting for interview to start"}

          {aiState === "listening" && !hasStartedSpeaking && (
            <div className="response-timer">
              Please start responding in {responseTimer}s
            </div>
          )}
        </div>
      </div>

      <div className="ai-videos">
        {role === "candidate" && (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="ai-video"
          />
        )}

        {remoteStreams.map(({ socketId, stream }) => (
          <video
            key={socketId}
            autoPlay
            playsInline
            className="ai-video"
            ref={(video) => {
              if (video) video.srcObject = stream;
            }}
          />
        ))}
      </div>

      {warning && <div className="warning">{warning}</div>}

      {aiState === "listening" && (
        <div className="candidate-wave">
          <MicWaveform stream={micStream} />

          <p>Listening...</p>
        </div>
      )}

      <div className="ai-controls">
        {role === "candidate" && (
          <>
            <button disabled={!canSpeak} onClick={toggleAudio}>
              {isMuted ? "Unmute" : "Mute"}
            </button>

            <button onClick={toggleVideo}>
              {isVideoOff ? "Camera On" : "Camera Off"}
            </button>
          </>
        )}

        <button onClick={leaveInterview}>Leave</button>
      </div>
    </div>
  );



}
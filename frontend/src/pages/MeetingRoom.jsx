import { useState, useContext, useRef, useEffect } from "react";

import { useParams } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import socket from "../socket";

import "./MeetingRoom.css";

export default function MeetingRoom() {
  const { code } = useParams();
  const { user } = useContext(AuthContext);

  const localStream = useRef(null);
  const localVideoRef = useRef(null);

  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  const [joineduser, setjoineduser] = useState([]);

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStream.current = stream;
      localVideoRef.current.srcObject = stream;

      socket.connect();

      socket.emit("join-meeting", {
        meetingCode: code,
        userId: user._id,
        username: user.username,
      });
    };

    init();

    socket.on("User-joined", async ({ socketId }) => {
      const pc = createpeerconnection(socketId);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("offer", {
        to: socketId,
        offer,
      });
    });

    // when a offer is recieved
    socket.on("offer", async ({ from, offer }) => {
      const pc = createpeerconnection(from);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", {
        to: from,
        answer,
      });
    });

    // when an answer is recieved
    socket.on("answer", async ({ from, answer }) => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
    });

    // when an ICE candidate is recieved
    socket.on("ice-candidate", async ({ from, candidate }) => {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate),
        );
      }
    });

    return () => {
      socket.disconnect();
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      socket.disconnect();
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      handleUnload();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const createpeerconnection = (SocketId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.current = pc;
    // add local stream tracks to the peer connection
    localStream.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStream.current);
    });

    // when a remote stream is added, display it in the remote video element
    //add remote stream to remote video element
    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    // when an ICE candidate is generated, send it to the other peer
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: SocketId,
          candidate: event.candidate,
        });
      }
    };

    return pc;
  };

  const handleLeave = () => {
    socket.disconnect();

    if (peerConnection.current) {
      peerConnection.current.close();
    }

    window.location.href = "/dashboard";
  };

  return (
    <div className="meeting-container">
      <h2>Meeting Room : {code} </h2>
      <div className="video-section">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          className="video"
          playsInline
        />
        <video ref={remoteVideoRef} autoPlay playsInline className="video" />
      </div>

      <button onClick={handleLeave}>Leave</button>
    </div>
  );
}

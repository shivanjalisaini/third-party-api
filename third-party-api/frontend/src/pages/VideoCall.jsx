import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function VideoCall() {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peer = useRef(null);
  const localStream = useRef(null);

  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  const joinRoom = async () => {
    if (!roomId) return alert("Enter Room ID");
    setJoined(true);

    localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.current.srcObject = localStream.current;

    peer.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    localStream.current.getTracks().forEach(track => peer.current.addTrack(track, localStream.current));

    peer.current.ontrack = e => remoteVideo.current.srcObject = e.streams[0];

    peer.current.onicecandidate = e => {
      if (e.candidate) socket.emit("ice-candidate", { roomId, candidate: e.candidate });
    };

    socket.emit("join-room", roomId);

    socket.on("user-joined", async () => {
      const offer = await peer.current.createOffer();
      await peer.current.setLocalDescription(offer);
      socket.emit("offer", { roomId, offer });
    });

    socket.on("offer", async data => {
      await peer.current.setRemoteDescription(data.offer);
      const answer = await peer.current.createAnswer();
      await peer.current.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async data => await peer.current.setRemoteDescription(data.answer));
    socket.on("ice-candidate", async data => await peer.current.addIceCandidate(data.candidate));
  };

  const toggleMute = () => {
    localStream.current.getAudioTracks()[0].enabled = muted;
    setMuted(!muted);
  };

  const toggleCamera = () => {
    localStream.current.getVideoTracks()[0].enabled = videoOff;
    setVideoOff(!videoOff);
  };

  const shareScreen = async () => {
    const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const sender = peer.current.getSenders().find(s => s.track.kind === "video");
    sender.replaceTrack(screen.getVideoTracks()[0]);
  };

  const leaveCall = () => window.location.reload();

  return (
    <div style={styles.container}>
      {!joined && (
        <div style={styles.joinBox}>
          <h2>Join Meeting</h2>
          <input placeholder="Room ID" value={roomId} onChange={e => setRoomId(e.target.value)} style={styles.input} />
          <button onClick={joinRoom} style={styles.btn}>Join</button>
        </div>
      )}

      {joined && (
        <>
          <div style={styles.videoBox}>
            <video ref={localVideo} autoPlay muted playsInline style={styles.video} />
            <video ref={remoteVideo} autoPlay playsInline style={styles.video} />
          </div>

          <div style={styles.controls}>
            <button onClick={toggleMute}>{muted ? "Unmute" : "Mute"}</button>
            <button onClick={toggleCamera}>{videoOff ? "Camera On" : "Camera Off"}</button>
            <button onClick={shareScreen}>Share Screen</button>
            <button onClick={leaveCall} style={{ background: "#ef4444", color: "white" }}>End</button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { height: "100vh", background: "#020617", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  joinBox: { background: "#1e293b", padding: 30, borderRadius: 10, width: 300, textAlign: "center" },
  input: { width: "100%", padding: 12, borderRadius: 6, border: "none" },
  btn: { marginTop: 15, padding: "10px 18px", background: "#6366f1", border: "none", borderRadius: 6, color: "#fff" },
  videoBox: { display: "flex", gap: 20 },
  video: { width: 320, height: 240, borderRadius: 10, background: "black" },
  controls: { marginTop: 15, display: "flex", gap: 10 }
};

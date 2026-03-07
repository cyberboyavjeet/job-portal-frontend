import { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const socket = io("https://job-portal-backend-ah72.onrender.com");

export default function Chat() {
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const bottomRef = useRef(null);

  const adminId = "ADMIN_USER_ID"; // Replace with actual admin ID
  const roomId = user.role === "admin"
    ? selectedWorker ? `${adminId}_${selectedWorker._id}` : null
    : `${adminId}_${user.id}`;

  useEffect(() => {
    if (user.role === "admin") fetchWorkers();
  }, []);

  useEffect(() => {
    if (!roomId) return;
    socket.emit("joinRoom", roomId);
    fetchMessages();
  }, [roomId, selectedWorker]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages(prev => [...prev, data]);
    });
    return () => socket.off("receiveMessage");
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchWorkers = async () => {
    try {
      const res = await axios.get("https://job-portal-backend-ah72.onrender.com/api/messages/admin/chats",
        { headers: { Authorization: `Bearer ${token}` } });
      const unique = [];
      const seen = new Set();
      res.data.forEach(m => {
        const other = m.sender.role === "worker" ? m.sender : m.receiver;
        if (!seen.has(other._id)) { seen.add(other._id); unique.push(other); }
      });
      setWorkers(unique);
    } catch (err) { console.log(err); }
  };

  const fetchMessages = async () => {
    if (!roomId) return;
    try {
      const res = await axios.get(`https://job-portal-backend-ah72.onrender.com/api/messages/${roomId}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setMessages(res.data);
    } catch (err) { console.log(err); }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const receiverId = user.role === "admin" ? selectedWorker?._id : adminId;
    const msgData = { roomId, senderId: user.id, senderName: user.name, message: input, role: user.role };

    socket.emit("sendMessage", msgData);
    try {
      await axios.post("https://job-portal-backend-ah72.onrender.com/api/messages",
        { receiverId, message: input, roomId },
        { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) { console.log(err); }
    setInput("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", display: "flex", color: "white" }}>
      {user.role === "admin" && (
        <div style={{ width: "250px", background: "#16213e", padding: "1.5rem", borderRight: "1px solid #0f3460" }}>
          <h3 style={{ color: "#00d4ff", marginBottom: "1rem" }}>Workers</h3>
          {workers.length === 0 && <p style={{ color: "#aaa", fontSize: "0.9rem" }}>No chats yet</p>}
          {workers.map(w => (
            <div key={w._id} onClick={() => setSelectedWorker(w)}
              style={{
                padding: "0.8rem", borderRadius: "8px", cursor: "pointer", marginBottom: "0.5rem",
                background: selectedWorker?._id === w._id ? "#0f3460" : "transparent",
                border: "1px solid #333"
              }}>
              <p style={{ color: "white" }}>👷 {w.name}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "1.5rem" }}>
        <h2 style={{ color: "#00d4ff", marginBottom: "1rem" }}>
          💬 {user.role === "admin" ? (selectedWorker ? `Chat with ${selectedWorker.name}` : "Select a worker") : "Chat with Admin"}
        </h2>

        {(user.role === "worker" || selectedWorker) ? (
          <>
            <div style={{
              flex: 1, background: "#16213e", borderRadius: "12px", padding: "1.5rem",
              overflowY: "auto", maxHeight: "calc(100vh - 250px)", marginBottom: "1rem"
            }}>
              {messages.map((msg, i) => {
                const isMe = (msg.sender?._id || msg.senderId) === user.id;
                return (
                  <div key={i} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: "0.8rem" }}>
                    <div style={{
                      maxWidth: "60%", padding: "0.7rem 1rem", borderRadius: "12px",
                      background: isMe ? "#00d4ff" : "#0f3460",
                      color: isMe ? "#1a1a2e" : "white"
                    }}>
                      <p style={{ fontSize: "0.8rem", marginBottom: "0.3rem", opacity: 0.7 }}>
                        {msg.sender?.name || msg.senderName}
                      </p>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div style={{ display: "flex", gap: "0.8rem" }}>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                style={{
                  flex: 1, padding: "0.9rem", borderRadius: "8px",
                  border: "1px solid #333", background: "#16213e", color: "white", fontSize: "1rem"
                }} />
              <button onClick={sendMessage} style={{
                padding: "0.9rem 1.5rem", background: "#00d4ff", color: "#1a1a2e",
                border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "1rem"
              }}>Send</button>
            </div>
          </>
        ) : (
          <p style={{ color: "#aaa" }}>Select a worker from the sidebar to start chatting.</p>
        )}
      </div>
    </div>
  );
}
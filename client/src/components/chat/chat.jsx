import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Layout from "../layouts/layout";

const socket = io("http://localhost:3000");

const FarmerExpertChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // 👇 Assume role (farmer/expert) for demo
  const [role] = useState("farmer"); // change to "expert" for expert login

  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("loadMessages", (msgs) => setMessages(msgs));
    socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));

    return () => {
      socket.off("loadMessages");
      socket.off("receiveMessage");
    };
  }, []);

  // auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const msg = {
      sender: role, // farmer or expert
      text: newMessage,
      time: new Date().toISOString(),
    };

    socket.emit("sendMessage", msg);
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-[80vh] max-w-md mx-auto border rounded-xl shadow-lg bg-white overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-green-600 text-white font-semibold flex items-center justify-center shadow">
          👨‍🌾 Farmer ↔ 👨‍💼 Expert
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex mb-3 ${
                msg.sender === "farmer" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-sm shadow-md max-w-[70%] ${
                  msg.sender === "farmer"
                    ? "bg-green-200 text-gray-900 rounded-bl-none"
                    : "bg-blue-200 text-gray-900 rounded-br-none"
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-xs text-gray-600 block text-right mt-1">
                  {msg.time
                    ? new Date(msg.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t flex items-center gap-2 bg-white">
          <textarea
            rows="1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSend}
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
          >
            ➤
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default FarmerExpertChat;

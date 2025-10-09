import React, { useState, useRef, useEffect } from "react";
import { FaSeedling, FaRobot } from "react-icons/fa";
import { GiFarmTractor } from "react-icons/gi";
import { BsSend } from "react-icons/bs";

const ChatBot = ({ onClose }) => {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      from: "bot",
      message:
        "🌾 Hello! I'm KrishiBot – your agriculture assistant. Ask me anything about crops, fertilizers, weather, or pest control!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // 🔄 Auto-scroll when new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setChatLog((prev) => [...prev, { from: "user", message: input }]);
    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
          import.meta.env.VITE_GEMINI_API_KEY
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert agriculture assistant. Reply in simple and friendly language. Be helpful and precise.\n\nUser: ${input}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "🤔 Sorry, I didn't understand that. Can you try rephrasing?";

      setChatLog((prev) => [...prev, { from: "bot", message: botReply }]);
    } catch (error) {
      console.error("ChatBot API error:", error);
      setChatLog((prev) => [
        ...prev,
        {
          from: "bot",
          message:
            "🌧️ Oops! Unable to connect to the agriculture knowledge server.",
        },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 bg-[#f7fef5] border border-green-300 rounded-2xl shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="bg-green-400 text-white px-5 py-3 flex justify-between items-center rounded-t-2xl">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <FaSeedling className="text-xl" /> KrishiBot
        </h3>
        <button
          onClick={onClose}
          className="text-2xl font-bold hover:text-red-200"
        >
          &times;
        </button>
      </div>

      {/* Chat Window */}
      <div
        className="p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-green-300"
        style={{ maxHeight: "320px", minHeight: "220px" }}
      >
        {chatLog.map((chat, idx) => (
          <div
            key={idx}
            className={`mb-3 ${
              chat.from === "bot" ? "text-left" : "text-right"
            }`}
          >
            <div className="flex items-start gap-2">
              {chat.from === "bot" && (
                <div className="text-green-700 pt-1">
                  <FaRobot className="text-lg" />
                </div>
              )}
              <div
                className={`inline-block px-4 py-2 rounded-xl shadow-md max-w-[80%] ${
                  chat.from === "bot"
                    ? "bg-[#e9f7e2] text-green-800"
                    : "bg-[#4caf50] text-white ml-auto"
                }`}
              >
                {chat.message}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <p className="text-gray-500 italic mt-2 flex items-center gap-2">
            <GiFarmTractor className="animate-bounce text-green-500" />
            KrishiBot is thinking...
          </p>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-green-200 flex items-center gap-2">
        <input
          type="text"
          aria-label="Chat input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your farming question..."
          className="flex-grow border border-green-400 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-[#4caf50] hover:bg-[#388e3c] text-white p-2 rounded-full transition-all duration-200 disabled:opacity-50"
        >
          <BsSend className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;

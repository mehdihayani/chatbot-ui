import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = "http://localhost:8000/chat";

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      const botResponse = typeof data.response === "string" ? data.response : JSON.stringify(data.response.result).replace(/(^"|"$)/g, '');

      setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Request Error:", error);
      setMessages([...newMessages, { text: "API connection error.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <h2 className="text-2xl font-bold text-center py-4 bg-gray-800">💬 MHWAY IA</h2>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">Posez une question !</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 my-2 rounded-lg max-w-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white self-end ml-auto"  // User messages (right)
                  : "bg-green-500 text-white self-start"       // Bot messages (left)
              }`}
            >
              {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-gray-800 flex">
        <input
          type="text"
          className="flex-1 p-3 border border-gray-600 rounded-l-lg bg-gray-700 text-white"
          placeholder="Posez une question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className={`px-5 py-3 rounded-r-lg ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "..." : "Envoyer"}
        </button>
      </div>
    </div>
  );
}
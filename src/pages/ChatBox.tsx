// // ChatBox.js
// import React, { useState } from "react";

// const ChatBox = () => {
//   const [messages, setMessages] = useState([
//     { text: "Hello! How can I help you?", sender: "bot" },
//     { text: "Hello! How can I help you?", sender: "bot" },
//   ]);
//   const [input, setInput] = useState("");

//   const sendMessage = () => {
//     if (input.trim() === "") return;
//     setMessages([...messages, { text: input, sender: "user" }]);
//     setInput("");
//   };

//   return (
//     <div className=" bottom-4  bg-white me-2 border-gray-300 shadow-lg rounded-lg  ">
//       {/* Header */}
//       <div className="p-3 text-gray-700 font-semibold border-b border-gray-200">
//         Chat Box
//       </div>

//       {/* Chat messages */}
//       <div className="flex-1 overflow-y-auto p-3 space-y-2 h-[480px]">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               msg.sender === "user" ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`px-3 py-2 rounded-lg max-w-[75%] text-sm ${
//                 msg.sender === "user"
//                   ? "bg-[#223577] text-white"
//                   : "bg-gray-200 text-gray-800"
//               }`}
//             >
//               {msg.text}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Input box */}
//       <div className="p-2 border-t border-gray-200">
//         <div className="flex">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             className="flex-1 border border-gray-300 rounded-l px-2 py-1 text-sm focus:outline-none"
//             placeholder="Type a message..."
//           />
//           <button
//             onClick={sendMessage}
//             className="bg-[#223577] text-white px-3 rounded-r text-sm"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [user, setUser] = useState({ _id: "", name: "" });

  useEffect(() => {
    const savedId = Cookies.get("_id");
    const savedName = Cookies.get("name");

    if (savedId && savedName) {
      setUser({ _id: savedId, name: savedName });
    }
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;

    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);

    let userId = user._id;
    let userName = user.name;

    // If no user ID, generate and save to cookies
    if (!userId) {
      userId = uuidv4();
      userName = input; // Save first input as name
      Cookies.set("_id", userId, { expires: 365 });
      Cookies.set("name", userName, { expires: 365 });
      setUser({ _id: userId, name: userName });
    }

    const payload = {
      social_id: userId,
      name: userName,
    };

    console.log(payload, "payload");

    fetch("/api/cricindia/register_user.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Server Response:", data);
        if (data.status === "success") {
          setMessages((prev) => [
            ...prev,
            { text: "User saved successfully!", sender: "bot" },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { text: data.message || "Something went wrong", sender: "bot" },
          ]);
        }
      })
      .catch((err) => {
        console.error("API Error:", err);
        setMessages((prev) => [
          ...prev,
          { text: "Error sending message", sender: "bot" },
        ]);
      });

    setInput("");
  };

  return (
    <div className="bottom-4 bg-white me-2 border-gray-300 shadow-lg rounded-lg">
      <div className="p-3 text-gray-700 font-semibold border-b border-gray-200">
        Chat Box
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 h-[480px]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-[75%] text-sm ${
                msg.sender === "user"
                  ? "bg-[#223577] text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-gray-200">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border border-gray-300 rounded-l px-2 py-1 text-sm focus:outline-none"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-[#223577] text-white px-3 rounded-r text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

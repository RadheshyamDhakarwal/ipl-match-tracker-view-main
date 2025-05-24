import React, { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

type Comment = {
  id: number;
  user: string;
  text: string;
  time: string;
  avatarUrl?: string;
};

const CommentSection = () => {
  //   const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatList, setChatList] = useState<Comment[]>([]);
  const [user, setUser] = useState({ _id: "", name: "" });
  const { id: match_id } = useParams();

  useEffect(() => {
    const savedId = Cookies.get("_id");
    const savedName = Cookies.get("name");

    if (savedId && savedName) {
      setUser({ _id: savedId, name: savedName });
    }
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/match-preview/")) {
        userLogin(true); 
        fetchChatsList();
    }
  }, [location.pathname]);

  const fetchChatsList = async () => {
    try {
      const res = await fetch("/api/cricindia/chat_api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat_list",
          match_id: "12453",
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        const formatted = data.chats.map((chat: any) => ({
          id: parseInt(chat.id),
          user: chat.name,
          text: chat.message,
          time: chat.created_at,
          avatarUrl: "https://i.pravatar.cc/32", // static avatar
        }));
        setChatList(formatted);
      }
    } catch (err) {
      console.error("Fetching chats failed", err);
    }
  };

  const userLogin = (skipInputCheck = false) => {
    const userId = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit user ID
    const userName = `Guest-${userId}`; // first message as name
    Cookies.set("_id", userId, { expires: 365 });
    Cookies.set("name", userName, { expires: 365 });
    setUser({ _id: userId, name: userName });

    const payload = {
      social_id: userId,
      name: userName,
      userid:"123"
    };

    fetch("/api/cricindia/register_user.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
           Cookies.set("userid", data?.user?.id, { expires: 365 });
          //   setMessages((prev) => [
          //     ...prev,
          //     { text: "User saved successfully!", sender: "bot" },
          //   ]);
        } else {
          //   setMessages((prev) => [
          //     ...prev,
          //     { text: data.message || "Something went wrong", sender: "bot" },
          //   ]);
        }
      })
      .catch((err) => {
        console.error("API Error:", err);
        // setMessages((prev) => [
        //   ...prev,
        //   { text: "Error sending message", sender: "bot" },
        // ]);
      });

    setInput("");
  };

  const setMessages = async () => {
    if (!input.trim()) return;

    // If still no userId (first time ever), fallback
    const userId = user._id || Cookies.get("_id");
    const uID=Cookies.get("userid");
    const matchId = match_id; // use your actual match_id value

    if (!userId) {
      console.error("User ID missing. User must login first.");
      return;
    }
    const payload = {
      action: "add_message",
      message: input,
      user_id: uID,
      match_id: match_id,
    };

    try {
      const response = await fetch("https://cric-india.com/chat_api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.status === "success") {
        setInput(""); // clear input
        fetchChatsList(); // refresh chat list
      } else {
        console.error("Error from API:", data.message);
      }
    } catch (error) {
      console.error("API failed:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border rounded-lg shadow-sm p-4">
      {chatList.map((comment) => (
        <div key={comment.id} className="mb-4 flex gap-3">
          <img
            src={comment.avatarUrl}
            alt={comment.user}
            className="w-10 h-10 rounded-full mt-1"
          />
          <div className="flex-1 border rounded-md p-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#202124]">{comment.user}</span>
              <span className="text-xs text-gray-500">
                {new Date(comment.time).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="mt-1 text-[#5E5E5E] text-[14px] whitespace-pre-line">
              {comment.text}
            </p>
            {/* <div className="mt-2 flex gap-3 text-xs text-blue-600 font-medium cursor-pointer">
              <div className="flex items-center gap-1 hover:underline">
                <FaThumbsUp className="text-sm" /> Like
              </div>
              <div className="flex items-center gap-1 hover:underline">
                <FaReply className="text-sm" /> Reply
              </div>
            </div> */}
          </div>
        </div>
      ))}

     

      {/* Input box */}

      <div className="relative w-full max-w-md flex gap-1">
        <img
          src="https://i.pravatar.cc/32"
          alt="user"
          className="rounded-full w-8 h-8"
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setMessages()}
          className="w-full p-2 pr-10 rounded-full border border-gray-300 text-sm focus:outline-none"
          placeholder="Write a comment..."
        />
        <FaPaperPlane
          onClick={setMessages}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-[#223577]"
        />
      </div>
    </div>
  );
};

export default CommentSection;

export const setCookie = (name, value, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
};

export const getCookie = (name) => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
};

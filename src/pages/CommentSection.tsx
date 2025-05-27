import React, { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import FacebookLogin from "react-facebook-login";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [user, setUser] = useState({ _id: "", name: "", avatarUrl: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const { id: match_id } = useParams();

  const handleEmojiClick = (emojiData: any) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    const savedId = Cookies.get("social_id");
    const savedName = Cookies.get("name");
    const savedAvatar = Cookies.get("avatarUrl");
     const savedUserId = Cookies.get("p_userid");
     if (savedName && savedUserId) {
    setUser({ _id: savedId, name: savedName, avatarUrl: savedAvatar });
    setIsLoggedIn(true); // ✅ Set to true only if user is registered
  } else {
    setIsLoggedIn(false); // ❌ Not logged in
  }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchChatsList();
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, [location.pathname]);

  const fetchChatsList = async () => {
    try {
      const res = await fetch("/api/cricindia/chat_api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat_list",
          match_id: match_id,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        const formatted = data.chats.map((chat: any) => ({
          id: parseInt(chat.id),
          user: chat.name,
          text: chat.message,
          time: chat.created_at,
          avatarUrl:
            chat.avatarUrl ||
            "data:image/png;base64,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", // static avatar
        }));
        setChatList(formatted);
      }
    } catch (err) {
      console.error("Fetching chats failed", err);
    }
  };

  const setMessages = async () => {
    // if (!input.trim()) return;

    // If still no userId (first time ever), fallback
    const userId = user._id || Cookies.get("_id");

    if (!userId) {
      console.error("User ID missing. User must login first.");
      return;
    }
    const payload = {
      action: "add_message",
      message: input,
      user_id: Cookies.get("p_userid"),
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

  const responseFacebook = (response: any) => {
    if (response.status !== "unknown") {
      const { name, id, picture } = response;
      const avatarUrl = picture.data.url;
      // Set cookies
      Cookies.set("_id", id, { expires: 365 });
      Cookies.set("name", name, { expires: 365 });
      Cookies.set("avatarUrl", avatarUrl, { expires: 365 });
      // Update user state
      userLogin();
      setUser({ _id: id, name: name, avatarUrl: avatarUrl });
      setIsLoggedIn(true);
    } else {
      console.error("Facebook login failed");
    }
  };

  const userLogin = (skipInputCheck = false) => {
    const userId = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit user ID
    const userName = `Guest-${userId}`; // first message as name
    // Cookies.set("_id", userId, { expires: 365 });
    // Cookies.set("name", userName, { expires: 365 });
    // setUser({ _id: userId, name: userName, avatarUrl : Cookies.get('avatarUrl') });

    const payload = {
      social_id: Cookies.get("_id"),
      name: Cookies.get("name"),
      p_userid: "123",
      avatarUrl: Cookies.get("avatarUrl"),
    };
    console.log("payl;oad", payload);
    fetch("/api/cricindia/register_user.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.user?.id) {
          Cookies.set("p_userid", data.user.id, { expires: 365 });
        } else {
          console.error("User registration failed:", data.message);
        }
      })

      .catch((err) => {
        console.error("API Error:", err);
      });

    setInput("");
  };
  return (
    <div className="max-w-lg mx-auto bg-white border rounded-lg shadow-sm p-4">
      {chatList.map((comment) => (
        <div key={comment.id} className="mb-1 flex gap-3">
          <img
            src={
              comment.avatarUrl ||
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAZlBMVEVJTE7///9GSUtCRUf7+/s5PT/x8fE/QkQtMTQ2Ojz4+Pj09PQ8QELt7e1SVVfFxsaqq6y7vLze3993eXrm5ubY2dmkpaZvcXOxsrKOkJHLzMxfYmRmaWp/gYJYWlycnZ4jKCsVHSD2NbXWAAAMG0lEQVR4nM2d2YKqMAyGawu0RfZFBEQ47/+SB9wGFEpp4vLfzcUon3RJkzQhO6D8iNiUgEVtEvnQZyGg/95XhZBwkqukKCrnWzBWFtaCY6EM4qIOM+sLMFYSnQXDRBnExDlKjHEMYay8R0GYKq+ioo5yQxwzmORQS/S3cheT9SH5GIwfFfxtKBccXhgtbQYwcUFRp/2cOCniD8BkBWFvmSxTUUaK7N0wEf0EygWH0+itMEktP4RywZH1toVgC4x7eN8SNi8moy2r9AaYPH3PzqISFc2Gl6MN44YBmhW2RTIIXWyYrP30ELuLyVZ3z9GE6YfYd1AGiSbHhAlPXxlid8lTiAdzDN6+5avFgyMSjHsgH1/FnkVJu8eAccpP7flKGlaun0JXYZwG44iPILtZpVmD8YuvTv2xZLG2RK/AZN9dxqaSpxU7Wg2T1T/E0tPU6nejhPF/i2WVRgWTpT/G0tOkKhoFTNbY3372V9mNYt4swzjll7f9eXHFfrMI47a/sFe+irJ28UiwBGNF9CdZehq6aKctwVS/yjLYaUs29AJMEnzpKKYjRhaO0vMwWe19+4lV8ur5JW0Wxi2/eK7UkWhmF4FZmGP37addUze7CMzBJD/+XgaJuWkzA+Ocf3jy38XOM3vnDEyJbsVQir/Q26UOTIxpxVBuC3FZGT0hbI6JxF9jHi8wWY02yKgtvKI9VvlF1bEtPIF3Bmev6/MLTInFwgUpw8zfPzzf1t7PwpKgBajZy0B7hgkDnJ/O64pqP7MZuPuq6HB2ZBo8mzVPMFmK8kVe1ygOUX7TobwdL30aaE8wEcLZklKvWfHY7RsP44Ahn0JrU5gcYfZTWmj4ufMCYbVm9fSbJjDuAf5i2DnSiqe4EcLeLA+T75rAVHCnMk8rHZTLt6XgfYeSybeNYfZgDwa12w3x7qwF7zqyHM/OMUwFHWRUHDV89aNf7wiOksrxqxnBWNBlmYrNWRUxlMZLR+HoEUwOtfylQYZIDP1SMVrQRjA1cCcTR4PMKusIpOH1HEzeAVkO2iHusdwDkKb7ezV/MCfYsi81IluzckrYusNOrzAZ7AfihVm+W6+kgI1v8dgNHjAw0//Vgt0goKX+dxS4w/iwzZ+1gKRXq4X9kORuod9hDjCWtQCdWhlsvtLDFMYqIB+n8GXr6QgyoVlhTWAq0LClJ6NV+U/uCfT1QTWBgU1/z2DrnyoEWVL3JeAKk8FGWQBl2e1AI4PdclOvMDHoswRwxgwCWTU0iEcwLegg8w/Ostv9gzyB3f7BJKBR5jUYMA1k1vA0ecDEoJWx0z4oq1R1gEegNLzDWCA/BrUxWHY7kLkpD9YNJkshlh7OKAOPs+wGk8PWMvAmcxXozEmD/AYTg97wbAzLQLB43eXITobTEWRhphR8ie8qH7QK2cPZkEBtVlbAbvA95ID2h4vd3sMkoB3TLoFG5l0uLPxoJxeYEDZYl/NyNsK0sKkbDjDAD5EmDqY5WUfYc/Q/Ktk5sGMe1soM9Qeyk9PD+LDLSgLgyZgKNtyp9HsYoPPvV2AGZyCBent/BqYf72QHm/8/M2f6FaCHAVmZPwTD0x2xgIF/I9//nKDxABpYxAI64X9ln+l/Vos4HRDmgAUDDXV3DkmAMDaeOQMMD3cJqYDDbDUbQ1d70FGzl6gIdKQOZgSKgGbVMHsJdKT+yOFsgDmQEprG9BvHZjLMXtJAs6V+wqExiDckhabjzGV+mgic58oKAoqMXD7jjAMDTnKiJ1KDE5k6UAjwrqyDPgetSQD9DJSIBjCmcYU5I8Cwev1R14WQgwhH6fUPwQbYg+IziJItHAZ4RLwJ491QOAxGanhAzggpuTNp+RuFcQGhXwDgS/NgbALPNBbUyLzA1PBNc/gYAnw1MUYtiH7TBJszg4ChAFgA4PEQKdzQHEQJaOM8ohTp6A1N6GH1KmaeO9cb/xgz5nIEwLjK0IubuwLcFucKiowILKD50C0Sb6IQ6UKajMEOjbv4xlpkDyXQFOS7RAV2NT0k10upzMlpsMpBdAnYCTj6sK1V7y6K8L7fIRZenQypWexqrBzx6y1i4V2W59uzG90T2q1QFlhkh3Nl7qL569MqIV4J99Id2SFczbqLso2vZo94TVgeehhg9O35AzcJ8Ycc4pEEwS3yJxpsOgtAA10TddkQOse8Ps02nQVixLv6lA2hcxz7+yaWboFBOX7cv7lw4OkmU12T2DQFS9p70jXdBHUFIHSDp6bFLA9wTQTaJZjVDHiqvQRYwKD90xdfU7Qy4M2iidhJe5zlOGeyq3hxTZ7b404a7XMNVumBi+RQmhKecPok/YrREeaUuSecoq4q1NZeAeA3m0df+0gFzqAeGko5t6UUvZj+ctZSNvyHlDbnUBuNN/ckbVB9Bio7wc5FUx6iOMyTJNMOPvtZkuRhHB3Kpjgz0UGS+K41Gy4wobnfisk28R1nv3ddQxet5br7veP4CaAi9K3k2QXG/DIAPxucLpeUn40f41oaBHYZ6HF1DUfG1/jGl4GMl3y7REppusoyDJ/fN7crjG82zhjU+/+smBhNG34rFXq72mhwIZfZvC5RouZ/ysqa2waPctsO7pdONwbQmO3VZQTsSjQjp4rK2tvIQ8/TS6fWlnMStWVdHnOkPLNn7fNjWcst1gFLp9eBd0fdf6a2CMo4R38nYzl5XAb61cMeN6vvMK7eesaFV4bJW0luPElYenrVw2hwd3D9FTdY/8felErj7AMkN54sToVGjyv+UtxgvewEE3XsIyWX6sr143oVZ6bsxJqbluFu9vpKVqqten8OoT8Yv1P9C10pL/5GrSQJdH8PNiqik6psCYZ2GWO7chWMPfLUjWBUGZ8UKd3PTKosknG+67jwlKIiGEe682smhf1pN/OFp/rXufgLeAhZWOY6LMJQNj5PjWEUjlq+yYeMrWUfxfRi5aSM3rKb5q9QzRfkLJ7qn1zbExjFrQ+OlL1souXSK0/3XaalJ5drQNHN7eDQtFwH/7na1VNR0OPi6ATnlJlKkYvGnwLCTzCKgo0MUijLXOHySdp+vrrzXEhXceTk5y9YZ9Wy+4m+PM9LiWOFN8DTD1dgKT8t75fsZe97gVGFOO1P0yhZXlMpX8uCqxpPfJhGxULp66CfKdiuyjSw6w/Om6pW2PFz+RMzMG6h+Azv/LE1LQwUpzK7mDn0zjU5yFR+ER58aL+JVT38qD3nfpxtPxF2yx/TL/tYd2ZVsg5KT203Oz5mYaxW5d2gvHy71emXyiQYMV8ccr5li6/uo+XBijOuKzspnRhLPbUWmulk6pRWT8ZvHGpWLJUsfKH9zGKbo1yd7Ui79w01v+yU3lW2mJ+z2E1r7eKECPK3eATdPFC7IxXm+yLMajstJrbUM9dV1q54MPuD1eIIX27a5q4GoOQpRh5rfrzaJVLR5kzVTm+9kDJnpX5T5XW5YcnW3PfKstCqRofOah8q6p1LNGOtKs/eWlxFKEtcK1tQ7pvVvDo0HB0UItRlIdTNQR2N3tOMn3WbRC8rb858PRIjUnVwaKVtq7P+bga3ItHsEr2gsCA6TU/E2j2QtYa66/PmiiOJdkfy529oidTq36KeLzowg89WK9pJ5b863m80cqx9XP/T/HyNmjDrTajdg24yGBOiiDNHc7F2nSQudGKWVxaq0XZAp9f5Uf9WChfy1IZJ5ihfkeVkSdiepH4vKqbV7FyrcXu4pYkjk4IW5bGqkpmX5PYYVXUsCyq2ZJd5tdYCowWzqzSW6JGGVm2SnNKyjY5xHIZVrzCM42PUlumJyK3t24Rmhx49mF1Wbu6tQtmQtymHPJjgfA6GfJvhT7658xQVuvlGmjC7/ZEY3oCiD5n9v0e0O/TowvRD7fSVzpSi0LeW9GH6owasSKWJqNyyF2+AGS7vfLjHtr3tctEmmN7w/OTLoXJj7bRtMJcsyg/h9ObrVut1K8xuXwaoPT6XUHhQbk413AwznD2C9WMUEMULTM5IBjA7N25MNx09eaSJTXwLJjCDFyW1Me9YTcTt1NDrYwbTbzpxitZ/dYoypE4aPpQpTI8TpgJ9sHkiDc1di+Yw/WDrjWnMfYfK3jyGuBUhMP06nbSe7llxTUx4bQJL/IbB7AY35EnPH6EUZfIEd47+B4wasf2xUpAGAAAAAElFTkSuQmCC"
            }
            alt={comment.user}
            className="w-10 h-10 rounded-full mt-1"
          />
          <div className="flex-1 rounded-md p-3 ">
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#202124]">{comment.user}</span>
              <span className="text-xs text-gray-500">
                {(() => {
                  const commentDate = new Date(comment.time);
                  const today = new Date();

                  const isToday =
                    commentDate.getDate() === today.getDate() &&
                    commentDate.getMonth() === today.getMonth() &&
                    commentDate.getFullYear() === today.getFullYear();

                  if (isToday) {
                    return `Today, ${commentDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}`;
                  } else {
                    return commentDate.toLocaleString("en-US", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                  }
                })()}
              </span>
            </div>
            <p
              className="mt-1 text-[#5E5E5E] text-[14px] whitespace-pre-line"
              style={{
                fontFamily:
                  "Segoe UI Emoji, NotoColorEmoji, Apple Color Emoji, sans-serif",
              }}
            >
              {comment.text}
            </p>
          </div>
        </div>
      ))}

      {/* Input box */}

      <div
        className="relative w-full max-w-md flex gap-1"
        onMouseEnter={() => {
          if (!isLoggedIn) {
            toast.error("Please log-in first to write a comment");
          }
        }}
      >
        <img
          src={
            Cookies.get("avatarUrl") ||
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAZlBMVEVJTE7///9GSUtCRUf7+/s5PT/x8fE/QkQtMTQ2Ojz4+Pj09PQ8QELt7e1SVVfFxsaqq6y7vLze3993eXrm5ubY2dmkpaZvcXOxsrKOkJHLzMxfYmRmaWp/gYJYWlycnZ4jKCsVHSD2NbXWAAAMG0lEQVR4nM2d2YKqMAyGawu0RfZFBEQ47/+SB9wGFEpp4vLfzcUon3RJkzQhO6D8iNiUgEVtEvnQZyGg/95XhZBwkqukKCrnWzBWFtaCY6EM4qIOM+sLMFYSnQXDRBnExDlKjHEMYay8R0GYKq+ioo5yQxwzmORQS/S3cheT9SH5GIwfFfxtKBccXhgtbQYwcUFRp/2cOCniD8BkBWFvmSxTUUaK7N0wEf0EygWH0+itMEktP4RywZH1toVgC4x7eN8SNi8moy2r9AaYPH3PzqISFc2Gl6MN44YBmhW2RTIIXWyYrP30ELuLyVZ3z9GE6YfYd1AGiSbHhAlPXxlid8lTiAdzDN6+5avFgyMSjHsgH1/FnkVJu8eAccpP7flKGlaun0JXYZwG44iPILtZpVmD8YuvTv2xZLG2RK/AZN9dxqaSpxU7Wg2T1T/E0tPU6nejhPF/i2WVRgWTpT/G0tOkKhoFTNbY3372V9mNYt4swzjll7f9eXHFfrMI47a/sFe+irJ28UiwBGNF9CdZehq6aKctwVS/yjLYaUs29AJMEnzpKKYjRhaO0vMwWe19+4lV8ur5JW0Wxi2/eK7UkWhmF4FZmGP37addUze7CMzBJD/+XgaJuWkzA+Ocf3jy38XOM3vnDEyJbsVQir/Q26UOTIxpxVBuC3FZGT0hbI6JxF9jHi8wWY02yKgtvKI9VvlF1bEtPIF3Bmev6/MLTInFwgUpw8zfPzzf1t7PwpKgBajZy0B7hgkDnJ/O64pqP7MZuPuq6HB2ZBo8mzVPMFmK8kVe1ygOUX7TobwdL30aaE8wEcLZklKvWfHY7RsP44Ahn0JrU5gcYfZTWmj4ufMCYbVm9fSbJjDuAf5i2DnSiqe4EcLeLA+T75rAVHCnMk8rHZTLt6XgfYeSybeNYfZgDwa12w3x7qwF7zqyHM/OMUwFHWRUHDV89aNf7wiOksrxqxnBWNBlmYrNWRUxlMZLR+HoEUwOtfylQYZIDP1SMVrQRjA1cCcTR4PMKusIpOH1HEzeAVkO2iHusdwDkKb7ezV/MCfYsi81IluzckrYusNOrzAZ7AfihVm+W6+kgI1v8dgNHjAw0//Vgt0goKX+dxS4w/iwzZ+1gKRXq4X9kORuod9hDjCWtQCdWhlsvtLDFMYqIB+n8GXr6QgyoVlhTWAq0LClJ6NV+U/uCfT1QTWBgU1/z2DrnyoEWVL3JeAKk8FGWQBl2e1AI4PdclOvMDHoswRwxgwCWTU0iEcwLegg8w/Ostv9gzyB3f7BJKBR5jUYMA1k1vA0ecDEoJWx0z4oq1R1gEegNLzDWCA/BrUxWHY7kLkpD9YNJkshlh7OKAOPs+wGk8PWMvAmcxXozEmD/AYTg97wbAzLQLB43eXITobTEWRhphR8ie8qH7QK2cPZkEBtVlbAbvA95ID2h4vd3sMkoB3TLoFG5l0uLPxoJxeYEDZYl/NyNsK0sKkbDjDAD5EmDqY5WUfYc/Q/Ktk5sGMe1soM9Qeyk9PD+LDLSgLgyZgKNtyp9HsYoPPvV2AGZyCBent/BqYf72QHm/8/M2f6FaCHAVmZPwTD0x2xgIF/I9//nKDxABpYxAI64X9ln+l/Vos4HRDmgAUDDXV3DkmAMDaeOQMMD3cJqYDDbDUbQ1d70FGzl6gIdKQOZgSKgGbVMHsJdKT+yOFsgDmQEprG9BvHZjLMXtJAs6V+wqExiDckhabjzGV+mgic58oKAoqMXD7jjAMDTnKiJ1KDE5k6UAjwrqyDPgetSQD9DJSIBjCmcYU5I8Cwev1R14WQgwhH6fUPwQbYg+IziJItHAZ4RLwJ491QOAxGanhAzggpuTNp+RuFcQGhXwDgS/NgbALPNBbUyLzA1PBNc/gYAnw1MUYtiH7TBJszg4ChAFgA4PEQKdzQHEQJaOM8ohTp6A1N6GH1KmaeO9cb/xgz5nIEwLjK0IubuwLcFucKiowILKD50C0Sb6IQ6UKajMEOjbv4xlpkDyXQFOS7RAV2NT0k10upzMlpsMpBdAnYCTj6sK1V7y6K8L7fIRZenQypWexqrBzx6y1i4V2W59uzG90T2q1QFlhkh3Nl7qL569MqIV4J99Id2SFczbqLso2vZo94TVgeehhg9O35AzcJ8Ycc4pEEwS3yJxpsOgtAA10TddkQOse8Ps02nQVixLv6lA2hcxz7+yaWboFBOX7cv7lw4OkmU12T2DQFS9p70jXdBHUFIHSDp6bFLA9wTQTaJZjVDHiqvQRYwKD90xdfU7Qy4M2iidhJe5zlOGeyq3hxTZ7b404a7XMNVumBi+RQmhKecPok/YrREeaUuSecoq4q1NZeAeA3m0df+0gFzqAeGko5t6UUvZj+ctZSNvyHlDbnUBuNN/ckbVB9Bio7wc5FUx6iOMyTJNMOPvtZkuRhHB3Kpjgz0UGS+K41Gy4wobnfisk28R1nv3ddQxet5br7veP4CaAi9K3k2QXG/DIAPxucLpeUn40f41oaBHYZ6HF1DUfG1/jGl4GMl3y7REppusoyDJ/fN7crjG82zhjU+/+smBhNG34rFXq72mhwIZfZvC5RouZ/ysqa2waPctsO7pdONwbQmO3VZQTsSjQjp4rK2tvIQ8/TS6fWlnMStWVdHnOkPLNn7fNjWcst1gFLp9eBd0fdf6a2CMo4R38nYzl5XAb61cMeN6vvMK7eesaFV4bJW0luPElYenrVw2hwd3D9FTdY/8felErj7AMkN54sToVGjyv+UtxgvewEE3XsIyWX6sr143oVZ6bsxJqbluFu9vpKVqqten8OoT8Yv1P9C10pL/5GrSQJdH8PNiqik6psCYZ2GWO7chWMPfLUjWBUGZ8UKd3PTKosknG+67jwlKIiGEe682smhf1pN/OFp/rXufgLeAhZWOY6LMJQNj5PjWEUjlq+yYeMrWUfxfRi5aSM3rKb5q9QzRfkLJ7qn1zbExjFrQ+OlL1souXSK0/3XaalJ5drQNHN7eDQtFwH/7na1VNR0OPi6ATnlJlKkYvGnwLCTzCKgo0MUijLXOHySdp+vrrzXEhXceTk5y9YZ9Wy+4m+PM9LiWOFN8DTD1dgKT8t75fsZe97gVGFOO1P0yhZXlMpX8uCqxpPfJhGxULp66CfKdiuyjSw6w/Om6pW2PFz+RMzMG6h+Azv/LE1LQwUpzK7mDn0zjU5yFR+ER58aL+JVT38qD3nfpxtPxF2yx/TL/tYd2ZVsg5KT203Oz5mYaxW5d2gvHy71emXyiQYMV8ccr5li6/uo+XBijOuKzspnRhLPbUWmulk6pRWT8ZvHGpWLJUsfKH9zGKbo1yd7Ui79w01v+yU3lW2mJ+z2E1r7eKECPK3eATdPFC7IxXm+yLMajstJrbUM9dV1q54MPuD1eIIX27a5q4GoOQpRh5rfrzaJVLR5kzVTm+9kDJnpX5T5XW5YcnW3PfKstCqRofOah8q6p1LNGOtKs/eWlxFKEtcK1tQ7pvVvDo0HB0UItRlIdTNQR2N3tOMn3WbRC8rb858PRIjUnVwaKVtq7P+bga3ItHsEr2gsCA6TU/E2j2QtYa66/PmiiOJdkfy529oidTq36KeLzowg89WK9pJ5b863m80cqx9XP/T/HyNmjDrTajdg24yGBOiiDNHc7F2nSQudGKWVxaq0XZAp9f5Uf9WChfy1IZJ5ihfkeVkSdiepH4vKqbV7FyrcXu4pYkjk4IW5bGqkpmX5PYYVXUsCyq2ZJd5tdYCowWzqzSW6JGGVm2SnNKyjY5xHIZVrzCM42PUlumJyK3t24Rmhx49mF1Wbu6tQtmQtymHPJjgfA6GfJvhT7658xQVuvlGmjC7/ZEY3oCiD5n9v0e0O/TowvRD7fSVzpSi0LeW9GH6owasSKWJqNyyF2+AGS7vfLjHtr3tctEmmN7w/OTLoXJj7bRtMJcsyg/h9ObrVut1K8xuXwaoPT6XUHhQbk413AwznD2C9WMUEMULTM5IBjA7N25MNx09eaSJTXwLJjCDFyW1Me9YTcTt1NDrYwbTbzpxitZ/dYoypE4aPpQpTI8TpgJ9sHkiDc1di+Yw/WDrjWnMfYfK3jyGuBUhMP06nbSe7llxTUx4bQJL/IbB7AY35EnPH6EUZfIEd47+B4wasf2xUpAGAAAAAElFTkSuQmCC"
          }
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
          disabled={!isLoggedIn}
        />

        <FaPaperPlane
          onClick={setMessages}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-[#223577]"
        />
        <button
          className="absolute top-1/2 right-9 transform -translate-y-1/2"
          onClick={() => setShowPicker((prev) => !prev)}
        >
          😀
        </button>
      </div>
      <div>
        {showPicker && (
          <EmojiPicker className="mt-2" style={{width:"450px"}} onEmojiClick={handleEmojiClick} />
        )}
      </div>
      <div
        className="facebook_login"
        style={{ display: "flex", justifyContent: "center" }}
      >
        {!isLoggedIn && (
          <FacebookLogin
            appId="993192689634378" // Your App ID
            autoLoad={false}
            fields="name,picture"
            callback={responseFacebook}
            cssClass="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
            textButton="Login with Facebook"
          />
        )}
      </div>
      <ToastContainer toastStyle={{ top: "50px" }} />
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

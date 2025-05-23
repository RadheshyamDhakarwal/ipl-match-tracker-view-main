import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // your backend

type ChatRoomProps = {
  matchId: string;
  username: string;
};

 const ChatRoom = ({ matchId, username }) => {
  const [users, setUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.emit('joinRoom', { matchId, username });

    socket.on('updateUserList', (onlineUsers: string[]) => {
      setUsers(onlineUsers);
    });

    socket.on('receiveMessage', (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit('leaveRoom', { matchId });
      socket.disconnect();
    };
  }, [matchId, username]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('sendMessage', { matchId, username, text: input });
      setInput('');
    }
  };

  return (
    <div className="flex h-screen bg-black text-green-300 font-mono">
      <div className="w-1/5 border-r border-green-500 p-2">
        <h3 className="font-bold">Users Online</h3>
        <ul>
          {users.map((u, i) => (
            <li key={i}>• {u}</li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-2 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className="mb-1">{msg}</div>
          ))}
        </div>
        <div className="mt-2 flex">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-gray-900 text-green-300 p-2 outline-none"
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} className="bg-green-800 px-4 py-2 ml-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};


export default  ChatRoom;
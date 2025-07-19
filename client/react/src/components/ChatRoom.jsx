//Global chat room UI

import { useEffect, useState, useRef } from 'react';
import socket from '../socket';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import UserList from './UserList';

export default function ChatRoom() {
  const username = localStorage.getItem('username');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!username) return;

    socket.emit('user_join', username);

    socket.on('receive_message', (msg) => {
      console.log('📨 Message received:', msg);
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('user_list', (userList) => {
      setUsers(userList);
    });

    socket.on('typing_users', (typingList) => {
      setTypingUsers(typingList);
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_list');
      socket.off('typing_users');
    };
  }, [username]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send_message', {
        message,
      });
      setMessage('');
      socket.emit('typing', false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit('typing', e.target.value.length > 0);
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="grid grid-cols-4 h-screen">
      <UserList users={users} />
      <div className="col-span-3 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-2">
          {messages.map((msg) => (
            <Message key={msg.id} msg={msg} />
          ))}
          <TypingIndicator users={typingUsers} />
          <div ref={messageEndRef} />
        </div>
        <form onSubmit={handleSend} className="mt-4 flex gap-2">
          <input
            value={message}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="border rounded px-3 py-2 w-full"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 rounded">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

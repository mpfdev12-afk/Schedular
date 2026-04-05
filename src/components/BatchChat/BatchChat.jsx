import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiX, FiMessageSquare } from 'react-icons/fi';
import { useSocket } from '../../context/SocketContext';
import { useSelector } from 'react-redux';
import { fetchDataFromApi } from '../../utils/api';
import './BatchChat.scss';

export default function BatchChat({ batchId, batchTitle, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();
  const user = useSelector((state) => state.user);
  const scrollRef = useRef();

  // 1. Fetch History on Mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const res = await fetchDataFromApi(`/messages/${batchId}`);
        setMessages(res?.data || []);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();

    // 2. Join Socket Room
    if (socket) {
      socket.emit("join_batch", batchId);

      // 3. Listen for Incoming Messages
      socket.on("receive_message", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });

      return () => {
        socket.off("receive_message");
      };
    }
  }, [batchId, socket]);

  // Handle Scroll to Bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    const messageData = {
      batchId,
      senderId: user._id,
      senderModel: "User", // This could be dynamic if we check roles
      fullname: user.fullname,
      content: input,
    };

    socket.emit("send_message", messageData);
    setInput('');
  };

  return (
    <motion.div 
      className="batch-chat-overlay"
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
    >
      <div className="chat-header">
        <div className="title">
          <FiMessageSquare className="icon" />
          <div className="text">
            <h4>{batchTitle} Chat</h4>
            <span className="online-tag">Live Sync Active</span>
          </div>
        </div>
        <button className="close-btn" onClick={onClose}><FiX /></button>
      </div>

      <div className="chat-messages" ref={scrollRef}>
        {loading ? (
          <div className="chat-loader">Synchronizing History...</div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={msg._id || index} 
              className={`message-wrapper ${msg.senderId === user._id ? 'own' : 'other'}`}
            >
              <div className="sender-name">{msg.fullname}</div>
              <div className="message-bubble">{msg.content}</div>
              <div className="timestamp">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
      </div>

      <form className="chat-input-area" onSubmit={handleSendMessage}>
        <input 
          type="text" 
          placeholder="Share your progress..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="send-btn" disabled={!input.trim()}>
          <FiSend />
        </button>
      </form>
    </motion.div>
  );
}

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useSelector((state) => state.user);
  
  // Get base URL from VITE_API_URL (strip /api/v1)
  const socketUrl = import.meta.env.VITE_API_URL.replace('/api/v1', '');

  useEffect(() => {
    if (user && user._id) {
      console.log("SOCKET: Initializing connection for user:", user._id);
      
      const newSocket = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket'],
      });

      setSocket(newSocket);

      // Join private room for individual notifications
      newSocket.emit("join_private", user._id);

      // Global Notification Listeners
      newSocket.on("NOTIFICATION_NEW_BOOKING", (data) => {
        toast.info(data.message || "New booking alert!");
      });

      newSocket.on("NOTIFICATION_BOOKING_CONFIRMED", (data) => {
        toast.success(data.message || "Your session is confirmed!");
      });

      return () => {
        console.log("SOCKET: Disconnecting...");
        newSocket.disconnect();
      };
    } else {
      // If user logs out, disconnect socket
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

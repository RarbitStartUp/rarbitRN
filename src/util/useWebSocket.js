import React from 'react';
import {createContext, useContext, useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';

const WebSocketContext = createContext();

const getWebSocketURL = () => {
  // Define WebSocket URLs for different environments or platforms
  // For example, you might have different URLs for development, staging, and production environments
  const developmentUrl = 'ws://localhost:3001';
  const productionUrl = 'wss://rarbit.tech';

  // Determine the environment or platform where the app is running
  // For React Native, you might use platform-specific APIs or environment variables
  // For simplicity, let's assume a variable indicating the development environment
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Return the appropriate WebSocket URL based on the environment
  return isDevelopment ? developmentUrl : productionUrl;
};

export const WebSocketProvider = ({children}) => {
  const socketUrl = getWebSocketURL();

  // Use state to manage the WebSocket instance and its connection status
  const [socket, setSocket] = useState(null);
  const [isWebSocketOpen, setIsWebSocketOpen] = useState(false);

  useEffect(() => {
    const initWebSocket = async () => {
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        const ws = new WebSocket(socketUrl);
        ws.addEventListener('open', () => {
          console.log('WebSocket connection opened successfully');
          setIsWebSocketOpen(true);
          // Add a small delay to ensure WebSocket is connected before logging
          setTimeout(() => {
            console.log('Is WebSocket connected:', ws instanceof WebSocket);
          }, 100);
        });
        ws.addEventListener('close', () => {
          console.log('WebSocket connection closed');
          setIsWebSocketOpen(false);
        });
        setSocket(ws);
      }
    };

    initWebSocket();

    // Clean up the WebSocket instance and event listeners when the component is unmounted
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socketUrl]); // eslint-disable-line react-hooks/exhaustive-deps
  console.log('Is WebSocket connected:', socket instanceof WebSocket);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

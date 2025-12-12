import { useState, useEffect, useRef, useCallback } from 'react';

export const useWebSocket = (url) => {
    const [data, setData] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    const connect = useCallback(() => {
        try {
            const socket = new WebSocket(url);

            socket.onopen = () => {
                setIsConnected(true);
                console.log('WebSocket Connected');
            };

            socket.onmessage = (event) => {
                const newData = JSON.parse(event.data);
                setData(newData);
            };

            socket.onclose = () => {
                setIsConnected(false);
                console.log('WebSocket Disconnected. Reconnecting...');
                reconnectTimeoutRef.current = setTimeout(connect, 3000);
            };

            socket.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };

            socketRef.current = socket;
        } catch (error) {
            console.error('Connection failed:', error);
        }
    }, [url]);

    useEffect(() => {
        connect();
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [connect]);

    // Simulador de datos para desarrollo si no hay backend real activo
    useEffect(() => {
        if (!isConnected) {
            const interval = setInterval(() => {
                // Simular heartbeat
                setData({ type: 'heartbeat', timestamp: new Date().toISOString() });
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isConnected]);

    return { data, isConnected };
};

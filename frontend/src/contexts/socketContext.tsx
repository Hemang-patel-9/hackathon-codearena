import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './authContext';

interface ServerToClientEvents {
	// Define incoming socket events if needed
	'active-users': (users: { userId: string; username: string }[]) => void;
}

interface ClientToServerEvents {
	'register-user': (data: { userId: string; username: string }) => void;
	'get-active-users': () => void;
	
}

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const SocketContext = createContext<TypedSocket | null>(null);

interface SocketProviderProps {
	children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
	const { user } = useAuth();
	const socketRef = useRef<TypedSocket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		if (!user?._id) return;

		const socket: TypedSocket = io(import.meta.env.VITE_APP_SOCKET_URL, {
			transports: ['websocket'],
		});

		socket.on('connect', () => {
			console.log('✅ Socket connected:', socket.id);

			// ✅ Register user globally
			socket.emit('register-user', {
				userId: user._id,
				username: user.username,
			});
		});

		socketRef.current = socket;
		setIsConnected(true);

		return () => {
			socket.disconnect();
			setIsConnected(false);
		};
	}, [user]);

	return (
		<SocketContext.Provider value={isConnected ? socketRef.current : null}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => useContext(SocketContext);

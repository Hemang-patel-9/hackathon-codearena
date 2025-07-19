import React, {
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import type { User } from "@/types/user";

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (user: User, token: string) => void;
	logout: () => void;
	isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(() => {
		return localStorage.getItem("token");
	});
	const [isAuthLoading, setIsAuthLoading] = useState(true);

	const login = (user: User, token: string) => {
		setUser(user);
		setToken(token);
		localStorage.setItem("token", token);
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("token");
	};

	useEffect(() => {
		const validateToken = async () => {
			const savedToken = localStorage.getItem("token");
			if (!savedToken) {
				setIsAuthLoading(false);
				return;
			}

			try {
				const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/user/auth`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${savedToken}`,
					},
				});

				if (res.ok) {
					const data = await res.json();
					if (data.error == null) {
						setToken(savedToken);
						setUser(data.data);
					}
				} else {
					logout();
				}
			} catch (err) {
				console.error("Session validation failed", err);
				logout();
			} finally {
				setTimeout(() => {
					setIsAuthLoading(false);
				}, 1000);
			}
		};

		validateToken();
	}, []);

	const value = {
		user,
		token,
		login,
		logout,
		isAuthLoading,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {	
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

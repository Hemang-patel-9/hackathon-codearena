import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function GitHubSuccess() {
	const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
	const location = useLocation();

	useEffect(() => {
		const query = new URLSearchParams(location.search);
		const name = query.get("name");
		const avatar = query.get("avatar");
		if (name && avatar) setUser({ name, avatar });
	}, [location.search]);

	return (
		<div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
			{user ? (
				<>
					<img src={user.avatar} className="w-20 h-20 rounded-full" />
					<h1 className="text-xl font-bold">Welcome, {user.name}</h1>
				</>
			) : (
				<p>Loading user info...</p>
			)}
		</div>
	);
}

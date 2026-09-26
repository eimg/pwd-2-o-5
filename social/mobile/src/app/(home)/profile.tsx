import { useApp } from "@/components/app-provider";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Profile() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { auth, clearAuth, setAuth, saveToken } = useApp();

	const login = async () => {
		const res = await fetch("http://localhost:8800/login", {
			method: "POST",
			body: JSON.stringify({ username, password }),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			const { user, token } = await res.json();
			saveToken(token);
			setAuth(user);
			router.push("/");
		} else {
			alert("Unable to login");
		}
	};

	return (
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text style={{ fontSize: 18, fontWeight: "bold" }}>Profile</Text>

			{auth && (
				<View
					style={{ alignItems: "center", justifyContent: "center" }}>
					<Text style={{ fontWeight: "bold" }}>{auth.name}</Text>
					<TouchableOpacity
						style={{
							marginTop: 20,
							paddingHorizontal: 30,
							paddingVertical: 10,
							borderRadius: 20,
							backgroundColor: "red",
							justifyContent: "center",
							alignItems: "center",
						}}
						onPress={clearAuth}>
						<Text style={{ fontSize: 18, color: "white" }}>
							Logout
						</Text>
					</TouchableOpacity>
				</View>
			)}

			{!auth && (
				<View style={{ gap: 8, width: "80%", marginTop: 20 }}>
					<TextInput
						style={{
							width: "100%",
							paddingHorizontal: 20,
							paddingVertical: 10,
							fontSize: 18,
							borderRadius: 20,
							borderWidth: 1,
							borderColor: "#66666640",
							backgroundColor: "white",
						}}
						placeholder="username"
						autoCapitalize="none"
						value={username}
						onChangeText={setUsername}
					/>
					<TextInput
						style={{
							width: "100%",
							paddingHorizontal: 20,
							paddingVertical: 10,
							fontSize: 18,
							borderRadius: 20,
							borderWidth: 1,
							borderColor: "#66666640",
							backgroundColor: "white",
						}}
						placeholder="password"
						secureTextEntry
						value={password}
						onChangeText={setPassword}
					/>
					<TouchableOpacity
						style={{
							width: "100%",
							paddingHorizontal: 20,
							paddingVertical: 10,
							borderRadius: 20,
							backgroundColor: "teal",
							justifyContent: "center",
							alignItems: "center",
						}}
						onPress={login}>
						<Text style={{ fontSize: 18, color: "white" }}>
							Login
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
}

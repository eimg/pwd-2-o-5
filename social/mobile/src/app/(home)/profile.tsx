import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Profile() {
	return (
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text style={{ fontSize: 18, fontWeight: "bold" }}>Profile</Text>

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
					}}>
					<Text style={{ fontSize: 18, color: "white" }}>Login</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
	return (
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text style={{ fontSize: 18, fontWeight: "bold" }}>
				Hello World
			</Text>

			<Link
				style={{ marginTop: 20, color: "blue" }}
				href={"/add-post"}>
				+ Add Post
			</Link>

			<Link
				style={{ marginTop: 20, color: "blue" }}
				href={"/view-post/123"}>
				View Post
			</Link>
		</View>
	);
}

import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ViewPost() {
	const { id } = useLocalSearchParams();

	return (
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text style={{ fontSize: 18, fontWeight: "bold" }}>
				View Post #{id}
			</Text>
		</View>
	);
}

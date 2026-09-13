import { Stack } from "expo-router";

export default function RootLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="(home)"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="add-post"
				options={{
					title: "Add Post",
				}}
			/>
			<Stack.Screen
				name="view-post/[id]"
				options={{
					title: "View Post",
				}}
			/>
		</Stack>
	);
}

import { Stack } from "expo-router";

export default function RootLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="(home)"
				options={{
					title: "Home",
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="add-post"
				options={{
					title: "New Post",
					presentation: "modal",
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

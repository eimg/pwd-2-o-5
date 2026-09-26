import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
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
		</QueryClientProvider>
	);
}

import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router, Tabs } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export default function HomeLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<Ionicons
							color={color}
							name="home"
							size={24}
						/>
					),
					headerRight: () => (
						<View style={{ marginRight: 15 }}>
							<TouchableOpacity
								onPress={() => router.push("/add-post")}>
								<Ionicons
									name="add"
									size={24}
								/>
							</TouchableOpacity>
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => (
						<Ionicons
							color={color}
							name="person-circle"
							size={24}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: ({ color }) => (
						<Ionicons
							color={color}
							name="settings"
							size={24}
						/>
					),
				}}
			/>
		</Tabs>
	);
}

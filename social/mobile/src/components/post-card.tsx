import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";

export default function PostCard() {
	return (
		<View
			style={{
				backgroundColor: "white",
				paddingVertical: 20,
				paddingHorizontal: 15,
				borderBottomWidth: 1,
				borderColor: "#66666630",
			}}>
			<View style={{ flexDirection: "row", gap: 10 }}>
				<View
					style={{
						width: 52,
						height: 52,
						borderRadius: 52,
						backgroundColor: "teal",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<Text style={{ color: "white" }}>A</Text>
				</View>
				<View style={{ flexShrink: 1 }}>
					<Text style={{ fontSize: 16, fontWeight: "bold" }}>
						Alice
					</Text>
					<Text style={{ color: "teal" }}>A few seconds ago</Text>
					<Text style={{ fontSize: 15, marginTop: 6 }}>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Dignissimos, obcaecati consequuntur distinctio
						reiciendis esse iste a velit nesciunt porro quos quia
						animi voluptatem quidem officiis facere, at quod iusto
						voluptatibus.
					</Text>
				</View>
			</View>
			<View
				style={{
					marginTop: 15,
					flexDirection: "row",
					justifyContent: "space-around",
				}}>
				<View
					style={{
						flexDirection: "row",
						gap: 10,
						alignItems: "center",
					}}>
					<TouchableOpacity>
						<Ionicons
							name="heart-outline"
							color={"red"}
							size={24}
						/>
					</TouchableOpacity>
					<TouchableOpacity>
						<Text>5</Text>
					</TouchableOpacity>
				</View>

				<View
					style={{
						flexDirection: "row",
						gap: 10,
						alignItems: "center",
					}}>
					<TouchableOpacity
						onPress={() => router.push("/view-post/123")}>
						<Ionicons
							name="chatbubble-outline"
							color={"gray"}
							size={24}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => router.push("/view-post/123")}>
						<Text>3</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

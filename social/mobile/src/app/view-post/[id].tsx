import PostCard from "@/components/post-card";
import { useLocalSearchParams } from "expo-router";
import {
	Text,
	View,
	ScrollView,
	TextInput,
	TouchableOpacity,
} from "react-native";

export default function ViewPost() {
	const { id } = useLocalSearchParams();

	return (
		<ScrollView>
			<PostCard />
			<View style={{ paddingHorizontal: 15, gap: 8, marginTop: 10 }}>
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
					placeholder="Your reply..."
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
					<Text style={{ fontSize: 18, color: "white" }}>
						Add Reply
					</Text>
				</TouchableOpacity>
			</View>
			<View
				style={{
					marginVertical: 20,
					borderTopWidth: 1,
					borderColor: "#66666630",
				}}>
				<View
					style={{
						padding: 15,
						borderBottomWidth: 1,
						borderColor: "#66666630",
						paddingHorizontal: 20,
					}}>
					<Text style={{ fontSize: 16, fontWeight: "bold" }}>
						Alice
					</Text>
					<Text style={{ color: "teal" }}>A few seconds ago</Text>
					<Text style={{ fontSize: 15, marginTop: 6 }}>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						sit amet consectetur adipisicing elit.
					</Text>
				</View>
				<View
					style={{
						padding: 15,
						borderBottomWidth: 1,
						borderColor: "#66666630",
						paddingHorizontal: 20,
					}}>
					<Text style={{ fontSize: 16, fontWeight: "bold" }}>
						Alice
					</Text>
					<Text style={{ color: "teal" }}>A few seconds ago</Text>
					<Text style={{ fontSize: 15, marginTop: 6 }}>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						sit amet consectetur adipisicing elit.
					</Text>
				</View>
			</View>
		</ScrollView>
	);
}

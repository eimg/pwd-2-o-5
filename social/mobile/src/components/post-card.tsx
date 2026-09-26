import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { PostType } from "@/types/global";

import { formatDistance } from "date-fns";

export default function PostCard({ post }: { post: PostType }) {
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
					<Text style={{ color: "white" }}>
						{post.user.name[0].toUpperCase()}
					</Text>
				</View>
				<View style={{ flexShrink: 1 }}>
					<Text style={{ fontSize: 16, fontWeight: "bold" }}>
						{post.user.name}
					</Text>
					<Text style={{ color: "teal" }}>
                        {formatDistance(post.created, new Date())}
                    </Text>
					<Text style={{ fontSize: 15, marginTop: 6 }}>
						{post.content}
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
						onPress={() => router.push(`/view-post/${post.id}`)}>
						<Ionicons
							name="chatbubble-outline"
							color={"gray"}
							size={24}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => router.push(`/view-post/${post.id}`)}>
						<Text>{post.comments.length}</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

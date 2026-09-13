import { Text, View, TextInput, TouchableOpacity } from "react-native";

export default function AddPost() {
	return (
		<View>
			<View style={{ paddingHorizontal: 15, gap: 8, marginTop: 10 }}>
				<TextInput
					style={{
						width: "100%",
                        height: 100,
						paddingHorizontal: 20,
						paddingVertical: 10,
						fontSize: 18,
						borderRadius: 20,
						borderWidth: 1,
						borderColor: "#66666640",
						backgroundColor: "white",
					}}
                    multiline
					placeholder="What's on your mind..."
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
						Add Post
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

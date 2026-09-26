import { useApp } from "@/components/app-provider";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";

export default function AddPost() {
	const [content, setContent] = useState("");
	const { token } = useApp();

	const queryClient = useQueryClient();

	const create = async () => {
		const res = await fetch("http://localhost:8800/posts", {
			method: "POST",
			body: JSON.stringify({ content }),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (res.ok) {
			await queryClient.invalidateQueries({
				queryKey: ["posts"],
			});

			router.dismiss();
		} else {
			alert("Unable to add post");
		}
	};

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
					value={content}
					onChangeText={setContent}
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
					}}
					onPress={create}>
					<Text style={{ fontSize: 18, color: "white" }}>
						Add Post
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

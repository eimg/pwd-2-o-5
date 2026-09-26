import PostCard from "@/components/post-card";
import { useLocalSearchParams } from "expo-router";
import {
	Text,
	View,
	ScrollView,
	TextInput,
	TouchableOpacity,
} from "react-native";

import { useQuery } from "@tanstack/react-query";
import { PostType } from "@/types/global";

import { formatDistance } from "date-fns";

async function fetchPost(id: string): Promise<PostType> {
    const res = await fetch(`http://localhost:8800/posts/${id}`);
    return res.json();
}

export default function ViewPost() {
	const { id } = useLocalSearchParams();

    const {
		data: post,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["posts", id],
		queryFn: () => fetchPost(id as string),
	});
    
    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <Text>{error.message}</Text>
            </View>
        );
    }

    if (!post) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}>
				<Text>Post not found</Text>
			</View>
		);
	}

	return (
		<ScrollView>
			<PostCard post={post} />
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
				
				{post.comments?.map(comment => {
                    return (
						<View
                            key={comment.id}
							style={{
								padding: 15,
								borderBottomWidth: 1,
								borderColor: "#66666630",
								paddingHorizontal: 20,
							}}>
							<Text style={{ fontSize: 16, fontWeight: "bold" }}>
								{comment.user.name}
							</Text>
							<Text style={{ color: "teal" }}>
								{formatDistance(post.created, new Date())}
							</Text>
							<Text style={{ fontSize: 15, marginTop: 6 }}>
								{comment.content}
							</Text>
						</View>
					);
                })}
			</View>
		</ScrollView>
	);
}

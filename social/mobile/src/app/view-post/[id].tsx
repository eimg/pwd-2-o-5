import PostCard from "@/components/post-card";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import {
	Alert,
	Text,
	View,
	ScrollView,
	TextInput,
	TouchableOpacity,
} from "react-native";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CommentType, PostType } from "@/types/global";
import { useApp } from "@/components/app-provider";
import { API_URL } from "@/lib/api";
import { updatePostCaches } from "@/lib/post-cache";
import { useState } from "react";
import { formatDistance } from "date-fns";

async function fetchPost(id: string): Promise<PostType> {
    const res = await fetch(`${API_URL}/posts/${id}`);
    if (!res.ok) throw new Error(`Unable to load post (${res.status})`);
    return res.json();
}

async function getResponseError(response: Response) {
	const body = await response.text();
	try {
		const parsed = JSON.parse(body) as { msg?: string };
		return new Error(parsed.msg || `Request failed (${response.status})`);
	} catch {
		return new Error(body || `Request failed (${response.status})`);
	}
}

export default function ViewPost() {
	const { id } = useLocalSearchParams();
	const postId = Array.isArray(id) ? id[0] : id;
	const { auth, token } = useApp();
	const queryClient = useQueryClient();
	const [reply, setReply] = useState("");

    const {
		data: post,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["posts", postId],
		queryFn: () => fetchPost(postId as string),
		enabled: Boolean(postId),
	});
	const addCommentMutation = useMutation({
		mutationFn: async (content: string) => {
			if (!token) throw new Error("Sign in to add a comment.");
			const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
				method: "POST",
				body: JSON.stringify({ content }),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) throw await getResponseError(response);
			return (await response.json()) as CommentType;
		},
		onSuccess: comment => {
			updatePostCaches(queryClient, comment.postId, cachedPost => ({
				...cachedPost,
				comments: [...(cachedPost.comments ?? []), comment],
			}));
			setReply("");
		},
		onError: error => Alert.alert("Comment failed", error.message),
	});
	const deleteCommentMutation = useMutation({
		mutationFn: async (commentId: number) => {
			if (!token) throw new Error("Sign in to delete comments.");
			const response = await fetch(`${API_URL}/comments/${commentId}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!response.ok) throw await getResponseError(response);
			return commentId;
		},
		onSuccess: commentId => {
			if (!postId) return;
			updatePostCaches(queryClient, Number(postId), cachedPost => ({
				...cachedPost,
				comments: cachedPost.comments.filter(comment => comment.id !== commentId),
			}));
		},
		onError: error => Alert.alert("Delete failed", error.message),
	});

	const addComment = () => {
		const content = reply.trim();
		if (!content) return;
		if (!auth || !token) {
			Alert.alert("Sign in required", "Sign in to add a comment.", [
				{ text: "Cancel", style: "cancel" },
				{ text: "Profile", onPress: () => router.push("/(home)/profile") },
			]);
			return;
		}
		addCommentMutation.mutate(content);
	};

	const confirmDeleteComment = (commentId: number) => {
		Alert.alert("Delete comment?", "This cannot be undone.", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: () => deleteCommentMutation.mutate(commentId),
			},
		]);
	};
    
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
			<PostCard post={post} onPostDeleted={() => router.back()} />
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
					value={reply}
					onChangeText={setReply}
					editable={Boolean(auth)}
				/>
				<TouchableOpacity
					style={{
						width: "100%",
						paddingHorizontal: 20,
						paddingVertical: 10,
						borderRadius: 20,
					backgroundColor: auth ? "teal" : "#888",
						justifyContent: "center",
						alignItems: "center",
					}}
					disabled={addCommentMutation.isPending}
					onPress={addComment}>
					<Text style={{ fontSize: 18, color: "white" }}>
						{addCommentMutation.isPending ? "Adding..." : "Add Reply"}
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
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={{ fontSize: 16, fontWeight: "bold", flex: 1 }}>
									{comment.user?.name ?? "User"}
								</Text>
								{auth?.id === comment.userId && (
									<TouchableOpacity
										accessibilityRole="button"
										accessibilityLabel="Delete comment"
										disabled={deleteCommentMutation.isPending}
										onPress={() => confirmDeleteComment(comment.id)}
										style={{ padding: 8 }}>
										<Ionicons name="trash-outline" color="gray" size={18} />
									</TouchableOpacity>
								)}
							</View>
							<Text style={{ color: "teal" }}>
								{formatDistance(comment.created, new Date())}
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

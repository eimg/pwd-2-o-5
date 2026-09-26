import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LikeType, PostType } from "@/types/global";
import { useApp } from "@/components/app-provider";
import { API_URL } from "@/lib/api";
import { removePostFromCaches, updatePostCaches } from "@/lib/post-cache";

import { formatDistance } from "date-fns";

type PostCardProps = {
	post: PostType;
	onPostDeleted?: () => void;
};

async function getResponseError(response: Response) {
	const body = await response.text();
	try {
		const parsed = JSON.parse(body) as { msg?: string };
		return new Error(parsed.msg || `Request failed (${response.status})`);
	} catch {
		return new Error(body || `Request failed (${response.status})`);
	}
}

export default function PostCard({ post, onPostDeleted }: PostCardProps) {
	const { auth, token } = useApp();
	const queryClient = useQueryClient();
	const isLiked = Boolean(
		auth && post.likes?.some(like => like.userId === auth.id),
	);
	const likeMutation = useMutation({
		mutationFn: async (shouldLike: boolean) => {
			if (!token) throw new Error("Sign in to like posts.");
			const response = await fetch(`${API_URL}/posts/${post.id}/like`, {
				method: shouldLike ? "POST" : "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!response.ok) throw await getResponseError(response);
			return shouldLike ? ((await response.json()) as LikeType) : null;
		},
		onSuccess: (like, shouldLike) => {
			if (!auth) return;
			updatePostCaches(queryClient, post.id, cachedPost => {
				const likesByOtherUsers = (cachedPost.likes ?? []).filter(
					item => item.userId !== auth.id,
				);
				return {
					...cachedPost,
					likes:
						shouldLike && like
							? [...likesByOtherUsers, like]
							: likesByOtherUsers,
				};
			});
		},
		onError: error => Alert.alert("Like failed", error.message),
	});
	const deleteMutation = useMutation({
		mutationFn: async () => {
			if (!token) throw new Error("Sign in to delete posts.");
			const response = await fetch(`${API_URL}/posts/${post.id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!response.ok) throw await getResponseError(response);
		},
		onSuccess: () => {
			removePostFromCaches(queryClient, post.id);
			onPostDeleted?.();
		},
		onError: error => Alert.alert("Delete failed", error.message),
	});

	const confirmDelete = () => {
		Alert.alert("Delete post?", "This will also remove its comments.", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: () => deleteMutation.mutate(),
			},
		]);
	};

	const toggleLike = () => {
		if (!auth || !token) {
			Alert.alert("Sign in required", "Sign in to like posts.", [
				{ text: "Cancel", style: "cancel" },
				{ text: "Profile", onPress: () => router.push("/(home)/profile") },
			]);
			return;
		}
		likeMutation.mutate(!isLiked);
	};

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
				<View style={{ flex: 1, flexShrink: 1 }}>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Text style={{ fontSize: 16, fontWeight: "bold", flex: 1 }}>
							{post.user.name}
						</Text>
						{auth?.id === post.userId && (
							<TouchableOpacity
								accessibilityRole="button"
								accessibilityLabel="Delete post"
								disabled={deleteMutation.isPending}
								onPress={confirmDelete}
								style={{ padding: 8 }}>
								<Ionicons name="trash-outline" color="gray" size={20} />
							</TouchableOpacity>
						)}
					</View>
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
					<TouchableOpacity
						accessibilityRole="button"
						accessibilityLabel={isLiked ? "Unlike post" : "Like post"}
						disabled={likeMutation.isPending}
						onPress={toggleLike}>
						<Ionicons
							name={isLiked ? "heart" : "heart-outline"}
							color={"red"}
							size={24}
						/>
					</TouchableOpacity>
					<Text>{post.likes?.length ?? 0}</Text>
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

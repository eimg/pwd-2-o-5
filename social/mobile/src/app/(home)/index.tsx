import PostCard from "@/components/post-card";
import { ScrollView, View, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import type { PostType } from "@/types/global";

async function fetchPosts(): Promise<PostType[]> {
    const res = await fetch("http://192.168.99.20:8800/posts");
	return res.json();
}

export default function App() {
	const {
		data: posts,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["posts"],
		queryFn: fetchPosts,
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

	return (
		<ScrollView>
			{posts?.map(post => {
                return <PostCard key={post.id} post={post} />
            })}
		</ScrollView>
	);
}

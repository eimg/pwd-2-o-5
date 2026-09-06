import { Box, Typography } from "@mui/material";

import { useQuery } from "@tanstack/react-query";

import PostCard from "../components/PostCard";

async function fetchPosts() {
	const res = await fetch("http://localhost:8800/posts");
	return res.json();
}

export default function Home() {
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
			<Box>
				<Typography>Loading...</Typography>
			</Box>
		);
	}

	if (error) {
		return (
			<Box>
				<Typography>{error.message}</Typography>
			</Box>
		);
	}

	return (
		<Box>
			{posts?.map(post => {
				return <PostCard key={post.id} post={post} />;
			})}
		</Box>
	);
}

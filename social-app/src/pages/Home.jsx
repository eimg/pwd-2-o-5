import { Box, Button, OutlinedInput, Typography } from "@mui/material";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import PostCard from "../components/PostCard";

import { useRef } from "react";

import { useApp } from "../AppProvider";

async function fetchPosts() {
	const res = await fetch("http://localhost:8800/posts");
	return res.json();
}

export default function Home() {
	const contentRef = useRef();

	const { auth } = useApp();

	const queryClient = useQueryClient();

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

	async function submitPost(content) {
		const token = localStorage.getItem("token");

		const res = await fetch("http://localhost:8800/posts", {
			method: "POST",
			body: JSON.stringify({ content }),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (res.ok) {
			await queryClient.invalidateQueries({ queryKey: ["posts"] });
		} else {
			alert("Unable to submit post");
		}
	}

	return (
		<Box>
			{auth && (
				<Box sx={{ mb: 2, textAlign: "right" }}>
					<form
						onSubmit={e => {
							e.preventDefault();
							const content = contentRef.current.value;

							if (content) {
								submitPost(content);
							}

							e.currentTarget.reset();
						}}>
						<OutlinedInput
							fullWidth
							placeholder="What's on your mind?"
							inputRef={contentRef}
						/>
						<Button
							type="submit"
							sx={{ mt: 1 }}
							variant="contained">
							Add Post
						</Button>
					</form>
				</Box>
			)}

			{posts?.map(post => {
				return (
					<PostCard
						key={post.id}
						post={post}
					/>
				);
			})}
		</Box>
	);
}

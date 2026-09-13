import { Box, IconButton, OutlinedInput, Typography } from "@mui/material";
import PostCard from "../components/PostCard";

import { Delete as DeleteIcon, Send as SendIcon } from "@mui/icons-material";
import { green } from "@mui/material/colors";

import { useParams } from "react-router";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useApp } from "../AppProvider";

async function fetchPost(id) {
	const res = await fetch(`http://localhost:8800/posts/${id}`);
	return res.json();
}

export default function ViewPost() {
	const { id } = useParams();
	const contentRef = useRef();
	const queryClient = useQueryClient();
	const { auth } = useApp();

	const {
		data: post,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["post", id],
		queryFn: () => fetchPost(id),
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

	async function submitComment(event) {
		event.preventDefault();
		const form = event.currentTarget;
		const content = contentRef.current.value.trim();
		if (!content) return;

		const res = await fetch(`http://localhost:8800/posts/${id}/comments`, {
			method: "POST",
			body: JSON.stringify({ content }),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
		if (!res.ok) {
			alert("Unable to add comment");
			return;
		}

		const comment = await res.json();
		queryClient.setQueryData(["post", id], currentPost =>
			currentPost
				? {
						...currentPost,
						comments: [...(currentPost.comments ?? []), comment],
					}
					: currentPost,
		);
		form.reset();
	}

	async function deleteComment(commentId) {
		if (!window.confirm("Delete this comment?")) return;

		const res = await fetch(`http://localhost:8800/comments/${commentId}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
		});
		if (!res.ok) {
			alert("Unable to delete comment");
			return;
		}

		await queryClient.invalidateQueries({ queryKey: ["post", id] });
	}

	return (
		<Box>
			<PostCard post={post} />

			{auth && <Box>
				<form onSubmit={submitComment}>
					<OutlinedInput
						fullWidth
						placeholder="your reply..."
						inputRef={contentRef}
						endAdornment={
							<IconButton type="submit">
								<SendIcon />
							</IconButton>
						}
					/>
				</form>
			</Box>}

			{post.comments?.map(comment => {
				return (
					<Box
						sx={{ mt: 2 }}
						key={comment.id}>
						<Box
							sx={{ p: 2, mb: 2, border: "1px solid #66666650", position: "relative" }}>
							<Typography sx={{ fontWeight: "bold" }}>
								{comment.user.name}
							</Typography>
							<Typography sx={{ color: green[500], mb: 1 }}>
								{comment.created}
							</Typography>
							<Typography>{comment.content}</Typography>
							{auth?.id === comment.userId && (
								<IconButton
									size="small"
									aria-label="Delete comment"
									onClick={() => deleteComment(comment.id)}
									sx={{ position: "absolute", top: 8, right: 8 }}>
									<DeleteIcon color="error" />
								</IconButton>
							)}
						</Box>
					</Box>
				);
			})}
		</Box>
	);
}

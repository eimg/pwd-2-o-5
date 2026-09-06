import { Box, IconButton, OutlinedInput, Typography } from "@mui/material";
import PostCard from "../components/PostCard";

import { Send as SendIcon } from "@mui/icons-material";
import { green } from "@mui/material/colors";

import { useParams } from "react-router";

import { useQuery } from "@tanstack/react-query";

async function fetchPost(id) {
	const res = await fetch(`http://localhost:8800/posts/${id}`);
	return res.json();
}

export default function ViewPost() {
	const { id } = useParams();

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

	return (
		<Box>
			<PostCard post={post} />

			<Box>
				<form>
					<OutlinedInput
						fullWidth
						placeholder="your reply..."
						endAdornment={
							<IconButton type="submit">
								<SendIcon />
							</IconButton>
						}
					/>
				</form>
			</Box>

			{post.comments?.map(comment => {
				return (
					<Box
						sx={{ mt: 2 }}
						key={comment.id}>
						<Box
							sx={{ p: 2, mb: 2, border: "1px solid #66666650" }}>
							<Typography sx={{ fontWeight: "bold" }}>
								{comment.user.name}
							</Typography>
							<Typography sx={{ color: green[500], mb: 1 }}>
								{comment.created}
							</Typography>
							<Typography>{comment.content}</Typography>
						</Box>
					</Box>
				);
			})}
		</Box>
	);
}

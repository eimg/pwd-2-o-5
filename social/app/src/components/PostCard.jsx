import {
	Avatar,
	Box,
	Button,
	ButtonGroup,
	Card,
	IconButton,
	Typography,
} from "@mui/material";
import { green, grey } from "@mui/material/colors";

import {
	FavoriteBorderOutlined as LikeIcon,
	Favorite as LikedIcon,
	ChatBubbleOutlineOutlined as CommentIcon,
	Delete as DeleteIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router";
import { useApp } from "../AppProvider";
import { useQueryClient } from "@tanstack/react-query";

export default function PostCard({ post }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { auth } = useApp();
	const isOwner = auth && auth.id === post.userId;
	const isLiked = Boolean(auth && post.likes?.some(like => like.userId === auth.id));

	async function deletePost() {
		if (!window.confirm("Delete this post?")) return;

		const res = await fetch(`http://localhost:8800/posts/${post.id}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
		});
		if (!res.ok) {
			alert("Unable to delete post");
			return;
		}

		await queryClient.invalidateQueries({ queryKey: ["posts"] });
		await queryClient.invalidateQueries({ queryKey: ["post", String(post.id)] });
		if (auth) {
			await queryClient.invalidateQueries({ queryKey: ["profile", auth.id] });
		}
		if (window.location.pathname === `/view/${post.id}`) navigate("/");
	}

	async function toggleLike() {
		if (!auth) {
			navigate("/login");
			return;
		}

		const res = await fetch(`http://localhost:8800/posts/${post.id}/like`, {
			method: isLiked ? "DELETE" : "POST",
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
		});
		if (!res.ok) {
			alert("Unable to update like");
			return;
		}

		const like = isLiked ? null : await res.json();
		const updateLikes = currentPost => {
			if (!currentPost) return currentPost;
			const likes = currentPost.likes ?? [];
			return {
				...currentPost,
				likes: isLiked
					? likes.filter(item => item.userId !== auth.id)
					: [...likes, like],
			};
		};

		queryClient.setQueriesData({ queryKey: ["posts"] }, posts =>
			posts?.map(item => (item.id === post.id ? updateLikes(item) : item)),
		);
		queryClient.setQueryData(["post", String(post.id)], updateLikes);
		if (auth) {
			queryClient.setQueryData(["profile", auth.id], profile =>
				profile
					? {
							...profile,
							posts: profile.posts.map(item =>
								item.id === post.id ? updateLikes(item) : item,
							),
						}
					: profile,
			);
		}
	}

	return (
		<Card sx={{ p: 2, mb: 2, position: "relative" }}>
			{isOwner && (
				<IconButton
					size="small"
					aria-label="Delete post"
					onClick={deletePost}
					sx={{ position: "absolute", top: 8, right: 8 }}>
					<DeleteIcon color="error" />
				</IconButton>
			)}
			<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
				<Avatar sx={{ bgcolor: green[500], width: 52, height: 52 }} />
				<Box>
					<Typography sx={{ fontWeight: "bold" }}>
						{post.user.name}
					</Typography>
					<Typography sx={{ color: green[500], mb: 1 }}>
						{post.created}
					</Typography>
					<Typography>{post.content}</Typography>
				</Box>
			</Box>
			<Box sx={{ display: "flex", justifyContent: "space-around" }}>
				<ButtonGroup>
					<IconButton
						size="sm"
						onClick={toggleLike}
						aria-label={isLiked ? "Unlike post" : "Like post"}>
						{isLiked ? <LikedIcon color="error" /> : <LikeIcon color="error" />}
					</IconButton>
					<Button
						variant="text"
						size="sm">
						{post.likes ? post.likes.length : 0}
					</Button>
				</ButtonGroup>
				<ButtonGroup>
					<IconButton
						size="sm"
						onClick={() => navigate(`/view/${post.id}`)}>
						<CommentIcon sx={{ color: grey[500] }} />
					</IconButton>
					<Button
						variant="text"
						size="sm">
						{post.comments ? post.comments.length : 0}
					</Button>
				</ButtonGroup>
			</Box>
		</Card>
	);
}

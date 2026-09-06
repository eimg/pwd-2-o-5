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
	ChatBubbleOutlineOutlined as CommentIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router";

export default function PostCard({ post }) {
	const navigate = useNavigate();

	return (
		<Card sx={{ p: 2, mb: 2 }}>
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
					<IconButton size="sm">
						<LikeIcon color="error" />
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

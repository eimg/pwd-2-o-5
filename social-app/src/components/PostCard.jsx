import { Avatar, Box, Button, ButtonGroup, Card, IconButton, Typography } from "@mui/material";
import { green, grey } from "@mui/material/colors";

import {
    FavoriteBorderOutlined as LikeIcon,
    ChatBubbleOutlineOutlined as CommentIcon,
} from "@mui/icons-material";

export default function PostCard() {
	return (
		<Card sx={{ p: 2, mb: 2 }}>
			<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
				<Avatar sx={{ bgcolor: green[500], width: 52, height: 52 }} />
				<Box>
					<Typography sx={{ fontWeight: "bold" }}>Alice</Typography>
					<Typography sx={{ color: green[500], mb: 1 }}>
						A few seconds ago
					</Typography>
					<Typography>
						Lorem ipsum dolor sit amet consectetur, adipisicing
						elit. Ea eligendi ullam ut sapiente exercitationem fugit
						iure deleniti labore quia culpa, accusamus recusandae,
						odit blanditiis quaerat natus? Veniam dolorem nihil
						incidunt?
					</Typography>
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
						10
					</Button>
				</ButtonGroup>
				<ButtonGroup>
					<IconButton size="sm">
						<CommentIcon sx={{ color: grey[500] }} />
					</IconButton>
					<Button
						variant="text"
						size="sm">
						5
					</Button>
				</ButtonGroup>
			</Box>
		</Card>
	);
}

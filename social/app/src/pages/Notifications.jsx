import {
	Box,
	CircularProgress,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from "@mui/material";
import {
	ChatBubbleOutlineOutlined as CommentIcon,
	Favorite as LikeIcon,
} from "@mui/icons-material";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useApp } from "../AppProvider";

async function fetchNotifications() {
	const res = await fetch("http://localhost:8800/notifications", {
		headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
	});
	if (!res.ok) throw new Error("Unable to load notifications");
	return res.json();
}

export default function Notifications() {
	const { auth } = useApp();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const queryKey = ["notifications", auth?.id];
	const { data, isLoading, error } = useQuery({
		queryKey,
		queryFn: fetchNotifications,
		enabled: Boolean(auth),
	});

	useEffect(() => {
		if (!data?.unreadCount) return;

		fetch("http://localhost:8800/notifications/read", {
			method: "PATCH",
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
		}).then(() => {
			queryClient.setQueryData(queryKey, current =>
				current
					? {
							...current,
							unreadCount: 0,
							notifications: current.notifications.map(notification => ({
								...notification,
								read: true,
							})),
						}
					: current,
			);
		});
	}, [data?.unreadCount, queryClient, auth?.id]);

	if (isLoading) return <CircularProgress />;
	if (error) return <Typography>{error.message}</Typography>;

	return (
		<Box>
			<Typography variant="h5" sx={{ mb: 2 }}>Notifications</Typography>
			{data?.notifications?.length ? (
				<List>
					{data.notifications.map(notification => (
						<ListItem key={notification.id} divider disablePadding>
							<ListItemButton onClick={() => navigate(`/view/${notification.post.id}`)}>
								<ListItemIcon>
									{notification.type === "LIKE" ? (
										<LikeIcon color="error" />
									) : (
										<CommentIcon color="primary" />
									)}
								</ListItemIcon>
								<ListItemText
									primary={
										`${notification.actor.name} ${notification.type === "LIKE" ? "liked" : "commented on"} your post`
									}
									secondary={new Date(notification.created).toLocaleString()}
								/>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			) : (
				<Typography color="text.secondary">No notifications yet.</Typography>
			)}
		</Box>
	);
}

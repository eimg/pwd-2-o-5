import {
	Avatar,
	Box,
	Card,
	CircularProgress,
	Divider,
	Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../components/PostCard";
import { useApp } from "../AppProvider";

async function fetchProfile() {
	const res = await fetch("http://localhost:8800/users/me", {
		headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
	});
	if (!res.ok) throw new Error("Unable to load profile");
	return res.json();
}

export default function Profile() {
	const { auth } = useApp();
	const { data: profile, isLoading, error } = useQuery({
		queryKey: ["profile", auth?.id],
		queryFn: fetchProfile,
		enabled: Boolean(auth),
	});

	if (!auth) {
		return <Typography>Please log in to view your profile.</Typography>;
	}
	if (isLoading) return <CircularProgress />;
	if (error) return <Typography>{error.message}</Typography>;

	const initials = profile.name
		.split(" ")
		.map(part => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<Box>
			<Card sx={{ overflow: "hidden", mb: 4 }}>
				<Box
					sx={{
						height: 160,
						backgroundColor: "#1565c0",
					}}
				/>
				<Box sx={{ px: 3, pb: 3, mt: -7, textAlign: "center" }}>
					<Avatar
						sx={{
							width: 112,
							height: 112,
							mx: "auto",
							mb: 1.5,
							bgcolor: green[600],
							fontSize: "2rem",
							border: "4px solid",
							borderColor: "background.paper",
						}}
					>
						{initials}
					</Avatar>
					<Typography variant="h4" sx={{ fontWeight: 700 }}>
						{profile.name}
					</Typography>
					<Typography color="text.secondary">@{profile.username}</Typography>
					{profile.bio && (
						<Typography sx={{ mt: 1 }}>{profile.bio}</Typography>
					)}
				</Box>
			</Card>

			<Typography variant="h5" sx={{ mb: 2 }}>
				Your posts
			</Typography>
			<Divider sx={{ mb: 2 }} />
			{profile.posts.length ? (
				profile.posts.map(post => <PostCard key={post.id} post={post} />)
			) : (
				<Typography color="text.secondary">You have not posted anything yet.</Typography>
			)}
		</Box>
	);
}

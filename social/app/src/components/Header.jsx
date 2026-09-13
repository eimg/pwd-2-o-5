import { AppBar, Badge, IconButton, Toolbar, Typography } from "@mui/material";

import {
	Menu as MenuIcon,
	ArrowBack as BackIcon,
	LightMode as LightModeIcon,
	DarkMode as DarkModeIcon,
	Notifications as NotiIcon,
} from "@mui/icons-material";

import { useApp } from "../AppProvider";

import { useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

async function fetchNotifications() {
	const res = await fetch("http://localhost:8800/notifications", {
		headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
	});
	if (!res.ok) throw new Error("Unable to load notifications");
	return res.json();
}

export default function Header() {
	const { mode, setMode, setOpenDrawer, auth } = useApp();
	const { data: notifications } = useQuery({
		queryKey: ["notifications", auth?.id],
		queryFn: fetchNotifications,
		enabled: Boolean(auth),
		refetchInterval: 10000,
	});

	const { pathname } = useLocation();
	const navigate = useNavigate();

	return (
		<AppBar position="static">
			<Toolbar>
				{pathname == "/" ? (
					<IconButton
						onClick={() => setOpenDrawer(true)}
						color="inherit"
						sx={{ mr: 2 }}>
						<MenuIcon />
					</IconButton>
				) : (
					<IconButton
						onClick={() => navigate("/")}
						color="inherit"
						sx={{ mr: 2 }}>
						<BackIcon />
					</IconButton>
				)}

				<Typography sx={{ flexGrow: 1 }}>Social App</Typography>

				{mode == "dark" ? (
					<IconButton
						color="inherit"
						onClick={() => setMode("light")}>
						<LightModeIcon />
					</IconButton>
				) : (
					<IconButton
						color="inherit"
						onClick={() => setMode("dark")}>
						<DarkModeIcon />
					</IconButton>
				)}

				{auth && (
					<IconButton
						color="inherit"
						sx={{ ml: 1 }}
						onClick={() => navigate("/notifications")}
						aria-label="Notifications">
						<Badge
							color="error"
							badgeContent={notifications?.unreadCount ?? 0}>
							<NotiIcon />
						</Badge>
					</IconButton>
				)}
			</Toolbar>
		</AppBar>
	);
}

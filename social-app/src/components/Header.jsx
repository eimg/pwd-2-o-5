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

export default function Header() {
	const { mode, setMode, setOpenDrawer, auth } = useApp();

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
						sx={{ ml: 1 }}>
						<Badge
							color="error"
							badgeContent={1}>
							<NotiIcon />
						</Badge>
					</IconButton>
				)}
			</Toolbar>
		</AppBar>
	);
}

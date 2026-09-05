import { AppBar, Badge, IconButton, Toolbar, Typography } from "@mui/material";

import {
	Menu as MenuIcon,
	LightMode as LightModeIcon,
	DarkMode as DarkModeIcon,
	Notifications as NotiIcon,
} from "@mui/icons-material";

import { useApp } from "../AppProvider";

export default function Header() {
	const { mode, setMode, setOpenDrawer, auth } = useApp();

	return (
		<AppBar position="static">
			<Toolbar>
				<IconButton
					onClick={() => setOpenDrawer(true)}
					color="inherit"
					sx={{ mr: 2 }}>
					<MenuIcon />
				</IconButton>
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

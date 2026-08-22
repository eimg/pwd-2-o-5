import { AppBar, Toolbar, Typography, Badge, IconButton } from "@mui/material";

import { useContext } from "react";
import { AppContext } from "./AppProvider";

import {
	LightMode as LightModeIcon,
	DarkMode as DarkModeIcon,
} from "@mui/icons-material";

export default function Header({ count }) {
	const { mode, setMode } = useContext(AppContext);

	return (
		<AppBar position="static">
			<Toolbar>
				<Typography sx={{ flexGrow: 1 }}>
					<Badge
						badgeContent={count}
						color="error">
						Todo
					</Badge>
				</Typography>

				{mode == "dark" ? (
					<IconButton onClick={() => setMode("light")}>
						<LightModeIcon />
					</IconButton>
				) : (
					<IconButton onClick={() => setMode("dark")}>
						<DarkModeIcon />
					</IconButton>
				)}
			</Toolbar>
		</AppBar>
	);
}

import {
	Box,
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useApp } from "../AppProvider";

import {
	Home as HomeIcon,
	Person as ProfileIcon,
	PersonAdd as RegisterIcon,
	Login as LoginIcon,
	Logout as LogoutIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router";

export default function AppDrawer() {
	const { openDrawer, setOpenDrawer, auth, setAuth } = useApp();

    const navigate = useNavigate();

	return (
		<Drawer
			open={openDrawer}
			onClick={() => setOpenDrawer(false)}
			onClose={() => setOpenDrawer(false)}>
			<Box sx={{ width: 300, height: 200, bgcolor: grey[500] }}></Box>

			<List>
				<ListItemButton onClick={() => navigate("/")}>
					<ListItem>
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Home" />
					</ListItem>
				</ListItemButton>
			</List>

			<Divider />

			{auth && (
				<List>
					<ListItemButton onClick={() => navigate("/profile")}>
						<ListItem>
							<ListItemIcon>
								<ProfileIcon />
							</ListItemIcon>
							<ListItemText primary="Profile" />
						</ListItem>
					</ListItemButton>
					<ListItemButton
						onClick={() => {
							setAuth(false);
							navigate("/");
						}}>
						<ListItem>
							<ListItemIcon>
								<LogoutIcon />
							</ListItemIcon>
							<ListItemText primary="Logout" />
						</ListItem>
					</ListItemButton>
				</List>
			)}

			{!auth && (
				<List>
					<ListItemButton onClick={() => navigate("/register")}>
						<ListItem>
							<ListItemIcon>
								<RegisterIcon />
							</ListItemIcon>
							<ListItemText primary="Register" />
						</ListItem>
					</ListItemButton>
					<ListItemButton onClick={() => navigate("/login")}>
						<ListItem>
							<ListItemIcon>
								<LoginIcon />
							</ListItemIcon>
							<ListItemText primary="Login" />
						</ListItem>
					</ListItemButton>
				</List>
			)}
		</Drawer>
	);
}

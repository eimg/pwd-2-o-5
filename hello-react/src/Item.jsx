import { ListItem, IconButton, ListItemText } from "@mui/material";

import {
    Delete as DeleteIcon,
} from "@mui/icons-material";

export default function Item({ item, del }) {
	return (
		<ListItem>
			<ListItemText primary={item.name} />
			<IconButton
				onClick={() => {
					del(item.id);
				}}>
				<DeleteIcon color="error" />
			</IconButton>
		</ListItem>
	);
}

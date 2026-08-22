import { ListItem, IconButton, ListItemText } from "@mui/material";

import {
	Delete as DeleteIcon,
	SquareOutlined as CheckIcon,
	Check as DoneIcon,
} from "@mui/icons-material";

export default function Item({ item, del, toggle }) {
	return (
		<ListItem>
			<IconButton
				sx={{ mr: 2 }}
				onClick={() => toggle(item.id)}>
				{item.done ? <DoneIcon /> : <CheckIcon />}
			</IconButton>

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

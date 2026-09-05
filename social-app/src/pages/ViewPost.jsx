import { Box, IconButton, OutlinedInput, Typography } from "@mui/material";
import PostCard from "../components/PostCard";

import { Send as SendIcon } from "@mui/icons-material";
import { green } from "@mui/material/colors";

export default function ViewPost() {
	return (
		<Box>
			<PostCard />

			<Box>
				<form>
					<OutlinedInput
						fullWidth
						placeholder="your reply..."
						endAdornment={
							<IconButton type="submit">
								<SendIcon />
							</IconButton>
						}
					/>
				</form>
			</Box>

			<Box sx={{ mt: 2 }}>
				<Box sx={{ p: 2, mb: 2, border: "1px solid #66666650" }}>
					<Typography sx={{ fontWeight: "bold" }}>Bob</Typography>
					<Typography sx={{ color: green[500], mb: 1 }}>
						A few seconds ago
					</Typography>
					<Typography>
						Lorem ipsum dolor sit, amet consectetur adipisicing
						elit. In ex, molestias explicabo vel reiciendis ducimus.
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}

import { Alert, Box, Button, OutlinedInput, Typography } from "@mui/material";

export default function Register() {
	return (
		<Box>
			<Typography
				variant="h3"
				sx={{ mb: 2 }}>
				Register
			</Typography>
			<Alert severity="warning">Unable to create account</Alert>

			<form>
				<OutlinedInput
					placeholder="name"
					fullWidth
					sx={{ mt: 2 }}
				/>
				<OutlinedInput
					placeholder="username"
					fullWidth
					sx={{ mt: 2 }}
				/>
				<OutlinedInput
					type="password"
					placeholder="password"
					fullWidth
					sx={{ mt: 2 }}
				/>
				<OutlinedInput
					placeholder="short bio"
					fullWidth
					sx={{ mt: 2 }}
				/>
				<Button
					variant="contained"
					sx={{ mt: 2 }}
					type="submit"
					fullWidth>
					Register
				</Button>
			</form>
		</Box>
	);
}

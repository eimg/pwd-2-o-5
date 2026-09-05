import { Alert, Box, Button, OutlinedInput, Typography } from "@mui/material";

export default function Login() {
	return (
		<Box>
			<Typography variant="h3" sx={{ mb: 2 }}>Login</Typography>
			<Alert severity="warning">Unable to login</Alert>

			<form>
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
				<Button
                    variant="contained"
                    sx={{ mt: 2 }}
					type="submit"
					fullWidth>
					Login
				</Button>
			</form>
		</Box>
	);
}

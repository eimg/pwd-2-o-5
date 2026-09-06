import { useState } from "react";

import { Alert, Box, Button, OutlinedInput, Typography } from "@mui/material";

import { useForm } from "react-hook-form";

import { useApp } from "../AppProvider";
import { useNavigate } from "react-router";

export default function Login() {
	const [loginError, setLoginError] = useState(false);

	const { setAuth } = useApp();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const login = async data => {
		const res = await fetch("http://localhost:8800/login", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			const { user, token } = await res.json();
			setAuth(user);
			localStorage.setItem("token", token);
			navigate("/");
		} else {
			setLoginError(true);
		}
	};

	return (
		<Box>
			<Typography
				variant="h3"
				sx={{ mb: 2 }}>
				Login
			</Typography>

			{loginError && <Alert severity="warning">Unable to login</Alert>}

			<form onSubmit={handleSubmit(login)}>
				<OutlinedInput
					placeholder="username"
					fullWidth
					sx={{ mt: 2 }}
					{...register("username", { required: true })}
					error={errors.username}
				/>
				<OutlinedInput
					type="password"
					placeholder="password"
					fullWidth
					sx={{ mt: 2 }}
					{...register("password", { required: true })}
					error={errors.password}
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

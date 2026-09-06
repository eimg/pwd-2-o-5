import { useState } from "react";

import { Alert, Box, Button, OutlinedInput, Typography } from "@mui/material";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export default function Register() {
    const [registerError, setRegisterError] = useState(false);

    const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

    const navigate = useNavigate();

    const create = async data => {
        const res = await fetch("http://localhost:8800/users", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if(res.ok) {
            navigate("/login");
        } else {
            setRegisterError(true);
        }
    }

	return (
		<Box>
			<Typography
				variant="h3"
				sx={{ mb: 2 }}>
				Register
			</Typography>

			{registerError && (
				<Alert severity="warning">Unable to create account</Alert>
			)}

			<form onSubmit={handleSubmit(create)}>
				<OutlinedInput
					placeholder="name"
					fullWidth
					sx={{ mt: 2 }}
					{...register("name", { required: true })}
					error={errors.name}
				/>

				<OutlinedInput
					placeholder="username"
					fullWidth
					sx={{ mt: 2 }}
					{...register("username", { required: true })}
					error={errors.username}
				/>
				<OutlinedInput
					placeholder="short bio"
					fullWidth
					sx={{ mt: 2 }}
					{...register("bio")}
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
					Register
				</Button>
			</form>
		</Box>
	);
}

import { useState, useRef } from "react";

import Item from "./Item";
import Header from "./Header";

import { Container, IconButton, List, OutlinedInput } from "@mui/material";

import { Add as AddIcon } from "@mui/icons-material";

export default function App() {
	const inputRef = useRef();

	const [data, setDate] = useState([
		{ id: 3, name: "Egg" },
		{ id: 2, name: "Bread" },
		{ id: 1, name: "Butter" },
	]);

	const add = () => {
		const name = inputRef.current.value;
		if (!name) return false;

		const id = data[0] ? data[0].id + 1 : 1;

		setDate([{ id, name }, ...data]);
	};

	const del = id => {
		setDate(data.filter(item => item.id != id));
	};

	return (
		<div>
			<Header />

			<Container
				maxWidth="sm"
				sx={{ mt: 4 }}>
				<form
					onSubmit={e => {
						e.preventDefault();
						add();
						e.currentTarget.reset();
					}}>
					<OutlinedInput
						fullWidth
						inputRef={inputRef}
						endAdornment={
							<IconButton type="submit">
								<AddIcon />
							</IconButton>
						}
					/>
				</form>

				<List>
					{data.map(item => {
						return (
							<Item
								item={item}
								del={del}
							/>
						);
					})}
				</List>
			</Container>
		</div>
	);
}

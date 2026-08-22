import { useState, useRef } from "react";

import Item from "./Item";
import Header from "./Header";

import {
	Container,
	Divider,
	IconButton,
	List,
	OutlinedInput,
} from "@mui/material";

import { Add as AddIcon } from "@mui/icons-material";

export default function App() {
	const inputRef = useRef();

	const [data, setData] = useState([
		{ id: 3, name: "Egg", done: false },
		{ id: 2, name: "Bread", done: true },
		{ id: 1, name: "Butter", done: false },
	]);

	const add = () => {
		const name = inputRef.current.value;
		if (!name) return false;

		const id = data[0] ? data[0].id + 1 : 1;

		setData([{ id, name }, ...data]);
	};

	const del = id => {
		setData(data.filter(item => item.id != id));
	};

	const toggle = id => {
		setData(
			data.map(item => {
				if (item.id == id) item.done = !item.done;
				return item;
			}),
		);
	};

	return (
		<div>
			<Header count={data.filter(item => !item.done).length} />

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
					{data
						.filter(item => !item.done)
						.map(item => {
							return (
								<Item
                                    key={item.id}
									item={item}
									del={del}
                                    toggle={toggle}
								/>
							);
						})}
				</List>

				<Divider />

				<List>
					{data
						.filter(item => item.done)
						.map(item => {
							return (
								<Item
                                    key={item.id}
									item={item}
									del={del}
                                    toggle={toggle}
								/>
							);
						})}
				</List>
			</Container>
		</div>
	);
}

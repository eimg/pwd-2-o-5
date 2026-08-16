import { useState, useRef } from "react";

function Item({ item, del }) {
	return (
		<li>
			{item.name}
			<button
				onClick={() => {
					del(item.id);
				}}>
				Del
			</button>
		</li>
	);
}

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
			<h1>Hello React</h1>
			<form
				onSubmit={e => {
					e.preventDefault();
					add();
					e.currentTarget.reset();
				}}>
				<input
					type="text"
					ref={inputRef}
				/>
				<button type="submit">Add</button>
			</form>
			<ul>
				{data.map(item => {
					return (
						<Item
							item={item}
							del={del}
						/>
					);
				})}
			</ul>
		</div>
	);
}

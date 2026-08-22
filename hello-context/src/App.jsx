import { useState, createContext, useContext, useEffect, useMemo } from "react";

const AppContext = createContext();

function Title() {
    const count = useContext(AppContext);

	return <h1>Context ({count})</h1>;
}

function Header() {
	return (
		<div>
			<Title />
		</div>
	);
}

function Toolbar() {
	return (
		<div>
			<Header />
		</div>
	);
}

export default function App() {
	const [count, setCount] = useState(0);

    const value = useMemo(() => {
        console.log("running function...");
        return 123;
    }, []);

	return (
		<AppContext.Provider value={count}>
			<Toolbar />
			<button
				onClick={() => {
					setCount(count + 1);
				}}>
				Increase
			</button>
		</AppContext.Provider>
	);
}

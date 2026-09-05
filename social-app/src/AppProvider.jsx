import App from "./App";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useState, createContext, useMemo, useContext } from "react";

const AppContext = createContext();

export default function AppProvider() {
	const [mode, setMode] = useState("dark");
	const [openDrawer, setOpenDrawer] = useState(false);
	const [auth, setAuth] = useState(true);

	const theme = useMemo(() => {
		return createTheme({
			palette: {
				mode,
			},
		});
	}, [mode]);

	return (
		<ThemeProvider theme={theme}>
			<AppContext.Provider
				value={{
					mode,
					setMode,
					openDrawer,
					setOpenDrawer,
					auth,
					setAuth,
				}}>
				<App />
				<CssBaseline />
			</AppContext.Provider>
		</ThemeProvider>
	);
}

export function useApp() {
	return useContext(AppContext);
}

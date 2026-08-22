import App from "./App";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useState, createContext, useMemo } from "react";

export const AppContext = createContext();

export default function AppProvider() {
	const [mode, setMode] = useState("dark");

	const theme = useMemo(() => {
        return createTheme({
			palette: {
				mode,
			},
		});
    }, [mode]);

	return (
		<ThemeProvider theme={theme}>
			<AppContext.Provider value={{ mode, setMode }}>
				<App />
				<CssBaseline />
			</AppContext.Provider>
		</ThemeProvider>
	);
}

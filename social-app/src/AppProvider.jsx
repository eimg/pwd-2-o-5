import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useState, createContext, useMemo, useContext, useEffect } from "react";
import AppRouter from "./AppRouter";

const AppContext = createContext();

export default function AppProvider() {
	const [mode, setMode] = useState("dark");
	const [openDrawer, setOpenDrawer] = useState(false);
	const [auth, setAuth] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if(token) {
            const refresh = async () => {
				const res = await fetch("http://localhost:8800/verify", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                if(res.ok) {
                    const user = await res.json();
                    setAuth(user);
                } else {
                    localStorage.removeItem("token");
                }
			};

            refresh();
        }
    }, []);

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
				<AppRouter />
				<CssBaseline />
			</AppContext.Provider>
		</ThemeProvider>
	);
}

export function useApp() {
	return useContext(AppContext);
}

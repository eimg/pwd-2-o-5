import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import type { PropsWithChildren, SetStateAction } from "react";
import type { UserType } from "@/types/global";

const queryClient = new QueryClient();
const apiUrl = "http://localhost:8800";
const TOKEN_KEY = "token";

type AppContextValue = {
	auth: UserType | null;
	setAuth: (user: SetStateAction<UserType | null>) => void;
	token: string | null;
	saveToken: (token: string) => Promise<void>;
	clearAuth: () => Promise<void>;
	isAuthLoading: boolean;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

function normalizeUser(value: unknown): UserType | null {
	if (!value || typeof value !== "object") return null;

	const user = value as Record<string, unknown>;
	if (
		typeof user.id !== "number" ||
		typeof user.name !== "string" ||
		typeof user.username !== "string" ||
		(user.bio !== null && typeof user.bio !== "string") ||
		typeof user.created !== "string"
	) {
		return null;
	}

	return {
		id: user.id,
		name: user.name,
		username: user.username,
		bio: user.bio,
		created: user.created,
	};
}

export default function AppProvider({ children }: PropsWithChildren) {
	const [auth, setAuth] = useState<UserType | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isAuthLoading, setIsAuthLoading] = useState(true);

	useEffect(() => {
		let isActive = true;

		async function restoreAuth() {
			let storedToken: string | null = null;
			try {
				storedToken = await AsyncStorage.getItem(TOKEN_KEY);
				if (isActive) setToken(storedToken);

				if (storedToken) {
					const response = await fetch(`${apiUrl}/verify`, {
						headers: { Authorization: `Bearer ${storedToken}` },
					});

					if (!response.ok) {
						await AsyncStorage.removeItem(TOKEN_KEY);
						if (isActive) setToken(null);
					} else {
						const user = normalizeUser(await response.json());
						if (user) {
							if (isActive) setAuth(user);
						} else {
							await AsyncStorage.removeItem(TOKEN_KEY);
							if (isActive) setToken(null);
						}
					}
				}
			} catch {
				// Keep a saved token when verification fails because the API is unreachable.
			} finally {
				if (isActive) setIsAuthLoading(false);
			}
		}

		void restoreAuth();
		return () => {
			isActive = false;
		};
	}, []);

	const saveToken = useCallback(async (nextToken: string) => {
		await AsyncStorage.setItem(TOKEN_KEY, nextToken);
		setToken(nextToken);
	}, []);

	const clearAuth = useCallback(async () => {
		await AsyncStorage.removeItem(TOKEN_KEY);
		setToken(null);
		setAuth(null);
	}, []);

	const value = useMemo(
		() => ({ auth, setAuth, token, saveToken, clearAuth, isAuthLoading }),
		[auth, token, saveToken, clearAuth, isAuthLoading],
	);

	return (
		<QueryClientProvider client={queryClient}>
			<AppContext.Provider value={value}>{children}</AppContext.Provider>
		</QueryClientProvider>
	);
}

export function useApp() {
	const context = useContext(AppContext);
	if (!context) throw new Error("useApp must be used inside AppProvider");
	return context;
}

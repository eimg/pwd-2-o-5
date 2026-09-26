import PostCard from "@/components/post-card";
import { useApp } from "@/components/app-provider";
import { API_URL } from "@/lib/api";
import type { ProfileType, UserType } from "@/types/global";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

async function fetchProfile(token: string): Promise<ProfileType> {
	const response = await fetch(`${API_URL}/users/me`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!response.ok) {
		const body = await response.text();
		throw new Error(body || `Unable to load profile (${response.status})`);
	}
	return response.json();
}

export default function Profile() {
	const [formMode, setFormMode] = useState<"login" | "register">("login");
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { auth, clearAuth, setAuth, saveToken, token, isAuthLoading } = useApp();
	const queryClient = useQueryClient();
	const profileQuery = useQuery({
		queryKey: ["profile", auth?.id],
		queryFn: () => fetchProfile(token as string),
		enabled: Boolean(auth && token),
	});

	const authenticate = async (loginUsername: string, loginPassword: string) => {
		const response = await fetch(`${API_URL}/login`, {
			method: "POST",
			body: JSON.stringify({ username: loginUsername, password: loginPassword }),
		headers: { "Content-Type": "application/json" },
		});
		if (!response.ok) {
			throw new Error("Unable to login. Check your username and password.");
		}

		const result = (await response.json()) as {
			user: UserType;
			token: string;
		};
		await saveToken(result.token);
		setAuth(result.user);
		setPassword("");
		router.replace("/");
	};

	const submitLogin = async () => {
		if (!username.trim() || !password) {
			Alert.alert("Login required", "Enter your username and password.");
			return;
		}

		setIsSubmitting(true);
		try {
			await authenticate(username.trim(), password);
		} catch (error) {
			Alert.alert(
				"Login failed",
				error instanceof Error ? error.message : "Please try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const submitRegistration = async () => {
		if (!name.trim() || !username.trim() || !password) {
			Alert.alert(
				"Registration required",
				"Enter your name, username, and password.",
			);
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await fetch(`${API_URL}/users`, {
				method: "POST",
				body: JSON.stringify({
					name: name.trim(),
					username: username.trim(),
					bio: bio.trim() || undefined,
					password,
				}),
				headers: { "Content-Type": "application/json" },
			});
			if (!response.ok) {
				const result = (await response.json().catch(() => null)) as
					| { code?: string; msg?: string }
					| null;
				if (result?.code === "P2002") {
					throw new Error("That username is already taken.");
				}
				throw new Error(result?.msg ?? "Unable to create your account. Try again.");
			}

			try {
				await authenticate(username.trim(), password);
			} catch {
				setFormMode("login");
				setPassword("");
				Alert.alert("Account created", "Please log in with your new account.");
			}
		} catch (error) {
			Alert.alert(
				"Registration failed",
				error instanceof Error ? error.message : "Please try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const logout = async () => {
		try {
			await clearAuth();
			await queryClient.cancelQueries({ queryKey: ["profile"] });
			queryClient.removeQueries({ queryKey: ["profile"] });
		} catch {
			Alert.alert("Logout failed", "Please try again.");
		}
	};

	if (isAuthLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={styles.banner.backgroundColor} />
			</View>
		);
	}

	if (!auth) {
		return (
			<ScrollView contentContainerStyle={styles.loginContainer}>
				<View style={styles.loginCard}>
					<Text style={styles.loginTitle}>
						{formMode === "login" ? "Login" : "Create account"}
					</Text>
					{formMode === "register" && (
						<TextInput
							style={styles.input}
							placeholder="Name"
							autoComplete="name"
							value={name}
							onChangeText={setName}
						/>
					)}
					<TextInput
						style={styles.input}
						placeholder="Username"
						autoCapitalize="none"
						autoComplete="username"
						value={username}
						onChangeText={setUsername}
					/>
					{formMode === "register" && (
						<TextInput
							style={[styles.input, styles.bioInput]}
							placeholder="Bio (optional)"
							multiline
							textAlignVertical="top"
							value={bio}
							onChangeText={setBio}
						/>
					)}
					<TextInput
						style={styles.input}
						placeholder="Password"
						secureTextEntry
						autoComplete={formMode === "login" ? "current-password" : "new-password"}
						value={password}
						onChangeText={setPassword}
					/>
					<TouchableOpacity
						accessibilityRole="button"
						disabled={isSubmitting}
						onPress={formMode === "login" ? submitLogin : submitRegistration}
						style={styles.primaryButton}>
						<Text style={styles.buttonText}>
							{isSubmitting
								? formMode === "login"
									? "Signing in…"
									: "Creating account…"
								: formMode === "login"
									? "Login"
									: "Register"}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						accessibilityRole="button"
						disabled={isSubmitting}
						onPress={() =>
							setFormMode(mode => (mode === "login" ? "register" : "login"))
						}
						style={styles.modeToggle}>
						<Text style={styles.retryText}>
							{formMode === "login"
								? "New here? Create an account"
								: "Already have an account? Log in"}
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		);
	}

	const displayUser = profileQuery.data ?? auth;

	return (
		<ScrollView style={styles.screen} contentContainerStyle={styles.profileContent}>
			<View style={styles.banner} />
			<View style={styles.userInfo}>
				<View style={styles.avatar}>
					<Text style={styles.avatarInitial}>
						{displayUser.name.charAt(0).toUpperCase()}
					</Text>
				</View>
				<Text style={styles.name}>{displayUser.name}</Text>
				<Text style={styles.username}>@{displayUser.username}</Text>
				{displayUser.bio ? <Text style={styles.bio}>{displayUser.bio}</Text> : null}
				<TouchableOpacity
					accessibilityRole="button"
					accessibilityLabel="Log out"
					onPress={logout}
					style={[styles.primaryButton, styles.logoutButton]}>
					<Text style={styles.buttonText}>Logout</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.postsSection}>
				<Text style={styles.postsTitle}>
					Posts{profileQuery.data ? ` (${profileQuery.data.posts.length})` : ""}
				</Text>
				{profileQuery.isLoading ? (
					<ActivityIndicator style={styles.postsLoading} color="#1565c0" />
				) : profileQuery.isError ? (
					<View style={styles.messageContainer}>
						<Text style={styles.messageText}>{profileQuery.error.message}</Text>
						<TouchableOpacity onPress={() => profileQuery.refetch()}>
							<Text style={styles.retryText}>Try again</Text>
						</TouchableOpacity>
					</View>
				) : profileQuery.data?.posts.length ? (
					profileQuery.data.posts.map(post => <PostCard key={post.id} post={post} />)
				) : (
					<Text style={styles.emptyText}>You haven’t posted anything yet.</Text>
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: "#f5f7fa" },
	profileContent: { paddingBottom: 28 },
	centered: { flex: 1, alignItems: "center", justifyContent: "center" },
	banner: { height: 150, backgroundColor: "#1565c0" },
	userInfo: { alignItems: "center", marginTop: -52, paddingHorizontal: 20 },
	avatar: {
		width: 104,
		height: 104,
		borderRadius: 52,
		borderWidth: 5,
		borderColor: "white",
		backgroundColor: "#0d47a1",
		alignItems: "center",
		justifyContent: "center",
	},
	avatarInitial: { fontSize: 38, color: "white", fontWeight: "bold" },
	name: { marginTop: 12, fontSize: 24, fontWeight: "bold", textAlign: "center" },
	username: { marginTop: 3, color: "#555", fontSize: 16 },
	bio: { marginTop: 12, color: "#444", textAlign: "center" },
	primaryButton: {
		minWidth: 140,
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 24,
		backgroundColor: "#1565c0",
		alignItems: "center",
		justifyContent: "center",
	},
	logoutButton: { backgroundColor: "#b42318", marginTop: 18 },
	buttonText: { fontSize: 16, color: "white", fontWeight: "bold" },
	postsSection: { marginTop: 26 },
	postsTitle: { paddingHorizontal: 18, paddingBottom: 12, fontSize: 20, fontWeight: "bold" },
	postsLoading: { paddingVertical: 24 },
	messageContainer: { alignItems: "center", padding: 24, gap: 10 },
	messageText: { color: "#555", textAlign: "center" },
	retryText: { color: "#1565c0", fontWeight: "bold" },
	emptyText: { padding: 24, color: "#666", textAlign: "center" },
	loginContainer: {
		flexGrow: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
	loginCard: {
		width: "100%",
		maxWidth: 420,
		padding: 24,
		gap: 12,
		backgroundColor: "white",
		borderRadius: 16,
	},
	loginTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
	input: {
		width: "100%",
		paddingHorizontal: 16,
		paddingVertical: 12,
		fontSize: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#66666640",
		backgroundColor: "white",
	},
	bioInput: { minHeight: 88 },
	modeToggle: { alignSelf: "center", paddingVertical: 8 },
});

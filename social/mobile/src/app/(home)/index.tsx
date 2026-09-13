import PostCard from "@/components/post-card";
import { ScrollView } from "react-native";

export default function App() {
	return (
		<ScrollView>
			<PostCard />
			<PostCard />
			<PostCard />
			<PostCard />
		</ScrollView>
	);
}

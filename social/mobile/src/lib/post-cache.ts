import type { QueryClient } from "@tanstack/react-query";
import type { PostType, ProfileType } from "@/types/global";

export function updatePostCaches(
	queryClient: QueryClient,
	postId: number,
	update: (post: PostType) => PostType,
) {
	queryClient.setQueryData<PostType[]>(["posts"], posts =>
		posts?.map(post => (post.id === postId ? update(post) : post)),
	);
	queryClient.setQueryData<PostType>(["posts", String(postId)], post =>
		post ? update(post) : post,
	);
	queryClient.setQueriesData<ProfileType>({ queryKey: ["profile"] }, profile =>
		profile
			? {
					...profile,
					posts: profile.posts.map(post =>
						post.id === postId ? update(post) : post,
					),
				}
			: profile,
	);
}

export function removePostFromCaches(
	queryClient: QueryClient,
	postId: number,
) {
	queryClient.setQueryData<PostType[]>(["posts"], posts =>
		posts?.filter(post => post.id !== postId),
	);
	queryClient.removeQueries({ queryKey: ["posts", String(postId)], exact: true });
	queryClient.setQueriesData<ProfileType>({ queryKey: ["profile"] }, profile =>
		profile
			? { ...profile, posts: profile.posts.filter(post => post.id !== postId) }
			: profile,
	);
}

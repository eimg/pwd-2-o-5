export type PostType = {
    id: number;
    content: string;
    userId: number;
    user: UserType;
    comments: CommentType[];
    likes: LikeType[];
    created: string;
};

export type LikeType = {
    id: number;
    userId: number;
    postId: number;
    created: string;
};

export type UserType = {
    id: number;
    name: string;
    username: string;
    bio: string | null;
    created: string;
};

export type ProfileType = UserType & {
    posts: PostType[];
};

export type CommentType = {
    id: number;
    content: string;
    postId: number;
    post?: PostType;
    userId: number;
    user?: UserType;
    created: string;
};

export type PostType = {
    id: number;
    content: string;
    userId: number;
    user: UserType;
    comments: CommentType[];
    created: string;
};

export type UserType = {
    id: number;
    name: string;
    username: string;
    bio: string | null;
    created: string;
};

export type CommentType = {
    id: number;
    content: string;
    postId: number;
    post: PostType;
    userId: number;
    user: UserType;
    created: string;
};

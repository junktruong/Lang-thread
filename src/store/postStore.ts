import { create } from "zustand";

interface Author {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
}

export interface Post {
    id: string;
    word: string;
    meaning: string;
    createdAt: string;
    mediaUrl?: string | null;
    mediaType?: string | null;
    authorId: string | null;
    author?: Author | null;
}

interface PostStore {
    posts: Post[];
    page: number;
    loading: boolean;
    setPosts: (posts: Post[]) => void;
    addPost: (post: Post) => void;
    resetPosts: () => void;
    setLoading: (loading: boolean) => void;
    nextPage: () => void;
}

export const usePostStore = create<PostStore>((set) => ({
    posts: [],
    page: 0,
    loading: false,
    setPosts: (posts) => set({ posts }),
    addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
    resetPosts: () => set({ posts: [], page: 0 }),
    setLoading: (loading) => set({ loading }),
    nextPage: () => set((state) => ({ page: state.page + 1 })),
}));


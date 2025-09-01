import { Session } from "@prisma/client";

export interface Author {
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

export interface SessionAuthor extends Session {
    user: Author;
}


export interface Post {
    id: string
    word: string
    meaning: string
    mediaUrl?: string
    mediaType?: "image" | "video"
    author: {
        name: string
        avatar: string
    }
    createdAt: string
    commentCount: number
}

export interface Comment {
    id: string
    content: string
    mediaUrl?: string
    mediaType?: "image" | "video"
    author: {
        name: string
        avatar: string
    }
    createdAt: string
}

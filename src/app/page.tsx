// app/page.tsx (Server Component)
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/ui/Navbar";
import CreatePostForm from "@/components/posts/CreatePostForm";
import PostList from "@/components/posts/PostList";
import { getServerSession } from "next-auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${process.env.BACKEND_URL}/api/posts?skip=0&take=5`, {
    cache: "no-store", // tránh cache khi SSR
  });
  const initialPosts = res.ok ? await res.json() : [];

  return (
    <>
      <Navbar session={session} />
      <main className="max-w-3xl mx-auto p-6 space-y-6">
        <CreatePostForm session={session} />
        <PostList initialPosts={initialPosts} />
      </main>
    </>
  );
}

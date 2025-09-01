// "use client";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useCallback, useState } from "react";
// import Navbar from "@/components/ui/Navbar";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { usePostStore } from "@/store/postStore";

// export default function HomePage() {
//   const { data: session } = useSession();
//   const router = useRouter();

//   const { posts, page, loading, setPosts, resetPosts, setLoading, nextPage } =
//     usePostStore();

//   const [showForm, setShowForm] = useState(false);
//   const [word, setWord] = useState("");
//   const [meaning, setMeaning] = useState("");
//   const loaderRef = useRef<HTMLDivElement | null>(null);

//   // Fetch posts (lazy load)
//   const fetchPosts = useCallback(async () => {
//     if (loading) return;
//     setLoading(true);

//     const res = await fetch(`/api/posts?skip=${page * 5}&take=5`);
//     if (res.ok) {
//       const data = await res.json();
//       setPosts([...posts, ...data]);
//       if (data.length > 0) nextPage();
//     }
//     setLoading(false);
//   }, [page, loading, posts, setPosts, setLoading, nextPage]);

//   // Initial load
//   useEffect(() => {
//     if (posts.length === 0) fetchPosts();
//   }, []);

//   // IntersectionObserver để lazy load khi scroll gần cuối
//   useEffect(() => {
//     if (!loaderRef.current) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && !loading) {
//           fetchPosts();
//         }
//       },
//       { threshold: 1 }
//     );

//     observer.observe(loaderRef.current);
//     return () => observer.disconnect();
//   }, [fetchPosts, loading]);

//   const handleCreatePost = () => {
//     if (!session) {
//       router.push("/auth/signin");
//     } else {
//       setShowForm(true);
//     }
//   };

//   async function handleSubmit() {
//     const res = await fetch("/api/posts", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ word, meaning }),
//     });
//     if (res.ok) {
//       const newPost = await res.json();
//       setPosts([newPost, ...posts]);
//     }
//     setShowForm(false);
//     setWord("");
//     setMeaning("");
//   }

//   return (
//     <>
//       <Navbar session={session} />
//       <main className="max-w-3xl mx-auto p-6 space-y-6">
//         <div className="flex justify-between items-center">
//           <Button onClick={handleCreatePost}>Tạo bài viết</Button>
//         </div>

//         {showForm && (
//           <div className="space-y-4 border p-4 rounded">
//             <Input
//               placeholder="Word"
//               value={word}
//               onChange={(e) => setWord(e.target.value)}
//             />
//             <Textarea
//               placeholder="Meaning"
//               value={meaning}
//               onChange={(e) => setMeaning(e.target.value)}
//             />
//             <Button onClick={handleSubmit}>Submit</Button>
//           </div>
//         )}

//         {posts.length === 0 ? (
//           <p className="text-gray-500">Chưa có bài viết nào.</p>
//         ) : (
//           <div className="space-y-4">
//             {posts.map((post) => (
//               <Card
//                 key={post.id}
//                 className="cursor-pointer hover:shadow-lg transition"
//                 onClick={() => router.push(`/post/${post.id}`)}
//               >
//                 <CardHeader>
//                   <CardTitle>{post.word}</CardTitle>
//                   <div className="text-xs text-gray-400 flex gap-2 items-center">
//                     {post.author?.image && (
//                       <img
//                         src={post.author.image}
//                         alt={post.author.name || "user"}
//                         className="w-5 h-5 rounded-full"
//                       />
//                     )}
//                     {post.author?.name ?? "Ẩn danh"} •{" "}
//                     {new Date(post.createdAt).toLocaleString()}
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-gray-600">
//                     {post.meaning.length > 100
//                       ? post.meaning.slice(0, 100) + "..."
//                       : post.meaning}
//                   </p>
//                   {post.mediaUrl && (
//                     <div className="mt-2">
//                       {post.mediaType?.startsWith("image") ? (
//                         <img
//                           src={post.mediaUrl}
//                           alt="media"
//                           className="max-h-48 rounded"
//                         />
//                       ) : (
//                         <a
//                           href={post.mediaUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-500 underline"
//                         >
//                           Xem media
//                         </a>
//                       )}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             ))}
//             {/* Loader */}
//             <div ref={loaderRef} className="h-10 flex justify-center items-center">
//               {loading && <p className="text-gray-400">Đang tải...</p>}
//             </div>
//           </div>
//         )}
//       </main>
//     </>
//   );
// }

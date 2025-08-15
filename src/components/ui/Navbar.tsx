"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="w-full border-b bg-white shadow-sm">
            <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-lg font-bold tracking-tight">
                    LangThread
                </Link>

                {/* Menu */}
                <div className="flex items-center gap-4">

                    {/* Đăng nhập / Avatar */}
                    {session ? (
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src={session.user?.image ?? ""} />
                                <AvatarFallback>
                                    {session.user?.name?.charAt(0) ?? "U"}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                variant="ghost"
                                onClick={() => signOut({ callbackUrl: "/" })}
                            >
                                Đăng xuất
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={() => signIn("google")}>Đăng nhập</Button>
                    )}
                </div>
            </div>
        </nav>
    );
}

import { PrismaAdapter } from "@auth/prisma-adapter"
import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { db } from "./db"
import { MongoPrismaAdapter } from "./mongoPrismaAdapter"

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(db) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "database",
    },
    callbacks: {
        async session({ session, user }) {
            if (user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
}

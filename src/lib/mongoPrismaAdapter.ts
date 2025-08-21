import { Adapter, AdapterUser } from "next-auth/adapters";
import { PrismaClient } from "@prisma/client";
import { AdapterAccount } from "next-auth/adapters";

const prisma = new PrismaClient();

export function MongoPrismaAdapter(): Adapter {
    return {
        async createUser(user: AdapterUser) {
            let newUser = await prisma.user.findUnique({
                where: { email: user.email ?? "" },
            });

            if (!newUser) {
                newUser = await prisma.user.create({
                    data: {
                        id: user.id,
                        email: user.email ?? "",
                        name: user.name ?? null,
                        image: user.image ?? null,
                        emailVerified: user.emailVerified ?? null,
                    },
                });
            } else {
                newUser = await prisma.user.update({
                    where: { id: newUser.id },
                    data: {
                        name: user.name ?? undefined,
                        image: user.image ?? undefined,
                        emailVerified: user.emailVerified ?? undefined,
                    },
                });
            }

            return {
                id: newUser.id,
                email: newUser.email ?? "",
                emailVerified: newUser.emailVerified,
                name: newUser.name,
                image: newUser.image,
            } as AdapterUser;
        }
        ,

        async getUser(id) {
            const u = await prisma.user.findUnique({ where: { id } });
            if (!u) return null;
            return {
                id: u.id,
                email: u.email ?? "",
                emailVerified: u.emailVerified,
                name: u.name,
                image: u.image,
            } as AdapterUser;
        },

        async getUserByEmail(email) {
            if (!email) return null;
            const u = await prisma.user.findUnique({ where: { email } });
            if (!u) return null;
            return {
                id: u.id,
                email: u.email ?? "",
                emailVerified: u.emailVerified,
                name: u.name,
                image: u.image,
            } as AdapterUser;
        },

        async getUserByAccount({ provider, providerAccountId }) {
            const account = await prisma.account.findUnique({
                where: { provider_providerAccountId: { provider, providerAccountId } },
                include: { user: true },
            });
            if (!account?.user) return null;
            return {
                id: account.user.id,
                email: account.user.email ?? "",
                emailVerified: account.user.emailVerified,
                name: account.user.name,
                image: account.user.image,
            } as AdapterUser;
        },

        async updateUser(user) {
            const updated = await prisma.user.update({
                where: { id: user.id },
                data: user,
            });
            return {
                id: updated.id,
                email: updated.email ?? "",
                emailVerified: updated.emailVerified,
                name: updated.name,
                image: updated.image,
            } as AdapterUser;
        },

        async deleteUser(userId) {
            const deleted = await prisma.user.delete({ where: { id: userId } });
            return {
                id: deleted.id,
                email: deleted.email ?? "",
                emailVerified: deleted.emailVerified,
                name: deleted.name,
                image: deleted.image,
            } as AdapterUser;
        },

        // 🔄 Dùng upsert thay cho transaction
        async linkAccount(account: AdapterAccount) {
            const { userId, ...accountData } = account;

            await prisma.user.upsert({
                where: { id: userId },
                update: {
                    accounts: { create: accountData },
                },
                create: {
                    id: userId,
                    email: "", // phòng trường hợp user chưa tồn tại
                    accounts: { create: accountData },
                },
            });

            const dbAccount = await prisma.account.findUnique({
                where: {
                    provider_providerAccountId: {
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                    },
                },
            });

            if (!dbAccount) return null;

            // Map Prisma.Account -> AdapterAccount
            return {
                id: dbAccount.id,
                userId: dbAccount.userId,
                type: dbAccount.type === "oauth" ? "oauth" : dbAccount.type === "email" ? "email" : "oidc",
                provider: dbAccount.provider,
                providerAccountId: dbAccount.providerAccountId,
                refresh_token: dbAccount.refresh_token ? dbAccount.refresh_token : undefined,
                access_token: dbAccount.access_token ? dbAccount.access_token : undefined,
                expires_at: dbAccount.expires_at ? dbAccount.expires_at : undefined,
                token_type: dbAccount.token_type ? dbAccount.token_type : undefined,
                scope: dbAccount.scope ? dbAccount.scope : undefined,
                id_token: dbAccount.id_token ? dbAccount.id_token : undefined,
                session_state: dbAccount.session_state ? dbAccount.session_state : undefined,
            } satisfies AdapterAccount;
        },


        async unlinkAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
            try {
                const dbAccount = await prisma.account.delete({
                    where: { provider_providerAccountId: { provider, providerAccountId } },
                });

                if (!dbAccount) throw new Error("Account not found");

                // Map Prisma.Account -> AdapterAccount
                return {
                    id: dbAccount.id,
                    userId: dbAccount.userId,
                    type: dbAccount.type ? "oauth" : dbAccount.type === "email" ? "email" : "oidc",
                    provider: dbAccount.provider,
                    providerAccountId: dbAccount.providerAccountId,
                    refresh_token: dbAccount.refresh_token ? dbAccount.refresh_token : undefined,
                    access_token: dbAccount.access_token ? dbAccount.access_token : undefined,
                    expires_at: dbAccount.expires_at ? dbAccount.expires_at : undefined,
                    token_type: dbAccount.token_type ? dbAccount.token_type : undefined,
                    scope: dbAccount.scope ? dbAccount.scope : undefined,
                    id_token: dbAccount.id_token ? dbAccount.id_token : undefined,
                    session_state: dbAccount.session_state ? dbAccount.session_state : undefined,
                } satisfies AdapterAccount;
            } catch {
                // Nếu không tìm thấy account thì Prisma sẽ throw -> ta trả null cho hợp lệ với NextAuth
                throw new Error("Account not found");
            }
        }
        ,

        async createSession(session) {
            return prisma.session.create({ data: session });
        },

        async getSessionAndUser(sessionToken) {
            const session = await prisma.session.findUnique({
                where: { sessionToken },
                include: { user: true },
            });
            if (!session) return null;
            const { user, ...sess } = session;
            return {
                session: sess,
                user: {
                    id: user.id,
                    email: user.email ?? "",
                    emailVerified: user.emailVerified,
                    name: user.name,
                    image: user.image,
                } as AdapterUser,
            };
        },

        async updateSession(session) {
            return prisma.session.update({
                where: { sessionToken: session.sessionToken },
                data: session,
            });
        },

        async deleteSession(sessionToken) {
            return prisma.session.delete({ where: { sessionToken } });
        },

        // async createVerificationToken(token) {
        //     return prisma.verificationToken.create({ data: token });
        // },

        // async useVerificationToken(identifier_token) {
        //     try {
        //         return await prisma.verificationToken.delete({
        //             where: { identifier_token },
        //         });
        //     } catch {
        //         return null;
        //     }
        // },
    };
}

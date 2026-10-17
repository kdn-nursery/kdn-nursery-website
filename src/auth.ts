import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "@/server/admin/password";
import { normalizeUsername, SESSION_MAX_AGE_SECONDS } from "@/server/admin/rules";
import { getPrismaClient } from "@/server/db";

const authSecret = process.env.AUTH_SECRET;

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: authSecret ?? "unset-auth-secret-rejected-at-login",
  useSecureCookies: process.env.NODE_ENV === "production",
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_SECONDS },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!authSecret) return null;
        const username = normalizeUsername(String(credentials.username ?? ""));
        const password = String(credentials.password ?? "");
        if (!username || !password) return null;

        const user = await getPrismaClient().adminUser.findUnique({ where: { username } });
        if (!user) return null;
        const matches = await verifyPassword(password, user.passwordHash);
        if (!matches) return null;

        return {
          id: user.id,
          name: user.username,
          passwordChangedAt: user.passwordChangedAt.toISOString(),
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.passwordChangedAt) token.passwordChangedAt = user.passwordChangedAt;
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub ?? "";
      session.user.passwordChangedAt =
        typeof token.passwordChangedAt === "string" ? token.passwordChangedAt : "";
      return session;
    },
  },
});

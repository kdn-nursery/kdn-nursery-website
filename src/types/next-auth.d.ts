import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      passwordChangedAt: string;
    } & DefaultSession["user"];
  }

  interface User {
    passwordChangedAt?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    passwordChangedAt?: string;
  }
}

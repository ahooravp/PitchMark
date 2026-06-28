import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";

// 1. Strictly type the config object to eliminate TS warnings
export const authConfig: NextAuthConfig = {
  providers: [
    GitHub,
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, profile, account }) {
      if (!account || !profile) return false;

      // 2. BULLETPROOF ID: Use the normalized providerAccountId
      const providerId = account.providerAccountId;

      const providerLogin = account.provider === "google" ? user.email?.split("@")[0] : (profile.login as string);
      const providerBio = (profile.bio as string) || "";

      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: providerId,
        });

      if (!existingUser) {
        await writeClient.createIfNotExists({
          _type: "author",
          _id: `author-${providerId}`, 
          id: providerId,
          name: user.name,
          username: providerLogin,
          email: user.email,
          image: user.image,
          bio: providerBio,
        });
      }

      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        // 3. Normalized ID again
        const providerId = account.providerAccountId;

        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: providerId,
          });

        token.id = user?._id || `author-${providerId}`;
      }

      return token;
    },
    // 4. Your correct runtime session logic
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

// 5. Initialize NextAuth with the typed config
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
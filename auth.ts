import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub,
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: '/login', 
  },
  callbacks: {
    async signIn({ user: { name, email, image }, profile, account }) {
      // 1. Determine the correct ID and cast it immediately to a String
      const rawProviderId = account?.provider === "google" ? profile?.sub : profile?.id;
      const providerId = String(rawProviderId); 
      
      const providerLogin = account?.provider === "google" ? email?.split('@')[0] : profile?.login;
      const providerBio = profile?.bio || "";

      // 2. Query the user
      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: providerId,
        });

      // 3. BULLETPROOF CREATION: Use createIfNotExists and a deterministic _id
      if (!existingUser) {
        await writeClient.createIfNotExists({
          _type: "author",
          _id: `author-${providerId}`, // Database-level uniqueness guarantee
          id: providerId, 
          name,
          username: providerLogin,
          email,
          image,
          bio: providerBio,
        });
      }

      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const rawProviderId = account?.provider === "google" ? profile?.sub : profile?.id;
        const providerId = String(rawProviderId);

        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: providerId,
          });

        // 4. Fallback: If user isn't returned due to indexing delay, construct the expected _id
        token.id = user?._id || `author-${providerId}`;
      }

      return token;
    },
    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});
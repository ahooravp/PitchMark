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
    signIn: '/login', // Forces NextAuth to use your new custom page
  },
  callbacks: {
    async signIn({ user: { name, email, image }, profile, account }) {
      // 1. Determine the correct ID and username based on the provider
      const providerId = account?.provider === "google" ? profile?.sub : profile?.id;
      const providerLogin = account?.provider === "google" ? email?.split('@')[0] : profile?.login;
      const providerBio = profile?.bio || "";

      // 2. Fetch the user using the correct ID (cast to string just in case)
      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: String(providerId),
        });

      // 3. Create the user in Sanity if they don't exist
      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id: String(providerId),
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
        // Also fix the JWT callback so it correctly grabs the Google 'sub'
        const providerId = account?.provider === "google" ? profile?.sub : profile?.id;

        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: String(providerId),
          });

        token.id = user?._id;
      }

      return token;
    },
    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});
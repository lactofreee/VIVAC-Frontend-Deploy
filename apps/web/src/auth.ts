import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "google" && account.id_token) {
        const res = await fetch(
          `${process.env.BACKEND_API_URL}/v1/auth/google`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_token: account.id_token }),
          },
        );
        if (!res.ok) return false;
      }
      return true;
    },
  },
});

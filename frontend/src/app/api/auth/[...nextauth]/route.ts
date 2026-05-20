import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Autentificare",
      credentials: {
        username: { label: "Utilizator", type: "text", placeholder: "admin" },
        password: { label: "Parolă", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.username === "admin" &&
          credentials?.password === "admin"
        ) {
          return {
            id: "1",
            name: "Administrator",
            email: "admin@autobrand.ro",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    "cheie-secreta-generica-pentru-dezvoltare-locala",
});

export { handler as GET, handler as POST };

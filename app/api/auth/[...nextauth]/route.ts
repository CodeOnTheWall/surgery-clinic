// Next Auth package type
import NextAuth, { AuthOptions } from "next-auth";
// built in OAuth Providers
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// Next Auth Prisma Adapter to connect to db
import { PrismaAdapter } from "@next-auth/prisma-adapter";
// Prisma Client
import prisma from "@/lib/prisma";
// Password hashing
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  // configuring Next Auth to use the Prisma adaper with the provided Prisma client
  adapter: PrismaAdapter(prisma),
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        console.log(user, "user authorize");

        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        // use await here so value is a boolean and not a promise
        const isCorrectPassword = await bcrypt.compare(
          // comparing between form user has submitted with hashed
          // password in the db
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      // console.log(session, "session");
      // console.log(user, "user");
      // if (session?.user) {
      //   session.user.userId = user.id;
      // }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

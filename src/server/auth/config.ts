import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import { compare } from "bcrypt";
import { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "~/server/db";
import { User } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  callbacks: {
    session: ({ session, token }) => {
      return ({
        ...session,
        user: token.user as User | undefined
      })
    },
    async jwt({ token }) {
      if (token.sub) {
        let data = await db.user.findFirst({
          where: {
            id: token.sub,
          }
        })

        if (data) {
          // @ts-ignore
          delete data.password

          token = { ...token, user: data }
        }
      }

      return token;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const { email, password } = credentials;

        // Найдите пользователя в базе данных
        const user = await db.user.findUnique({
          where: { email },
        });

        // Если пользователь найден и пароли совпадают
        if (user && (await compare(password, user.password))) {
          return {
            name: user.name,
            email: user.email,
            id: user.id,
          }; // Вернуть данные пользователя, если авторизация успешна
        }

        // Если авторизация не удалась, вернуть null
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    // jwt: true,
  },
} satisfies NextAuthConfig;



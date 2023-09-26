import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import client from '@/lib/client';

interface IdCredentials {
  phone: string;
  password: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Phone',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { phone, password } = credentials as IdCredentials;

        try {
          const { data: loginData } = await client.post('/auth/login', {
            phone: phone.replace(/-/g, ''),
            password,
          });

          return {
            ...loginData,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        token.data = {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...token.data,
          ...session.user,
        };
      }
      if (user) {
        token.data = user;
      }
      return token;
    },
    async session({ session, token, user, newSession, trigger }) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      session.user = token.data;
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

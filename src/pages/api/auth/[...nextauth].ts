import dayjs from 'dayjs';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import client from '@/lib/client';

import type { Response } from '@/types/client';

interface Credentials {
  phone?: string;
  password?: string;
  provider: 'id' | 'kakao' | 'google';
  code?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        phone: { label: 'Phone', type: 'text', placeholder: '010-0000-0000' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        },
        code: { label: 'code', type: 'text' },
        provider: { label: 'provider', type: 'text' },
      },
      async authorize(credentials) {
        const { phone, password, provider, code } = credentials as Credentials;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
        if (provider === 'id') {
          try {
            const { data: loginData } = await client.post('/auth/login', {
              phone: phone?.replace(/-/g, ''),
              password,
            });
            return loginData.data;
          } catch (e) {
            return null;
          }
        } else {
          try {
            const { data: loginData } = await client.get<Response<any>>(
              `/auth/${provider}/callback?code=${code}`
            );
            return loginData.data;
          } catch (e) {
            return null;
          }
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return token;
    },
    async session({ session, token, user, newSession, trigger }) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      session.user = token.data;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      session.expires = dayjs()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .add(token.data.token.expiresIn, 'second')
        .toDate();
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
};

export default NextAuth(authOptions);

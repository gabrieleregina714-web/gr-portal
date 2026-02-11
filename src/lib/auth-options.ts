import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { staffUsers, athleteUsers } from '@/lib/auth-data';
import { athletes } from '@/lib/data';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Check staff users first
        const staff = staffUsers.find(
          (u) => u.email === credentials.email && u.password === credentials.password && u.status === 'active'
        );
        if (staff) {
          return {
            id: staff.id,
            name: `${staff.name} ${staff.surname}`,
            email: staff.email,
            role: staff.role,
            permissions: staff.permissions,
          } as any;
        }

        // Check athlete users
        const athUser = athleteUsers.find(
          (u) => u.email === credentials.email && u.password === credentials.password && u.status === 'active'
        );
        if (athUser) {
          const athlete = athletes.find(a => a.id === athUser.athleteId);
          if (!athlete) return null;
          return {
            id: athUser.id,
            name: `${athlete.name} ${athlete.surname}`,
            email: athUser.email,
            role: 'athlete',
            athleteId: athUser.athleteId,
            permissions: [],
          } as any;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.userId = (user as any).id;
        token.permissions = (user as any).permissions;
        token.athleteId = (user as any).athleteId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).userId = token.userId;
        (session.user as any).permissions = token.permissions;
        (session.user as any).athleteId = token.athleteId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'gr-perform-secret-key-2026',
};

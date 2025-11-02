import 'server-only';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { prisma } from './db/prisma';

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect('/login');
  }

  return { isAuth: true, userId: session.userId as string };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  } catch {
    console.log('Failed to fetch user');
    return null;
  }
});

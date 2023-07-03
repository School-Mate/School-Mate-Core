import Router from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

import { User } from '@/types/user';

export default function useUser({
  redirectTo = '',
  redirectIfFound = false,
} = {}) {
  const { data: user, mutate: mutateUser, error } = useSWR<User>('/auth/me');

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && error) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && !error)
    ) {
      Router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo]);

  return { user, mutateUser, error };
}

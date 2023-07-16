import Router from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

import { UserSchoolWithUser } from '@/types/user';

export default function useSchool({
  redirectTo = '',
  redirectIfFound = false,
} = {}) {
  const {
    data: school,
    mutate: mutateSchool,
    isLoading: isSchoolLoading,
    error,
  } = useSWR<UserSchoolWithUser>('/auth/me/school');

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !school) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && error) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && !error)
    ) {
      Router.push(redirectTo);
    }
  }, [school, redirectIfFound, redirectTo]);

  if (error)
    return {
      school: null,
      isLoading: isSchoolLoading,
      mutateSchool,
      error,
    };

  return {
    school,
    mutateSchool,
    error,
    isLoading: isSchoolLoading,
  };
}

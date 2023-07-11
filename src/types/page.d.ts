import { AppProps } from 'next/app';

interface DefaultAppProps extends AppProps {
  auth: {
    user?: User;
    isVerifySchool: boolean;
    isSchoolSelected: boolean;
  };
}

export type PageProps<T> = DefaultAppProps & T;

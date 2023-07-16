import Router from 'next/router';
import React, { useEffect } from 'react';

interface LoginProps {
  redirectTo: string;
}

const Login: React.FC<LoginProps> = ({ redirectTo }) => {
  useEffect(() => {
    if (redirectTo) {
      Router.push(`/auth/login?redirectTo=${redirectTo}`);
    } else {
      Router.push('/auth/login');
    }
  });

  return <></>;
};

export default Login;

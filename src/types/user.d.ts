export interface User {
  id: string;
  email: string | null;
  password: string | null;
  phone: string | null;
  name: string;
  provider: Provider;
  verified: boolean;
  profile: string | null;
  SocialLogin: SocialLogin | null;
}

export interface SocialLogin {
  accessToken: string;
  refreshToken: string | null;
  provider: SocialLoginProvider;
  userId: string;
  socialId: string;
}

export type SocialLoginProvider = 'kakao' | 'google';
export type Provider = 'social' | 'id';

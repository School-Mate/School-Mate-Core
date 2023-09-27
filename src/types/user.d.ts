import { School } from '@/types/school';

export interface User {
  id: string;
  email: string | null;
  password: string | null;
  phone: string | null;
  name: string;
  provider: UserLoginProviderType;
  verified: boolean;
  profile: string | null;
  createdAt: Date;
  userSchoolId: string | null;
  SocialLogin: SocialLogin | null;
  Agreement: Agreement;
  Image: Image[];
  UserSchoolVerify: UserSchoolVerify[];
  UserSchool: UserSchool;
}

export interface Agreement {
  receive: boolean;
  updatedAt: Date;
  userId: string;
}

export interface Image {
  id: string;
  key: string;
  userId: string;
  createdAt: Date;
}

export interface UserSchoolVerify {
  id: string;
  userId: string;
  imageId: string;
  schoolId: string;
  dept: string;
  grade: string;
  class: string;
  message: string | null;
  process: Process;
}

export interface UserSchool {
  userId: string;
  schoolId: string;
  dept: string;
  grade: string;
  class: string;
  school: School;
}

export interface SocialLogin {
  accessToken: string;
  refreshToken: string | null;
  provider: SocialLoginProviderType;
  userId: string;
  socialId: string;
}

export type UserSchoolWithUser = UserSchool & {
  school: School;
};

export type UserLoginProviderType = 'id' | 'social';
export type Process = 'pending' | 'success' | 'denied';
export type SocialLoginProvider = 'kakao' | 'google';
export type Provider = 'social' | 'id';

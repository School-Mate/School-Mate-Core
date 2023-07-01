export interface User {
  id: string;
  email: string | null;
  password: string | null;
  phone: string | null;
  name: string;
  provider: string;
  verified: boolean;
  profile: string | null;
}

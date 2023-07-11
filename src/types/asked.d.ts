import { User } from '@/types/user';

export interface AskedUser {
  userId: string;
  customId: string | null;
  statusMessage: string | null;
  receiveAnonymous: boolean;
  receiveOtherSchool: boolean;
  user: User;
}

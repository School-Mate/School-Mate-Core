import { Process, User } from '@/types/user';

export interface AskedUser {
  userId: string;
  customId: string | null;
  statusMessage: string | null;
  receiveAnonymous: boolean;
  receiveOtherSchool: boolean;
  user: User;
}

export interface AskedQuestion {
  id: string;
  userId: string;
  askedUserId: string;
  process: Process;
  question: string;
  answer?: string;
  isAnonymous: boolean;
  AskedUser: AskedUser;
  QuestionUser: User;
  createdAt: Date;
  answerTimeAt?: Date;
}

export interface AskedQuestionWithMe {
  user: AskedUser;
  askeds: AskedQuestion[];
  pages: number;
  deniedCount: number;
  successCount: number;
  pendingCount: number;
}

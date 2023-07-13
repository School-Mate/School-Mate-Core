import { User } from './user';

export interface Article {
  id: number;
  schoolId: string;
  title: string;
  content: string;
  images: string[];
  isAnonymous: boolean;
  userId: string;
  createdAt: Date;
  boardId: number;
  Board: Board;
  User: User;
  keyOfImages: string[];
}

export interface Board {
  id: number;
  schoolId: string;
  name: string;
  description: string;
  noticeId: number | null;
}

export interface Comment {
  User?: User;
  articleId: number;
  content: string;
  createdAt: Date;
  id: number;
  isAnonymous: boolean;
  recomments: Recomment[];
  updatedAt: Date;
  userId: string;
}

export interface Recomment {
  User?: User;
  articleId: number;
  commentId: number;
  content: string;
  createdAt: Date;
  id: number;
  isAnonymous: boolean;
  updatedAt: Date;
  userId: string;
}

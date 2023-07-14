export interface Like {
  id: string;
  userId: string;
  targetId: string;
  targetType: LikeTargetType;
  likeType: LikeType;
}

export type LikeType = 'like' | 'dislike';
export type LikeTargetType = 'article' | 'comment' | 'recomment';

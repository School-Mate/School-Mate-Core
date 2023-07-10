import React from 'react';

import { Review } from '@/types/review';

interface ReviewProps {
  review: Review;
}

const Review: React.FC<ReviewProps> = ({ review }) => {
  return (
    <>
      <div className='h-full w-full'></div>
    </>
  );
};

export default Review;

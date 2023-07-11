import React from 'react';

import { Review } from '@/types/review';

interface ReviewProps {
  review: Review;
}

const Review: React.FC<ReviewProps> = ({ review }) => {
  return (
    <>
      <div className='h-full w-full'>
        <div className='flex flex-row items-center'>
          <div className='flex flex-col'>
            {/* <h1 className='text-lg font-bold'>{review.user.name}</h1>
            <h2 className='text-sm font-normal text-[#707070]'>
              @{review.user.name}
            </h2> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Review;

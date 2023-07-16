import React, { useState } from 'react';

import clsxm from '@/lib/clsxm';

interface TooltipsProps {
  children: React.ReactNode;
  tooltip: React.ReactNode;
}

const Tooltips: React.FC<TooltipsProps> = ({ children, tooltip }) => {
  const [show, setShow] = useState(false);
  return (
    <div
      onMouseEnter={() => {
        setShow(true);
      }}
      onMouseLeave={() => {
        setShow(false);
      }}
    >
      <div className='relative'>
        <div
          className={clsxm(
            'absolute bottom-6 z-10 rounded-[10px] bg-white',
            show ? 'block' : 'hidden',
            'left-1/2 z-10 -translate-x-1/2 transform rounded-[10px] bg-white p-5'
          )}
          style={{
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div>{tooltip}</div>
          <div
            style={{
              width: '0px',
              height: '0px',
              borderTop: '10px solid white',
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: '10px solid transparent',
              position: 'absolute',
              bottom: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Tooltips;

import { useEffect, useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';

import clsxm from '@/lib/clsxm';

const Modal: React.FC<Modal> = ({
  children,
  isOpen,
  callbackOpen,
  className,
}) => {
  const ref = useDetectClickOutside({
    onTriggered: () => callbackOpen(false),
  });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  return (
    <>
      {open ? (
        <>
          <div
            className='animate-fade fixed inset-0 bg-black bg-opacity-50 transition-opacity'
            style={{
              zIndex: 10000,
            }}
          />
          <div
            style={{
              zIndex: 10001,
              fontFamily: 'Noto Sans KR',
            }}
            ref={ref}
            className={clsxm(
              'animate-fade fixed left-1/2 top-1/2 max-h-[90vh] w-[43rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white lg:overflow-visible',
              className
            )}
          >
            <div className='p-5'>{children}</div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

interface Modal {
  className?: string;
  children: React.ReactNode;
  isOpen: boolean;
  callbackOpen: (open: boolean) => void;
}

export default Modal;

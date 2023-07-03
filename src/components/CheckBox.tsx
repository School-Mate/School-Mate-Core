import React from 'react';

import clsxm from '@/lib/clsxm';

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithRef<'input'>
>(({ children, className, disabled: buttonDisabled, ...rest }, ref) => {
  return (
    <input
      ref={ref}
      type='checkbox'
      disabled={buttonDisabled}
      className={clsxm(
        'accent-schoolmate-500',
        'h-[13px] w-[13px] lg:h-[18px] lg:w-[18px]',
        'checked:bg-schoolmate-500 checked:border-schoolmate-500 focus:outline-none',
        'rounded-[2px] border-[2px] border-[#BABABA]',
        'appearance-none',
        className
      )}
      {...rest}
    />
  );
});

export default Checkbox;

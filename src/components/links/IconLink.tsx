import * as React from 'react';
import { IconType } from 'react-icons';

import clsxm from '@/lib/clsxm';

import UnstyledLink, {
  UnstyledLinkProps,
} from '@/components/links/UnstyledLink';

const IconLinkVariant = [
  'primary',
  'outline',
  'ghost',
  'light',
  'dark',
] as const;

type IconLinkProps = {
  isDarkBg?: boolean;
  variant?: (typeof IconLinkVariant)[number];
  icon?: IconType;
  iconClassName?: string;
} & Omit<UnstyledLinkProps, 'children'>;

const IconLink = React.forwardRef<HTMLAnchorElement, IconLinkProps>(
  (
    {
      className,
      icon: Icon,
      variant = 'outline',
      isDarkBg = false,
      iconClassName,
      ...rest
    },
    ref
  ) => {
    return (
      <UnstyledLink
        ref={ref}
        type='button'
        className={clsxm(
          'inline-flex items-center justify-center rounded font-medium',
          'focus-visible:ring-schoolmate-500 focus:outline-none focus-visible:ring',
          'shadow-sm',
          'transition-colors duration-75',
          'min-h-[28px] min-w-[28px] p-1 md:min-h-[34px] md:min-w-[34px] md:p-2',
          //#region  //*=========== Variants ===========
          [
            variant === 'primary' && [
              'bg-schoolmate-500 text-white',
              'border-schoolmate-600 border',
              'hover:bg-schoolmate-600 hover:text-white',
              'active:bg-schoolmate-700',
              'disabled:bg-schoolmate-700',
            ],
            variant === 'outline' && [
              'text-schoolmate-500',
              'border-schoolmate-500 border',
              'hover:bg-schoolmate-50 active:bg-schoolmate-100 disabled:bg-schoolmate-100',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'ghost' && [
              'text-schoolmate-500',
              'shadow-none',
              'hover:bg-schoolmate-50 active:bg-schoolmate-100 disabled:bg-schoolmate-100',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'light' && [
              'bg-white text-gray-700',
              'border border-gray-300',
              'hover:text-dark hover:bg-gray-100',
              'active:bg-white/80 disabled:bg-gray-200',
            ],
            variant === 'dark' && [
              'bg-gray-900 text-white',
              'border border-gray-600',
              'hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-700',
            ],
          ],
          //#endregion  //*======== Variants ===========
          'disabled:cursor-not-allowed',
          className
        )}
        {...rest}
      >
        {Icon && <Icon className={clsxm(iconClassName)} />}
      </UnstyledLink>
    );
  }
);

export default IconLink;

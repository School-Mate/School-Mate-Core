import clsxm from '@/lib/clsxm';

interface ProfileProps {
  children?: React.ReactNode;
  defaultProfile?: string | null;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const Profile = ({
  children,
  defaultProfile,
  className,
  size,
}: ProfileProps) => {
  return (
    <>
      {defaultProfile ? (
        <div
          className={clsxm(
            'relative h-28 w-28 rounded-[20px] border border-[#D8D8D8]',
            className
          )}
          style={{
            backgroundImage: `url(${
              process.env.NEXT_PUBLIC_S3_URL + '/' + defaultProfile
            })`,
            backgroundColor: '#F1F1F1',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          {children}
        </div>
      ) : (
        <div
          className={clsxm(
            'relative h-28 w-28 rounded-[20px] border border-[#D8D8D8]',
            className
          )}
          style={{
            backgroundImage: `url(/svg/CloverGray.svg)`,
            backgroundColor: '#F1F1F1',
            backgroundSize:
              size === 'large'
                ? 'cover'
                : size === 'medium'
                ? '50px 50px'
                : '30px 30px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default Profile;

import { ISchoolInfoRow } from '@/types/school';
import { User } from '@/types/user';

interface WigetBusProps {
  school: ISchoolInfoRow;
  user: User;
}

const WigetBus: React.FC<WigetBusProps> = ({ school }) => {
  return (
    <div className='flex h-[172px] w-full flex-col items-center justify-center rounded-[10px] border bg-white'>
      <h2 className='text-sm font-semibold'>[버스 도착정보]</h2>
      <div className='mt-1 flex h-[100px] flex-col items-center justify-center px-5 text-center text-sm'></div>
    </div>
  );
};

export default WigetBus;

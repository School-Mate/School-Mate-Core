const Footer = () => {
  return (
    <footer className='flex h-[150px] items-center justify-center border-t border-[#D8D8D8] bg-[#f9f9f9]'>
      <div className='flex flex-row items-center space-x-6 text-[#939393]'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src='/svg/LogoGray.svg' alt='logo' className='h-12 w-12' />
        <div className='flex flex-row'>
          <span>운영팀 :</span>
          <span className='ml-2'>kdh89811@gachon.ac.kr</span>
        </div>
        <div className='flex flex-row'>
          <span>이용약관</span>
        </div>
        <div className='flex flex-row'>
          <span className='font-semibold'>개인정보처리방침</span>
        </div>
        <div className='flex flex-row'>
          <span>청소년보호정책</span>
        </div>
        <div className='flex flex-row'>
          <span>문의/신고</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

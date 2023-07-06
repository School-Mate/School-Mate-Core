import Header from '@/components/layout/DashboardHeader';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default DashboardLayout;

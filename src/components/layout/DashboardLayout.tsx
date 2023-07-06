import Header from '@/components/layout/DashboardHeader';

const DashboardLayout = ({
  children,
  school,
}: {
  children: React.ReactNode;
  school: ISchoolInfoRow;
}) => {
  return (
    <>
      <Header school={school} />
      <main>{children}</main>
    </>
  );
};

export default DashboardLayout;

import { useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import useSWR from 'swr';

import client from '@/lib/client';
import useUser from '@/lib/hooks/useUser';
import Toast from '@/lib/toast';

import Button from '@/components/buttons/Button';
import Dropdown from '@/components/Dropdown';
import Input from '@/components/Input';
import Layout from '@/components/layout/Layout';
import { LoadingScreen } from '@/components/Loading';
import Seo from '@/components/Seo';

import { Response } from '@/types/client';
import { IClassInfoRow, ISchoolInfoRow } from '@/types/school';

const SchoolVerify = () => {
  const [step, setStep] = useState<number>(1);
  const [schoolKeyword, setSchoolKeyword] = useState<string>('');
  const [openSchoolDropdown, setOpenSchoolDropdown] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [grade, setGrade] = useState<string>('');
  const [classNumber, setClassNumber] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [selectSchool, setSelectSchool] = useState<ISchoolInfoRow>();
  const [selectSchoolDetail, setSelectSchoolDetail] =
    useState<IClassInfoRow[]>();
  const ref = useDetectClickOutside({
    onTriggered: () => setOpenSchoolDropdown(false),
  });
  const { user, isLoading } = useUser();
  const { data: searchSchools, error: schoolSearchError } = useSWR<
    ISchoolInfoRow[]
  >(`/school/search?keyword=${schoolKeyword}`);

  const handleSelectSchool = async (school: ISchoolInfoRow) => {
    setSelectSchool(school);

    try {
      setShowLoading(true);
      const { data: schoolDetail } = await client.get<
        Response<IClassInfoRow[]>
      >(`/school/${school.SD_SCHUL_CODE}/detail`);
      setSelectSchoolDetail(schoolDetail.data);
    } catch (e) {
      return Toast('학교 정보를 불러오는데 실패했습니다.', 'error');
    } finally {
      setShowLoading(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const arraySameFilter = (arr: any[]) => {
    return arr.filter((item1, idx1) => {
      return (
        arr.findIndex((item2, idx2) => {
          return item1.value == item2.value;
        }) == idx1
      );
    });
  };

  const getSchoolGrades = () => {
    if (!selectSchoolDetail) return [];

    const arr = selectSchoolDetail.map((item) => ({
      value: item.GRADE as string,
      name: (item.GRADE as string) + '학년',
    }));
    return arraySameFilter(arr);
  };

  const getSchoolClasses = () => {
    if (!selectSchoolDetail) return [];

    const arr = selectSchoolDetail.filter(
      (item) => item.GRADE == grade
    ) as IClassInfoRow[];

    const arr2 = arr.map((item) => ({
      value: item.CLASS_NM as string,
      name: (item.CLASS_NM as string) + '반',
    }));

    return arraySameFilter(arr2);
  };

  const getSchoolDepartments = () => {
    if (!selectSchoolDetail) return [];

    const arr = selectSchoolDetail.filter(
      (item) => item.GRADE == grade && item.CLASS_NM == classNumber
    ) as IClassInfoRow[];

    const arr2 = arr.map((item) => ({
      value: item.DDDEP_NM as string,
      name: item.DDDEP_NM as string,
    }));

    const returnArr = arraySameFilter(arr2);

    if (returnArr.length == 0) return [];
    if (!returnArr[0].name) return [];
    return returnArr;
  };

  const steps: {
    [key: number]: React.ReactNode;
  } = {
    1: (
      <div className='mt-auto flex h-full w-full max-w-[551px] flex-col items-start justify-end px-5 lg:px-0'>
        <div className='mb-0 mt-6 flex flex-row items-center justify-center px-4 lg:mb-0 lg:mt-0'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='/svg/Logo.svg'
            alt='logo'
            className='h-[60px] w-[60px] lg:h-[110px] lg:w-[110px]'
            style={{
              filter: 'drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.2))',
            }}
          />
          <span className='font ml-5 w-full text-xl font-bold lg:text-3xl'>
            학교 인증
          </span>
        </div>
        <span className='-mb-5 ml-auto'>
          필수입력<span className='text-red-500'>*</span>
        </span>
        <div className='mb-8 mt-8 h-[350px] w-full border-b border-t border-[#BABABA] pt-8 lg:mb-12 lg:max-h-[400px]'>
          <div className='flex flex-col space-y-5'>
            <div className='flex flex-row items-center justify-between'>
              <div className='flex flex-row'>
                <span className='text-xl font-bold'>학교</span>
                <span className='text-red-500'>*</span>
              </div>
              <div className='relative w-80'>
                {selectSchool ? (
                  <>
                    <Button
                      className='h-12 w-full rounded-[10px] border'
                      variant='light'
                      onClick={() => {
                        setSelectSchool(undefined);
                        setSelectSchoolDetail(undefined);
                        setGrade('');
                        setClassNumber('');
                        setDepartment('');
                      }}
                    >
                      {selectSchool.SCHUL_NM} ({selectSchool.LCTN_SC_NM})
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      className='h-12 w-full rounded-[10px] border pr-8'
                      type='text'
                      placeholder='학교를 검색해주세요.'
                      onChange={(e) => {
                        setSchoolKeyword(e.target.value);
                        setOpenSchoolDropdown(true);
                      }}
                    />
                    <div className='absolute right-0 top-0 flex h-full w-10 items-center justify-center'>
                      <i className='fas fa-search' />
                    </div>
                    <div
                      ref={ref}
                      className={`absolute z-10 mt-1 max-h-[200px] min-h-[40px] w-full overflow-y-auto rounded-[10px] border-2 bg-white ${
                        openSchoolDropdown ? 'visible' : 'invisible'
                      }`}
                      style={{
                        transition: 'all 0.3s',
                        transform: openSchoolDropdown
                          ? 'scaleY(1)'
                          : 'scaleY(0)',
                        transformOrigin: 'top',
                      }}
                    >
                      {!searchSchools ||
                      schoolSearchError ||
                      searchSchools.length == 0 ? (
                        <div className='w-full rounded-b-md rounded-t-md px-3 py-1.5 hover:bg-gray-100'>
                          <div className='flex w-full flex-row items-center justify-between'>
                            <div className={`flex flex-row items-center `}>
                              검색 결과가 없습니다.
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {searchSchools.map((item, index) => (
                            <button
                              onClick={() => {
                                setOpenSchoolDropdown(false);
                                handleSelectSchool(item);
                              }}
                              key={index}
                              className={`w-full px-3 py-1.5 hover:bg-gray-100 ${
                                index === 0 && 'rounded-t-md'
                              } ${
                                index == searchSchools.length - 1 &&
                                'rounded-b-md'
                              }`}
                            >
                              <div className='flex w-full flex-row items-center justify-between'>
                                <div className={`flex flex-row items-center `}>
                                  {item.SCHUL_NM} ({item.LCTN_SC_NM})
                                </div>
                              </div>
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            {selectSchoolDetail && (
              <>
                <div className='flex flex-row items-center justify-between'>
                  <div className='flex flex-row'>
                    <span className='text-xl font-bold'>학년</span>
                    <span className='text-red-500'>*</span>
                  </div>
                  <div className='relative w-80'>
                    <Dropdown
                      items={getSchoolGrades()}
                      selectCallback={(item) => {
                        setGrade(item);
                      }}
                    />
                  </div>
                </div>
              </>
            )}
            {selectSchoolDetail && grade && (
              <div className='flex flex-row items-center justify-between'>
                <div className='flex flex-row'>
                  <span className='text-xl font-bold'>반</span>
                  <span className='text-red-500'>*</span>
                </div>
                <div className='relative w-80'>
                  <Dropdown
                    items={getSchoolClasses()}
                    selectCallback={(item) => {
                      setClassNumber(item);
                    }}
                  />
                </div>
              </div>
            )}

            {selectSchoolDetail &&
              grade &&
              classNumber &&
              getSchoolDepartments().length > 0 && (
                <div className='flex flex-row items-center justify-between'>
                  <div className='flex flex-row'>
                    <span className='text-xl font-bold'>학과(계열)</span>
                    <span className='text-red-500'>*</span>
                  </div>
                  <div className='relative w-80'>
                    <Dropdown
                      items={getSchoolDepartments()}
                      selectCallback={(item) => {
                        setDepartment(item);
                      }}
                      defalutItem={getSchoolDepartments()[0]}
                    />
                  </div>
                </div>
              )}
          </div>
        </div>
        <Button
          className='mb-5 flex h-12 w-full items-center justify-center rounded-[10px] font-bold lg:mb-10 lg:h-[65px]'
          variant='primary'
          onClick={handleNextStep}
        >
          다음
        </Button>
      </div>
    ),
  };

  return (
    <>
      {showLoading && <LoadingScreen />}
      <Layout>
        <Seo templateTitle='학교인증' />
        <main className='background flex min-h-[100vh] w-[100vw] items-center justify-center'>
          <div className='my-10 flex max-h-[909px] min-h-[90vh] w-[90vw] max-w-[644px] flex-col items-center rounded-[31px] bg-white'>
            {steps[step]}
          </div>
        </main>
      </Layout>
    </>
  );
};

export default SchoolVerify;

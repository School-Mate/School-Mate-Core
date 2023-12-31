import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import useSWR from 'swr';

import client from '@/lib/client';
import Toast from '@/lib/toast';

import Button from '@/components/buttons/Button';
import Dropdown from '@/components/Dropdown';
import Input from '@/components/Input';
import LoginLayout from '@/components/layout/LoginLayout';
import { LoadingScreen } from '@/components/Loading';
import Seo from '@/components/Seo';

import { Response } from '@/types/client';
import { IClassInfoRow, ISchoolInfoRow } from '@/types/school';

interface SchoolVerifyProps {
  session: Session;
}

const SchoolVerify = ({ session }: SchoolVerifyProps) => {
  const [step, setStep] = useState<number>(1);
  const [schoolKeyword, setSchoolKeyword] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [openSchoolDropdown, setOpenSchoolDropdown] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [grade, setGrade] = useState<string>('');
  const [classNumber, setClassNumber] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [selectSchool, setSelectSchool] = useState<ISchoolInfoRow>();
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const [selectSchoolDetail, setSelectSchoolDetail] =
    useState<IClassInfoRow[]>();
  const ref = useDetectClickOutside({
    onTriggered: () => setOpenSchoolDropdown(false),
  });
  const { data: searchSchools, error: schoolSearchError } = useSWR<
    ISchoolInfoRow[]
  >(`/school/search?keyword=${schoolKeyword}`);

  const handleSelectSchool = async (school: ISchoolInfoRow) => {
    setSelectSchool(school);

    try {
      setShowLoading(true);
      const { data: schoolDetail } = await client.get<
        Response<IClassInfoRow[]>
      >(`/school/${school.SD_SCHUL_CODE}/class`);
      setSelectSchoolDetail(schoolDetail.data);
    } catch (e) {
      return Toast('학교 정보를 불러오는데 실패했습니다.', 'error');
    } finally {
      setShowLoading(false);
    }
  };

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

  const checkSchool = () => {
    if (!selectSchool) return Toast('학교를 선택해주세요.', 'error');
    if (!selectSchoolDetail) return Toast('학교를 선택해주세요.', 'error');
    if (!grade) return Toast('학년을 선택해주세요.', 'error');
    if (!classNumber) return Toast('반을 선택해주세요.', 'error');

    if (getSchoolDepartments().length > 0 && !department)
      return Toast('학과(계열)을 선택해주세요.', 'error');

    handleNextStep();
  };

  const handleVerify = async () => {
    if (!image) return Toast('학생증을 첨부해주세요.', 'error');
    setVerifyLoading(true);
    let uploadImageId = '';

    try {
      const formData = new FormData();
      formData.append('img', image);
      formData.append('storage', 'schoolverify');
      const { data: uploadImage } = await client.post<Response<string>>(
        `/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            storage: 'schoolverify',
            Authorization: `Bearer ${session.user?.token.accessToken}`,
          },
        }
      );
      uploadImageId = uploadImage.data;

      const { data } = await client.post(
        `/school/verify`,
        {
          imageId: uploadImageId,
          schoolId: selectSchool?.SD_SCHUL_CODE,
          grade,
          class: classNumber,
          dept: department,
        },
        {
          headers: {
            Authorization: `Bearer ${session.user?.token.accessToken}`,
          },
        }
      );

      Toast(
        '인증요청이 접수되었습니다! 심사 완료까지 약 1일~2일이 소요됩니다!',
        'success'
      );

      await Router.push('/');
    } catch (error) {
      if (error instanceof AxiosError) {
        if (uploadImageId) {
          await client.delete(`/image/${uploadImageId}`, {
            headers: {
              Authorization: `Bearer ${session.user?.token.accessToken}`,
            },
          });
        }
        return Toast(error.response?.data.message, 'error');
      }

      return Toast('학교 인증 요청에 실패했습니다.', 'error');
    } finally {
      setImage(null);
      setVerifyLoading(false);
      imageUploadRef.current?.value && (imageUploadRef.current.value = '');
    }
  };

  const steps: {
    [key: number]: React.ReactNode;
  } = {
    1: (
      <>
        <div className='mb-auto flex flex-row items-center justify-center px-5 pt-20'>
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
            학교인증
          </span>
        </div>
        <span className='-mb-5 ml-auto'>
          필수입력<span className='text-red-500'>*</span>
        </span>
        <div className='min-h-[400px] w-full'>
          <hr className='my-8 border-[#BABABA] ' />
          <div className='flex flex-col space-y-2 lg:space-y-5'>
            <div className='flex flex-col justify-between lg:flex-row lg:items-center'>
              <div className='flex flex-row'>
                <span className='text-sm font-bold lg:text-lg'>학교</span>
                <span className='text-red-500'>*</span>
              </div>
              <div className='relative mt-1 w-full lg:mt-0 lg:w-80'>
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
                <div className='flex flex-col justify-between lg:flex-row lg:items-center'>
                  <div className='flex flex-row'>
                    <span className='text-sm font-bold lg:text-lg'>학년</span>
                    <span className='text-red-500'>*</span>
                  </div>
                  <div className='relative mt-1 w-full lg:mt-0 lg:w-80'>
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
              <div className='flex flex-col justify-between lg:flex-row lg:items-center'>
                <div className='flex flex-row'>
                  <span className='text-sm font-bold lg:text-lg'>반</span>
                  <span className='text-red-500'>*</span>
                </div>
                <div className='relative mt-1 w-full lg:mt-0 lg:w-80'>
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
                <div className='flex flex-col justify-between lg:flex-row lg:items-center'>
                  <div className='flex flex-row'>
                    <span className='text-sm font-bold lg:text-lg'>
                      학과(계열)
                    </span>
                    <span className='text-red-500'>*</span>
                  </div>
                  <div className='relative mt-1 w-full lg:mt-0 lg:w-80'>
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
          <hr className='my-8 border-[#BABABA] ' />
        </div>
        <div className='mb-4 flex w-full flex-row space-x-2'>
          <Button
            className='mb-5 flex h-10 w-full items-center justify-center rounded-[10px] font-bold lg:h-[65px]'
            variant='primary'
            onClick={checkSchool}
          >
            다음
          </Button>
        </div>
      </>
    ),
    2: (
      <>
        <div className='mb-auto flex flex-row items-center justify-center px-5 pt-20'>
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
            학교인증
          </span>
        </div>
        <div className='flex flex-col'>
          <hr className='my-8 border-[#BABABA] ' />

          <div className='flex h-full w-full flex-col items-center justify-center'>
            <span className='mr-auto text-xl font-bold'>학생증 인증</span>
            <button
              onClick={() => {
                imageUploadRef.current?.click();
              }}
              className='mt-2 flex h-52 w-full flex-col items-center justify-center rounded-[10px] border-4 text-[#E3E3E3]'
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className='h-full w-full object-cover'
                  src={URL.createObjectURL(image)}
                  alt='image'
                />
              ) : (
                <>
                  <i className='fas fa-file text-6xl' />
                  <span className='mt-3 text-xl'>이미지 첨부하기</span>
                </>
              )}
              <input
                className='hidden'
                type='file'
                ref={imageUploadRef}
                accept='image/*'
                onChange={(e) => {
                  if (!e.target.files) return;
                  setImage(e.target.files[0]);
                }}
              />
            </button>
            <div className='mt-4 flex w-full flex-col'>
              <span className='font-bold'>[ 인증 가능 서류 ]</span>
              <span className='ml-2 text-sm'>· 생활기록부</span>
              <span className='ml-2 text-sm'>· 학생증</span>
            </div>
            <div className='mt-2 flex w-full flex-col'>
              <div className='flex flex-row items-start justify-start text-sm text-[#BEBDBD]'>
                <span>1.</span>
                <span className='ml-1'>
                  첨부 이미지는 정보 확인 후 즉시 폐기하며, 주민등록번호가 나올
                  시 마스킹 후 첨부 부탁드립니다.
                </span>
              </div>
              <div className='flex flex-row items-start justify-start text-sm text-[#BEBDBD]'>
                <span>2.</span>
                <span className='ml-1'>
                  타인을 사칭, 서류 위조, 해킹 등의 여부는 관련 법에 따라 법적
                  책임이 따를 수 있습니다.
                </span>
              </div>
            </div>
          </div>
          <hr className='my-8 border-[#BABABA] ' />
        </div>
        <div className='mb-4 flex w-full flex-row space-x-2'>
          <Button
            className='mb-5 flex h-10 w-full items-center justify-center rounded-[10px] font-bold lg:h-[65px]'
            variant='primary'
            onClick={handleVerify}
            isLoading={verifyLoading}
          >
            완료
          </Button>
        </div>
      </>
    ),
  };

  return (
    <>
      {showLoading && <LoadingScreen />}
      <Seo templateTitle='학교인증' />
      <LoginLayout>{steps[step]}</LoginLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session)
    return {
      props: {
        session,
      },
    };
  return {
    redirect: {
      destination: '/auth/login?redirectTo=/auth/verify',
      permanent: false,
    },
  };
};

export default SchoolVerify;

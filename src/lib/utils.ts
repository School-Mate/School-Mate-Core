import cookie from 'cookie';
import dayjs from 'dayjs';
import { GetServerSidePropsContext, NextPageContext } from 'next';

export const schoolMateDateFormat = (date: Date) => {
  const todayDate = new Date();
  const targetDate = new Date(date);

  const betweenTime = Math.floor(
    (todayDate.getTime() - targetDate.getTime()) / 1000 / 60
  );

  if (betweenTime < 1) return '방금전';
  if (betweenTime < 60) {
    return `${betweenTime}분전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 30) {
    return `${betweenTimeDay}일전`;
  }

  return dayjs(date).format('YYYY/MM/DD');
};

export const cookieParser = (
  ctx: GetServerSidePropsContext | NextPageContext
) => {
  if (!ctx || !ctx.req) return {};
  const cookies = cookie.parse((ctx.req.headers.cookie as string) || '');
  return cookies;
};

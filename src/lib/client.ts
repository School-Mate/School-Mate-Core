import axios, { AxiosError } from 'axios';

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const loggedClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

loggedClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const swrfetcher = async <JSON = unknown>(
  endpoints: string
): Promise<JSON> =>
  client
    .get(endpoints, {
      withCredentials: true,
    })
    .then((data) => data.data.data)
    .catch((e: AxiosError) => {
      const response = e.response as unknown as { data: { message: string } };

      throw new Error(response?.data?.message || 'Something went wrong');
    });

export default client;

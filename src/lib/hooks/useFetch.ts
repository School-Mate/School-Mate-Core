import { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { Id, toast, ToastOptions } from 'react-toastify';

import client from '@/lib/client';

type UseFetchParams = {
  fetchInit?: AxiosRequestConfig;
  pendingToast?: {
    message: string;
    options?: ToastOptions;
  };
  successToast?: {
    message: string;
    options?: ToastOptions;
  };
  failureToast?: {
    [statusCode: number]: {
      message: string;
      options?: ToastOptions;
    };
    fallback: {
      message: string;
      options?: ToastOptions;
    };
  };
  onError?: (statusCode: number, statusText: string, body: any) => void;
  onSuccess?: (statusCode: number, statusText: string, body: any) => void;
  onPending?: () => void;
};

export default function useFetch(
  url: string,
  type: Method,
  {
    fetchInit,
    successToast,
    failureToast,
    pendingToast,
    onError,
    onSuccess,
    onPending,
  }: UseFetchParams
) {
  return {
    triggerFetch({
      failureToast: oFailureToast,
      fetchInit: oFetchInit,
      successToast: oSuccessToast,
      pendingToast: oPendingToast,
      onError: oOnError,
      onSuccess: oOnSuccess,
      onPending: oOnPending,
    }: UseFetchParams): Promise<{ response?: AxiosResponse; body: any }> {
      oOnPending ? oOnPending() : onPending && onPending();
      let promiseToastId: Id | null = null;
      const successToastObject = oSuccessToast ?? successToast;
      const pendingToastObject = oPendingToast ?? pendingToast;
      if (pendingToastObject && successToastObject) {
        promiseToastId = toast.loading(
          pendingToastObject.message,
          pendingToastObject.options ?? {
            position: 'bottom-center',
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            closeButton: false,
          }
        );
      }

      return client(url, {
        method: type,
        ...oFetchInit,
        ...fetchInit,
      })
        .then((response) => {
          if (promiseToastId && successToastObject) {
            toast.update(promiseToastId, {
              render: successToastObject?.message,
              ...(successToastObject?.options ?? {
                position: 'bottom-center',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                closeButton: false,
                type: 'success',
                isLoading: false,
              }),
            });
          } else if (promiseToastId) {
            toast.dismiss(promiseToastId);
          } else if (successToastObject) {
            toast.success(successToastObject.message, {
              ...(successToastObject.options ?? {
                position: 'bottom-center',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                closeButton: false,
                isLoading: false,
                type: 'success',
              }),
            });
          }

          if (oOnSuccess || onSuccess) {
            oOnSuccess
              ? oOnSuccess(
                  response.status,
                  response.statusText,
                  response.data.data
                )
              : onSuccess &&
                onSuccess(
                  response.status,
                  response.statusText,
                  response.data.data
                );
          }

          return { response, body: response.data };
        })
        .catch((error: AxiosError) => {
          const failureToastObject = oFailureToast ?? failureToast;
          if (promiseToastId && failureToastObject) {
            if (failureToastObject[error.response?.status ?? 0]) {
              toast.update(promiseToastId, {
                render:
                  failureToastObject[error.response?.status ?? 500].message,
                ...(failureToastObject[error.response?.status ?? 500]
                  .options ?? {
                  position: 'bottom-center',
                  autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  closeButton: false,
                  type: 'error',
                  isLoading: false,
                }),
              });
            } else {
              toast.update(promiseToastId, {
                render: failureToastObject.fallback.message,
                ...(failureToastObject.fallback.options ?? {
                  position: 'bottom-center',
                  autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  closeButton: false,
                  type: 'error',
                  isLoading: false,
                }),
              });
            }
          }

          const response = error.response as unknown as {
            data: { message: string; data: any };
          };

          if (oOnError || onError) {
            onError
              ? onError(
                  error.response?.status ?? 500,
                  response ? response.data.message : error.message,
                  response ? response.data.data : null
                )
              : oOnError &&
                oOnError(
                  error.response?.status ?? 500,
                  response ? response.data.message : error.message,
                  response ? response.data.data : null
                );
          }

          return { response: error.response, body: response.data };
        });
    },
  };
}

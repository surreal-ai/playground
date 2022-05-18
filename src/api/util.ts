import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestTransformer,
  AxiosResponse,
} from 'axios';

export function getErrorCode(error: any): { code: number; message: string } {
  if (error?.response?.data?.code) {
    const response = error.response as AxiosResponse;
    return response.data;
  } else if (error?.code === 'ECONNABORTED') {
    // timeout
    return {
      code: 408,
      message: 'Request Timeout!',
    };
  } else if (error?.response) {
    // request error
    return {
      code: error.response.status || 500,
      message: error.response.statusText,
    };
  } else if (error?.code) {
    // custom error
    return {
      code: error.code,
      message: '',
    };
  } else {
    return {
      code: 500,
      message: '',
    };
  }
}

export class NetworkError extends Error {
  code?: number;
  constructor(message?: string, code?: number) {
    super(message);
    this.code = code;
  }
}

export class ApiError extends Error {
  code?: number;
  constructor(message?: string, code?: number) {
    super(message ?? '');
    this.code = code ?? 0;
  }
}

export function inject(axios: AxiosInstance) {
  // Add a request interceptor
  axios.interceptors.request.use(
    (config) => {
      let token = '';
      try {
        token = JSON.parse(localStorage.getItem('se-token'));
      } catch (err) {
        // ignore
      }

      if (token) {
        if (!config.headers) { config.headers = {}; }
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    });

  // Add a response interceptor
  axios.interceptors.response.use(
    (response) => {
      const isSuccessCode = response.status >= 200 && response.data.code === 0;
      if (isSuccessCode) {
        return response.data?.data;
      } else {
        return Promise.reject({
          code: response.data.code,
          message: response.data.message,
        });
      }
    },
    (error: AxiosError) => {
      if (Axios.isCancel(error)) {
        return Promise.reject(error);
      } else {
        const responseData = (error?.response?.data as any) || {};
        if (responseData?.code) {
          return Promise.reject(
            new ApiError(
              responseData?.message,
              responseData?.code,
            ),
          );
        } else if (error.response?.status) {
          return Promise.reject(
            new NetworkError(error.message, error.response.status),
          );
        } else {
          return Promise.reject(error);
        }
      }
    },
  );
}

export function addTransformer(
  before: AxiosRequestTransformer | AxiosRequestTransformer[] | undefined,
  transf: AxiosRequestTransformer,
) {
  if (!before) return [transf];
  if (before instanceof Array) return [...before, transf];
  else return [before, transf];
}

/**
 * @param data
 */
export const axiosFormDataTransformer: AxiosRequestTransformer = function (
  data,
) {
  const formData = new FormData();

  function append(formDataInstance: FormData, object: any) {
    if (object instanceof Array) {
      object.forEach((val, key) => {
        formDataInstance.append(`${key}[]`, val);
      });
    } else {
      for (const it in data) {
        formDataInstance.append(it, data[it]);
      }
    }
  }

  append(formData, data);
  return formData;
};

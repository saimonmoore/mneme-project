import axios from 'axios';

type FetchOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, any>;
  responseType?: string;
  credentials?: string;
};

type FetchResponse = {
  ok: boolean;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  url: string;
  text: () => Promise<string>;
  json: () => Promise<any>;
};

type AxiosConfig = {
  headers?: Record<string, string>;
  body?: any;
  withCredentials?: boolean;
};

export const agnosticFetch = {
  get: async (url: string, options: FetchOptions = {}): Promise<FetchResponse> => {
    const response = await fetchAPIAxiosWrapper(url, 'get', options);
    return response;
  },
  post: async (url: string, options: FetchOptions = {}): Promise<FetchResponse> => {
    const response = await fetchAPIAxiosWrapper(url, 'post', options);
    return response;
  },
};

const fetchAPIAxiosWrapper = async (
  url: string,
  method = 'get',
  options: FetchOptions = {},
): Promise<FetchResponse> => {

  let axiosConfig: AxiosConfig = {
    headers: options.headers,
  };

  // Support for 'fetch' API credentials option
  if (options.credentials === 'include') {
    axiosConfig.withCredentials = true;
  }

  try {
    // @ts-ignore
    const response = await callAxios(url, method, options.body, axiosConfig);

    // Mimic the fetch API Response object
    const fetchResponse = {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
      url,
      text: async () => response.data,
      json: async () => response.data,
    };

    return fetchResponse;
  } catch (error: any) {
    // Mimic the fetch API behavior on error
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return Promise.reject(error.response);
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('Network Error'));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(error.message);
    }
  }
};

const callAxios = async (url: string, method = 'get', body: any, options: AxiosConfig = {}): Promise<any> => {
    switch (method) {
        case 'get':
            return axios.get(url, options);
        case 'post':
            return axios.post(url, body, options);
        default:
            throw new Error(`Unsupported method: ${method}`);
        }
};

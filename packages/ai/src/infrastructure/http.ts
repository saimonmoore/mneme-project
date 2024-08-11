import axios from 'axios';

type FetchOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
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
  withCredentials?: boolean;
};

export const agnosticFetch = async (
  url: string,
  options: FetchOptions = {},
): Promise<FetchResponse> => {
  // Convert the 'fetch' options to 'axios' options
  const axiosConfig: AxiosConfig = {
    headers: options.headers,
  };

  // Support for 'fetch' API credentials option
  if (options.credentials === 'include') {
    axiosConfig.withCredentials = true;
  }

  try {
    const response = await axios.get(url, axiosConfig);

    // Mimic the fetch API Response object
    const fetchResponse = {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
      url,
      text: () => Promise.resolve(response.data),
      json: () => Promise.resolve(JSON.stringify(response.data)),
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

type ApiResult<T> = {
  data?: T;
  response: Response;
};

export function requireData<T>({ data, response }: ApiResult<T>) {
  if (!data) {
    throw new Error(`Expected response body for ${response.status} ${response.statusText}`);
  }

  return data;
}

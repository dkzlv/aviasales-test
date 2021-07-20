const appJson = 'application/json';

export const request = async <Res = {}>(
  method: Methods,
  path: string,
  other?: { query?: { [key: string]: string }; data?: any }
) => {
  const { query, data } = other || {};

  if (query) path += '?' + new URLSearchParams(query);

  const body = method !== Methods.get && data ? JSON.stringify(data) : undefined;

  const res = await fetch(
    new Request(path, {
      method,
      body,
      headers: {
        Accept: appJson,
        'Content-Type': appJson,
      },
    })
  );
  if (!res.ok) throw new HttpError(res);

  const json: Res = await res.json();
  return { json, res };
};

export class HttpError extends Error {
  constructor(public res: Response) {
    super();
  }
}

export enum Methods {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  patch = 'PATCH',
  del = 'DELETE',
}

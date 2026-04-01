export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpRequestOptions = Omit<RequestInit, 'method' | 'body'> & {
  method?: HttpMethod;
  body?: unknown;
};

export class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly responseBody?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export async function http<T>(
  input: string | URL,
  options: HttpRequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers, ...rest } = options;

  const res = await fetch(input, {
    ...rest,
    method,
    headers: {
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const parsed = isJson ? await res.json().catch(() => undefined) : await res.text();

  if (!res.ok) {
    throw new HttpError('Request failed', res.status, parsed);
  }

  return parsed as T;
}


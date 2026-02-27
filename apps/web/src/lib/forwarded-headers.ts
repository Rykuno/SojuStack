const FORWARDED_HEADER_NAMES = [
  'authorization',
  'cookie',
  'x-request-id',
  'x-correlation-id',
  'x-forwarded-for',
  'x-forwarded-host',
  'x-forwarded-proto',
  'x-real-ip',
  'accept-language',
  'user-agent',
] as const;

export function pickForwardHeaders(headers: Headers): HeadersInit {
  const forwarded = new Headers();

  for (const headerName of FORWARDED_HEADER_NAMES) {
    const headerValue = headers.get(headerName);

    if (headerValue) {
      forwarded.set(headerName, headerValue);
    }
  }

  return Object.fromEntries(forwarded);
}

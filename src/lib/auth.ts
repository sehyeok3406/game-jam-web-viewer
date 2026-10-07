import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
export const SESSION_COOKIE = 'gamejam_viewer';
export const SESSION_SECONDS = 60 * 60 * 24 * 30;
export const privateHeaders = {
  'Cache-Control': 'private, no-store',
  Vary: 'Cookie',
};
const hash = (value: string) =>
  createHash('sha256').update(value).digest('hex');
const equal = (a: string, b: string) =>
  a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
export function configured() {
  return !!(
    process.env.VIEWER_READ_KEY_HASH &&
    process.env.VIEWER_PUBLISH_KEY_HASH &&
    (process.env.BLOB_STORE_ID ||
      process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.NODE_ENV !== 'production' && process.env.VIEWER_TEST_STORE))
  );
}
export function validReadKey(value: string) {
  return (
    /^[A-Za-z0-9_-]{43}$/.test(value) &&
    equal(hash(value), process.env.VIEWER_READ_KEY_HASH ?? '')
  );
}
export function validPublisher(request: Request) {
  const value =
    request.headers.get('authorization')?.replace(/^Bearer /, '') ?? '';
  return (
    /^[A-Za-z0-9_-]{43}$/.test(value) &&
    equal(hash(value), process.env.VIEWER_PUBLISH_KEY_HASH ?? '')
  );
}
const signature = (value: string) =>
  createHmac('sha256', process.env.VIEWER_PUBLISH_KEY_HASH ?? '')
    .update(`${process.env.VIEWER_READ_KEY_HASH}:${value}`)
    .digest('hex');
export function createSession(now = Date.now()) {
  const until = Math.floor(now / 1000) + SESSION_SECONDS;
  return `${until}.${signature(String(until))}`;
}
export function validSession(value: string, now = Date.now()) {
  const parts = value.split('.');
  if (
    !configured() ||
    parts.length !== 2 ||
    !/^\d{10}$/.test(parts[0]) ||
    !/^[a-f0-9]{64}$/.test(parts[1])
  )
    return false;
  const until = Number(parts[0]);
  return (
    until > now / 1000 &&
    until <= now / 1000 + SESSION_SECONDS + 60 &&
    equal(parts[1], signature(parts[0]))
  );
}
export async function authenticated() {
  return validSession((await cookies()).get(SESSION_COOKIE)?.value ?? '');
}
export function sameOrigin(request: Request) {
  try {
    const origin = new URL(request.headers.get('origin') ?? '');
    return (
      ['http:', 'https:'].includes(origin.protocol) &&
      origin.host === request.headers.get('host')
    );
  } catch {
    return false;
  }
}
export function failure(status: number, code: string, message: string) {
  return Response.json(
    { error: { code, message } },
    { status, headers: privateHeaders },
  );
}

import { cookies } from 'next/headers';
import {
  authenticated,
  configured,
  createSession,
  failure,
  privateHeaders,
  sameOrigin,
  SESSION_COOKIE,
  SESSION_SECONDS,
  validReadKey,
} from '@/lib/auth';
export async function GET() {
  return Response.json(
    { configured: configured(), authenticated: await authenticated() },
    { headers: privateHeaders },
  );
}
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return failure(403, 'INVALID_ORIGIN', '이 웹 뷰어에서 연결해주세요.');
  if (!configured())
    return failure(503, 'NOT_CONFIGURED', '웹 뷰어 연결을 설정하는 중입니다.');
  if (Number(request.headers.get('content-length')) > 1024)
    return failure(413, 'TOO_LARGE', '연결 코드가 너무 깁니다.');
  try {
    const { code } = await request.json();
    if (typeof code !== 'string' || !validReadKey(code.trim()))
      return failure(401, 'INVALID_CODE', '연결 코드를 확인해주세요.');
    (await cookies()).set(SESSION_COOKIE, createSession(), {
      httpOnly: true,
      secure: new URL(request.url).protocol === 'https:',
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_SECONDS,
    });
    return Response.json({ authenticated: true }, { headers: privateHeaders });
  } catch {
    return failure(400, 'INVALID_REQUEST', '연결 코드를 확인해주세요.');
  }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request))
    return failure(
      403,
      'INVALID_ORIGIN',
      '이 웹 뷰어에서 연결을 해제해주세요.',
    );
  (await cookies()).delete(SESSION_COOKIE);
  return Response.json({ authenticated: false }, { headers: privateHeaders });
}

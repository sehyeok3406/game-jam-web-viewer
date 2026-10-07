import { demoProject } from '@/lib/demo';

/** Only the synthetic demo is public. Real project authentication is not implemented yet. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  if (projectId === 'demo')
    return Response.json(demoProject, {
      headers: { 'Cache-Control': 'no-store' },
    });
  return Response.json(
    {
      error: {
        code: 'PROJECT_SOURCE_NOT_CONFIGURED',
        message: '실제 프로젝트 조회 기능은 아직 연결되지 않았습니다.',
      },
    },
    { status: 503, headers: { 'Cache-Control': 'no-store' } },
  );
}

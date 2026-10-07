import { demoProject } from '@/lib/demo';
import { authenticated, failure, privateHeaders } from '@/lib/auth';
import { loadProject } from '@/lib/storage';

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
  if (!(await authenticated()))
    return failure(401, 'UNAUTHORIZED', '프로젝트를 보려면 연결해주세요.');
  try {
    const project = await loadProject(projectId);
    return project
      ? Response.json(project, { headers: privateHeaders })
      : failure(404, 'PROJECT_NOT_FOUND', '프로젝트를 찾을 수 없습니다.');
  } catch {
    return failure(
      503,
      'STORAGE_UNAVAILABLE',
      '프로젝트를 불러오지 못했습니다. 다시 시도해주세요.',
    );
  }
}

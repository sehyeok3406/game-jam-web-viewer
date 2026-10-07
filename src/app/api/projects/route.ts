import { authenticated, failure, privateHeaders } from '@/lib/auth';
import { listProjects } from '@/lib/storage';
export async function GET() {
  if (!(await authenticated()))
    return failure(401, 'UNAUTHORIZED', '프로젝트를 보려면 연결해주세요.');
  try {
    return Response.json(
      { projects: await listProjects() },
      { headers: privateHeaders },
    );
  } catch {
    return failure(
      503,
      'STORAGE_UNAVAILABLE',
      '프로젝트 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
    );
  }
}

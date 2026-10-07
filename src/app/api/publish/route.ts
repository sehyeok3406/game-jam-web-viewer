import {
  configured,
  failure,
  privateHeaders,
  validPublisher,
} from '@/lib/auth';
import { saveProject } from '@/lib/storage';
import { validateProject } from '@/lib/validate-project';
export async function POST(request: Request) {
  if (!configured())
    return failure(503, 'NOT_CONFIGURED', '게시 저장소가 설정되지 않았습니다.');
  // A browser read session cannot authorize publishing.
  if (!validPublisher(request))
    return failure(403, 'PUBLISH_DENIED', '게시 권한이 없습니다.');
  if (request.headers.has('origin'))
    return failure(403, 'DESKTOP_ONLY', '데스크톱 게시만 지원합니다.');
  const reader = request.body?.getReader();
  if (!reader)
    return failure(400, 'INVALID_REQUEST', '게시할 프로젝트가 없습니다.');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 4_000_000) {
        await reader.cancel();
        return failure(413, 'TOO_LARGE', '게시본은 4MB 이하여야 합니다.');
      }
      chunks.push(chunk.value);
    }
    const project = validateProject(
      JSON.parse(Buffer.concat(chunks).toString('utf8')),
    );
    try {
      await saveProject(project);
    } catch {
      return failure(
        503,
        'STORAGE_UNAVAILABLE',
        '게시 저장소에 연결하지 못했습니다.',
      );
    }
    return Response.json(
      { id: project.id, publishedAt: project.publishedAt },
      { headers: privateHeaders },
    );
  } catch {
    return failure(
      400,
      'INVALID_PROJECT',
      '프로젝트 데이터가 올바르지 않습니다.',
    );
  }
}

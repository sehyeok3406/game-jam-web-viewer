import { configured } from '@/lib/auth';
export function GET() {
  return Response.json(
    {
      status: 'ok',
      service: 'game-jam-web-viewer',
      version: '0.2.0',
      projectSource: configured()
        ? 'private-published-projects'
        : 'not-configured',
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

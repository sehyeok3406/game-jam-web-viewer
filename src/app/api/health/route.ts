export function GET() {
  return Response.json(
    {
      status: 'ok',
      service: 'game-jam-web-viewer',
      version: '0.1.0',
      projectSource: 'not-configured',
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

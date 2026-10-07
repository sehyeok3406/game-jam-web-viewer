import assert from 'node:assert/strict';

const base = process.argv[2] ?? 'http://127.0.0.1:3080';
const deadline = Date.now() + 30_000;
while (true) {
  try {
    const health = await fetch(`${base}/api/health`, {
      signal: AbortSignal.timeout(3000),
    });
    assert.equal(health.status, 200);
    assert.ok(
      ['not-configured', 'private-published-projects'].includes(
        (await health.json()).projectSource,
      ),
    );
    break;
  } catch (error) {
    if (Date.now() > deadline) throw error;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

for (const path of ['/', '/view/demo']) {
  const response = await fetch(`${base}${path}`);
  assert.equal(response.status, 200, path);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
  const html = await response.text();
  assert.match(html, /공개 예제/);
  assert.match(html, /읽기 전용/);
}

const demo = await fetch(`${base}/api/view/demo`);
assert.equal(demo.status, 200);
const project = await demo.json();
assert.equal(project.source, 'demo');
assert.equal(project.readOnly, true);
assert.equal(project.documents.length, 4);
assert.equal(project.token, undefined);

const unavailable = await fetch(`${base}/api/view/a-real-project`);
assert.equal(unavailable.status, 401);
const unavailableBody = await unavailable.json();
assert.equal(unavailableBody.error.code, 'UNAUTHORIZED');
assert.equal(unavailableBody.documents, undefined);

for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
  assert.equal(
    (await fetch(`${base}/api/view/demo`, { method })).status,
    405,
    method,
  );
}

const deepLink = await fetch(`${base}/view/a-real-project`);
assert.equal(deepLink.status, 200);
assert.match(await deepLink.text(), /프로젝트를 불러오는 중/);
assert.equal((await fetch(`${base}/api/projects`)).status, 401);
assert.equal((await fetch(`${base}/a-missing-page`)).status, 404);
console.log(
  'PASS: production routes, demo source, unsupported sources, read-only API methods and headers',
);

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
const store = await mkdtemp(path.join(os.tmpdir(), 'gamejam-web-tests-'));
const readKey = 'r'.repeat(43),
  publishKey = 'p'.repeat(43);
const hash = (value) => createHash('sha256').update(value).digest('hex');
const port = 3091,
  base = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  [
    'node_modules/next/dist/bin/next',
    'dev',
    '--hostname',
    '127.0.0.1',
    '--port',
    String(port),
  ],
  {
    windowsHide: true,
    env: {
      ...process.env,
      NODE_ENV: 'development',
      VIEWER_TEST_STORE: store,
      VIEWER_READ_KEY_HASH: hash(readKey),
      VIEWER_PUBLISH_KEY_HASH: hash(publishKey),
    },
    stdio: 'pipe',
  },
);
let logs = '';
server.stdout.on('data', (chunk) => {
  logs += chunk;
});
server.stderr.on('data', (chunk) => {
  logs += chunk;
});
const closed = new Promise((resolve) => server.once('close', resolve));
try {
  const deadline = Date.now() + 60_000;
  while (true) {
    try {
      if (
        (
          await fetch(`${base}/api/health`, {
            signal: AbortSignal.timeout(3000),
          })
        ).ok
      )
        break;
    } catch {}
    if (Date.now() > deadline || server.exitCode !== null)
      throw new Error(`Test server did not start: ${logs}`);
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  const id = 'a'.repeat(64);
  assert.equal((await fetch(`${base}/api/projects`)).status, 401);
  assert.equal((await fetch(`${base}/api/view/${id}`)).status, 401);
  const session = (code, origin = base) =>
    fetch(`${base}/api/session`, {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
  assert.equal((await session(readKey, 'https://attacker.test')).status, 403);
  assert.equal((await session('bad')).status, 401);
  const login = await session(readKey);
  assert.equal(login.status, 200);
  const setCookie = login.headers.get('set-cookie');
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /SameSite=strict/i);
  const cookie = setCookie.split(';')[0];
  const read = (route) =>
    fetch(`${base}${route}`, { headers: { Cookie: cookie } });
  const project = {
    schemaVersion: 1,
    id,
    name: '연결 테스트',
    source: 'shared',
    description: 'Synthetic integration fixture',
    revision: 1,
    readOnly: true,
    modifiedAt: 123,
    documents: [
      {
        id: 'doc',
        title: 'Real document',
        kind: 'document',
        section: '기획',
        summary: 'Body',
        body: '# Actual body',
        position: { x: 234, y: 567 },
        width: 340,
        height: 300,
        color: 'blue',
      },
    ],
    sections: [],
    credentials: { token: 'MUST_NOT_LEAK' },
    root: 'C:/MUST_NOT_LEAK',
  };
  const publish = (value, token = publishKey, extra = {}) =>
    fetch(`${base}/api/publish`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...extra,
      },
      body: JSON.stringify(value),
    });
  assert.equal(
    (await publish(project, readKey, { Cookie: cookie })).status,
    403,
  );
  assert.equal(
    (await publish(project, publishKey, { Origin: base })).status,
    403,
  );
  assert.equal((await publish({ ...project, readOnly: false })).status, 400);
  assert.equal(
    (
      await publish({
        ...project,
        documents: [...project.documents, ...project.documents],
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await publish({
        ...project,
        documents: [
          { ...project.documents[0], image: 'https://attacker.test/pixel' },
        ],
      })
    ).status,
    400,
  );
  assert.equal((await publish(project)).status, 200);
  const loaded = await read(`/api/view/${id}`);
  assert.equal(loaded.status, 200);
  assert.match(loaded.headers.get('cache-control'), /private.*no-store/);
  const data = await loaded.json();
  assert.equal(data.documents[0].body, '# Actual body');
  assert.deepEqual(data.documents[0].position, { x: 234, y: 567 });
  assert.ok(!JSON.stringify(data).includes('MUST_NOT_LEAK'));
  assert.equal(
    (await (await read('/api/projects')).json()).projects[0].documentCount,
    1,
  );
  project.revision = 2;
  project.documents[0].body = 'Updated content';
  assert.equal((await publish(project)).status, 200);
  assert.equal(
    (await (await read(`/api/view/${id}`)).json()).documents[0].body,
    'Updated content',
  );
  assert.equal((await read(`/api/view/${'b'.repeat(64)}`)).status, 404);
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE'])
    assert.equal(
      (
        await fetch(`${base}/api/view/${id}`, {
          method,
          headers: { Cookie: cookie },
        })
      ).status,
      405,
    );
  const logout = await fetch(`${base}/api/session`, {
    method: 'DELETE',
    headers: { Cookie: cookie, Origin: base },
  });
  assert.equal(logout.status, 200);
  assert.match(logout.headers.get('set-cookie'), /expires=Thu, 01 Jan 1970/i);
  console.log(
    'PASS: publish → authenticated project list → real project read, revisions, grants, DTO filtering and mutation denial',
  );
} finally {
  server.kill();
  await closed;
  const resolved = path.resolve(store);
  assert.ok(
    resolved.startsWith(
      path.resolve(os.tmpdir()) + path.sep + 'gamejam-web-tests-',
    ),
  );
  await rm(resolved, { recursive: true, force: true });
}

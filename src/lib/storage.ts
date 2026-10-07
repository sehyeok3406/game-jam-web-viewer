import { get, list, put } from '@vercel/blob';
import type { ProjectSummary, ViewerProject } from './project';
import fs from 'node:fs/promises';
import path from 'node:path';
const prefix = 'gamejam/projects/';
const validId = (id: string) => /^[a-f0-9]{64}$/.test(id);
// The filesystem adapter is for development only, never a deployed production build.
const testStore = () =>
  process.env.NODE_ENV !== 'production'
    ? process.env.VIEWER_TEST_STORE
    : undefined;
export async function saveProject(project: ViewerProject) {
  if (!validId(project.id)) throw new Error('Invalid project');
  const local = testStore();
  if (local) {
    await fs.mkdir(local, { recursive: true });
    await fs.writeFile(
      path.join(local, `${project.id}.json`),
      JSON.stringify(project),
    );
    return;
  }
  await put(`${prefix}${project.id}.json`, JSON.stringify(project), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}
export async function loadProject(id: string): Promise<ViewerProject | null> {
  if (!validId(id)) return null;
  const local = testStore();
  if (local)
    return fs
      .readFile(path.join(local, `${id}.json`), 'utf8')
      .then(JSON.parse)
      .catch((error) => {
        if (error.code === 'ENOENT') return null;
        throw error;
      });
  const result = await get(`${prefix}${id}.json`, {
    access: 'private',
    useCache: false,
  });
  if (!result || result.statusCode !== 200) return null;
  return new Response(result.stream).json();
}
export async function listProjects(): Promise<ProjectSummary[]> {
  const local = testStore();
  let ids: string[];
  if (local)
    ids = (await fs.readdir(local).catch(() => []))
      .map((name) => name.replace(/\.json$/, ''))
      .filter(validId);
  else {
    ids = [];
    let cursor: string | undefined;
    do {
      const result = await list({ prefix, cursor, limit: 100 });
      ids.push(
        ...result.blobs
          .map((blob) =>
            blob.pathname.slice(prefix.length).replace(/\.json$/, ''),
          )
          .filter(validId),
      );
      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);
  }
  const summaries: ProjectSummary[] = [];
  for (let offset = 0; offset < ids.length; offset += 5) {
    const projects = await Promise.all(
      ids.slice(offset, offset + 5).map(loadProject),
    );
    for (const project of projects) {
      if (!project) continue;
      const { documents, sections, ...metadata } = project;
      summaries.push({
        ...metadata,
        documentCount: documents.length,
        sectionCount: sections?.length ?? 0,
      });
    }
  }
  return summaries.sort(
    (a, b) =>
      (b.modifiedAt ?? b.publishedAt ?? 0) -
      (a.modifiedAt ?? a.publishedAt ?? 0),
  );
}

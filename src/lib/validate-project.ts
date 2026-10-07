import type { ViewerDocument, ViewerProject } from './project';
// Rebuild using an allow-list; credentials, paths and commands never enter storage.
export function validateProject(value: unknown): ViewerProject {
  const object = (v: unknown): Record<string, unknown> => {
    if (!v || typeof v !== 'object' || Array.isArray(v))
      throw new Error('Invalid object');
    return v as Record<string, unknown>;
  };
  const string = (v: unknown, max: number) => {
    if (typeof v !== 'string' || v.length > max)
      throw new Error('Invalid text');
    return v;
  };
  const number = (v: unknown, max = 1_000_000) => {
    if (typeof v !== 'number' || !Number.isFinite(v) || Math.abs(v) > max)
      throw new Error('Invalid number');
    return v;
  };
  const project = object(value);
  if (
    project.schemaVersion !== 1 ||
    project.readOnly !== true ||
    !/^[a-f0-9]{64}$/.test(String(project.id)) ||
    !['shared', 'published', 'local-live'].includes(String(project.source)) ||
    !Array.isArray(project.documents) ||
    project.documents.length > 500 ||
    !Array.isArray(project.sections) ||
    project.sections.length > 100
  )
    throw new Error('Invalid project');
  const seen = new Set<string>();
  const documents = project.documents.map((v): ViewerDocument => {
    const doc = object(v),
      position = object(doc.position),
      id = string(doc.id, 300);
    if (
      seen.has(id) ||
      !['idea', 'document', 'image', 'html'].includes(String(doc.kind)) ||
      !['cream', 'green', 'blue', 'rose', 'purple', 'gray'].includes(
        String(doc.color),
      )
    )
      throw new Error('Invalid document');
    seen.add(id);
    const image =
      doc.image === undefined ? undefined : string(doc.image, 4_000_000);
    if (
      image &&
      !/^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/=]+$/.test(image)
    )
      throw new Error('Invalid image');
    return {
      id,
      title: string(doc.title, 300),
      kind: doc.kind as ViewerDocument['kind'],
      color: doc.color as ViewerDocument['color'],
      section: string(doc.section, 300),
      summary: string(doc.summary, 500),
      body: string(doc.body, 2_000_000),
      position: { x: number(position.x), y: number(position.y) },
      width: number(doc.width),
      height: number(doc.height),
      ...(doc.onCanvas === false ? { onCanvas: false } : {}),
      ...(image ? { image } : {}),
      ...(doc.html !== undefined ? { html: string(doc.html, 4_000_000) } : {}),
    };
  });
  return {
    schemaVersion: 1,
    id: String(project.id),
    name: string(project.name, 300),
    description: string(project.description, 1000),
    source: project.source as ViewerProject['source'],
    revision: number(project.revision, Number.MAX_SAFE_INTEGER),
    readOnly: true,
    publishedAt: Date.now(),
    modifiedAt: number(project.modifiedAt, 9e15),
    ...(project.folder ? { folder: string(project.folder, 100) } : {}),
    documents,
    sections: project.sections.map((v) => {
      const section = object(v);
      return {
        id: string(section.id, 300),
        title: string(section.title, 300),
        x: number(section.x),
        y: number(section.y),
        width: number(section.width),
        height: number(section.height),
      };
    }),
  };
}

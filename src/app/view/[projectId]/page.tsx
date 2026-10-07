import { ProjectViewer } from '@/components/project-viewer';
import { RemoteProject } from '@/components/remote-project';
import { demoProject } from '@/lib/demo';
export const metadata = { title: '프로젝트 보기 · Game Jam!' };
export default async function ViewProject({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return projectId === 'demo' ? (
    <ProjectViewer project={demoProject} />
  ) : (
    <RemoteProject projectId={projectId} />
  );
}

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Brand } from './brand';
import { ProjectViewer } from './project-viewer';
import type { ViewerProject } from '@/lib/project';
export function RemoteProject({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<ViewerProject | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const load = async () => {
      if (document.hidden) return;
      try {
        const response = await fetch(
          `/api/view/${encodeURIComponent(projectId)}`,
          { cache: 'no-store', signal: controller.signal },
        );
        const data = await response.json();
        if (!response.ok) {
          if (response.status === 401 && active) setProject(null);
          throw new Error(
            data.error?.message ?? '프로젝트를 불러오지 못했습니다.',
          );
        }
        if (active) {
          setProject(data);
          setError('');
        }
      } catch (error) {
        if (active)
          setError(
            error instanceof Error ? error.message : '연결하지 못했습니다.',
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    const timer = setInterval(() => void load(), 15_000);
    const visibility = () => {
      if (!document.hidden) void load();
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      active = false;
      controller.abort();
      clearInterval(timer);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [projectId, retry]);
  if (project)
    return (
      <>
        <ProjectViewer project={project} />
        {error && (
          <p className="connection-warning" role="status">
            {error} 마지막으로 불러온 내용을 표시하고 있습니다.
          </p>
        )}
      </>
    );
  return (
    <div className="home-shell">
      <header className="site-header">
        <Brand />
      </header>
      <main id="main" className="unavailable-page">
        <h1>
          {loading ? '프로젝트를 불러오는 중…' : '프로젝트를 열 수 없어요.'}
        </h1>
        <p role="alert">{error}</p>
        <div className="library-actions">
          <Link href="/" className="button button-primary">
            프로젝트 목록으로
          </Link>
          {!loading && (
            <button
              className="button"
              onClick={() => {
                setLoading(true);
                setRetry(retry + 1);
              }}
            >
              다시 시도
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

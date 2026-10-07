import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Link2Off } from 'lucide-react';
import { Brand } from '@/components/brand';
import { ProjectViewer } from '@/components/project-viewer';
import { demoProject } from '@/lib/demo';

type Props = { params: Promise<{ projectId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params;
  return {
    title:
      projectId === 'demo' ? '밤의 정원 · 공개 예제' : '프로젝트 연결 준비 중',
  };
}

export default async function ViewProject({ params }: Props) {
  const { projectId } = await params;
  if (projectId === 'demo') return <ProjectViewer project={demoProject} />;

  return (
    <div className="home-shell">
      <header className="site-header">
        <Brand />
      </header>
      <main id="main" className="unavailable-page">
        <div className="unavailable-symbol">
          <Link2Off size={32} />
        </div>
        <p className="section-kicker">PROJECT CONNECTION</p>
        <h1>프로젝트 연결을 준비 중이에요.</h1>
        <p>
          아직 실제 프로젝트를 가져오는 기능이 연결되지 않았습니다.
          <br />
          지금은 공개 예제에서 웹 뷰어를 살펴볼 수 있어요.
        </p>
        <Link href="/view/demo" className="button button-primary">
          공개 예제 열기
        </Link>
        <Link href="/" className="back-link">
          <ArrowLeft size={16} /> 홈으로 돌아가기
        </Link>
      </main>
    </div>
  );
}

'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  FolderOpen,
  HardDrive,
  Users,
  Search,
  RefreshCw,
  LockKeyhole,
  Globe2,
  LogOut,
  FileText,
} from 'lucide-react';
import { Brand } from './brand';
import type { ProjectSummary } from '@/lib/project';

export const sourceNames = {
  demo: '공개 예제',
  shared: '공동 프로젝트',
  published: '로컬 게시본',
  'local-live': '로컬 자동 갱신',
};
export function ProjectHome() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [connected, setConnected] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [folder, setFolder] = useState('');
  const refresh = useCallback(async () => {
    try {
      const session = await fetch('/api/session', { cache: 'no-store' }).then(
        (response) => response.json(),
      );
      setConfigured(session.configured);
      setConnected(session.authenticated);
      if (session.authenticated) {
        const response = await fetch('/api/projects', { cache: 'no-store' });
        const data = await response.json();
        if (response.status === 401) {
          setConnected(false);
          setProjects([]);
          return;
        }
        if (!response.ok)
          throw new Error(data.error?.message ?? '목록을 불러오지 못했습니다.');
        setProjects(data.projects);
        setError('');
      } else setProjects([]);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : '서버에 연결하지 못했습니다.',
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const launchCode = fragment.get('connect');
    if (launchCode) {
      window.history.replaceState(null, '', window.location.pathname);
      void fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: launchCode }),
      })
        .then(async (response) => {
          if (!response.ok)
            throw new Error('연결 코드가 만료되었거나 올바르지 않습니다.');
          await refresh();
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
      return;
    }
    // Initial fetch: refresh sets state only after the remote session response.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);
  async function connect(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error?.message ?? '연결하지 못했습니다.');
      setCode('');
      await refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : '연결하지 못했습니다.');
    } finally {
      setBusy(false);
    }
  }
  const visible = projects.filter(
    (project) =>
      (!folder || project.folder === folder) &&
      (filter === 'all' ||
        (filter === 'shared'
          ? project.source === 'shared'
          : project.source !== 'shared')) &&
      `${project.name} ${project.description}`
        .toLocaleLowerCase('ko')
        .includes(query.trim().toLocaleLowerCase('ko')),
  );
  const folders = [
    ...new Set(projects.map((project) => project.folder).filter(Boolean)),
  ];
  return (
    <div className="library-shell">
      <header className="viewer-header">
        <Brand />
        <span className="readonly-badge">
          <LockKeyhole size={13} /> 읽기 전용
        </span>
      </header>
      <div className="library-layout">
        <aside className="library-sidebar" aria-label="프로젝트 분류">
          <p className="section-kicker">내 프로젝트</p>
          {[
            { id: 'all', name: '전체 프로젝트', icon: FolderOpen },
            { id: 'local', name: '로컬 프로젝트', icon: HardDrive },
            { id: 'shared', name: '공동 프로젝트', icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              aria-pressed={filter === item.id && !folder}
              onClick={() => {
                setFilter(item.id);
                setFolder('');
              }}
            >
              <item.icon size={18} />
              {item.name}
              <span>
                {
                  projects.filter(
                    (project) =>
                      item.id === 'all' ||
                      (item.id === 'shared'
                        ? project.source === 'shared'
                        : project.source !== 'shared'),
                  ).length
                }
              </span>
            </button>
          ))}
          {!!folders.length && (
            <p className="section-kicker library-folder-heading">폴더</p>
          )}
          {folders.map((name) => (
            <button
              key={name}
              aria-pressed={folder === name}
              onClick={() => {
                setFolder(name!);
                setFilter('all');
              }}
            >
              <FolderOpen size={18} />
              {name}
            </button>
          ))}
          <div className="library-sidebar-bottom">
            <Globe2 size={20} />
            <strong>어디서든 프로젝트 보기</strong>
            <p>
              프로젝트 내용과 배치는
              <br />
              PC 앱에서 관리하세요.
            </p>
            <Link href="/view/demo">
              공개 예제 둘러보기 <ArrowRight size={14} />
            </Link>
          </div>
        </aside>
        <main id="main" className="library-main">
          <div className="library-heading">
            <div>
              <p className="section-kicker">GAME JAM! WEB VIEWER</p>
              <h1>{folder || '프로젝트'}</h1>
              <p>프로젝트를 선택해 문서와 캔버스를 살펴보세요.</p>
            </div>
            <div className="library-actions">
              <button
                className="button"
                disabled={busy || loading}
                onClick={() => {
                  setBusy(true);
                  void refresh().finally(() => setBusy(false));
                }}
              >
                <RefreshCw size={16} /> 새로고침
              </button>
              {connected && (
                <button
                  className="icon-button"
                  aria-label="이 기기 연결 해제"
                  onClick={async () => {
                    await fetch('/api/session', { method: 'DELETE' });
                    setProjects([]);
                    setConnected(false);
                  }}
                >
                  <LogOut size={18} />
                </button>
              )}
            </div>
          </div>
          {error && (
            <p className="library-error" role="alert">
              {error}
            </p>
          )}
          {loading ? (
            <p className="canvas-loading" role="status">
              프로젝트 목록을 불러오는 중…
            </p>
          ) : !connected ? (
            <section className="connect-card">
              <div className="connect-icon">
                <LockKeyhole size={24} />
              </div>
              <h2>내 프로젝트 연결</h2>
              <p>
                PC의 Game Jam! 홈에서 <strong>웹 뷰어</strong>를 열고
                <br />
                연결 코드를 복사해 입력하세요.
              </p>
              <form onSubmit={connect}>
                <label htmlFor="connection-code">연결 코드</label>
                <input
                  id="connection-code"
                  type="password"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  autoComplete="off"
                  placeholder="PC 앱에서 복사한 코드"
                  required
                  maxLength={100}
                />
                <button
                  className="button button-primary"
                  disabled={busy || !configured}
                >
                  {busy ? '연결 중…' : '프로젝트 연결'} <ArrowRight size={17} />
                </button>
              </form>
              {!configured && (
                <p className="library-error">
                  웹 뷰어 연결 설정을 준비하고 있습니다.
                </p>
              )}
              <small>
                이 기기는 30일 동안 연결됩니다. 연결 코드를 가진 사람은 게시된
                프로젝트를 볼 수 있습니다.
              </small>
            </section>
          ) : (
            <>
              <div className="library-toolbar">
                <label className="search-box">
                  <Search size={17} />
                  <input
                    type="search"
                    aria-label="프로젝트 검색"
                    placeholder="프로젝트 검색"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </label>
                <span>{visible.length}개 프로젝트</span>
              </div>
              <div className="project-grid">
                {visible.map((project, index) => (
                  <Link
                    key={project.id}
                    href={`/view/${project.id}`}
                    className="library-project-card"
                  >
                    <div className={`project-card-art art-${index % 4}`}>
                      <div className="art-paper">
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className="art-small-paper">
                        <FileText size={28} />
                      </div>
                      <span className="project-source">
                        {project.source === 'shared' ? (
                          <Users size={13} />
                        ) : (
                          <HardDrive size={13} />
                        )}
                        {sourceNames[project.source]}
                      </span>
                    </div>
                    <div className="project-card-body">
                      <h2>{project.name}</h2>
                      <p>
                        {project.description ||
                          '프로젝트의 문서와 아이디어를 살펴보세요.'}
                      </p>
                      <div className="project-card-meta">
                        <span>
                          <FileText size={14} /> {project.documentCount}개 문서
                        </span>
                        <span>{project.sectionCount}개 섹션</span>
                        <ArrowRight size={18} />
                      </div>
                      <small>
                        게시{' '}
                        {project.publishedAt
                          ? new Date(project.publishedAt).toLocaleString(
                              'ko-KR',
                              {
                                timeZone: 'Asia/Seoul',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              },
                            )
                          : '—'}
                      </small>
                    </div>
                  </Link>
                ))}
              </div>
              {!visible.length && (
                <div className="library-empty">
                  <FolderOpen size={32} />
                  <h2>
                    {projects.length
                      ? '검색 결과가 없어요.'
                      : '아직 게시된 프로젝트가 없어요.'}
                  </h2>
                  <p>
                    {projects.length
                      ? '검색어나 분류를 바꿔보세요.'
                      : 'PC 앱의 웹 뷰어에서 프로젝트를 선택해 게시해주세요.'}
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

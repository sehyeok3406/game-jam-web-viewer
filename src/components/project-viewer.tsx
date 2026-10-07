'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  LayoutGrid,
  List,
  LockKeyhole,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { Brand } from './brand';
import type { ViewerDocument, ViewerProject } from '@/lib/project';
import { sourceNames } from './project-home';

const ProjectCanvas = dynamic(() => import('./project-canvas'), {
  ssr: false,
  loading: () => (
    <div className="canvas-loading" role="status">
      캔버스를 불러오는 중…
    </div>
  ),
});

function DocumentContent({ document }: { document: ViewerDocument }) {
  return (
    <>
      <div className="document-eyebrow">
        <span className={`kind-icon color-${document.color}`}>
          {document.kind === 'idea' ? (
            <Sparkles size={16} />
          ) : (
            <FileText size={16} />
          )}
        </span>
        {document.section}
        <span>·</span>
        {document.kind === 'idea' ? '아이디어' : '기획 문서'}
      </div>
      <h2>{document.title}</h2>
      <p className="document-summary">{document.summary}</p>
      {document.image && (
        <Image
          unoptimized
          className="viewer-image"
          src={document.image}
          width={1200}
          height={900}
          alt={document.title}
        />
      )}
      {document.html && (
        <iframe
          className="viewer-html"
          title={`${document.title} 미리보기`}
          sandbox="allow-scripts"
          referrerPolicy="no-referrer"
          srcDoc={`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; media-src data: blob:; font-src data:; connect-src 'none'; form-action 'none'; base-uri 'none';">${document.html}`}
        />
      )}
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            input: ({ checked }) => (
              <input
                type="checkbox"
                checked={!!checked}
                disabled
                aria-label={checked ? '완료된 항목' : '미완료 항목'}
              />
            ),
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
            img: ({ alt }) => (
              <span className="embedded-image-note">
                {alt ? `이미지: ${alt}` : '외부 이미지'} (원본 앱에서 보기)
              </span>
            ),
          }}
        >
          {document.body}
        </ReactMarkdown>
      </div>
    </>
  );
}

function DocumentDialog({
  document,
  onClose,
}: {
  document: ViewerDocument | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !document) return;
    dialog.showModal();
    return () => dialog.close();
  }, [document]);

  return (
    <dialog
      ref={ref}
      className="document-dialog"
      aria-label={document?.title ?? '문서 상세'}
      onCancel={onClose}
      onClose={onClose}
    >
      <div className="dialog-toolbar">
        <span>
          <LockKeyhole size={13} /> 읽기 전용
        </span>
        <button
          className="icon-button"
          aria-label="문서 닫기"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      {document && (
        <article className="reader-article">
          <DocumentContent document={document} />
        </article>
      )}
    </dialog>
  );
}

export function ProjectViewer({ project }: { project: ViewerProject }) {
  const [mode, setMode] = useState<'list' | 'canvas'>('list');
  const [query, setQuery] = useState('');
  const [section, setSection] = useState('전체');
  const [selectedId, setSelectedId] = useState(project.documents[0]?.id);
  const [modalDocument, setModalDocument] = useState<ViewerDocument | null>(
    null,
  );
  const sections = [
    ...new Set(project.documents.map((document) => document.section)),
  ];
  const normalized = query.toLocaleLowerCase('ko').trim();
  const filtered = project.documents.filter(
    (document) =>
      (section === '전체' || document.section === section) &&
      (!normalized ||
        `${document.title} ${document.summary} ${document.body}`
          .toLocaleLowerCase('ko')
          .includes(normalized)),
  );
  const selected =
    project.documents.find((document) => document.id === selectedId) ??
    project.documents[0];
  const selectedIndex = project.documents.findIndex(
    (document) => document.id === selected?.id,
  );

  return (
    <div className="viewer-shell">
      <header className="viewer-header">
        <Brand />
        <span className="readonly-badge">
          <LockKeyhole size={13} /> 읽기 전용
        </span>
      </header>
      <main id="main">
        <div className="project-header">
          <div>
            <Link href="/" className="project-back">
              <ArrowLeft size={14} /> 프로젝트 목록
            </Link>
            <div className="project-title-row">
              <h1>{project.name}</h1>
              <span className="sample-label">
                {sourceNames[project.source]}
              </span>
            </div>
            <p>{project.description}</p>
          </div>
          <div className="view-switch" role="group" aria-label="보기 방식">
            <button
              aria-pressed={mode === 'list'}
              className={mode === 'list' ? 'is-active' : ''}
              onClick={() => setMode('list')}
            >
              <List size={16} /> 문서 보기
            </button>
            <button
              aria-pressed={mode === 'canvas'}
              className={mode === 'canvas' ? 'is-active' : ''}
              onClick={() => setMode('canvas')}
            >
              <LayoutGrid size={16} /> 캔버스
            </button>
          </div>
        </div>
        <div className="demo-notice">
          <span className="status-dot" />
          <span>
            {project.source === 'demo'
              ? '웹 뷰어 체험용 공개 예제입니다.'
              : `게시 ${new Date(project.publishedAt ?? 0).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} · ${project.source === 'published' ? 'PC 앱에서 다시 게시하면 갱신됩니다.' : '연결 프로그램이 실행 중이면 저장 내용을 자동 갱신합니다.'}`}
          </span>
        </div>
        <div className="viewer-workspace">
          <aside className="document-sidebar" aria-label="프로젝트 문서">
            <label className="search-box">
              <Search size={17} />
              <input
                aria-label="문서 검색"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="문서 검색"
                autoComplete="off"
              />
            </label>
            <div
              className="section-filters"
              role="group"
              aria-label="섹션 필터"
            >
              {['전체', ...sections].map((item) => (
                <button
                  key={item}
                  aria-pressed={section === item}
                  onClick={() => setSection(item)}
                  className={section === item ? 'is-active' : ''}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="sidebar-heading">
              <span>프로젝트 문서</span>
              <span aria-live="polite">{filtered.length}개</span>
            </div>
            <div className="document-list">
              {filtered.map((document) => (
                <button
                  key={document.id}
                  className={`document-list-item ${selectedId === document.id && mode === 'list' ? 'is-selected' : ''}`}
                  aria-current={
                    selectedId === document.id && mode === 'list'
                      ? 'true'
                      : undefined
                  }
                  onClick={() => {
                    setSelectedId(document.id);
                    if (mode === 'canvas') setModalDocument(document);
                  }}
                >
                  <span className={`kind-icon color-${document.color}`}>
                    {document.kind === 'idea' ? (
                      <Sparkles size={17} />
                    ) : (
                      <FileText size={17} />
                    )}
                  </span>
                  <span>
                    <strong>{document.title}</strong>
                    <small>{document.section}</small>
                  </span>
                  <ArrowRight size={15} />
                </button>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="empty-search">
                <Search size={22} />
                <p>일치하는 문서가 없어요.</p>
                <button
                  onClick={() => {
                    setQuery('');
                    setSection('전체');
                  }}
                >
                  검색 초기화
                </button>
              </div>
            )}
            <div className="sidebar-footnote">
              <LockKeyhole size={13} />
              <p>
                자유롭게 살펴보세요.
                <br />
                원본 내용은 변경되지 않습니다.
              </p>
            </div>
          </aside>
          {mode === 'list' ? (
            <section className="document-reader" aria-label="선택한 문서">
              {selected ? (
                <>
                  <article className="reader-article">
                    <DocumentContent document={selected} />
                  </article>
                  <nav className="document-pagination" aria-label="문서 이동">
                    <button
                      disabled={selectedIndex <= 0}
                      onClick={() =>
                        setSelectedId(project.documents[selectedIndex - 1].id)
                      }
                    >
                      <ArrowLeft size={15} /> 이전 문서
                    </button>
                    <span>
                      {selectedIndex + 1} / {project.documents.length}
                    </span>
                    <button
                      disabled={selectedIndex >= project.documents.length - 1}
                      onClick={() =>
                        setSelectedId(project.documents[selectedIndex + 1].id)
                      }
                    >
                      다음 문서 <ArrowRight size={15} />
                    </button>
                  </nav>
                </>
              ) : (
                <p className="canvas-loading">읽을 문서를 선택하세요.</p>
              )}
            </section>
          ) : (
            <section className="canvas-region" aria-label="프로젝트 캔버스">
              <ProjectCanvas
                documents={filtered}
                sections={project.sections ?? []}
                onOpen={setModalDocument}
              />
              <div className="canvas-hint">
                드래그로 이동 · 확대/축소 · 카드를 눌러 문서 읽기
              </div>
            </section>
          )}
        </div>
      </main>
      <DocumentDialog
        document={
          project.documents.find(
            (document) => document.id === modalDocument?.id,
          ) ?? null
        }
        onClose={() => setModalDocument(null)}
      />
    </div>
  );
}

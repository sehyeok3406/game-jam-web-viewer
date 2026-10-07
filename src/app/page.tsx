import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  Check,
  FileText,
  Globe2,
  Leaf,
  LockKeyhole,
  Monitor,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { Brand } from '@/components/brand';

function PreviewBoard() {
  return (
    <div
      className="preview-window"
      aria-label="공개 예제 프로젝트 캔버스 미리보기"
    >
      <div className="preview-toolbar">
        <div className="window-dots">
          <i />
          <i />
          <i />
        </div>
        <span>밤의 정원</span>
        <span className="tiny-readonly">
          <LockKeyhole size={11} /> 읽기 전용
        </span>
      </div>
      <div className="preview-board">
        <div className="preview-section">
          <span>게임 아이디어</span>
        </div>
        <div className="preview-note note-seed">
          <span className="note-eyebrow">
            <Sparkles size={12} /> 아이디어
          </span>
          <h3>아이디어의 첫 씨앗</h3>
          <p>
            낮에는 정원을 가꾸고,
            <br />
            밤에는 작은 변화를 관찰한다.
          </p>
          <div className="note-rule" />
          <p className="note-quote">
            내가 만든 정원이
            <br />
            스스로 움직이는 즐거움.
          </p>
        </div>
        <div className="preview-note note-loop">
          <span className="note-eyebrow">
            <FileText size={12} /> 기획 문서
          </span>
          <h3>핵심 게임 루프</h3>
          <div className="mini-steps">
            <span>
              01 <b>씨앗 선택</b>
            </span>
            <span>
              02 <b>정원 가꾸기</b>
            </span>
            <span>
              03 <b>밤 관찰</b>
            </span>
          </div>
        </div>
        <div className="preview-note note-tools">
          <span className="note-eyebrow">
            <Leaf size={12} /> 메모
          </span>
          <h3>작은 장치들</h3>
          <p>
            <Check size={12} /> 물방울 시계
            <br />
            <Check size={12} /> 빛의 울타리
          </p>
        </div>
        <span className="preview-zoom">
          − <span>100%</span> ＋
        </span>
      </div>
      <div className="preview-footer">
        <span className="status-dot" /> 공개 예제 프로젝트 <span>문서 4개</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="home-shell">
      <header className="site-header">
        <Brand />
        <Link href="/view/demo" className="header-link">
          예제 둘러보기 <ArrowRight size={15} />
        </Link>
      </header>
      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span /> IDEAS GO EVERYWHERE
            </div>
            <h1>
              밖에서도,
              <br />
              아이디어는 <span>계속.</span>
            </h1>
            <p className="hero-description">
              휴대폰에서도, 다른 컴퓨터에서도.
              <br />
              게임 아이디어와 기획을 편하게 살펴보세요.
            </p>
            <Link href="/view/demo" className="button button-primary">
              웹 뷰어 미리보기 <ArrowRight size={18} />
            </Link>
            <p className="hero-caption">
              <LockKeyhole size={13} /> 설치 없이 열고, 읽기 전용으로 살펴보기
            </p>
          </div>
          <div className="hero-visual">
            <PreviewBoard />
            <span className="floating-label">
              <Smartphone size={17} /> 작은 화면에서도 편하게
            </span>
          </div>
        </section>

        <div className="feature-strip">
          <span>
            <Globe2 size={17} /> 링크 하나로 열기
          </span>
          <span>
            <Smartphone size={17} /> 모바일에 맞춘 읽기
          </span>
          <span>
            <LockKeyhole size={17} /> 프로젝트는 읽기 전용
          </span>
        </div>

        <section className="explore-section" aria-labelledby="explore-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">TAKE A LOOK</p>
              <h2 id="explore-title">어떻게 보이는지 살펴볼까요?</h2>
            </div>
            <span className="section-side-note">
              공개 예제로 먼저 만나보세요 <ArrowDown size={15} />
            </span>
          </div>
          <Link href="/view/demo" className="demo-project-card">
            <div className="garden-illustration" aria-hidden="true">
              <span className="garden-moon" />
              <div className="plant plant-one">
                <i />
                <i />
                <i />
              </div>
              <div className="plant plant-two">
                <i />
                <i />
                <i />
              </div>
              <div className="plant plant-three">
                <i />
                <i />
                <i />
              </div>
              <span className="garden-soil" />
              <span className="garden-spark spark-one">✦</span>
              <span className="garden-spark spark-two">✦</span>
            </div>
            <div className="demo-project-copy">
              <span className="sample-label">공개 예제</span>
              <h3>밤의 정원</h3>
              <p>
                낮에는 가꾸고, 밤에는 지키는 작은 정원.
                <br />
                아이디어부터 첫 플레이테스트 메모까지.
              </p>
              <span className="project-meta">
                <FileText size={14} /> 문서 4개 <i /> 섹션 2개
              </span>
            </div>
            <span className="project-open">
              프로젝트 열기 <ArrowRight size={20} />
            </span>
          </Link>
        </section>

        <section className="availability-note">
          <div className="availability-icon">
            <Monitor size={20} />
          </div>
          <div>
            <h2>내 프로젝트 연결은 준비 중이에요.</h2>
            <p>
              현재는 공개 예제를 볼 수 있습니다. 공유 프로젝트·로컬 게시본·로컬
              실시간 보기 연결은 다음 단계에서 추가됩니다.
            </p>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <span>
          gamejam!{' '}
          <span className="footer-caption">아이디어가 게임이 되는 곳.</span>
        </span>
        <span>WEB VIEWER · READ ONLY</span>
      </footer>
    </div>
  );
}

import Link from 'next/link';
import { Brand } from '@/components/brand';

export default function NotFound() {
  return (
    <div className="home-shell">
      <header className="site-header">
        <Brand />
      </header>
      <main id="main" className="unavailable-page">
        <p className="section-kicker">404</p>
        <h1>이 페이지를 찾을 수 없어요.</h1>
        <p>주소를 확인하거나 웹 뷰어 홈으로 돌아가세요.</p>
        <Link href="/" className="button button-primary">
          홈으로 돌아가기
        </Link>
      </main>
    </div>
  );
}

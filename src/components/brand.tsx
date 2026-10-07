import Link from 'next/link';

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Game Jam! 웹 뷰어 홈">
      <span className="brand-icon" aria-hidden="true">
        g<span>!</span>
      </span>
      <span className="brand-wordmark">
        gamejam<span>!</span>
      </span>
      <span className="brand-divider" />
      <span className="brand-caption">웹 뷰어</span>
    </Link>
  );
}

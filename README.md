# Game Jam! Web Viewer

https://game-jam-web-viewer.vercel.app

첫 화면에서 연결된 로컬·공동 프로젝트를 검색·분류하고 선택하면 해당 프로젝트의 문서·캔버스를 읽는다. PC의 Game Jam! 홈 **웹 뷰어**에서 게시하고 보기 코드를 복사한다. 외부 기기는 코드로 연결하며 30일 동안 HttpOnly/SameSite 쿠키를 사용한다. 공개 예제는 `/view/demo`에 별도로 유지한다. 인증하지 않은 요청에는 실제 목록·본문을 반환하지 않는다.

프로젝트는 Vercel **Private Blob**에 저장한다. 게시용 키와 보기 코드는 독립된 무작위 32바이트 키이다. 서버 환경에는 원문 대신 각각의 SHA-256 hex 해시를 저장한다. 읽기 세션은 게시를 허용하지 않으며, 게시 API는 데스크톱 키가 필요하다. DTO 허용 목록으로 협업 자격증명·절대 경로·AI 작업 파일을 제외한다. HTML 결과는 별도의 opaque-origin iframe에서 CSP와 sandbox로 외부 네트워크·상위 페이지 접근을 차단한다. 문서 외부 이미지는 자동으로 요청하지 않는다. 각 프로젝트 게시 요청은 4MB까지 지원하고 초과 시 실패한다.

공동 프로젝트와 로컬 자동 갱신은 이 PC의 연결 프로그램이 약 15초마다 저장 내용을 확인한다. 웹 뷰어도 활성 화면에서 15초마다 새 게시본을 조회한다. 변경이 없으면 다시 업로드하지 않는다. 로컬 수동 게시본은 PC 앱에서 다시 게시해야 갱신된다. PC나 서버가 꺼지면 마지막 게시본을 유지하며 게시 시각을 표시한다. 이 단계는 단일 소유자의 연결 코드로 전체 게시 프로젝트를 조회한다. 사용자별 계정·프로젝트별 공유 권한은 아직 제공하지 않는다.

## 실행 및 검증

Node.js 24, Next.js 16, React 19를 사용한다.

```sh
npm ci
npm run dev
npm run lint
npm run test:connection
npm run build
npm run typecheck
npm run start -- --hostname 127.0.0.1 --port 3080
npm run test:smoke -- http://127.0.0.1:3080
```

`test:connection`은 임시 개발 저장소와 합성 데이터를 사용해 게시→인증→프로젝트 목록→문서 조회·수정본 갱신, 자격증명 필터링, Origin·게시 권한·변경 요청 거부를 검증한다. 테스트용 파일 저장소는 production에서 사용할 수 없다. 실제 개인 문서나 키는 테스트·Git에 넣지 않는다.

## Vercel

Next.js 프리셋, 루트 `./`, `npm ci`, `npm run build`, Node.js 24.x, 기본 출력 설정. `main` 푸시 시 자동 배포한다. 프로젝트의 Storage에서 **Private Blob**을 연결하면 `BLOB_STORE_ID`가 추가되고 SDK가 Vercel OIDC로 인증한다. 키 해시 `VIEWER_READ_KEY_HASH`, `VIEWER_PUBLISH_KEY_HASH`는 서버 환경에만 설정한다. `.env.example`을 참고하고 `NEXT_PUBLIC_*`에는 비밀 값을 넣지 않는다. 보기 해시 교체 시 기존 코드와 모든 세션이 회수된다. 공유 코드가 유출되면 보기 코드와 해시를 함께 교체한다.

API: `GET /api/session`, `POST/DELETE /api/session`, 인증된 `GET /api/projects`, `GET /api/view/[id]`, 데스크톱 전용 `POST /api/publish`, `GET /api/health`. 공개 예제를 제외한 개인 데이터는 `private, no-store`로 응답한다. 읽기 API의 POST·PUT·PATCH·DELETE는 405로 거부한다.

데스크톱 연결 구현: [`game-jam-dev/tools/web-viewer`](https://github.com/sehyeok3406/game-jam-dev/tree/main/tools/web-viewer).

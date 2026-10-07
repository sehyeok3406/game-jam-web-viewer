# Game Jam! Web Viewer

Game Jam! 프로젝트를 모바일·다른 PC에서 읽는 웹 뷰어의 초기 배포입니다. Next.js App Router, React, TypeScript를 사용합니다.

## 현재 제공하는 기능

- 모바일·PC 홈 화면과 읽기 전용 공개 예제 `/view/demo`.
- 문서 본문·표·비활성 체크리스트, 문서 검색과 섹션 필터.
- 원본 배치를 바꾸지 않는 캔버스 이동·확대·축소와 문서 상세 보기.
- 상태 확인 `GET /api/health`, 공개 예제 조회 `GET /api/view/demo`.
- Vercel 배포 설정과 GitHub Actions 빌드·정적 검사·HTTP 검증.

**실제 프로젝트 연결은 아직 구현되지 않았습니다.** 공개 예제는 새로 작성한 합성 데이터이며 개인 문서·서버 토큰·사용자 프로젝트를 포함하지 않습니다. `demo` 이외의 API 조회는 `503 PROJECT_SOURCE_NOT_CONFIGURED`를 반환합니다. API는 GET만 구현하며 POST·PUT·PATCH·DELETE는 405로 거부합니다. 이것은 초기 배포의 동작이며 실제 프로젝트 인증 구현을 대신하지 않습니다.

## 로컬 실행

Node.js 24를 사용합니다. 초기 화면·예제에는 환경변수가 필요하지 않습니다.

```sh
npm ci
npm run dev
```

기본 주소는 `http://127.0.0.1:3000`입니다.

```sh
npm run lint
npm run build
npm run typecheck
npm run start -- --hostname 127.0.0.1 --port 3080
# 다른 터미널에서 실행
npm run test:smoke -- http://127.0.0.1:3080
```

## Vercel

| 설정                           | 값                                 |
| ------------------------------ | ---------------------------------- |
| Git repository                 | `sehyeok3406/game-jam-web-viewer`  |
| Production branch              | `main`                             |
| Framework / Application Preset | Next.js                            |
| Root Directory                 | `./`                               |
| Install Command                | `npm ci`                           |
| Build Command                  | `npm run build`                    |
| Output Directory               | Next.js 기본값; 수동 Override 없음 |
| Node.js                        | 24.x (`package.json`에서 지정)     |
| Environment Variables          | 초기 배포에는 없음                 |

`vercel.json`에도 Next.js 프레임워크·빌드 설정을 지정했습니다. 프로젝트는 `game-jam-web-viewer.vercel.app` 고정 주소를 사용합니다. Git 연결 후 `main`에 푸시하면 새 배포를 생성합니다. GitHub에는 코드와 합성 예제만 보관하며 사용자 프로젝트 데이터·비밀 값은 커밋하지 않습니다.

## 다음 구현

한 웹 뷰어에서 세 가지 데이터 소스를 지원할 예정입니다.

| 데이터 소스   | 웹에 보이는 내용                     | 실행 조건                       |
| ------------- | ------------------------------------ | ------------------------------- |
| 공동 프로젝트 | 협업 서버 최신 내용                  | 협업 서버와 외부 접속 경로 실행 |
| 로컬 게시본   | 마지막으로 외부 저장소에 게시한 내용 | 내 PC 종료 후에도 조회 가능     |
| 로컬 실시간   | PC에서 저장한 최신 내용              | PC·제공 프로그램·외부 연결 실행 |

보기 링크별 인증·만료·회수, 비공개 게시본 저장소·메타데이터 DB, 기존 데스크톱/협업 서버의 읽기 전용 API 또는 게시 연결을 추가해야 합니다. 링크가 없거나 인증이 실패했을 때 예제 데이터로 대체하지 않습니다. 실제 데이터 조회·파일 반환 경로에서 권한을 검사해야 합니다.

`src/lib/project.ts`는 표시용 데이터 계약의 시작점입니다. 로컬 절대 경로·AI 작업 지시 파일·관리자 자격증명은 포함하지 않습니다. 실제 저장소 연결 시 서버용 환경변수를 추가하고 `.env.example`과 이 문서를 함께 갱신합니다. 비밀 값은 `NEXT_PUBLIC_*`에 넣지 않습니다.

기존 Electron 앱과 협업 서버는 [`game-jam-dev`](https://github.com/sehyeok3406/game-jam-dev)에서 관리합니다. 이번 초기 배포는 기존 앱·운영 서버를 변경하지 않습니다.

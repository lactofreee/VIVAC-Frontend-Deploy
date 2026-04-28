# Backpakers (Curve)

국내 백패킹/미니멀 캠핑 유저를 위한 통합 장소 탐색 앱.
공공 API(GoCamping, 산림청, 국립공원) 데이터를 수집·정제하여 야영 가능 장소를 통합 제공한다.

## 핵심 원칙

- **데이터 드리븐**: 모든 의사결정과 기능 개발은 사용자 데이터 분석에 기반한다. Google Analytics 연동을 통해 유저 행동을 측정하고, 정량 데이터가 기획·우선순위·개선의 근거가 된다.
- **가치 기반 수익화**: intrusive 광고를 지양하고, 유저에게 실질적 가치를 제공하는 모델만 채택한다.

## 프로젝트 개요

- **코드네임**: Curve
- **타겟**: 20~30대 국내 BPL/UL 백패킹 및 미니멀 캠핑 이용자
- **핵심 가치**: "어디서 자도 되는가"에 대한 신뢰할 수 있는 정보 제공
- **프로젝트 관리**: Notion(기획), Linear(스프린트)
- **플랫폼 전략**: MVP는 PWA로 출시, 이후 React Native 네이티브 앱을 모노레포 내에서 확장

### 핵심 타겟 이용자

20~30대 미니멀/백패킹 캠퍼가 핵심 타겟이다. 기존 오토캠핑에서 더 가볍고 도전적인 캠핑으로 전환한 중급 이상의 경험자이며, 차박·혼캠·감성 캠핑과 백패킹을 넘나드는 하이브리드 행동 패턴을 보인다.

**페르소나 A — "전환기 캠퍼" (핵심 타겟)**
- 20대 후반~30대 초반, 오토캠핑 1~2년 경험 후 백패킹 입문
- 연 5~6회 캠핑, 1회당 약 46.5만 원 지출, 연간 장비 구입비 약 137만 원
- 계절별 장비 구성이 달라지는 고관여 소비자. 구매 전 커뮤니티 후기·리뷰 영상 필수 탐색
- 페인 포인트: 박지 정보 접근 어려움, 야영 허가/금지 불확실, 오프라인 정보 부재
- 핵심 동기: 짐을 직접 운반해 의식주를 해결하는 성취감, 장비 창의적 활용의 희열

**페르소나 B — "라이프스타일 하이브리드"**
- 20대 중반~30대, 차박·혼캠에서 짧은 도보 백패킹(차박+1박 하이킹)으로 확장
- SNS 유입, 사진·뷰 중심 장소 선택. 접근성과 편의성 우선
- 핵심 동기: 일상 탈출, SNS 공유용 경험, 미니멀 라이프스타일 표현

## 기술 스택

### 프론트엔드 (확정)
- Next.js (App Router), TypeScript (strict mode)
- TanStack Query, Zustand, Axios, Zod, React Hook Form
- Tailwind CSS
- MSW (백엔드 준비 전 API 모킹)
- ESLint (린팅), Turborepo + pnpm (모노레포)
- 향후 React Native 추가 예정 (모노레포 내 `apps/mobile`)

### 백엔드 (미확정)
> **주의**: 백엔드 기술 스택은 BE 엔지니어와의 협의를 통해 확정 예정.
> 확정 전까지 아래 내용을 구현 판단의 근거로 사용하지 않는다.
- DB: PostgreSQL (검토 중)
- 데이터 수집: ETL 파이프라인 방식 (검토 중)

## 데이터 아키텍처

> **주의**: BE 엔지니어와의 협의를 통해 수정·확정할 사안.
> 확정 전까지 구현 판단의 근거로 사용하지 않는다.

검토 중인 방향: 공공 API → ETL 어댑터 → 통합 스키마 → 내부 DB. raw_data JSONB + source 필드 + 어댑터 패턴.

## 코드 컨벤션

### 모노레포 패키지 구조
플랫폼 무관 코드를 `packages/`로 분리하여, 향후 RN 앱 추가 시 비즈니스 로직을 재사용한다.

```
root/
├── apps/
│   ├── web/                  # Next.js PWA (MVP)
│   │   └── app/              # App Router — 라우팅 껍데기만 담당
│   └── mobile/               # React Native (향후)
├── packages/
│   ├── shared/               # 플랫폼 무관 유틸, 상수, 타입
│   │   ├── types/            # 도메인 타입 + Zod 스키마
│   │   ├── utils/
│   │   └── constants/
│   ├── api/                  # API 클라이언트, TanStack Query 훅
│   │   ├── client/           # Axios 인스턴스, 인터셉터
│   │   ├── queries/          # 쿼리 키 팩토리 + 훅
│   │   └── mocks/            # MSW 핸들러
│   └── store/                # Zustand 스토어
└── tooling/
    ├── eslint-config/        # 공유 ESLint 설정
    └── tsconfig/             # 공유 TS 설정
```

### Web 앱 전용 설정 (commands, feature 구조, App Router 주의사항)

@../Curve_Repo/CLAUDE.md

### TypeScript
- `strict: true` 필수. `any` 사용 금지 (`unknown` + 타입 가드로 대체)
- API 응답은 반드시 Zod 스키마로 런타임 검증 후 타입 추론 (`z.infer<typeof schema>`)
- `as` 타입 단언 지양. 불가피한 경우 사유 주석 필수
- 유틸리티 타입(`Pick`, `Omit`, `Partial` 등) 적극 활용하여 타입 중복 방지
- `packages/shared/types/`에 도메인 타입을 정의하고 앱에서 import

### ESLint
- `@typescript-eslint/strict-type-checked` 프리셋 기반
- `no-explicit-any: error`, `no-unused-vars: error`
- import 순서 강제 (`eslint-plugin-import`): 외부 → `@backpakers/` → `@/features` → 상대경로
- `packages/` 간 순환 의존 금지

### 네이밍
- 컴포넌트: `PascalCase.tsx` (예: `SpotCard.tsx`)
- 훅: `useCamelCase.ts` (예: `useSpotList.ts`)
- 유틸/상수: `camelCase.ts` (예: `formatDistance.ts`)
- 타입/인터페이스: `PascalCase` (예: `Spot`, `SpotFilter`)
- Zod 스키마: `camelCaseSchema` (예: `spotSchema`, `spotFilterSchema`)
- 파일명과 export명 일치 원칙

### 커밋
- Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
- Linear 이슈 연결: `feat(spots): 장소 목록 페이지 구현 [CUR-12]`
- 스코프는 feature 또는 package명 사용
- 커밋 메시지는 반드시 한글로 작성

### import 규칙
- 절대경로 alias: `@backpakers/shared`, `@backpakers/api`, `@backpakers/store`
- 앱 내부: `@/features/`, `@/app/`
- 순서: 외부 라이브러리 → `@backpakers/*` → `@/features/*` → 상대경로
- barrel export(`index.ts`)는 package 루트에서만 사용. feature 내부에서는 직접 경로 import

### 컴포넌트
- 함수 선언문 사용: `export function SpotCard() {}` (arrow function export 지양)
- Props는 컴포넌트 파일 내 `interface`로 정의 (예: `interface SpotCardProps`)
- 플랫폼 의존 컴포넌트(DOM/RN)는 `apps/` 내부에만 위치
- `packages/`에는 플랫폼 무관 로직만 포함 (UI 컴포넌트 금지)

## MVP Phase 1 개발 계획

목표 기한: ~2026-05-08

### MVP 핵심 요건
- 사용자는 오프라인 환경에서도 캠핑 가능 장소를 확인할 수 있다.
- 사용자는 캠핑 스팟의 야영 및 취사 가능 법적 여부를 확인할 수 있다.

### P1-1. 캠핑 가능 장소 탐색 (In Progress → ~05/03)
Phase 1 최우선 작업. 공공 API 데이터를 통합해 장소 탐색 기능 구현.

의존성 흐름:
```
M1 스키마 설계 → P1-1-A ETL 파이프라인
               → M3 BE API 엔드포인트
                    → P1-1-B 장소 탐색 UI ← P1-1-A
                         → M5 장소 상세 페이지
```

| 항목 | 선행 조건 | 담당 |
|---|---|---|
| M1. 통합 스키마 설계 및 DB 구축 | 없음 | 최진혁 |
| P1-1-A. ETL 파이프라인 및 데이터 수집 | M1 | 최진혁 |
| M3. BE API — 장소 탐색 엔드포인트 | M1 | 최진혁 |
| P1-1-B. 장소 탐색 UI (목록 + 지도) | M3 + P1-1-A | Minhyeok |
| M5. 장소 상세 페이지 | M3 + P1-1-B | Minhyeok |

### P1-2. PWA 오프라인 모드 (Planned → ~05/07)
선행: P1-1. Service Worker 기반 PWA 구현, 장소 데이터 오프라인 캐싱.

### P1-3. 소셜 로그인 (In Progress → ~04/27)
선행: P1-1. 카카오/Google OAuth, 세션/토큰 관리, 비로그인 접근 제어.

### P1-4. 랜딩페이지 + GA 연동 (Planned → ~05/07)
선행: P1-2 + P1-3. CBT 유저 모집 랜딩페이지, Google Analytics 연동 필수.

### Phase 1 완료 조건
- [ ] 공공 API 3종 데이터 통합 탐색 가능
- [ ] 오프라인 환경에서 장소 데이터 확인 가능
- [ ] 야영/취사 가능 법적 여부 확인 가능
- [ ] 소셜 로그인을 통한 유저 식별 가능
- [ ] CBT 유저 모집용 랜딩페이지 배포
- [ ] Google Analytics 연동 및 핵심 이벤트 트래킹 동작 확인

## 핵심 페인 포인트 (기획 근거)

1. **박지 정보의 폐쇄성** — 동호회 중심 폐쇄 공유 구조로 입문자 진입장벽이 높음. BM 관점에서는 이 폐쇄성이 가치 창출 기회 (→ 폐쇄형 커뮤니티)
2. **야영 허가/금지 불확실성** — 법적 여부 불명확, 규제 변동 잦음
3. **장비 선택 복잡성** — 계절/체력/코스별 장비 조합 판단 어려움
4. **현장 실시간 정보 부재** — 무통신 환경에서 정보 접근 불가
5. **환경 규범/매너 정보 부족** — LNT 문화 전파 채널 부재

## 향후 로드맵

### 폐쇄형 박지 커뮤니티
기존 동호회 이용자들이 박지 정보를 디지털로 아카이빙하고, 원하는 범위 내에서만 공유하는 기능. "나만 보기 / 그룹 내 공유 / 전체 공개" 3단계 공개 범위. 동호회·소모임 단위 비공개 그룹 생성, 그룹 내 박지 컬렉션 공동 관리, 방문 기록 타임라인, 멤버 간 코스 추천. 폐쇄적 공유 관행을 존중하면서 디지털 편의성으로 자연스러운 플랫폼 유입 유도.

### 크라우드소싱 박지 DB
GPS 좌표·사진·평탄도·수원 거리 등 구조화된 등록 폼. GPS 체크인 인증 + 후기 교차검증 기반 신뢰도 스코어.

### 규제 정보 레이어
야영 가능/금지 구역 지도 오버레이, 규제 변동 푸시 알림, 커뮤니티 기반 현장 리포트.

### 오프라인 필드 도구 고도화
등고선 지도 & GPX 트랙 다운로드, 산악 기상 캐싱, 긴급 SOS & 위치 공유.

### 맞춤형 장비 어시스턴트
조건 기반 패킹 리스트 자동 생성, 장비 비교 DB, BPL 무게 계산기.

### React Native 네이티브 앱
디자인 확정 후 `apps/mobile` 추가. `packages/` 공유 로직 재사용으로 빠른 개발.

## 수익 모델

프리미엄 구독(Backpakers Pro), 브랜드 네이티브 스폰서십, C2C 중고장터, 제휴 수수료, B2B 데이터 라이선싱.

## 공공 API 소스

GoCamping(한국관광공사), 산림청(휴양림/야영장), 국립공원(국립공원공단).

## 경쟁 서비스

고캠핑, 캠핏, 올트레일, 오늘등산, 야영.
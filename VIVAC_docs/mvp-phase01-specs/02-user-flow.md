# 📄 VIVAC MVP Phase-1 User Flow (v0.2)

## 1. 문서 메타정보

| 항목 | 내용 |
|---|---|
| 문서명 | VIVAC MVP Phase-1 User Flow |
| 버전 | v0.2 (Draft) |
| 작성일 | 2026-04-29 |
| 주요 대상 | 디자이너, 프론트엔드 개발자, 백엔드 개발자 |
| 상태 | 검토중 |

---

## 2. 사용자 상태 정의

플로우를 정확히 이해하기 위해, 사용자가 가질 수 있는 4가지 상태를 먼저 정의합니다.

| 상태 코드 | 상태명 | 정의 | Tier |
|---|---|---|---|
| **S0** | 익명 (Anonymous) | 로그인하지 않은 사용자 | Free |
| **S1** | 로그인 완료 / 온보딩 미완료 | 구글 로그인은 했으나 온보딩 설문 미완료 | 제한 (강제 온보딩) |
| **S2** | 온보딩 진행 중 | 온보딩 일부 단계만 완료 (이탈 후 재진입) | 제한 (이어서 진행) |
| **S3** | 온보딩 완료 (Member) | 가입+온보딩 모두 완료 | Member |

### 상태 판별 기준 (백엔드 응답 기반)
```
GET /api/v1/users/me 응답 예시:
- 응답 401 → S0 (익명)
- onboarding_completed_at == null && completed_steps == 0 → S1
- onboarding_completed_at == null && completed_steps > 0 → S2
- onboarding_completed_at != null → S3
```

---

## 3. 전체 플로우 다이어그램 (텍스트 버전)

```
┌─────────────────────────────────────────────────────────┐
│                  [최초 진입]                             │
│  - URL 직접 입력 / 검색 유입 / 외부 링크 / 광고          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  사용자 상태 판별      │
              │  (auth + onboarding)  │
              └───────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
       S0                S1/S2              S3
       익명          로그인됨/온보딩미완료    Member
        │                 │                 │
        ▼                 ▼                 ▼
  [랜딩 or 홈]      [온보딩으로 강제이동]   [홈/요청페이지]
   탐색 가능          (S2는 이어서)          전체 기능
        │                                     │
        │ (락 클릭)                            │
        ▼                                     │
  [락 모달]                                    │
   "가입하고 확인하기"                          │
        │                                     │
        ▼                                     │
  [구글 로그인]                                 │
        │                                     │
        ▼                                     │
  [온보딩 5단계]                                │
        │                                     │
        ▼                                     │
  [리워드 모먼트]                               │
        │                                     │
        └─────────────────┬───────────────────┘
                          ▼
                  [redirect 처리]
                  - redirect 파라미터 있음 → 해당 페이지
                  - 없음 → 홈
```

---

## 4. 플로우별 상세 정의

### 4.1 플로우 A: 신규 사용자 첫 방문 (S0 → S3)

가장 일반적인 가입 시나리오입니다.

```
[1] 외부 유입 (광고/SNS/검색)
    │
    ▼
[2] 랜딩 페이지 (/)
    - 서비스 소개
    - 가치 제안 (장소 N,000개, 맞춤 추천 등)
    - 미리보기 스크린샷
    - CTA 버튼: "지금 시작하기"
    │
    ├─── (CTA 미클릭) → [3a] 홈으로 둘러보기 (Soft Wall)
    │
    └─── (CTA 클릭) → [4] 구글 로그인
                          │
                          ▼
                      [5] 온보딩 Step 1~5
                          │
                          ▼
                      [6] 리워드 모먼트
                          │
                          ▼
                      [7] 홈 화면 (S3 상태)
```

#### 각 단계별 동작

| 단계 | URL | 비로그인 접근 | 동작 |
|---|---|---|---|
| 랜딩 | `/` | ✅ | 첫 방문자에게 노출. 재방문자(S3)는 자동으로 홈으로 |
| 로그인 | `/login` | ✅ | 구글 OAuth 호출 |
| OAuth 콜백 | `/auth/callback` | - | 토큰 교환, 사용자 상태 판별 |
| 온보딩 | `/onboarding/[step]` | ❌ | S1/S2만 접근 가능, S0는 로그인으로 redirect |
| 리워드 | `/onboarding/complete` | ❌ | S2 → S3 전환 직후 1회 노출 |
| 홈 | `/home` | ✅ | S0~S3 모두 접근, 상태별 UI 차이 |

---

### 4.2 플로우 B: 익명 탐색 후 락 트리거 (S0 → S3)

Soft Wall + Value Lock 정책의 핵심 시나리오입니다.

```
[1] 랜딩 → "둘러보기" 또는 직접 홈 진입
    │
    ▼
[2] 홈 화면 (/home, S0)
    - 검색, 카테고리, 큐레이션 모두 사용 가능
    │
    ▼
[3] 검색 또는 카테고리 클릭
    │
    ▼
[4] 검색 결과 (/search?q=...&category=...)
    - 카드 리스트 노출
    │
    ▼
[5] 카드 클릭 → 상세페이지 (/places/[id])
    - Tier 1 정보: 정상 노출
    - Tier 2 정보: 🔒 블러 처리
    - 예약/외부 링크 CTA: 🔒 락 아이콘
    │
    ├─── (Tier 1만 보고 이탈) → [6a] 세션 종료
    │                              (재방문 시 동일 플로우)
    │
    └─── (Tier 2 또는 CTA 클릭) → [7] 락 모달 노출
                                      │
                                      ├─── (닫기 클릭) → 상세페이지 유지
                                      │                  (해당 페이지에서 모달 재노출 금지)
                                      │
                                      └─── (가입하고 확인하기) → [8] 로그인
                                                                    │
                                                                    ▼
                                                                [9] 온보딩 1~5
                                                                    │
                                                                    ▼
                                                                [10] 리워드
                                                                    │
                                                                    ▼
                                                                [11] 원래 상세페이지로 복귀
                                                                     (락 해제, Tier 2 노출)
```

#### 락 트리거 상세

| 락 영역 | 트리거 조건 | 모달 카피 변형 |
|---|---|---|
| Tier 2 정보 (블러) | 블러 영역 탭 | "더 자세한 정보를 보려면..." |
| 예약 CTA | 예약 버튼 탭 | "예약 정보를 확인하려면..." |
| 외부 링크 CTA | 홈페이지 버튼 탭 | "외부 링크로 이동하려면..." |

#### 락 모달 표시 규칙
- 동일 페이지에서 **세션당 1회만 노출**
- 사용자가 "닫기"를 누른 경우 → sessionStorage에 `lock_dismissed_{place_id}` 기록
- 페이지 새로고침 또는 다른 페이지로 이동 후 재진입 시 → 다시 노출 가능

---

### 4.3 플로우 C: 온보딩 진행 중 이탈 후 재진입 (S2 → S3)

```
[Day 1]
[1] 로그인 완료 → 온보딩 Step 1~3 응답 후 앱 종료
    - 백엔드에 Step 1~3 응답 저장됨
    - completed_steps = 3, onboarding_completed_at = null
    - 사용자 상태: S2

[Day 2]
[2] 앱 재진입 (URL 직접 / 북마크 / 푸시)
    │
    ▼
[3] 사용자 상태 판별 → S2
    │
    ▼
[4] 자동 라우팅 → /onboarding/4 (이어서)
    - 진행률 바: 3/5 표시
    - "이전에 답변하신 내용은 저장되어 있어요"
    │
    ▼
[5] Step 4, 5 완료 → 리워드 → 홈
```

#### S2 사용자가 다른 URL로 직접 접근 시

| 시도 URL | 처리 |
|---|---|
| `/home` | 온보딩 미완료 안내 → `/onboarding/[next_step]`로 redirect (Soft redirect) |
| `/places/123` | 동일 — 단, redirect 파라미터에 원래 URL 저장 |
| `/search?q=...` | 동일 |
| `/onboarding/[이미 완료한 step]` | **허용** — 응답 수정 가능 (S1/S2) |
| `/onboarding/[미래 step]` | **차단** — 현재 진행 중인 step으로 redirect |

#### 온보딩 수정 정책 (확정)

- **온보딩 진행 중 (S1/S2)**: 이전 단계로 이동 + 응답 수정 ✅ **가능**
- **온보딩 완료 후 (S3)**: 수정 ❌ **불가** (Phase-2에서 마이페이지 통해 가능)

---

### 4.4 플로우 D: 재방문자 자동 진입 (S3)

```
[1] 앱 진입 (URL 직접 / 푸시 / 외부 링크)
    │
    ▼
[2] 세션 토큰 유효 확인
    │
    ├─── (유효) → [3] 사용자 상태 S3 확인 → 요청 페이지 또는 홈
    │
    └─── (만료) → [4] 토큰 갱신 시도
                      │
                      ├─── (성공) → 요청 페이지 또는 홈
                      │
                      └─── (실패) → 로그인 페이지로 redirect
                                    (redirect 파라미터에 원래 URL 저장)
```

---

### 4.5 플로우 E: 검색/필터 상태 보존 시나리오

가장 까다로운 케이스입니다. URL state 활용이 핵심.

```
[1] /search?q=지리산&category=산숲&region=전남&sort=distance
    - 검색어, 카테고리, 지역 필터, 정렬 모두 적용된 상태
    │
    ▼
[2] 카드 클릭 → /places/123
    │
    ▼
[3] 락 영역 탭 → 락 모달 → "가입하고 확인하기"
    │
    ▼
[4] /login?redirect=/places/123  ← redirect 저장
    │
    ▼
[5] 구글 OAuth 완료
    │
    ▼
[6] 온보딩 1~5 (5분 소요)
    │
    ▼
[7] 리워드 → /places/123 으로 복귀
    │
    ▼
[8] (사용자가 "뒤로 가기" 클릭)
    → /search?q=지리산&category=산숲&region=전남&sort=distance
    ✅ 모든 검색/필터 상태 유지됨 (URL state 덕분)
```

#### 핵심 원칙
- 검색어, 카테고리, 필터, 정렬은 **URL 쿼리 파라미터로 관리** (Next.js searchParams)
- Zustand 등 클라이언트 상태에 저장하지 않음 → 새로고침/리다이렉트에도 안전
- 페이지 진입 시 URL 파라미터를 읽어 UI 상태 복원

---

## 5. 분기점별 의사결정 매트릭스

각 진입 URL과 사용자 상태별로 어떤 화면을 보여줄지 명확히 정의합니다.

| 진입 URL | S0 (익명) | S1 (로그인/온보딩미완) | S2 (온보딩진행중) | S3 (Member) |
|---|---|---|---|---|
| `/` (랜딩) | ✅ 노출 | → `/onboarding/1` | → `/onboarding/[next]` | → `/home` |
| `/login` | ✅ 노출 | → `/onboarding/1` | → `/onboarding/[next]` | → `/home` |
| `/onboarding/[step]` | → `/login` | ✅ 노출 | ✅ 노출 (next step) | → `/home` |
| `/onboarding/[이미 완료한 step]` | → `/login` | ✅ 노출 (수정 가능) | ✅ 노출 (수정 가능) | → `/home` |
| `/onboarding/[미래 step]` | → `/login` | → 현재 단계로 redirect | → 현재 단계로 redirect | → `/home` |
| `/onboarding/complete` | → `/login` | → `/onboarding/1` | → `/onboarding/[next]` | ✅ 노출 (1회만) |
| `/home` | ✅ 노출 (Free) | → `/onboarding/1` | → `/onboarding/[next]` | ✅ 노출 (Member) |
| `/search` | ✅ 노출 (Free) | → `/onboarding/1` | → `/onboarding/[next]` | ✅ 노출 (Member) |
| `/places/[id]` | ✅ 노출 (Free, 락 적용) | → `/onboarding/1` (redirect 저장) | → `/onboarding/[next]` (redirect 저장) | ✅ 노출 (Member, 락 해제) |

> ⚠️ S1/S2 상태에서 `/home`이나 `/places/[id]`로 진입 시도 시, **redirect 파라미터에 원래 URL을 반드시 저장**해야 온보딩 완료 후 정상 복귀 가능

---

## 6. 리다이렉트 처리 상세

### 6.1 redirect 파라미터 규칙

```
형식: /login?redirect={encodeURIComponent(원래_URL)}
예시: /login?redirect=%2Fplaces%2F123
```

### 6.2 redirect 저장 시점

| 시점 | 저장 위치 | 비고 |
|---|---|---|
| 락 모달 "가입하고 확인하기" 클릭 | URL 쿼리 + sessionStorage | 이중 저장으로 안전성 확보 |
| 보호된 라우트 진입 시도 (S0) | URL 쿼리 + sessionStorage | 자동 처리 |
| 세션 만료로 강제 로그아웃 | sessionStorage | URL 쿼리 사용 불가 시 fallback |

### 6.3 redirect 적용 시점

```
온보딩 완료 (Step 5 또는 마지막 응답 제출) 직후:
1. 백엔드에 onboarding_completed_at 저장
2. 리워드 모먼트 1초 노출
3. redirect 파라미터 또는 sessionStorage 확인
4-a. 값이 있고 검증 통과 → 해당 URL로 이동
4-b. 값이 없거나 검증 실패 → /home으로 이동
5. sessionStorage의 redirect 키 삭제
```

### 6.4 보안 정책 — 4단계 검증

#### 1단계: URL 형식 검증
- ✅ 같은 도메인 상대 경로 (/로 시작, //로 시작하지 않음)
- ❌ 외부 도메인, 프로토콜 변조, 프로토콜 상대 URL

#### 2단계: 경로 화이트리스트 검증
- ✅ 허용된 경로 패턴에만 매칭되어야 함:
  - `/`
  - `/home`
  - `/search`
  - `/places/[id]` (id는 영숫자/하이픈만)
- ❌ 차단:
  - `/api/*` (API 직접 호출 차단)
  - `/auth/*` (인증 콜백 우회 차단)
  - `/onboarding/*` (온보딩으로 직접 redirect 금지)
  - `/login` (무한 루프 방지)
  - `/admin/*` (관리자 페이지)

#### 3단계: 쿼리 파라미터 검증
- ✅ 알려진 쿼리 파라미터만 허용 (q, category, region, sort 등)
- ❌ 차단:
  - 알 수 없는 파라미터
  - 비정상적으로 긴 값 (>500자)
  - 스크립트 인젝션 패턴 (<, >, ', ", javascript:, onerror= 등)

#### 4단계: 길이 제한
- redirect URL 전체 길이 1024자 이내

#### 의사코드

```typescript
function isSafeRedirect(url: string): boolean {
  // 1단계: 형식 검증
  if (!url.startsWith('/') || url.startsWith('//')) return false;
  if (/^(javascript|data|vbscript):/i.test(url)) return false;
  if (url.length > 1024) return false;

  // 2단계: 경로 화이트리스트
  const ALLOWED_PATHS = [
    /^\/$/,
    /^\/home$/,
    /^\/search(\?.*)?$/,
    /^\/places\/[a-zA-Z0-9-]+(\?.*)?$/,
  ];
  const BLOCKED_PREFIXES = ['/api/', '/auth/', '/onboarding/', '/login', '/admin/'];

  if (BLOCKED_PREFIXES.some(p => url.startsWith(p))) return false;
  if (!ALLOWED_PATHS.some(p => p.test(url))) return false;

  // 3단계: 쿼리 파라미터 검증
  const ALLOWED_PARAMS = ['q', 'category', 'region', 'sort', 'filter'];
  // ... 파라미터 키/값 검증 로직

  return true;
}

// 검증 실패 시 fallback
const safeRedirect = isSafeRedirect(redirectUrl) ? redirectUrl : '/home';
```

### 6.5 추가 방어 조치

| 위협 | 방어 |
|---|---|
| **Open Redirect 공격** | 4단계 화이트리스트로 차단 |
| **세션 고정 공격** | 로그인 성공 시 새 세션 토큰 발급 (백엔드 협의 사항) |
| **CSRF 공격** | OAuth state 파라미터 검증 (백엔드 협의 사항) |
| **무한 루프 공격** | `/login` 자체로의 redirect 차단 |
| **온보딩 우회 공격** | `/onboarding/*` redirect 차단 (정상 플로우는 redirect 무관하게 자동 라우팅) |
| **API 직접 호출 유도** | `/api/*` redirect 차단 |
| **악성 파라미터 인젝션** | 화이트리스트 파라미터만 허용 |

---

## 7. 엣지 케이스 처리

| 케이스 | 처리 |
|---|---|
| 로그인 도중 사용자가 OAuth 창을 닫음 | 락 적용 직전 페이지로 복귀, 토스트로 안내 |
| OAuth 콜백이 에러 반환 | `/login?error=oauth_failed`로 redirect, 에러 메시지 노출 |
| 온보딩 도중 브라우저 종료 | 다음 진입 시 S2 상태로 자동 라우팅 (이어서) |
| 온보딩 마지막 단계 직후 네트워크 단절 | 응답 저장 실패 → 재시도 버튼 노출, 최대 3회 자동 재시도 |
| 로그인 직후 redirect URL이 만료/삭제된 페이지 | 404 페이지에서 "홈으로 돌아가기" 안내 |
| 락 모달 노출 중 화면 회전/리사이즈 | 모달 상태 유지, 레이아웃만 재조정 |
| 동일 사용자의 다중 디바이스 동시 사용 | 백엔드가 최신 응답으로 덮어씀 (last-write-wins) |
| 세션 만료 + redirect 파라미터 만료 | 홈으로 fallback, 토스트로 "다시 로그인해주세요" 안내 |

---

## 8. 백엔드 협의 사항 (플로우 관점)

| 항목 | 협의 내용 |
|---|---|
| `GET /api/v1/users/me` 응답 스키마 | `onboarding_completed_at`, `completed_steps`, `tier` 필드 포함 필요 |
| 온보딩 부분 응답 저장 | 단계별 응답을 즉시 저장 (전체 완료까지 대기 X) |
| 세션 토큰 갱신 정책 | 만료 시간, 자동 갱신 로직 정의 필요 |
| OAuth 콜백 URL | `/auth/callback` 또는 별도 정의 |
| 로그아웃 API | `POST /api/v1/auth/logout` 정의 필요 |

---

## 9. 시각 다이어그램 작성 계획

이 문서는 텍스트 기반이지만, 디자이너에게 전달할 때는 **시각화된 다이어그램**이 필요합니다. 산출물 작성이 모두 완료되고 Notion 업로드 시점에 다음 다이어그램을 함께 첨부하겠습니다:

| 다이어그램 | 도구 | 내용 |
|---|---|---|
| 전체 사용자 여정 맵 | FigJam | S0 → S3 전환 흐름 시각화 |
| 락 트리거 시퀀스 | FigJam | 플로우 B의 단계별 화면 전환 |
| 의사결정 매트릭스 | Mermaid | 5번 표를 시각화 |
| 리다이렉트 시퀀스 | FigJam | 6번 내용을 시퀀스 다이어그램으로 |

> 다이어그램 도구는 **C안 (하이브리드)** — 시각적 표현이 중요한 다이어그램은 FigJam, 단순한 플로우/구조도는 Mermaid를 활용합니다.

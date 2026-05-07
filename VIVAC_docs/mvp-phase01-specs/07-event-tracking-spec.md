# 📄 VIVAC MVP Phase-1 Event Tracking Specification (v0.1)

## 1. 문서 메타정보

| 항목 | 내용 |
|---|---|
| 문서명 | VIVAC MVP Phase-1 Event Tracking Specification |
| 버전 | v0.1 (Draft) |
| 작성일 | 2026-04-29 |
| 주요 대상 | 프론트엔드 개발자, 데이터 분석, PO |
| 상태 | 검토중 |

---

## 2. 트래킹 도구 구성

### 2.1 도구 선정 — GA4 + PostHog 하이브리드

| 도구 | 역할 |
|---|---|
| **Google Analytics 4 (GA4)** | 광고 채널 ROI 분석, 마케팅 어트리뷰션, 마케팅팀 표준 도구 |
| **PostHog** | 프로덕트 분석 (깔때기, 코호트, 세션 리플레이, 피처 플래그), Self-host 가능 |

### 2.2 이벤트 라우팅 전략

| 이벤트 카테고리 | GA4 | PostHog | 비고 |
|---|---|---|---|
| 페이지뷰 | ✅ | ✅ | 양쪽 모두 |
| 광고/마케팅 (UTM) | ✅ | - | GA4 중심 |
| 사용자 행동 (탭, 스크롤) | - | ✅ | PostHog 중심 |
| 깔때기 분석 (가입, 온보딩) | ✅ | ✅ | 양쪽 모두 |
| 락 트리거, 가설 검증 | - | ✅ | PostHog 중심 |
| 에러 모니터링 | - | ✅ | PostHog 중심 |

### 2.3 구현 추상화

```
analytics.track(eventName, properties)
  ├── GA4: gtag('event', eventName, properties) (해당 이벤트만)
  └── PostHog: posthog.capture(eventName, properties) (해당 이벤트만)
```

> 💡 단일 인터페이스로 추상화 + 이벤트별 라우팅 설정. 추후 도구 변경에도 코드 수정 최소화.

---

## 3. 이벤트 명명 규칙

### 3.1 네이밍 컨벤션

```
{도메인}_{객체}_{액션}
```

예시:
- `home_viewed`
- `place_card_clicked`
- `onboarding_step_completed`
- `value_lock_triggered`

### 3.2 액션 동사 표준

| 동사 | 의미 |
|---|---|
| `viewed` | 화면/요소 노출 |
| `clicked` / `tapped` | 사용자 탭 (구분 없이 `clicked` 통일) |
| `executed` | 사용자 능동 액션 (검색 실행 등) |
| `completed` | 단계/플로우 완료 |
| `started` | 단계/플로우 시작 |
| `succeeded` / `failed` | 결과 |
| `dismissed` | 사용자가 닫음 |
| `triggered` | 시스템이 발동 (모달 등) |
| `applied` / `removed` | 필터 등 |

### 3.3 속성 명명

- snake_case
- Boolean: `is_*`, `has_*`
- ID: `*_id`
- 시간: `*_at` (ISO8601), `duration_ms` (밀리초)

---

## 4. 공통 속성 (Super Properties)

모든 이벤트에 자동 부착.

| 속성 | 타입 | 설명 |
|---|---|---|
| `user_id` | string | 사용자 ID (S0 익명 시 null) |
| `anonymous_id` | string | 익명 사용자 식별자 (sessionStorage) |
| `user_state` | string | "S0" / "S1" / "S2" / "S3" |
| `tier` | string | "free" / "member" |
| `device_type` | string | "mobile" / "tablet" / "desktop" |
| `os` | string | "iOS" / "Android" / "Windows" / "macOS" |
| `browser` | string | 브라우저명 |
| `viewport_width` | int | 뷰포트 너비 |
| `app_version` | string | 빌드 버전 |
| `referrer` | string | 진입 referrer |
| `utm_source` / `utm_medium` / `utm_campaign` | string | UTM 파라미터 (페이지뷰에 한해) |

---

## 5. 화면별 이벤트 정의

화면별로 정리합니다. 각 이벤트는 화면 정의서의 트래킹 섹션과 1:1 매핑됩니다.

### 5.1 랜딩 페이지

| 이벤트 | 트리거 | 고유 속성 |
|---|---|---|
| `landing_viewed` | 페이지 진입 | `referrer`, `utm_*` |
| `landing_cta_clicked` | CTA 탭 | `cta_type`: "primary" / "secondary" |

### 5.2 로그인 페이지

| 이벤트 | 트리거 | 고유 속성 |
|---|---|---|
| `login_viewed` | 페이지 진입 | `redirect_url` |
| `login_attempted` | 구글 버튼 탭 | `provider`: "google" |
| `login_succeeded` | OAuth 성공 | `provider`, `is_new_user` |
| `login_failed` | OAuth 실패 | `provider`, `error_code` |

### 5.3 온보딩

| 이벤트 | 트리거 | 고유 속성 |
|---|---|---|
| `onboarding_started` | Step 1 진입 | (자동) |
| `onboarding_step_viewed` | 각 단계 진입 | `step_number` |
| `onboarding_step_completed` | 다음 버튼 탭 | `step_number`, `answer`, `duration_ms` |
| `onboarding_step_skipped` | 건너뛰기 탭 | `step_number` |
| `onboarding_step_back` | 이전 버튼 탭 | `step_number` (이동 전) |
| `onboarding_completed` | Step 5 완료 | `total_duration_ms`, `skipped_count`, `answers` (요약) |
| `onboarding_abandoned` | 24시간 미복귀 | `last_step` |

#### `answers` 요약 형식 예시

```json
{
  "step_1": "intermediate",
  "step_2": ["ultralight", "thru_hike"],
  "step_3": ["mountain", "valley"],
  "step_4": "monthly",
  "step_5": "yeongnam"
}
```

### 5.4 리워드 모먼트

| 이벤트 | 트리거 | 고유 속성 |
|---|---|---|
| `reward_moment_viewed` | 페이지 진입 | `segment` (예: "ultralight_mountain") |
| `reward_moment_cta_clicked` | CTA 탭 | `dwell_time_ms` |
| `reward_moment_auto_redirected` | 5초 무반응 | `segment` |

### 5.5 홈 화면

| 이벤트 | 트리거 | 고유 속성 |
|---|---|---|
| `home_viewed` | 페이지 진입 | `user_state` |
| `home_search_bar_clicked` | 검색바 탭 | (없음) |
| `category_filter_clicked` | 카테고리 탭 | `category_code` |
| `curation_card_clicked` | 큐레이션 카드 탭 | `curation_type`, `place_id`, `position` |
| `curation_more_clicked` | 큐레이션 더보기 탭 | `curation_type` |
| `home_more_clicked` | 하단 더보기 탭 | (없음) |

### 5.6 검색 결과 페이지

| 이벤트 | 트리거 | 고유 속성 |
|---|---|---|
| `search_results_viewed` | 페이지 진입 | `query`, `filters`, `total_count` |
| `search_executed` | 검색어 변경 | `query`, `total_count` |
| `filter_applied` | 필터 변경 | `filter_type`, `value` |
| `filter_removed` | 칩 ✕ 탭 | `filter_type`, `value` |
| `filters_cleared` | 전체 해제 | (없음) |
| `place_card_clicked` | 카드 탭 | `place_id`, `position`, `total_count` |
| `search_no_results` | 결과 0건 | `query`, `filters` |
| `infinite_scroll_loaded` | 다음 페이지 fetch | `page`, `cumulative_count` |

### 5.7 필터 모달

| 이벤트 | 트리거 | 고유 속성 |
|---|---|---|
| `filter_modal_opened` | 모달 열림 | (없음) |
| `filter_modal_applied` | "결과 보기" 탭 | `filters` |
| `filter_modal_dismissed` | ✕/배경 탭 | `had_changes` |
| `filter_modal_reset` | 초기화 탭 | (없음) |

### 5.8 정렬 시트

| 이벤트 | 트리거 | 고유 속성 |
|---|---|---|
| `sort_sheet_opened` | 시트 열림 | (없음) |
| `sort_option_selected` | 옵션 탭 | `sort_code`, `is_implemented` |

> 💡 `is_implemented: false`인 이벤트로 **미구현 정렬 수요 측정** → Phase-2 우선순위 결정 근거.

### 5.9 장소 상세페이지

| 이벤트 | 트리거 | 고유 속성 |
|---|---|---|
| `place_detail_viewed` | 페이지 진입 | `place_id`, `source`, `user_state` |
| `place_image_carousel_swiped` | 이미지 스와이프 | `place_id`, `image_index` |
| `place_image_fullscreen_opened` | 이미지 탭 | `place_id`, `image_index` |
| `place_feature_chip_clicked` | features 칩 탭 | `place_id`, `feature_code` |
| `place_address_copied` | 주소 탭 | `place_id` |
| `place_more_section_expanded` | 더 알아보기 펼침 | `place_id`, `user_state` |
| `place_phone_clicked` | 전화 버튼 탭 | `place_id` |
| `place_booking_clicked` | 예약하기 탭 (S3) | `place_id` |
| `place_website_clicked` | 외부 웹사이트 탭 (S3) | `place_id` |

#### `source` 속성 값

상세 진입 경로 추적:
- `curation_legendary` / `curation_recommended`
- `search_results`
- `category_filter`
- `direct` (URL 직접/북마크)
- `share_link` (Phase-2 대비)

### 5.10 락 모달 (Value Lock)

| 이벤트 | 트리거 | 고유 속성 |
|---|---|---|
| `value_lock_triggered` | 모달 노출 | `place_id`, `lock_type` |
| `value_lock_cta_clicked` | Primary CTA 탭 | `place_id`, `lock_type` |
| `value_lock_dismissed` | 닫기 액션 | `place_id`, `lock_type`, `dismiss_method` |

#### `lock_type` 속성 값

- `tier2` (Tier 2 정보 블러)
- `booking` (예약 CTA)
- `website` (외부 웹사이트 CTA)

#### `dismiss_method` 속성 값

- `button` (닫기 버튼)
- `backdrop` (배경 탭)
- `drag` (드래그 다운)

---

## 6. 깔때기 정의

검증 가설 및 KPI 측정을 위한 핵심 깔때기.

### 6.1 가입 깔때기

```
Step 1: landing_viewed
Step 2: landing_cta_clicked (cta_type: "primary")
Step 3: login_viewed
Step 4: login_attempted
Step 5: login_succeeded
Step 6: onboarding_started
Step 7: onboarding_completed
```

각 단계 이탈률 측정.

### 6.2 락 → 가입 전환 깔때기 (핵심)

```
Step 1: place_detail_viewed (user_state: "S0")
Step 2: value_lock_triggered
Step 3: value_lock_cta_clicked
Step 4: login_succeeded
Step 5: onboarding_completed
```

> 💡 이 깔때기가 Soft Wall + Value Lock 정책의 핵심 검증.

### 6.3 검색 → 상세 깔때기 (H1 검증)

```
Step 1: home_viewed
Step 2-A: home_search_bar_clicked → search_executed
Step 2-B: category_filter_clicked
Step 3: search_results_viewed
Step 4: place_card_clicked
Step 5: place_detail_viewed
```

### 6.4 온보딩 단계별 이탈 깔때기 (H2 검증)

```
Step 1 진입: onboarding_step_viewed (step_number: 1)
Step 1 완료: onboarding_step_completed (step_number: 1)
Step 2 진입: onboarding_step_viewed (step_number: 2)
Step 2 완료: ...
...
Step 5 완료: onboarding_completed
```

---

## 7. 사용자 식별 전략

### 7.1 익명 → 식별 머지

| 시점 | 처리 |
|---|---|
| 사이트 첫 방문 | `anonymous_id` 발급 (UUID), localStorage 저장 |
| 모든 이벤트 | `anonymous_id` 부착 |
| 로그인 성공 | `posthog.identify(user_id, { ...traits })` 호출 + 익명 행동 머지 |

### 7.2 익명 행동 보존 정책

```
[Day 1] 익명 사용자 A
  - 검색 3회
  - 상세 진입 5회
  - 락 모달 1회 (이탈)

[Day 2] 동일 사용자 A 재방문, 로그인
  - identify 호출 → Day 1 행동이 user_id와 연결됨

→ Day 1의 검색/상세 행동도 가설 검증에 활용 가능
```

### 7.3 GA4 User-ID 처리

GA4도 동일하게 `set_user_id` 호출. PostHog identify와 동시 수행.

---

## 8. PII (개인정보) 처리

### 8.1 절대 트래킹 금지

- 이메일, 전화번호, 주소
- OAuth 토큰, 세션 ID
- 결제 정보 (Phase-2 대비)

### 8.2 개인 식별 가능 데이터

| 데이터 | 처리 |
|---|---|
| `user_id` | 내부 UUID — 외부에 노출 안 됨 |
| `nickname` | 트래킹 미부착 (필요시 GA4 user property로만) |
| 위치 정보 | Phase-1 미수집 |

### 8.3 데이터 보관

- PostHog: 24개월
- GA4: 14개월 (기본)

---

## 9. 구현 가이드

### 9.1 파일 구조 권장

```
src/
  lib/
    analytics/
      index.ts          // 통합 인터페이스
      ga4.ts            // GA4 어댑터
      posthog.ts        // PostHog 어댑터
      events.ts         // 이벤트 타입 정의 + 상수
      constants.ts      // 이벤트명 상수
```

### 9.2 이벤트 타입 정의 (TypeScript)

```typescript
// events.ts

export const EVENTS = {
  LANDING_VIEWED: 'landing_viewed',
  LANDING_CTA_CLICKED: 'landing_cta_clicked',
  LOGIN_VIEWED: 'login_viewed',
  // ...
} as const;

export interface EventProperties {
  [EVENTS.LANDING_CTA_CLICKED]: {
    cta_type: 'primary' | 'secondary';
  };
  [EVENTS.PLACE_CARD_CLICKED]: {
    place_id: string;
    position: number;
    total_count: number;
  };
  // ...
}
```

### 9.3 통합 인터페이스 예시

```typescript
// analytics/index.ts

import { ga4 } from './ga4';
import { posthog } from './posthog';

const ROUTING: Record<string, ('ga4' | 'posthog')[]> = {
  landing_viewed: ['ga4', 'posthog'],
  landing_cta_clicked: ['ga4', 'posthog'],
  value_lock_triggered: ['posthog'],
  // ...
};

export const analytics = {
  track(eventName: string, properties: object) {
    const targets = ROUTING[eventName] ?? ['posthog']; // 기본 PostHog

    if (targets.includes('ga4')) ga4.track(eventName, properties);
    if (targets.includes('posthog')) posthog.track(eventName, properties);
  },

  identify(userId: string, traits: object) {
    ga4.identify(userId, traits);
    posthog.identify(userId, traits);
  },

  reset() {
    ga4.reset();
    posthog.reset();
  },
};
```

### 9.4 사용 예시

```typescript
// 컴포넌트 내
import { analytics, EVENTS } from '@/lib/analytics';

function LandingCTA() {
  const handleClick = () => {
    analytics.track(EVENTS.LANDING_CTA_CLICKED, {
      cta_type: 'primary',
    });
    router.push('/login');
  };

  return <Button onClick={handleClick}>지금 시작하기</Button>;
}
```

---

## 10. 검증 및 QA

### 10.1 출시 전 검증 체크리스트

- 모든 이벤트가 GA4 DebugView에 노출되는가?
- 모든 이벤트가 PostHog Live Events에 노출되는가?
- 공통 속성이 모든 이벤트에 부착되는가?
- 익명 → 식별 머지가 정상 동작하는가?
- 이벤트명이 명세와 1:1 일치하는가? (오타/대소문자)
- 깔때기 정의가 GA4/PostHog에 등록되었는가?

### 10.2 출시 후 모니터링

| 시점 | 점검 항목 |
|---|---|
| 출시 후 D+1 | 모든 이벤트가 발화되는지 |
| 출시 후 D+3 | 깔때기 정상 동작, 비정상 데이터 부재 |
| 출시 후 D+7 | 베이스라인 데이터 정합성, 외부 봇 트래픽 필터링 |

---

## 11. 향후 확장 (Phase-2+)

| 기능 | 추가 이벤트 |
|---|---|
| 북마크 | `bookmark_added`, `bookmark_removed`, `bookmark_list_viewed` |
| 평점/리뷰 | `review_submitted`, `review_helpful_clicked`, `review_reported` |
| 공유 | `share_button_clicked`, `share_completed` |
| 푸시 알림 | `push_received`, `push_clicked` |
| 마이페이지 | `mypage_viewed`, `profile_edited`, `onboarding_revised` |
| 결제/구독 | `subscription_initiated`, `subscription_completed` |
| 추천 알고리즘 | `recommendation_viewed`, `recommendation_clicked` |

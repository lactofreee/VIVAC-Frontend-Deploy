# 📄 VIVAC MVP Phase-1 Screen Specification (3/3) v0.2

## 상세페이지 / Value Lock 디자인 가이드 / 공통 컴포넌트

## 1. 문서 메타정보

| 항목 | 내용 |
|---|---|
| 문서명 | VIVAC MVP Phase-1 Screen Specification (3차) |
| 버전 | v0.2 (Draft) |
| 작성일 | 2026-04-29 |
| 주요 대상 | 디자이너, 프론트엔드 개발자 |
| 포함 내용 | 상세페이지, Value Lock 디자인 가이드, 공통 컴포넌트 정의 |
| 상태 | 검토중 |

---

## 2. 화면 10. 장소 상세페이지

### 2.1 화면 개요

| 항목 | 내용 |
|---|---|
| URL | `/places/{id}` |
| 화면 ID | `screen.place.detail` |
| 접근 가능 상태 | S0(Free), S3(Member) — S1/S2는 온보딩으로 redirect |
| 핵심 목적 | 장소 상세 정보 제공 + 예약/외부 링크 액션 유도 + 가입 동기 부여(Free) |
| 핵심 KPI | 상세 진입율, 예약 CTA 클릭율, Tier별 체류 시간, 락 모달 트리거율 |

### 2.2 Tier별 노출 차이

| 영역 | S0 (Free) | S3 (Member) |
|---|---|---|
| Tier 1 정보 (이미지, 타이틀, 위치 등) | ✅ 정상 노출 | ✅ 정상 노출 |
| Tier 2 정보 (상세설명, 면적, 운영주체 등) | 🔒 블러 처리 | ✅ 정상 노출 |
| 예약 CTA (`booking_url`) | 🔒 락 아이콘 | ✅ 활성 |
| 외부 링크 CTA (`website_url`) | 🔒 락 아이콘 | ✅ 활성 |
| 전화 연결 (`phone`) | ✅ 정상 노출 | ✅ 정상 노출 |

> 💡 전화 연결은 **Tier 1 핵심 액션**으로 분류 (긴급 문의 차단 시 사용자 신뢰 저하 방지)

### 2.3 화면 구조

```
┌───────────────────────────────┐
│ [← 뒤로]                       │ ← 헤더 (반투명/스크롤시 솔리드)
│                                │
│ ┌───────────────────────────┐ │
│ │                           │ │
│ │   [이미지 캐러셀]          │ │ ← Tier 1
│ │                           │ │
│ │            [📷 1/5]        │ │
│ └───────────────────────────┘ │
│                                │
│ 야영장명 (title)               │ ← Tier 1
│ 한줄설명 (tagline)             │
│                                │
│ [#계곡] [#도보진입]            │ ← features 칩
│                                │
│ 📍 전라남도 구례군 OO면        │ ← Tier 1 (지도 미리보기 미노출)
│                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                │
│ 부대시설                       │ ← Tier 1
│ [🚻 화장실][🚿 샤워][🍳 취사]  │
│                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                │
│ ▼ 더 알아보기                  │ ← Tier 2 (S0: 블러)
│ ┌─────────────────────────┐   │
│ │ 상세설명 텍스트...        │   │ S0: 🔒 자물쇠 + 블러
│ │ 사업주체, 운영주체, 면적  │   │ S3: 정상 노출
│ │ ...                       │   │
│ └─────────────────────────┘   │
│                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                │
│ ┌────────┐ ┌────────────────┐│ ← Sticky 하단 액션바
│ │  📞     │ │  예약하기 🔒    ││   S0: 예약 CTA에 락
│ │ 전화    │ │                ││   S3: 정상 활성
│ └────────┘ └────────────────┘│
└───────────────────────────────┘
```

### 2.4 영역별 상세 명세

#### 2.4.1 헤더

| 컴포넌트 | 동작 |
|---|---|
| 뒤로가기 | 이전 페이지 (검색 결과 또는 홈), 스크롤 위치 보존 |
| 공유 버튼 | **Phase-2 이후** — Phase-1에는 미노출 |

> 💡 공유 기능은 Phase-2의 바이럴 확산 전략에 핵심이므로 디자인은 미리 고려.

#### 2.4.2 이미지 캐러셀 (Tier 1)

| 항목 | 내용 |
|---|---|
| 비율 | 16:9 |
| 레이아웃 | 풀 너비, 스와이프 가로 스크롤 |
| 인디케이터 | 우하단 "1/N" 텍스트 또는 도트 |
| 탭 동작 | 풀스크린 모드 진입 |
| 풀스크린 모드 | 이미지만 표시, 스와이프 이동, 탭하여 닫기 |
| 이미지 부재 | BI 일러스트 플레이스홀더 (1장) |
| 이미지 1장만 | 인디케이터 미노출 |
| 로딩 | Blur placeholder → Sharp |

#### 2.4.3 타이틀 영역 (Tier 1)

| 컴포넌트 | 필드 | 처리 |
|---|---|---|
| 야영장명 | `title` | 24~28pt bold, 2줄까지 ellipsis |
| 한줄설명 | `tagline` | 16pt, 2줄까지, 없으면 영역 자체 생략 |
| 특징 칩 | `features` 전체 | 가로 스크롤 칩, 탭 시 해당 features로 검색 (`/search?features[]={code}`) |

#### 2.4.4 위치 정보 (Tier 1)

| 컴포넌트 | 처리 |
|---|---|
| 주소 | 📍 아이콘 + `region_province` + `region_city` + `address` + `address_detail` |
| 주소 탭 동작 | 클립보드에 복사 + 토스트 "주소가 복사되었어요" |
| 지도 미리보기 | **Phase-1 미노출** (영역 자체 생략) |

> Phase-2 지도 API 도입 후 활성화 예정.

#### 2.4.5 부대시설 (Tier 1)

| 항목 | 내용 |
|---|---|
| 데이터 | `amenities` 배열 |
| 노출 형태 | 아이콘 + 텍스트 (그리드 또는 가로 스크롤) |
| 아이콘 매핑 | 마스터 데이터의 `icon` 필드 활용 (백엔드 협의 후) |
| 부재 시 | "정보가 없어요" 또는 영역 생략 |

#### 2.4.6 더 알아보기 영역 (Tier 2 — Value Lock 적용)

##### 펼침/접힘 정책
- **기본 상태**: 접힘 (헤더만 노출)
- **탭 동작**: 펼쳐서 내용 표시
- **S0 사용자**: 펼쳐도 내용 블러 처리 + 락 모달 트리거
- **S3 사용자**: 펼치면 정상 노출

##### Tier 2 정보 구성

| 항목 | 필드 | 처리 |
|---|---|---|
| 상세설명 | `description` | 텍스트, 줄바꿈 보존 |
| 사업주체 | `business_type` | "사업주체: OO" 형태 |
| 운영주체 | `operation_type` | "운영주체: OO" 형태 |
| 운영기관 | `operating_agency` | "운영기관: OO" 형태 |
| 업종 | `category` | "업종: OO" 형태 |
| 전체면적 | `total_area_m2` | "전체면적: N㎡" 형태 |
| 외부 웹사이트 | `website_url` | 링크 (락 적용) |

#### 2.4.7 Sticky 하단 액션바

| 컴포넌트 | S0 동작 | S3 동작 |
|---|---|---|
| 📞 전화 버튼 | `tel:` 링크로 전화 연결 | 동일 |
| 예약하기 버튼 | `booking_url`이 있으면 락 모달 트리거 / 없으면 비활성 | `booking_url`이 있으면 외부 링크 / 없으면 비활성 |

##### 데이터별 분기

| `booking_url` 상태 | 버튼 표시 |
|---|---|
| 존재 + S0 | "예약하기 🔒" — 락 트리거 |
| 존재 + S3 | "예약하기 →" — 외부 링크 |
| 부재 | "예약 정보 없음" — 비활성 (회색) |

> 💡 외부 링크 클릭 시 안전을 위해 `target="_blank"` + `rel="noopener noreferrer"` 적용. 첫 클릭 시 "외부 페이지로 이동합니다" 토스트 안내 옵션도 검토.

### 2.5 인터랙션 명세

| 액션 | 동작 |
|---|---|
| 이미지 캐러셀 스와이프 | 이미지 전환 |
| 이미지 탭 | 풀스크린 모드 |
| features 칩 탭 | `/search?features[]={code}` 이동 |
| 주소 탭 | 클립보드 복사 + 토스트 |
| 부대시설 탭 | (Phase-1) 무동작 / (Phase-2) `/search?amenities[]={code}` 가능 |
| 더 알아보기 탭 (S0, 접힌 상태) | 펼침 + 즉시 락 모달 트리거 |
| 더 알아보기 탭 (S0, 펼친 상태) | 다시 접기 |
| 더 알아보기 탭 (S3) | 펼침/접힘 토글 |
| Tier 2 블러 영역 탭 (S0) | 락 모달 트리거 (단, 같은 페이지 동일 락 타입은 1회만) |
| 예약하기 탭 (S0) | 락 모달 트리거 (lock_type: "booking") |
| 예약하기 탭 (S3) | `booking_url` 새 탭에서 열기 |
| 외부 웹사이트 탭 (S0) | 락 모달 트리거 (lock_type: "website") |
| 외부 웹사이트 탭 (S3) | `website_url` 새 탭에서 열기 |
| 전화 버튼 탭 | `tel:{phone}` 호출 |
| 뒤로가기 | 이전 페이지 + 스크롤 위치 보존 |

### 2.6 데이터 요구사항

```
GET /api/v1/places/{id}
응답:
{
  id, title, tagline, description,
  thumbnail_url, image_urls, image_count,
  region_province, region_city, address, address_detail,
  features: [...],
  amenities: [...],
  business_type, operation_type, operating_agency,
  category, total_area_m2,
  phone, website_url, booking_url,
  operating_status,
  created_at, updated_at
}
```

> 💡 Tier 분류와 무관하게 **API는 모든 필드를 응답**. Tier 적용은 프론트에서 시각적으로 처리. (보안상 민감 정보가 아니므로)

### 2.7 트래킹 이벤트

| 이벤트 | 트리거 | 속성 |
|---|---|---|
| `place_detail_viewed` | 페이지 진입 | `place_id`, `source` (curation/search/direct), `user_state` |
| `place_image_carousel_swiped` | 이미지 스와이프 | `place_id`, `image_index` |
| `place_image_fullscreen_opened` | 이미지 탭 | `place_id`, `image_index` |
| `place_feature_chip_clicked` | features 칩 탭 | `place_id`, `feature_code` |
| `place_address_copied` | 주소 탭 | `place_id` |
| `place_more_section_expanded` | 더 알아보기 펼침 | `place_id`, `user_state` |
| `place_phone_clicked` | 전화 버튼 탭 | `place_id` |
| `place_booking_clicked` | 예약하기 탭 (S3) | `place_id` |
| `place_website_clicked` | 외부 웹사이트 탭 (S3) | `place_id` |
| `value_lock_triggered` | 락 모달 노출 | `place_id`, `lock_type` (tier2/booking/website) |

### 2.8 엣지 케이스

| 케이스 | 처리 |
|---|---|
| 존재하지 않는 place_id | 404 페이지 → "홈으로" |
| API 응답 실패 (5xx) | 에러 화면 + "다시 시도하기" |
| 이미지 부재 | BI 일러스트 플레이스홀더 |
| 모든 Tier 1 필드 부재 (극단적 데이터 누락) | 기본값 또는 영역 생략, "정보 부족" 안내 |
| 매우 긴 `description` | 2000자 이상 시 "더보기" 토글 |
| `phone` 부재 | 전화 버튼 비활성 |
| `booking_url`, `website_url` 모두 부재 | 액션바 영역 축소 또는 단일 버튼만 |
| 외부 URL이 깨진 형식 | URL 검증 실패 시 비활성 처리 |
| 매우 빠른 뒤로가기 후 재진입 | 캐싱된 데이터 활용 (TanStack Query staleTime) |

---

## 3. Value Lock 디자인 가이드

이 섹션은 디자이너에게 별도로 강조하여 전달할 디자인 명세입니다.

### 3.1 디자인 철학

Value Lock은 **사용자를 좌절시키는 장벽**이 아닌 **호기심을 자극하는 미리보기**가 되어야 합니다.

| 잘못된 접근 | 권장 접근 |
|---|---|
| 정보를 완전히 가린다 | 정보가 있다는 것을 보여주되 읽기 어렵게 |
| 협박조 카피 | 가치 제안 중심 카피 |
| 강제 모달 (닫기 불가) | 닫기 가능, 비강제적 |
| 모든 영역에 락 | 핵심 가치 영역에만 선택적 |

### 3.2 블러 처리 명세

#### 3.2.1 블러 강도

| 강도 | 사용처 | CSS 예시 |
|---|---|---|
| **약** (텍스트 식별 가능) | ❌ 사용 안 함 | `filter: blur(2px)` |
| **중** (윤곽만 보임) | ✅ Tier 2 정보 영역 | `filter: blur(6px)` |
| **강** (완전 불투명) | ❌ 사용 안 함 | `filter: blur(12px)` |

> 💡 **중**으로 통일 — 정보 존재를 인지시키되 읽을 수 없어야 함

#### 3.2.2 블러 적용 방식

```css
.tier2-locked {
  filter: blur(6px);
  user-select: none;
  pointer-events: none;
}

.tier2-locked-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.7) 50%
  );
  pointer-events: auto; /* 오버레이는 클릭 가능 */
}
```

#### 3.2.3 락 영역 위 오버레이

```
┌─────────────────────────────┐
│ [블러 처리된 텍스트 영역]    │  ← 클릭 차단
│   ▓▓▓▓▓▓ ▓▓▓▓ ▓▓▓▓        │
│   ▓▓▓▓ ▓▓▓▓▓▓▓▓ ▓▓▓        │
│                              │
│       ┌─────────┐            │  ← 자물쇠 아이콘
│       │   🔒    │            │
│       └─────────┘            │
│                              │
│  가입 후 확인 가능            │  ← 짧은 라벨
│                              │
└─────────────────────────────┘
```

| 요소 | 명세 |
|---|---|
| 자물쇠 아이콘 크기 | 32~40px |
| 라벨 카피 | "가입 후 확인 가능" |
| 라벨 폰트 | 14pt medium |
| 그라데이션 | 상단 transparent → 하단 흰색 70% (라이트모드 기준) |
| 클릭 영역 | 오버레이 전체 |

### 3.3 락 CTA 버튼 디자인

#### 3.3.1 예약하기 버튼 (예시)

| 상태 | 디자인 |
|---|---|
| **S0 (락)** | Primary 스타일 + 자물쇠 아이콘 우측 + "예약하기 🔒" |
| **S3 (활성)** | Primary 스타일 + 화살표 우측 + "예약하기 →" |
| **데이터 부재** | Disabled 스타일 + "예약 정보 없음" |

> ⚠️ 락 상태를 **비활성(disabled) 스타일로 표시하지 않음**. 클릭 가능하다는 시각 신호 유지가 핵심.

#### 3.3.2 시각 차이 가이드

```
S0 락 상태:    [  예약하기 🔒  ]  ← Primary 색상 유지, 아이콘으로 락 표시
S3 활성 상태:  [  예약하기 →   ]  ← Primary 색상, 화살표 아이콘
데이터 부재:   [  예약 정보 없음  ] ← 회색 비활성 (이건 진짜 disabled)
```

### 3.4 락 모달 디자인

화면 정의서 1차의 화면 5(락 모달)과 동일. 다음 사항 강조:

| 항목 | 명세 |
|---|---|
| 형태 | Bottom Sheet |
| 닫기 가능성 | 항상 가능 (드래그/배경탭/닫기버튼) |
| 카피 톤 | 가치 제안 중심, 협박 금지 |
| CTA 우선순위 | "가입하고 확인하기" Primary, "닫기" Secondary |
| 노출 빈도 | 동일 페이지에서 락 타입별 1회만 (sessionStorage) |

### 3.5 블러 해제 애니메이션 (가입 완료 후 복귀 시)

사용자가 가입 + 온보딩 완료 후 원래 상세페이지로 복귀했을 때:

| 단계 | 애니메이션 |
|---|---|
| 1. 페이지 진입 | 블러 적용된 상태로 진입 (이전 모습과 동일) |
| 2. 200ms 대기 | "보상 효과" 사용자 인식 시간 |
| 3. 블러 해제 | 300ms duration, ease-out, blur(6px) → blur(0) |
| 4. 오버레이 페이드아웃 | 자물쇠 아이콘 + 라벨 페이드아웃 |
| 5. 토스트 (선택) | "환영합니다, OO님!" |

> 💡 이 애니메이션은 **가입의 보상감을 시각적으로 강화**합니다. 디자이너 협의 시 우선순위 강조.

### 3.6 다크모드 대비 (향후 확장)

다크모드는 Phase-1에 미포함이지만, Phase-2 확장 대비 다음을 고려:

| 항목 | 라이트모드 | 다크모드 (향후) |
|---|---|---|
| 블러 오버레이 그라데이션 | 흰색 70% → transparent | 검정 70% → transparent |
| 자물쇠 아이콘 색상 | Neutral-700 | Neutral-300 |
| 락 라벨 텍스트 | Neutral-700 | Neutral-300 |

CSS 변수 기반으로 토큰화하여, 다크모드 활성화 시 변수 값만 교체.

### 3.7 접근성 (Accessibility)

| 항목 | 명세 |
|---|---|
| 블러 영역 ARIA | `aria-label="가입 후 확인 가능한 영역"` |
| 락 CTA 버튼 ARIA | `aria-label="가입 후 예약 가능"` |
| 스크린리더 | 블러 텍스트 자체를 읽지 않도록 `aria-hidden="true"` |
| 락 모달 포커스 트랩 | 모달 내부에 포커스 갇히도록 |
| 키보드 탐색 | Tab으로 락 영역 탭 시 락 모달 트리거 |

---

## 4. 공통 컴포넌트 정의

전 화면에서 재사용되는 공통 컴포넌트 명세입니다. 디자이너의 디자인 시스템 작업과 프론트의 컴포넌트 라이브러리 구축에 활용됩니다.

### 4.1 Button

| 속성 | 옵션 |
|---|---|
| **Variant** | Primary / Secondary / Tertiary / Ghost / Destructive |
| **Size** | XS (28px) / S (36px) / M (44px) / L (52px) |
| **State** | Default / Hover / Pressed / Disabled / Loading |
| **Width** | Auto / Full |
| **Icon** | Left / Right / Only |

#### 사용처
- Primary: CTA (지금 시작하기, 가입하고 확인하기, 결과 보기)
- Secondary: 보조 액션 (둘러보기, 닫기)
- Tertiary: 인라인 텍스트 액션
- Ghost: 헤더 아이콘 버튼
- Destructive: 삭제/취소 (Phase-1엔 거의 없음)

### 4.2 Input

| 속성 | 옵션 |
|---|---|
| **Type** | Text / Search / Number |
| **Size** | M (44px) / L (52px) |
| **State** | Default / Focus / Filled / Error / Disabled |
| **Affix** | Prefix icon / Suffix icon / Suffix clear button |

#### 사용처
- 검색바 (홈, 검색결과 헤더)
- 향후 Phase-2 폼 입력

### 4.3 Card

| 속성 | 옵션 |
|---|---|
| **Layout** | Vertical-Large / Vertical-Small / Horizontal |
| **Image Ratio** | 16:9 / 4:3 / 1:1 |
| **Content** | Title / Tagline / Region / Tags |

#### 사용처
- Vertical-Large: 홈 - 백패킹 성지 (가로 스크롤)
- Vertical-Small: 홈 - 한번쯤 가볼만한 야영지 (2열 그리드)
- Horizontal: 검색 결과 페이지

### 4.4 Chip / Tag

| 속성 | 옵션 |
|---|---|
| **Variant** | Filter (Primary 색상, ✕ 가능) / Tag (Neutral, 정적) / Selectable (Outline ↔ Filled) |
| **Size** | S (24px) / M (32px) |
| **Action** | Tappable / Static |

#### 사용처
- Filter (적용된 필터 칩, 검색 결과 상단)
- Tag (카드 내 features 표시)
- Selectable (필터 모달, 온보딩 옵션)

### 4.5 Modal / Bottom Sheet

| 속성 | 옵션 |
|---|---|
| **Form** | Center Modal / Bottom Sheet / Full Screen |
| **Dismissible** | true / false |
| **Drag Handle** | true / false (Bottom Sheet만) |

#### 사용처
- Bottom Sheet: 락 모달, 정렬 시트
- Full Screen: 필터 모달, 이미지 풀스크린
- Center Modal: 향후 확인 다이얼로그

### 4.6 Toast

| 속성 | 옵션 |
|---|---|
| **Variant** | Info / Success / Warning / Error |
| **Position** | Top / Bottom |
| **Duration** | Short (2s) / Medium (4s) / Long (6s) / Persistent |
| **Action** | None / Close button / Action button |

#### 사용처
- 주소 복사 완료 ("주소가 복사되었어요")
- 정렬 미구현 안내 ("정렬 기능은 곧 출시됩니다")
- 네트워크 에러
- 최대 선택 도달 안내

### 4.7 Progress Bar

| 속성 | 옵션 |
|---|---|
| **Type** | Linear / Step Indicator |
| **Size** | S (4px) / M (8px) |
| **Label** | "1/5" 텍스트 / 없음 |

#### 사용처
- 온보딩 단계 진행 표시

### 4.8 Skeleton Loader

| 속성 | 옵션 |
|---|---|
| **Shape** | Card-V-Large / Card-V-Small / Card-H / Chip / Text Line / Image |
| **Animation** | Shimmer / Pulse / None |

#### 사용처
- 큐레이션 카드 로딩 (홈)
- 검색 결과 카드 로딩
- 상세페이지 로딩

### 4.9 Empty State

| 속성 | 옵션 |
|---|---|
| **Type** | No Search Result / No Data / Error / Network Error |
| **Components** | Illustration / Headline / Subtext / CTA Button |

#### 사용처
- 검색 결과 0건
- 큐레이션 데이터 부재
- API 에러

### 4.10 Avatar (Phase-2 대비)

| 속성 | 옵션 |
|---|---|
| **Size** | XS (24px) / S (32px) / M (40px) / L (56px) |
| **Source** | Image / Initials / Default Icon |

> Phase-1엔 사용처 없음. Phase-2 마이페이지 대비 디자인 시스템에 포함.

### 4.11 Icon Set

#### 필수 아이콘 (Phase-1)

##### Navigation (4)
- ArrowLeft (뒤로가기)
- ArrowRight (이동)
- Close (닫기)
- ChevronDown (펼침/드롭다운)

##### Action (6)
- Search
- Filter
- Sort
- Phone
- ExternalLink
- Copy

##### Status (4)
- Lock
- Check
- AlertCircle
- Info

##### Category (6)
- Mountain (산·숲)
- Ocean (바다)
- Valley (계곡)
- River (강·호수)
- Wild (노지)
- NationalPark (국립공원)

##### Amenity (예시 — 백엔드 마스터 데이터 기반)
- Toilet (화장실)
- Shower (샤워)
- Cooking (취사)
- Parking (주차)
- Store (매점)
- Water (식수)
- (이하 마스터 데이터에 따라 추가)

##### Onboarding (5)
- Backpack (UL/경량)
- Map (종주·장거리)
- Tent (베이스캠핑)
- Car (차박)
- Wild (노지·비박)

##### Misc (3)
- Location (📍 위치 마커)
- Calendar (Phase-2 대비)
- Heart (Phase-2 대비 — 북마크)

> 총 약 35~40개 (마스터 데이터 의존 아이콘 제외)

### 4.12 Color Token

| 토큰 카테고리 | 변수 |
|---|---|
| Brand | `--color-primary`, `--color-primary-hover`, `--color-primary-pressed` |
| Semantic | `--color-success`, `--color-warning`, `--color-error`, `--color-info` |
| Neutral | `--color-neutral-1` ~ `--color-neutral-9` |
| Background | `--color-bg-base`, `--color-bg-elevated`, `--color-bg-overlay` |
| Text | `--color-text-primary`, `--color-text-secondary`, `--color-text-disabled` |
| Border | `--color-border-default`, `--color-border-subtle`, `--color-border-strong` |

> 다크모드 대비 변수화는 유지, Phase-1엔 라이트모드 값만 정의

### 4.13 Typography Token

| 토큰 | 사용처 | 권장 사이즈 |
|---|---|---|
| `--font-display` | 랜딩 헤드라인 | 32~36pt bold |
| `--font-h1` | 화면 메인 타이틀 | 24~28pt bold |
| `--font-h2` | 섹션 헤더 | 20pt semibold |
| `--font-h3` | 카드 타이틀 | 18pt semibold |
| `--font-body-1` | 본문 | 16pt regular |
| `--font-body-2` | 보조 본문 | 14pt regular |
| `--font-caption` | 메타정보 | 12pt regular |
| `--font-label` | 버튼/라벨 | 14~16pt medium |

### 4.14 Spacing Token

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64` (px)

CSS 변수: `--space-1` (4px) ~ `--space-8` (64px)

### 4.15 Radius Token

`4 / 8 / 12 / 16 / full`

CSS 변수: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full`

### 4.16 Elevation Token

| 단계 | 사용처 |
|---|---|
| `--elevation-0` | 기본 평면 |
| `--elevation-1` | 카드 |
| `--elevation-2` | 헤더 (스크롤 시) |
| `--elevation-3` | 모달, Bottom Sheet |
| `--elevation-4` | Toast |

### 4.17 Motion Token

| 토큰 | 값 | 사용처 |
|---|---|---|
| `--duration-instant` | 100ms | 호버, 작은 변화 |
| `--duration-short` | 200ms | 일반 트랜지션 |
| `--duration-medium` | 300ms | 모달, 페이지 전환 |
| `--duration-long` | 500ms | 큰 화면 전환 |
| `--easing-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | 일반 |
| `--easing-emphasized` | `cubic-bezier(0.4, 0, 0, 1)` | 강조 (블러 해제 등) |

---

## 5. 디자이너 추가 전달 사항 (3차 종합)

### 5.1 Value Lock 디자인 우선순위

| 우선순위 | 작업 |
|---|---|
| 🔴 최우선 | 블러 처리 + 락 오버레이 (Tier 2 영역) |
| 🔴 최우선 | 락 CTA 버튼 (예약하기 🔒) |
| 🔴 최우선 | 락 Bottom Sheet 모달 |
| 🟡 중요 | 블러 해제 애니메이션 (가입 완료 후 복귀) |
| 🟢 보조 | 락 영역 hover/tap 미세 피드백 |

### 5.2 일러스트/이미지 에셋 목록

| 위치 | 용도 | 형태 |
|---|---|---|
| 랜딩 미리보기 | 서비스 가치 시각화 | 화면 스크린샷 mockup |
| 온보딩 옵션 아이콘 | 환경/스타일 식별 | 일러스트 아이콘 6+5개 |
| 온보딩 완료 화면 | 세그먼트 시각화 | 동적 일러스트 |
| 락 모달 | 가입 동기 유발 | 일러스트 1~3종 (락 타입별) |
| 이미지 부재 플레이스홀더 | 데이터 누락 시 | 1종 (BI 일러스트) |
| 검색 결과 0건 | Empty State | 1종 |
| 큐레이션 데이터 부재 | Empty State | 1종 |
| 에러 화면 | API 실패 | 1종 |

### 5.3 디자인 시스템 작업 우선순위 (BI 작업 후)

| Phase | 항목 |
|---|---|
| **Phase 1.1** | Color, Typography, Spacing, Radius 토큰 정의 |
| **Phase 1.2** | Button, Input, Card, Chip, Toast 컴포넌트 |
| **Phase 1.3** | Modal/Bottom Sheet, Progress Bar, Skeleton, Empty State |
| **Phase 1.4** | Icon Set (35~40개) |
| **Phase 1.5** | 화면별 시안 작업 (랜딩 → 온보딩 → 홈 → 검색결과 → 상세) |
| **Phase 1.6** | Value Lock 디자인 가이드 적용 |
| **Phase 1.7** | 일러스트 에셋 작업 |

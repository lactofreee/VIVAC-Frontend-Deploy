# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
프로젝트 전체 컨텍스트(기획·컨벤션·로드맵)는 부모 디렉토리의 `.claude/CLAUDE.md`를 참조.

> **Note**: Next.js 16.2.4는 훈련 데이터와 API가 다를 수 있음 — 코드 작성 전 `node_modules/next/dist/docs/` 내 가이드 참조. 지원 중단 알림을 반드시 확인할 것.

## Commands

- `npm run dev` — 개발 서버 시작 (localhost:3000)
- `npm run build` — 프로덕션 빌드
- `npm run lint` — ESLint 실행

## 디렉토리 구조 (현재)

Import alias: `@/*` → `src/*`

```
src/
├── app/          # 라우트, 레이아웃, 페이지 (App Router)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
└── components/   # 재사용 가능한 UI 컴포넌트
```

## Feature 구조 (apps/web 내부)

```
apps/web/
├── app/                      # 라우팅 전용 — 얇게 유지
│   └── (routes)/spots/
│       ├── page.tsx          # 라우트 진입점
│       └── layout.tsx
└── features/                 # 기능 단위 모듈
    └── spots/
        ├── components/       # 이 기능 전용 UI 컴포넌트
        ├── hooks/            # 이 기능 전용 커스텀 훅
        └── utils/            # 이 기능 전용 헬퍼
```

원칙: `app/` 디렉토리는 라우팅 껍데기로만 사용. 로직은 `features/`에 응집.
`features/` 간 직접 import 금지 — 공유가 필요하면 `packages/shared`로 승격.

## Key Notes

- Server Components가 기본값 — 클라이언트 인터랙션이 필요한 경우에만 `"use client"` 사용

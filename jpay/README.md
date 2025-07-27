# PairPay - 우리 둘만의 가계부

커플, 친구, 룸메이트를 위한 간편한 공유 가계부 PWA 앱입니다.

## 기술 스택

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Routing**: React Router v7
- **PWA**: Service Worker + Web App Manifest

## 프로젝트 구조

```
src/
├── components/
│   ├── ui/              # shadcn/ui 기본 컴포넌트
│   ├── layout/          # 레이아웃 컴포넌트
│   └── forms/           # 폼 컴포넌트
├── pages/               # 페이지 컴포넌트
│   ├── onboarding/      # 온보딩 페이지들
│   ├── dashboard/       # 대시보드
│   ├── expenses/        # 지출 관련 페이지
│   ├── budget/          # 예산 관련 페이지
│   └── settlement/      # 정산 관련 페이지
├── stores/              # Zustand 스토어
├── hooks/               # 커스텀 훅
├── lib/                 # 유틸리티 함수
├── types/               # TypeScript 타입 정의
├── styles/              # 전역 스타일
└── assets/              # 정적 자산
```

## 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 타입 체크
npm run type-check

# 린트 검사
npm run lint
```

## 주요 기능

### MVP 기능
- [x] 프로젝트 베이스 세팅
- [ ] 페어 연결 (초대 코드 기반)
- [ ] 지출 기록
- [ ] 실시간 대시보드
- [ ] 공동 예산 설정
- [ ] 정산 및 내역 관리

### Post-MVP 기능
- [ ] 공동 저축 목표 설정
- [ ] 월간 소비 리포트
- [ ] 주기성 지출 등록

## PWA 기능

- 📱 홈 화면 설치 가능
- 🔄 오프라인 캐시 지원
- 📊 백그라운드 동기화 (준비중)
- 🔔 푸시 알림 (준비중)

## 브라우저 지원

- Chrome 80+
- Safari 14+
- Firefox 75+
- Edge 80+

## 개발 가이드라인

### 컴포넌트 명명 규칙
- 페이지 컴포넌트: `PascalCase` (예: `Dashboard.tsx`)
- UI 컴포넌트: `kebab-case` (예: `button.tsx`)
- 훅: `use-` 접두사 (예: `useExpenses.ts`)

### 스타일링 가이드라인
- Tailwind CSS 유틸리티 클래스 우선 사용
- 커스텀 스타일은 `globals.css`에 정의
- shadcn/ui 컴포넌트 변형은 `cn()` 함수 활용

### 상태 관리
- 전역 상태: Zustand 스토어 사용
- 지역 상태: React useState 사용
- 서버 상태: React Query (향후 추가 예정)

## 배포

PWA로 배포되며, 다음 플랫폼에서 앱처럼 사용 가능합니다:
- iOS Safari (홈 화면 추가)
- Android Chrome (설치 프롬프트)
- Desktop (Chrome, Edge 등)

## 라이선스

MIT
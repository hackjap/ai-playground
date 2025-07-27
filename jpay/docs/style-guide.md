# PairPay 스타일 가이드

## 1. 디자인 원칙

### 1.1 핵심 가치
- **단순함 (Simplicity)**: 복잡하지 않은 직관적인 인터페이스
- **명확함 (Clarity)**: 금액과 정산 상태가 한눈에 들어오는 시각적 계층
- **신뢰감 (Trust)**: 금융 앱다운 안정적이고 깔끔한 디자인
- **접근성 (Accessibility)**: 모든 사용자가 쉽게 사용할 수 있는 포용적 디자인

### 1.2 디자인 철학
- **모바일 퍼스트**: 스마트폰에서의 사용성을 최우선으로 고려
- **데이터 중심**: 숫자와 차트가 명확하게 보이는 정보 계층 구조
- **미니멀리즘**: 불필요한 장식 요소 제거, 기능에 집중

## 2. 색상 시스템 (Color System)

### 2.1 브랜드 컬러
```css
/* Primary Colors */
--primary-blue-50: #eff6ff;
--primary-blue-100: #dbeafe;
--primary-blue-500: #3b82f6;  /* 메인 브랜드 컬러 */
--primary-blue-600: #2563eb;
--primary-blue-700: #1d4ed8;
--primary-blue-900: #1e3a8a;

/* Secondary Colors */
--secondary-slate-50: #f8fafc;
--secondary-slate-100: #f1f5f9;
--secondary-slate-200: #e2e8f0;
--secondary-slate-500: #64748b;
--secondary-slate-700: #334155;
--secondary-slate-900: #0f172a;
```

### 2.2 기능별 컬러
```css
/* Success - 긍정적 상태 (받을 금액, 예산 여유) */
--success-green-50: #f0fdf4;
--success-green-100: #dcfce7;
--success-green-500: #22c55e;
--success-green-600: #16a34a;

/* Warning - 주의 상태 (예산 80% 도달) */
--warning-yellow-50: #fefce8;
--warning-yellow-100: #fef3c7;
--warning-yellow-500: #eab308;
--warning-yellow-600: #ca8a04;

/* Danger - 위험 상태 (예산 초과, 보낼 금액) */
--danger-red-50: #fef2f2;
--danger-red-100: #fee2e2;
--danger-red-500: #ef4444;
--danger-red-600: #dc2626;

/* Neutral - 기본 텍스트 및 배경 */
--neutral-gray-50: #f9fafb;
--neutral-gray-100: #f3f4f6;
--neutral-gray-200: #e5e7eb;
--neutral-gray-400: #9ca3af;
--neutral-gray-500: #6b7280;
--neutral-gray-700: #374151;
--neutral-gray-900: #111827;
```

### 2.3 색상 사용 가이드라인

#### 잔액 표시
- **받을 금액**: Success Green (#22c55e)
- **보낼 금액**: Danger Red (#ef4444)
- **잔액 0**: Neutral Gray (#6b7280)

#### 예산 상태
- **안전 (0-60%)**: Success Green
- **주의 (60-80%)**: Warning Yellow  
- **위험 (80-100%)**: Danger Red
- **초과 (100%+)**: Danger Red + 강조 스타일

#### 카테고리별 색상
```css
--category-food: #f59e0b;      /* 외식 - Amber */
--category-transport: #8b5cf6; /* 교통 - Violet */
--category-shopping: #ec4899;  /* 쇼핑 - Pink */
--category-utilities: #06b6d4; /* 생활 - Cyan */
--category-etc: #6b7280;       /* 기타 - Gray */
```

## 3. 타이포그래피 (Typography)

### 3.1 폰트 패밀리
```css
/* 기본 폰트 스택 */
font-family: 
  "Pretendard Variable", 
  Pretendard, 
  -apple-system, 
  BlinkMacSystemFont, 
  system-ui, 
  Roboto, 
  "Helvetica Neue", 
  "Segoe UI", 
  "Apple SD Gothic Neo", 
  "Noto Sans KR", 
  "Malgun Gothic", 
  "Apple Color Emoji", 
  "Segoe UI Emoji", 
  "Segoe UI Symbol", 
  sans-serif;

/* 숫자 전용 (tabular-nums) */
font-family: 
  "Pretendard Variable", 
  ui-monospace, 
  SFMono-Regular, 
  "SF Mono", 
  Monaco, 
  Consolas, 
  "Liberation Mono", 
  "Courier New", 
  monospace;
font-variant-numeric: tabular-nums;
```

### 3.2 텍스트 스케일
```css
/* Headings */
.text-h1 {
  font-size: 2.25rem;    /* 36px */
  line-height: 2.5rem;   /* 40px */
  font-weight: 700;
  letter-spacing: -0.025em;
}

.text-h2 {
  font-size: 1.875rem;   /* 30px */
  line-height: 2.25rem;  /* 36px */
  font-weight: 700;
  letter-spacing: -0.025em;
}

.text-h3 {
  font-size: 1.5rem;     /* 24px */
  line-height: 2rem;     /* 32px */
  font-weight: 600;
}

.text-h4 {
  font-size: 1.25rem;    /* 20px */
  line-height: 1.75rem;  /* 28px */
  font-weight: 600;
}

/* Body Text */
.text-body-lg {
  font-size: 1.125rem;   /* 18px */
  line-height: 1.75rem;  /* 28px */
  font-weight: 400;
}

.text-body {
  font-size: 1rem;       /* 16px */
  line-height: 1.5rem;   /* 24px */
  font-weight: 400;
}

.text-body-sm {
  font-size: 0.875rem;   /* 14px */
  line-height: 1.25rem;  /* 20px */
  font-weight: 400;
}

.text-caption {
  font-size: 0.75rem;    /* 12px */
  line-height: 1rem;     /* 16px */
  font-weight: 400;
  color: var(--neutral-gray-500);
}

/* Numbers & Currency */
.text-currency-lg {
  font-size: 2.25rem;    /* 36px */
  line-height: 2.5rem;   /* 40px */
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.025em;
}

.text-currency {
  font-size: 1.5rem;     /* 24px */
  line-height: 2rem;     /* 32px */
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.text-currency-sm {
  font-size: 1.125rem;   /* 18px */
  line-height: 1.75rem;  /* 28px */
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
```

### 3.3 텍스트 사용 가이드라인

#### 중요도별 텍스트 스타일
- **최우선 정보 (잔액)**: .text-currency-lg + 브랜드 컬러
- **주요 정보 (예산, 총액)**: .text-currency + 중성 컬러
- **보조 정보 (개별 지출)**: .text-currency-sm + 회색 톤
- **설명 텍스트**: .text-body + .text-caption

#### 금액 표시 규칙
```typescript
// 금액 포맷팅 함수
const formatCurrency = (amount: number): string => {
  return `₩${amount.toLocaleString('ko-KR')}`;
};

// 사용 예시
formatCurrency(15000);    // "₩15,000"
formatCurrency(1500000);  // "₩1,500,000"
```

## 4. 간격 시스템 (Spacing System)

### 4.1 간격 스케일 (8px 기반)
```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
```

### 4.2 컴포넌트별 간격 가이드

#### 페이지 레벨
```css
.page-container {
  padding: var(--spacing-4);          /* 16px */
  gap: var(--spacing-6);              /* 24px between sections */
}

.section-spacing {
  margin-bottom: var(--spacing-8);    /* 32px between major sections */
}
```

#### 카드 컴포넌트
```css
.card-padding {
  padding: var(--spacing-6);          /* 24px */
}

.card-spacing {
  margin-bottom: var(--spacing-4);    /* 16px between cards */
}
```

#### 폼 요소
```css
.form-field-spacing {
  margin-bottom: var(--spacing-5);    /* 20px between form fields */
}

.input-padding {
  padding: var(--spacing-3) var(--spacing-4); /* 12px 16px */
}

.button-padding {
  padding: var(--spacing-3) var(--spacing-6); /* 12px 24px */
}
```

#### 리스트 아이템
```css
.list-item-padding {
  padding: var(--spacing-4) 0;        /* 16px vertical */
}

.list-item-gap {
  gap: var(--spacing-3);              /* 12px between elements */
}
```

## 5. 컴포넌트 스타일링

### 5.1 버튼 스타일
```css
/* Primary Button */
.btn-primary {
  background: var(--primary-blue-500);
  color: white;
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
}

.btn-primary:hover {
  background: var(--primary-blue-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* FAB (Floating Action Button) */
.fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary-blue-500);
  color: white;
  font-size: 1.5rem;
  font-weight: 300;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease-in-out;
}

.fab:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.6);
}
```

### 5.2 카드 스타일
```css
.card {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid var(--neutral-gray-200);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 특별한 카드 (잔액 표시) */
.balance-card {
  background: linear-gradient(135deg, 
    var(--primary-blue-50), 
    var(--primary-blue-100));
  border: 2px solid var(--primary-blue-200);
}
```

### 5.3 입력 필드 스타일
```css
.input {
  padding: var(--spacing-3) var(--spacing-4);
  border: 2px solid var(--neutral-gray-200);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s ease-in-out;
}

.input:focus {
  outline: none;
  border-color: var(--primary-blue-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 금액 입력 필드 */
.currency-input {
  font-size: 1.25rem;
  font-weight: 600;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
```

## 6. 반응형 디자인

### 6.1 브레이크포인트
```css
/* Mobile First Approach */
.container {
  max-width: 100%;
  padding: 0 var(--spacing-4);
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .container {
    max-width: 540px;
    margin: 0 auto;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
    padding: 0 var(--spacing-6);
  }
  
  /* 태블릿에서는 2열 그리드 */
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
  
  /* 데스크톱에서는 사이드바 레이아웃 */
  .desktop-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: var(--spacing-8);
  }
}
```

### 6.2 터치 최적화
```css
/* 최소 터치 타겟 크기 */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* 터치 피드백 */
.touchable {
  -webkit-tap-highlight-color: rgba(59, 130, 246, 0.2);
  touch-action: manipulation;
}

/* 스와이프 가능한 영역 */
.swipeable {
  touch-action: pan-x;
  -webkit-overflow-scrolling: touch;
}
```

## 7. 애니메이션 및 트랜지션

### 7.1 기본 트랜지션
```css
/* 표준 트랜지션 */
.transition-standard {
  transition: all 0.2s ease-in-out;
}

/* 느린 트랜지션 (중요한 상태 변경) */
.transition-slow {
  transition: all 0.3s ease-in-out;
}

/* 빠른 트랜지션 (호버 효과) */
.transition-fast {
  transition: all 0.15s ease-in-out;
}
```

### 7.2 마이크로 인터랙션
```css
/* 버튼 프레스 효과 */
.btn-press {
  transform: scale(0.98);
  transition: transform 0.1s ease-in-out;
}

/* 로딩 스피너 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

/* 페이드인 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.4s ease-out;
}
```

## 8. 접근성 (Accessibility)

### 8.1 색상 대비
- **일반 텍스트**: 최소 4.5:1 대비율
- **큰 텍스트 (18px+)**: 최소 3:1 대비율
- **상태 표시**: 색상과 함께 아이콘/텍스트로 정보 전달

### 8.2 포커스 표시
```css
.focus-visible {
  outline: 2px solid var(--primary-blue-500);
  outline-offset: 2px;
}

/* 키보드 네비게이션 */
.keyboard-navigation:focus-visible {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}
```

### 8.3 스크린 리더 지원
```css
/* 스크린 리더 전용 텍스트 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## 9. 다크 모드 (향후 확장)

### 9.1 다크 모드 색상 정의
```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0f172a;
    --foreground: #f1f5f9;
    --card: #1e293b;
    --card-foreground: #f1f5f9;
    --border: #334155;
    --input: #1e293b;
  }
}
```

이 스타일 가이드는 PairPay의 일관된 디자인 시스템을 구축하기 위한 기반입니다. 개발 과정에서 필요에 따라 추가되거나 수정될 수 있습니다.
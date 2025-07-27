# 지출 등록 폼 사용 가이드

## 개요
지출 등록 폼(ExpenseForm)은 사용자가 공동 지출을 기록할 수 있는 모달 형태의 컴포넌트입니다.

## 주요 기능

### 1. 필수 입력 필드
- **금액**: 숫자만 입력 가능, 0보다 큰 값
- **지출 내용**: 최대 100자, 필수 입력
- **카테고리**: 5개 카테고리 중 선택 (외식, 교통, 쇼핑, 생활용품, 기타)
- **날짜**: 기본값은 오늘 날짜

### 2. 분담 비율 설정
- **반반 (50:50)**: 동등하게 분담
- **내가 전액 부담**: 상대방 부담 없음
- **상대방이 전액 부담**: 내 부담 없음
- 분담 금액 미리보기 제공

### 3. 선택사항
- **상세 설명**: 최대 200자
- **메모**: 최대 500자, 다중 라인 입력

## 사용 방법

### 컴포넌트 import
```tsx
import ExpenseForm from '@/components/forms/ExpenseForm'
```

### 기본 사용법
```tsx
const [isFormOpen, setIsFormOpen] = useState(false)

return (
  <>
    <Button onClick={() => setIsFormOpen(true)}>
      지출 등록
    </Button>
    
    {isFormOpen && (
      <ExpenseForm
        pairId="your-pair-id"
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false)
          // 지출 목록 새로고침 등
        }}
      />
    )}
  </>
)
```

## Props

### ExpenseFormProps
- `pairId: string` - 현재 페어의 ID (필수)
- `onClose: () => void` - 폼 닫기 콜백 (필수)
- `onSuccess?: () => void` - 등록 성공 시 콜백 (선택)

## 유효성 검증

### 클라이언트 검증
- 금액: 0보다 큰 숫자여야 함
- 제목: 공백이 아닌 문자열
- 카테고리: 반드시 선택
- 날짜: 유효한 날짜 형식

### 서버 검증
- Supabase 스키마 제약 조건 적용
- 데이터베이스 레벨에서 검증

## 카테고리

| 값 | 라벨 | 이모지 |
|---|---|---|
| food | 외식 | 🍽️ |
| transport | 교통 | 🚗 |
| shopping | 쇼핑 | 🛍️ |
| utilities | 생활용품 | 🏠 |
| etc | 기타 | 💰 |

## 상태 관리

### 폼 상태
- 입력 데이터 관리
- 유효성 검증 오류 상태
- 제출 중/완료/실패 상태

### 제출 플로우
1. 클라이언트 유효성 검증
2. Supabase `addExpense` 함수 호출
3. 성공/실패 상태 표시
4. 성공 시 폼 초기화 및 콜백 실행

## 테스트

### 브라우저 콘솔 테스트
```javascript
// 유효성 검증 테스트
runExpenseFormTests()

// 카테고리 매핑 확인
testCategoryMapping()

// 분담 비율 계산 테스트
testSplitCalculations()
```

### 수동 테스트 시나리오
1. **정상 등록**: 모든 필드 입력 후 등록
2. **필수 필드 누락**: 각 필수 필드별로 누락 시 오류 확인
3. **분담 비율 변경**: 각 분담 옵션별 계산 결과 확인
4. **네트워크 오류**: Supabase 연결 실패 시 오류 처리 확인

## 스타일링

### 반응형 디자인
- 모바일: 화면 하단에서 올라오는 모달
- 데스크톱: 중앙 모달

### 접근성
- 키보드 네비게이션 지원
- 스크린 리더 호환
- 적절한 포커스 관리
- 오류 메시지 접근성

## Supabase 연동

### 데이터 구조
```typescript
interface DatabaseExpense {
  pair_id: string
  amount: number
  title: string
  description: string | null
  expense_date: string
  paid_by: string
  split_ratio: number
  category: string
  memo: string | null
  receipt_url: string | null
  is_settled: boolean
  settled_at: string | null
}
```

### 오류 처리
- 네트워크 연결 실패
- 권한 오류
- 데이터 형식 오류
- 서버 내부 오류

사용자에게 친화적인 오류 메시지 표시 및 재시도 유도
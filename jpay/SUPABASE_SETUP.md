# Supabase 데이터베이스 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 새 프로젝트 생성
2. 프로젝트 이름: `jpay` 또는 원하는 이름
3. 리전: South Korea (가장 가까운 리전)

## 2. 데이터베이스 스키마 생성

Supabase 대시보드의 SQL Editor에서 다음 스크립트 실행:

```sql
-- database-schema.sql 파일의 내용을 복사하여 실행
```

또는 프로젝트 루트의 `database-schema.sql` 파일을 Supabase SQL Editor에 복사하여 실행하세요.

## 3. 환경 변수 설정

1. `.env.local` 파일을 프로젝트 루트에 생성:

```bash
cp .env.example .env.local
```

2. Supabase 대시보드에서 다음 정보 복사:
   - Project URL: Settings > API > Project URL
   - Anon key: Settings > API > Project API keys의 `anon public`

3. `.env.local` 파일에 실제 값 입력:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

## 4. 테이블 구조

### pairs (페어 정보)
- `id`: 고유 식별자
- `invite_code`: 8자리 초대 코드
- `user1_id`, `user2_id`: 익명 사용자 ID
- `pair_name`: 페어 이름 (기본값: '우리')
- `currency`: 통화 (기본값: 'KRW')

### expenses (지출 기록)
- `id`: 고유 식별자
- `pair_id`: 페어 참조
- `amount`: 금액
- `title`: 지출 제목
- `paid_by`: 결제자 ID
- `split_ratio`: 분담 비율 (0.5 = 50:50)
- `category`: 카테고리
- `expense_date`: 지출 날짜

### budgets (예산 설정)
- `id`: 고유 식별자
- `pair_id`: 페어 참조
- `budget_year`, `budget_month`: 예산 연월
- `total_budget`: 총 예산
- `category_budgets`: 카테고리별 예산 (JSON)

## 5. 테스트

개발 서버 실행 후 브라우저 콘솔에서:

```javascript
// test-supabase.ts의 함수 실행
runSupabaseTests()
```

## 6. 주요 기능

### 익명 세션
- 로그인 없이 localStorage에 익명 ID 저장
- 각 기기별로 고유한 익명 사용자 생성

### 페어 시스템
- 8자리 초대 코드로 페어 생성/참여
- 최대 2명까지 참여 가능

### 데이터 보안
- Row Level Security (RLS) 활성화
- 익명 사용자에게만 접근 권한 부여

## 7. 문제 해결

### 연결 오류
1. `.env.local` 파일의 URL과 KEY 확인
2. Supabase 프로젝트가 활성 상태인지 확인
3. 네트워크 연결 상태 확인

### SQL 오류
1. 스키마가 올바르게 실행되었는지 확인
2. 테이블이 정상 생성되었는지 Supabase 대시보드에서 확인

### 권한 오류
1. RLS 정책이 올바르게 설정되었는지 확인
2. 익명 접근이 허용되었는지 확인
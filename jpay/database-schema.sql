-- PairPay Supabase Database Schema
-- PRD 기반 3개 핵심 테이블: pairs, expenses, budgets

-- 1. Pairs 테이블 (커플/친구 등 2인 관계)
CREATE TABLE pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code VARCHAR(8) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 두 사용자의 익명 식별자
  user1_id VARCHAR(50) NOT NULL,
  user2_id VARCHAR(50),
  
  -- 페어 설정
  pair_name VARCHAR(50) DEFAULT '우리',
  currency VARCHAR(3) DEFAULT 'KRW',
  
  -- 인덱스
  CONSTRAINT pairs_invite_code_check CHECK (invite_code ~ '^[A-Z0-9]{8}$')
);

-- 2. Expenses 테이블 (지출 기록)
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_id UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 지출 기본 정보
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  title VARCHAR(100) NOT NULL,
  description TEXT,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- 결제자 및 분담
  paid_by VARCHAR(50) NOT NULL, -- user1_id 또는 user2_id
  split_ratio DECIMAL(3,2) DEFAULT 0.50 CHECK (split_ratio >= 0 AND split_ratio <= 1), -- 0.5 = 50:50
  
  -- 카테고리 및 태그
  category VARCHAR(50) DEFAULT '기타',
  
  -- 영수증/메모
  receipt_url TEXT,
  memo TEXT,
  
  -- 정산 상태
  is_settled BOOLEAN DEFAULT FALSE,
  settled_at TIMESTAMP WITH TIME ZONE
);

-- 3. Budgets 테이블 (공동 예산 설정)
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_id UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 예산 기간
  budget_year INTEGER NOT NULL,
  budget_month INTEGER NOT NULL CHECK (budget_month >= 1 AND budget_month <= 12),
  
  -- 예산 설정
  total_budget DECIMAL(12,2) CHECK (total_budget > 0),
  category_budgets JSONB DEFAULT '{}', -- {"식비": 300000, "교통비": 100000}
  
  -- 알림 설정
  alert_threshold DECIMAL(3,2) DEFAULT 0.80 CHECK (alert_threshold > 0 AND alert_threshold <= 1), -- 80% 소진시 알림
  
  UNIQUE(pair_id, budget_year, budget_month)
);

-- 인덱스 생성
CREATE INDEX idx_pairs_invite_code ON pairs(invite_code);
CREATE INDEX idx_pairs_user1_id ON pairs(user1_id);
CREATE INDEX idx_pairs_user2_id ON pairs(user2_id);

CREATE INDEX idx_expenses_pair_id ON expenses(pair_id);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX idx_expenses_paid_by ON expenses(paid_by);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_is_settled ON expenses(is_settled);

CREATE INDEX idx_budgets_pair_id ON budgets(pair_id);
CREATE INDEX idx_budgets_year_month ON budgets(budget_year, budget_month);

-- Row Level Security (RLS) 설정
ALTER TABLE pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- 익명 사용자도 접근할 수 있도록 정책 설정 (나중에 익명 세션 로직과 연동)
CREATE POLICY "Enable all operations for anonymous users" ON pairs
  FOR ALL USING (true);

CREATE POLICY "Enable all operations for anonymous users" ON expenses
  FOR ALL USING (true);

CREATE POLICY "Enable all operations for anonymous users" ON budgets
  FOR ALL USING (true);

-- 기본 카테고리 데이터 타입을 위한 ENUM (선택사항)
-- CREATE TYPE expense_category AS ENUM (
--   '식비', '교통비', '쇼핑', '엔터테인먼트', '의료/건강', 
--   '교육', '주거비', '기타'
-- );

-- 트리거 함수: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 적용
CREATE TRIGGER update_pairs_updated_at 
  BEFORE UPDATE ON pairs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at 
  BEFORE UPDATE ON expenses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at 
  BEFORE UPDATE ON budgets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
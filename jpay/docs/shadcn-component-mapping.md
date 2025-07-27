# shadcn/ui 컴포넌트 매핑 및 커스텀 구조 설계

## 1. 화면별 shadcn/ui 컴포넌트 매핑

### 1.1 대시보드 (Dashboard)
```tsx
// 주요 컴포넌트 구성
<div className="container mx-auto p-4 space-y-6">
  {/* Header */}
  <header className="flex justify-between items-center">
    <h1>PairPay</h1>
    <Button variant="ghost" size="sm">⚙️</Button>
  </header>

  {/* Balance Card - Custom Component */}
  <Card className="p-6 text-center bg-gradient-to-r from-blue-50 to-indigo-50">
    <CardContent>
      <Badge variant="secondary">A가 B에게</Badge>
      <div className="text-3xl font-bold mt-2">₩15,000</div>
      <p className="text-muted-foreground">받을 금액</p>
    </CardContent>
  </Card>

  {/* Quick Stats Grid */}
  <div className="grid grid-cols-2 gap-4">
    <Card>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">이번 달 총 지출</div>
        <div className="text-2xl font-bold">₩450,000</div>
      </CardContent>
    </Card>
    {/* 3개 더... */}
  </div>

  {/* Budget Progress */}
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">월 예산</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex justify-between text-sm">
        <span>₩600,000</span>
        <span>₩800,000</span>
      </div>
      <Progress value={75} className="mt-2" />
      <p className="text-sm text-muted-foreground mt-2">75% 사용</p>
    </CardContent>
  </Card>

  {/* Recent Expenses */}
  <Card>
    <CardHeader>
      <CardTitle>최근 지출</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {expenses.map(expense => (
        <div key={expense.id} className="flex justify-between items-center">
          <div>
            <div className="font-medium">{expense.description}</div>
            <Badge variant="outline">{expense.category}</Badge>
          </div>
          <div className="text-right">
            <div className="font-bold">₩{expense.amount}</div>
            <div className="text-sm text-muted-foreground">{expense.payer}</div>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
</div>

{/* FAB */}
<Button 
  className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
  size="lg"
>
  +
</Button>
```

### 1.2 지출 기록 (Add Expense)
```tsx
// 주요 컴포넌트 구성
<div className="container mx-auto p-4">
  <form className="space-y-6">
    {/* Amount Input */}
    <div className="space-y-2">
      <Label htmlFor="amount">금액 *</Label>
      <div className="relative">
        <span className="absolute left-3 top-3 text-lg">₩</span>
        <Input
          id="amount"
          type="number"
          placeholder="0"
          className="pl-8 text-lg h-12"
        />
      </div>
    </div>

    {/* Category Selection */}
    <div className="space-y-3">
      <Label>카테고리 *</Label>
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            type="button"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>

    {/* Payer Selection */}
    <div className="space-y-3">
      <Label>결제자 *</Label>
      <RadioGroup defaultValue="me">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="me" id="me" />
          <Label htmlFor="me">A (나)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="partner" id="partner" />
          <Label htmlFor="partner">B (상대방)</Label>
        </div>
      </RadioGroup>
    </div>

    {/* Split Method */}
    <div className="space-y-3">
      <Label>분담 방식</Label>
      <RadioGroup defaultValue="half">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="half" id="half" />
          <Label htmlFor="half">반반</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="full-a" id="full-a" />
          <Label htmlFor="full-a">전액 A</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="full-b" id="full-b" />
          <Label htmlFor="full-b">전액 B</Label>
        </div>
      </RadioGroup>
    </div>

    {/* Description */}
    <div className="space-y-2">
      <Label htmlFor="description">메모 (선택)</Label>
      <Input
        id="description"
        placeholder="간단한 설명..."
      />
    </div>

    {/* Date */}
    <div className="space-y-2">
      <Label>날짜</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "날짜 선택"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>

    {/* Submit Button */}
    <Button type="submit" className="w-full h-12 text-lg">
      저장하기
    </Button>
  </form>
</div>
```

### 1.3 예산 관리 (Budget Management)
```tsx
// 주요 컴포넌트 구성
<div className="container mx-auto p-4 space-y-6">
  {/* Total Budget Card */}
  <Card>
    <CardHeader>
      <CardTitle>2024년 1월 예산</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>사용 금액: ₩600,000</span>
          <span>총 예산: ₩800,000</span>
        </div>
        <Progress value={75} className="h-3" />
        <div className="text-center">
          <Badge variant={75 > 80 ? "destructive" : "secondary"}>
            75% 사용
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Category Budget List */}
  <div className="space-y-4">
    {categoryBudgets.map(budget => (
      <Card key={budget.category}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{budget.category}</span>
            <Badge variant={budget.percentage > 80 ? "destructive" : "secondary"}>
              {budget.percentage}%
            </Badge>
          </div>
          <div className="space-y-2">
            <Progress value={budget.percentage} />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₩{budget.used.toLocaleString()}</span>
              <span>₩{budget.total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>

  {/* Edit Budget Button */}
  <Button className="w-full" variant="outline">
    예산 수정하기
  </Button>
</div>
```

### 1.4 내역 리스트 (Expense List)
```tsx
// 주요 컴포넌트 구성
<div className="container mx-auto p-4 space-y-6">
  {/* Month Navigation */}
  <div className="flex justify-between items-center">
    <Button variant="ghost" size="sm">←</Button>
    <h2 className="text-lg font-semibold">2024년 1월</h2>
    <Button variant="ghost" size="sm">→</Button>
  </div>

  {/* Summary Card */}
  <Card>
    <CardContent className="p-4">
      <div className="text-center space-y-2">
        <div className="text-2xl font-bold">₩600,000</div>
        <div className="text-sm text-muted-foreground">1월 총 지출</div>
        <div className="flex justify-center gap-4 text-sm">
          <span>A: ₩320,000 (53%)</span>
          <span>B: ₩280,000 (47%)</span>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Filter Chips */}
  <ScrollArea>
    <div className="flex gap-2 pb-2">
      {filters.map(filter => (
        <Button
          key={filter}
          variant={selectedFilter === filter ? "default" : "outline"}
          size="sm"
          className="whitespace-nowrap"
        >
          {filter}
        </Button>
      ))}
    </div>
  </ScrollArea>

  {/* Expense List */}
  <div className="space-y-4">
    {groupedExpenses.map(group => (
      <Card key={group.date}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            {group.date}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {group.expenses.map(expense => (
            <div key={expense.id} className="flex justify-between items-center py-2">
              <div className="flex-1">
                <div className="font-medium">{expense.description}</div>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {expense.category}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {expense.payer}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">₩{expense.amount.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    ))}
  </div>
</div>
```

### 1.5 정산 (Settlement)
```tsx
// 주요 컴포넌트 구성
<div className="container mx-auto p-4 space-y-6">
  {/* Settlement Card */}
  <Card className="p-6">
    <CardContent className="text-center space-y-4">
      <div className="space-y-2">
        <div className="text-lg text-muted-foreground">A가 B에게 보낼 금액</div>
        <div className="text-4xl font-bold text-blue-600">₩15,000</div>
      </div>
      
      <Separator />
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>A 총 지출:</span>
          <span>₩285,000</span>
        </div>
        <div className="flex justify-between">
          <span>B 총 지출:</span>
          <span>₩315,000</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>차액 (₩30,000 ÷ 2):</span>
          <span>₩15,000</span>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Payment Methods */}
  <div className="space-y-3">
    <Label>정산 방법</Label>
    <div className="space-y-2">
      <Button variant="outline" className="w-full justify-start">
        💳 카카오페이로 보내기
      </Button>
      <Button variant="outline" className="w-full justify-start">
        🏦 계좌이체로 보내기
      </Button>
      <Button variant="outline" className="w-full justify-start">
        💰 현금으로 정산하기
      </Button>
    </div>
  </div>

  {/* Confirm Button */}
  <Alert>
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>정산 완료 후</AlertTitle>
    <AlertDescription>
      모든 잔액이 0으로 리셋되고, 지출 내역은 기록으로 보관됩니다.
    </AlertDescription>
  </Alert>
  
  <Button className="w-full h-12 text-lg">
    정산 완료
  </Button>
</div>
```

## 2. 필요한 shadcn/ui 컴포넌트 목록

### 2.1 레이아웃 & 컨테이너
- `Card` + `CardHeader` + `CardContent` + `CardTitle`
- `Container` (커스텀)
- `Separator`

### 2.2 폼 컴포넌트
- `Input`
- `Label`
- `Button` (다양한 variant)
- `RadioGroup` + `RadioGroupItem`
- `Checkbox`
- `Select` + `SelectContent` + `SelectItem` + `SelectTrigger`

### 2.3 네비게이션 & 상호작용
- `Tabs` + `TabsList` + `TabsContent` + `TabsTrigger`
- `Popover` + `PopoverContent` + `PopoverTrigger`
- `Calendar`
- `ScrollArea`

### 2.4 피드백 & 상태 표시
- `Progress`
- `Badge`
- `Alert` + `AlertTitle` + `AlertDescription`
- `Toast` (알림용)

### 2.5 아이콘
- Lucide React 아이콘 라이브러리 활용
- `CalendarIcon`, `AlertCircle`, `Settings` 등

## 3. 커스텀 컴포넌트 설계

### 3.1 BalanceCard
```tsx
interface BalanceCardProps {
  amount: number;
  fromUser: string;
  toUser: string;
  type: 'receive' | 'pay';
}

const BalanceCard: React.FC<BalanceCardProps> = ({ amount, fromUser, toUser, type }) => {
  const bgColor = type === 'receive' ? 'bg-green-50' : 'bg-red-50';
  const textColor = type === 'receive' ? 'text-green-600' : 'text-red-600';
  
  return (
    <Card className={`p-6 text-center ${bgColor}`}>
      <CardContent>
        <Badge variant="secondary">
          {fromUser}가 {toUser}에게
        </Badge>
        <div className={`text-3xl font-bold mt-2 ${textColor}`}>
          ₩{amount.toLocaleString()}
        </div>
        <p className="text-muted-foreground">
          {type === 'receive' ? '받을 금액' : '보낼 금액'}
        </p>
      </CardContent>
    </Card>
  );
};
```

### 3.2 ExpenseItem
```tsx
interface ExpenseItemProps {
  expense: {
    id: string;
    description: string;
    amount: number;
    category: string;
    payer: string;
    date: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onEdit, onDelete }) => {
  return (
    <div className="flex justify-between items-center py-2 group">
      <div className="flex-1">
        <div className="font-medium">{expense.description}</div>
        <div className="flex gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {expense.category}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {expense.payer}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="font-bold">₩{expense.amount.toLocaleString()}</div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={() => onEdit?.(expense.id)}>
            ✏️
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete?.(expense.id)}>
            🗑️
          </Button>
        </div>
      </div>
    </div>
  );
};
```

### 3.3 BudgetProgressBar
```tsx
interface BudgetProgressProps {
  used: number;
  total: number;
  category?: string;
}

const BudgetProgressBar: React.FC<BudgetProgressProps> = ({ used, total, category }) => {
  const percentage = Math.round((used / total) * 100);
  const variant = percentage > 80 ? 'destructive' : percentage > 60 ? 'secondary' : 'default';
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        {category && <span className="font-medium">{category}</span>}
        <Badge variant={variant}>{percentage}%</Badge>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>₩{used.toLocaleString()}</span>
        <span>₩{total.toLocaleString()}</span>
      </div>
    </div>
  );
};
```

## 4. 테마 및 CSS 변수 활용

### 4.1 커스텀 CSS 변수
```css
:root {
  --radius: 0.5rem;
  
  /* PairPay 브랜드 색상 */
  --primary-blue: 220 90% 50%;
  --secondary-blue: 220 60% 95%;
  --success-green: 142 76% 36%;
  --warning-yellow: 45 93% 58%;
  --danger-red: 0 84% 60%;
  
  /* 그래디언트 */
  --gradient-primary: linear-gradient(135deg, hsl(var(--primary-blue)), hsl(220 80% 60%));
}
```

### 4.2 반응형 유틸리티 클래스
```css
/* 모바일 우선 반응형 */
.container-mobile {
  @apply px-4 mx-auto max-w-sm;
}

@media (min-width: 768px) {
  .container-mobile {
    @apply max-w-md;
  }
}

/* 터치 최적화 */
.touch-target {
  @apply min-h-[44px] min-w-[44px];
}

/* PWA 안전 영역 */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```

이 설계를 통해 shadcn/ui의 장점을 최대한 활용하면서도 PairPay만의 브랜드 아이덴티티를 구현할 수 있습니다.
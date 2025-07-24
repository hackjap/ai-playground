# px CLI 사용법 가이드

## 📖 개요
`px`는 AI 개발 환경을 빠르게 설정할 수 있는 TypeScript 기반 CLI 도구입니다. Cursor AI, Claude AI, VSCode AI 설정 등을 자동으로 생성하여 개발 생산성을 향상시킵니다.

## 🚀 설치 및 설정

### 로컬 개발 환경 설정
```bash
# 저장소 클론
git clone <repository-url>
cd px

# 의존성 설치
npm install

# 프로젝트 빌드
npm run build

# 전역 설치 (px 명령어 사용)
npm install -g .
```

## 💻 사용 방법

### 1. 기본 명령어 구조
```bash
px [options] [command]
```

### 2. 도움말 확인
```bash
px --help              # 전체 명령어 도움말
px init --help         # init 명령어 상세 도움말
px add --help          # add 명령어 도움말
```

## 🎯 주요 명령어

### `px init` - 프로젝트 생성

#### 기본 사용법
```bash
# 대화형 모드 (권장)
px init

# 프로젝트명 지정
px init my-ai-project

# 템플릿 지정하여 생성
px init my-project --template cursor-rules

# 모든 질문에 자동 응답
px init my-project --template claude-prompts --yes

# 패키지 설치 건너뛰기
px init my-project --skip-install
```

#### 옵션 설명
| 옵션 | 단축 | 설명 |
|------|------|------|
| `--template <template>` | `-t` | 사용할 템플릿 지정 |
| `--yes` | `-y` | 모든 질문에 자동으로 yes 응답 |
| `--skip-install` | - | 패키지 설치 건너뛰기 |

### `px add` - 플러그인 추가 (개발 예정)
```bash
px add <plugin-name>    # 플러그인 설치
px add eslint-config    # ESLint 설정 플러그인 추가
```

### 슬래시 명령어 (개발 예정)
```bash
px /lint               # 린트 검사 및 수정
px /test               # 테스트 실행  
px /format             # 코드 포맷팅
```

## 📋 템플릿 가이드

### 1. `cursor-rules` 🎯
**Cursor AI 개발 규칙 설정**
```bash
px init my-cursor-project -t cursor-rules -y
```

**생성되는 파일:**
- `.cursor/rules/generate-test-code.md` - 테스트 코드 생성 규칙
- `.cursor/rules/refactor-logic.md` - 리팩토링 규칙
- `.cursor/rules/custom-rule-example.md` - 커스텀 규칙 예시
- `README.md` - 사용법 가이드

**사용 시나리오:**
- 자동 테스트 코드 생성
- 코드 리팩토링 지원
- 프로젝트별 코딩 규칙 적용

### 2. `claude-prompts` 🤖
**Claude AI 프롬프트 모음**
```bash
px init my-claude-project -t claude-prompts -y
```

**생성되는 파일:**
- `claude/code-review.md` - 코드 리뷰 프롬프트
- `claude/debug-error.md` - 디버깅 프롬프트
- `claude/document-function.md` - 함수 문서화 프롬프트
- `README.md` - 프롬프트 사용법

**사용 시나리오:**
- 체계적인 코드 리뷰
- 효율적인 디버깅
- 자동 문서 생성

### 3. `common-ai-settings` ⚙️
**공통 AI 도구 설정**
```bash
px init my-ai-workspace -t common-ai-settings -y
```

**생성되는 파일:**
- `.vscode/settings.json` - VSCode AI 확장 설정
- `.ai/config.json` - AI 도구 통합 설정
- `package.json` - AI 도구 의존성 (자동 설치)
- `README.md` - 설정 가이드

**사용 시나리오:**
- GitHub Copilot 최적화
- 다중 AI 도구 통합
- 팀 표준 AI 설정

## 🔧 실행 환경별 사용법

### 1. 프로젝트 루트에서 전역 명령어 사용 (권장)
```bash
cd /path/to/px
px init my-project -t cursor-rules -y
```

### 2. 직접 실행 (어디서나 사용 가능)
```bash
node /path/to/px/dist/bin/index.js init my-project -t claude-prompts -y
```

### 3. npm script 사용
```bash
cd /path/to/px
npm start init my-project -t common-ai-settings -y
```

## 📝 사용 예시

### 시나리오 1: Cursor AI 개발환경 구축
```bash
# 1. Cursor 규칙 프로젝트 생성
px init cursor-dev-env -t cursor-rules -y

# 2. 프로젝트 이동
cd cursor-dev-env

# 3. Cursor에서 프로젝트 열기
cursor .

# 4. .cursor/rules/ 폴더의 규칙 활용
```

### 시나리오 2: Claude AI 프롬프트 활용
```bash
# 1. Claude 프롬프트 프로젝트 생성
px init claude-workspace -t claude-prompts -y

# 2. 코드 리뷰 프롬프트 사용
cat claude/code-review.md | pbcopy  # 클립보드에 복사

# 3. Claude AI에 붙여넣기하여 코드 리뷰 요청
```

### 시나리오 3: 팀 AI 설정 표준화
```bash
# 1. 공통 AI 설정 프로젝트 생성
px init team-ai-config -t common-ai-settings -y

# 2. VSCode에서 프로젝트 열기
code team-ai-config

# 3. .vscode/settings.json 설정이 자동 적용됨
```

## 🛠️ 고급 사용법

### 변수 치환 활용
템플릿 파일에서 사용 가능한 변수:
- `{{projectName}}` - 프로젝트명
- `{{mainLanguage}}` - 주요 언어 (typescript, javascript, python 등)
- `{{taskDescription}}` - 프로젝트 목적/설명

### 기존 파일 처리
기존 디렉토리에 프로젝트 생성 시:
- `overwrite` - 기존 파일 덮어쓰기
- `skip` - 기존 파일 유지하고 새 파일만 생성
- `merge` - 설정 파일 병합 (JSON 파일 등)

## 🔍 문제 해결

### 자주 발생하는 문제

#### 1. `px: command not found`
**해결책:**
```bash
# 전역 설치 확인
npm list -g px

# 재설치
cd /path/to/px
npm install -g .
```

#### 2. 템플릿을 찾을 수 없음
**원인:** 상대 경로 문제 (전역 설치 시)
**해결책:**
```bash
# 프로젝트 루트에서 실행
cd /path/to/px
px init my-project -t cursor-rules
```

#### 3. 권한 오류
**해결책:**
```bash
# sudo 사용 (macOS/Linux)
sudo npm install -g .

# 또는 직접 실행 사용
node dist/bin/index.js init my-project
```

### 로그 및 디버깅
```bash
# 상세 로그 확인
DEBUG=px* px init my-project

# 버전 확인
px --version
```

## 📚 추가 리소스

### 관련 문서
- [기술 요구사항 문서 (TRD)](../TRD.md)
- [제품 요구사항 문서 (PRD)](../PRD.md)
- [템플릿 개발 가이드](./TEMPLATE_DEVELOPMENT.md)

### 지원 및 기여
- GitHub Issues: 버그 리포트 및 기능 요청
- Pull Requests: 코드 기여 환영
- Wiki: 상세 문서 및 예시

---

## 📞 지원

문제가 발생하거나 추가 기능이 필요한 경우:
1. GitHub Issues에 등록
2. 팀 슬랙 채널 문의  
3. 문서 업데이트 제안

**Happy Coding with AI! 🚀✨** 
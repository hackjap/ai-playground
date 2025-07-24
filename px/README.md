# Project Starter CLI (px)

TypeScript 기반 AI 개발 환경 자동 설정 도구

## 📖 개요

AI 개발 환경을 빠르게 설정할 수 있는 CLI 도구입니다. Cursor AI, Claude AI, VSCode AI 설정 등을 자동으로 생성하여 개발 생산성을 향상시킵니다.

## 🚀 주요 기능

- **AI 템플릿 생성**: Cursor AI 규칙, Claude 프롬프트, VSCode AI 설정 자동 생성
- **TUI 인터페이스**: 직관적인 텍스트 기반 사용자 인터페이스
- **변수 치환**: 프로젝트별 맞춤 설정 자동 적용
- **무인 설치**: `--yes` 옵션으로 자동 설치 지원
- **확장성**: 플러그인 아키텍처로 기능 확장 가능

## 📋 요구사항

- Node.js >= 18.0.0
- npm >= 8.0.0

## ⚡ 빠른 시작

### 설치
```bash
# 저장소 클론 및 설치
git clone <repository-url>
cd px
npm install
npm run build
npm install -g .
```

### 사용법
```bash
# AI 개발 환경 생성 (대화형)
px init

# Cursor AI 규칙 생성
px init my-project --template cursor-rules --yes

# Claude AI 프롬프트 생성  
px init my-project --template claude-prompts --yes

# VSCode AI 설정 생성
px init my-project --template common-ai-settings --yes

# 도움말
px --help
```

### 사용 가능한 템플릿
- 🎯 `cursor-rules`: Cursor AI 규칙 설정
- 🤖 `claude-prompts`: Claude AI 프롬프트 모음
- ⚙️ `common-ai-settings`: 공통 AI 도구 설정

## 🛠️ 개발

```bash
# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 빌드
npm run build

# 테스트 실행
npm run test

# 린트 검사
npm run lint

# 코드 포맷팅
npm run format
```

## 📦 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 로컬에서 CLI 테스트
px init test-project
```

## 📚 문서

- [📖 상세 사용법 가이드](./docs/CLI_USAGE_GUIDE.md)
- [⚙️ 기술 요구사항 문서](./docs/TRD.md)
- [📋 제품 요구사항 문서](./docs/PRD.md)

## 🎯 로드맵

- [ ] Phase 1: 템플릿 생성, 기본 설정, TUI
- [ ] Phase 2: 플러그인 시스템, 슬래시 커맨드
- [ ] Phase 3: 분석 로그, CI 통합, 접근성 개선 
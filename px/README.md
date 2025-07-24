# Project Starter CLI (px)

TypeScript 기반 프로젝트 초기 설정 자동화 도구

## 📖 개요

개발팀이 새로운 프로젝트를 시작할 때 필수 설정파일(예: `.eslintrc`, `tsconfig.json`, CI 파이프라인 등)을 자동 생성·관리해 주는 CLI 도구입니다.

## 🚀 주요 기능

- **템플릿 기반 프로젝트 생성**: `px init` 명령으로 기본 설정이 자동 적용
- **TUI 인터페이스**: 직관적인 텍스트 기반 사용자 인터페이스
- **플러그인 아키텍처**: NPM 패키지로 배포되는 플러그인 로딩
- **슬래시 커맨드**: `px /lint fix` 등 단축 명령
- **무인 설치**: `--yes` 옵션으로 자동 설치 지원

## 📋 요구사항

- Node.js >= 18.0.0
- npm >= 8.0.0

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
npm link
px --help
```

## 🎯 로드맵

- [ ] Phase 1: 템플릿 생성, 기본 설정, TUI
- [ ] Phase 2: 플러그인 시스템, 슬래시 커맨드
- [ ] Phase 3: 분석 로그, CI 통합, 접근성 개선 
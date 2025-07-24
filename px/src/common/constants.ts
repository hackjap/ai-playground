/**
 * 기본 설정
 */
export const DEFAULT_CONFIG = {
  CONFIG_FILE_NAME: '.projectstarterrc.json',
  TEMPLATES_DIR: 'templates',
  PLUGINS_DIR: 'plugins',
} as const;

/**
 * 지원되는 템플릿 목록 (AI 개발 환경 설정)
 */
export const SUPPORTED_TEMPLATES = [
  'cursor-rules',
  'claude-prompts',
  'common-ai-settings',
] as const;

/**
 * 템플릿 설명
 */
export const TEMPLATE_DESCRIPTIONS = {
  'cursor-rules': '🎯 Cursor AI 규칙 설정 - 테스트 코드 생성, 리팩토링 등 개발 규칙',
  'claude-prompts': '🤖 Claude AI 프롬프트 - 코드 리뷰, 디버깅, 문서화 프롬프트',
  'common-ai-settings': '⚙️ 공통 AI 설정 - VSCode Copilot 및 기타 AI 도구 설정',
} as const;

/**
 * CLI 메시지
 */
export const MESSAGES = {
  WELCOME: '🚀 Project Starter CLI에 오신 것을 환영합니다!',
  SUCCESS: '✅ 프로젝트가 성공적으로 생성되었습니다!',
  ERROR: '❌ 오류가 발생했습니다:',
  WARNING: '⚠️ 경고:',
} as const; 
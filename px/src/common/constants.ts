/**
 * 기본 설정
 */
export const DEFAULT_CONFIG = {
  CONFIG_FILE_NAME: '.projectstarterrc.json',
  TEMPLATES_DIR: 'templates',
  PLUGINS_DIR: 'plugins',
} as const;

/**
 * 지원되는 템플릿 목록
 */
export const SUPPORTED_TEMPLATES = [
  'node-basic',
  'react-basic',
] as const;

/**
 * CLI 메시지
 */
export const MESSAGES = {
  WELCOME: '🚀 Project Starter CLI에 오신 것을 환영합니다!',
  SUCCESS: '✅ 프로젝트가 성공적으로 생성되었습니다!',
  ERROR: '❌ 오류가 발생했습니다:',
  WARNING: '⚠️ 경고:',
} as const; 
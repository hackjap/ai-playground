/**
 * 프로젝트 템플릿 타입
 */
export interface ProjectTemplate {
  name: string;
  description: string;
  path: string;
  dependencies: string[];
  devDependencies: string[];
}

/**
 * CLI 명령어 옵션
 */
export interface CliOptions {
  yes?: boolean; // 자동 승인 (무인 설치)
  template?: string; // 템플릿 이름
  name?: string; // 프로젝트 이름
}

/**
 * 설정 파일 타입
 */
export interface ProjectConfig {
  name: string;
  template: string;
  createdAt: string;
  plugins: string[];
} 
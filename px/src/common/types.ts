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
  skipInstall?: boolean; // 패키지 설치 건너뛰기
  dev?: boolean; // 개발 의존성으로 설치
  fix?: boolean; // 자동 수정 (린트)
  watch?: boolean; // 파일 변경 감지
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

/**
 * 명령어 핸들러 타입
 */
export type CommandHandler = (args: any, options: CliOptions) => Promise<void>;

/**
 * 슬래시 커맨드 타입
 */
export interface SlashCommand {
  name: string;
  description: string;
  handler: CommandHandler;
} 
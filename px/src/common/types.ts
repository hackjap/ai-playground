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
 * 프로젝트 프롬프트 응답 타입
 */
export interface ProjectPromptAnswers {
  projectName: string;
  template: string;
  installDependencies: boolean;
  gitInit: boolean;
  // AI 템플릿 관련 추가 필드
  mainLanguage?: string;
  taskDescription?: string;
}

/**
 * CLI 옵션 타입
 */
export interface CliOptions {
  template?: string;
  yes?: boolean;
  skipInstall?: boolean;
}

/**
 * 템플릿 변수 타입
 */
export interface TemplateVariables {
  projectName: string;
  mainLanguage?: string;
  taskDescription?: string;
  [key: string]: string | undefined;
}

/**
 * 지원되는 템플릿 타입
 */
export type SupportedTemplate = 'cursor-rules' | 'claude-prompts' | 'common-ai-settings';

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
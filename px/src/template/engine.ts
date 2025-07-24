import * as fs from 'fs-extra';
import * as path from 'path';
import { CLIError } from '../core/error-handler';

/**
 * 템플릿 변수 치환을 위한 인터페이스
 */
export interface TemplateVariables {
  projectName: string;
  mainLanguage?: string;
  taskDescription?: string;
  [key: string]: string | undefined;
}

/**
 * 템플릿 복사 옵션
 */
export interface TemplateCopyOptions {
  overwrite?: boolean;
  merge?: boolean;
  skipExisting?: boolean;
}

/**
 * 템플릿 엔진 클래스
 */
export class TemplateEngine {
  private readonly templatesDir: string;

  constructor(templatesDir = 'templates') {
    this.templatesDir = path.resolve(templatesDir);
  }

  /**
   * 템플릿을 대상 디렉토리에 복사하고 변수를 치환합니다
   */
  async applyTemplate(
    templateName: string,
    targetDir: string,
    variables: TemplateVariables,
    options: TemplateCopyOptions = {}
  ): Promise<void> {
    const templatePath = path.join(this.templatesDir, templateName);
    const absoluteTargetDir = path.resolve(targetDir);

    // 템플릿 디렉토리 존재 확인
    if (!(await fs.pathExists(templatePath))) {
      throw new CLIError(`템플릿을 찾을 수 없습니다: ${templateName}`);
    }

    // 대상 디렉토리 생성
    await fs.ensureDir(absoluteTargetDir);

    // 템플릿 파일들 복사 및 변수 치환
    await this.copyTemplateFiles(templatePath, absoluteTargetDir, variables, options);
  }

  /**
   * 템플릿 파일들을 재귀적으로 복사하고 변수를 치환합니다
   */
  private async copyTemplateFiles(
    sourcePath: string,
    targetPath: string,
    variables: TemplateVariables,
    options: TemplateCopyOptions
  ): Promise<void> {
    const entries = await fs.readdir(sourcePath, { withFileTypes: true });

    for (const entry of entries) {
      const sourceFilePath = path.join(sourcePath, entry.name);
      const targetFilePath = path.join(targetPath, entry.name);

      if (entry.isDirectory()) {
        // 디렉토리인 경우 재귀적으로 복사
        await fs.ensureDir(targetFilePath);
        await this.copyTemplateFiles(sourceFilePath, targetFilePath, variables, options);
      } else {
        // 파일인 경우 복사 및 변수 치환
        await this.copyAndProcessFile(sourceFilePath, targetFilePath, variables, options);
      }
    }
  }

  /**
   * 개별 파일을 복사하고 변수를 치환합니다
   */
  private async copyAndProcessFile(
    sourceFilePath: string,
    targetFilePath: string,
    variables: TemplateVariables,
    options: TemplateCopyOptions
  ): Promise<void> {
    // 파일 존재 여부 확인 및 옵션 처리
    const fileExists = await fs.pathExists(targetFilePath);
    
    if (fileExists) {
      if (options.skipExisting) {
        return; // 기존 파일 건너뛰기
      }
      if (!options.overwrite && !options.merge) {
        throw new CLIError(`파일이 이미 존재합니다: ${targetFilePath}`);
      }
    }

    try {
      // 파일 내용 읽기
      let content = await fs.readFile(sourceFilePath, 'utf-8');

      // 변수 치환 수행
      content = this.replaceVariables(content, variables);

      // 파일 쓰기
      await fs.writeFile(targetFilePath, content, 'utf-8');
    } catch (error) {
      // 바이너리 파일이거나 읽기 실패한 경우 그대로 복사
      if (error instanceof Error && error.message.includes('invalid character')) {
        await fs.copy(sourceFilePath, targetFilePath, { overwrite: options.overwrite });
      } else {
        throw new CLIError(`파일 처리 실패: ${sourceFilePath} - ${error}`);
      }
    }
  }

  /**
   * 템플릿 변수를 치환합니다
   */
  private replaceVariables(content: string, variables: TemplateVariables): string {
    let result = content;

    // {{variableName}} 패턴을 찾아서 치환
    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        result = result.replace(regex, value);
      }
    }

    return result;
  }

  /**
   * 사용 가능한 템플릿 목록을 반환합니다
   */
  async getAvailableTemplates(): Promise<string[]> {
    try {
      const entries = await fs.readdir(this.templatesDir, { withFileTypes: true });
      return entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .sort();
    } catch (error) {
      throw new CLIError(`템플릿 목록을 가져올 수 없습니다: ${error}`);
    }
  }

  /**
   * 템플릿이 존재하는지 확인합니다
   */
  async templateExists(templateName: string): Promise<boolean> {
    const templatePath = path.join(this.templatesDir, templateName);
    return fs.pathExists(templatePath);
  }
} 
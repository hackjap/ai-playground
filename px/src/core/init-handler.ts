import { CliOptions, TemplateVariables } from '../common/types';
import { CLIError } from './error-handler';
import { MESSAGES } from '../common/constants';
import { promptProjectDetails, promptOverwriteConfirmation } from '../tui/prompts';
import { TemplateEngine } from '../template/engine';
import * as path from 'path';
import * as fs from 'fs-extra';
import { execSync } from 'child_process';

export async function initProject(
  projectName: string,
  options: CliOptions
): Promise<void> {
  try {
    // TUI 프롬프트로 프로젝트 세부사항 수집
    const projectDetails = await promptProjectDetails(
      projectName,
      options.template,
      options.yes || false
    );

    console.log('\n📋 프로젝트 설정:');
    console.log(`  이름: ${projectDetails.projectName}`);
    console.log(`  템플릿: ${projectDetails.template}`);
    console.log(`  주요 언어: ${projectDetails.mainLanguage}`);
    console.log(`  목적: ${projectDetails.taskDescription}`);
    console.log(`  추가 도구 설치: ${projectDetails.installDependencies ? '예' : '아니오'}`);
    console.log(`  Git 초기화: ${projectDetails.gitInit ? '예' : '아니오'}`);

    // 프로젝트 디렉토리 경로 설정
    const targetDir = path.resolve(projectDetails.projectName);
    
    // 디렉토리 존재 확인
    if (await fs.pathExists(targetDir)) {
      const existingFiles = await getExistingFiles(targetDir);
      if (existingFiles.length > 0) {
        const action = await promptOverwriteConfirmation(existingFiles);
        
        if (action === 'skip') {
          console.log('\n⏭️  템플릿 생성을 건너뛰었습니다.');
          return;
        }
        
        // 덮어쓰기나 병합 처리는 템플릿 엔진에서 처리
      }
    }

    console.log('\n🔧 AI 개발 환경 설정 중...');
    
    // 템플릿 엔진 초기화 및 변수 설정
    const templateEngine = new TemplateEngine();
    const templateVariables: TemplateVariables = {
      projectName: projectDetails.projectName,
      mainLanguage: projectDetails.mainLanguage || 'typescript',
      taskDescription: projectDetails.taskDescription || 'AI 개발 환경 설정',
      timestamp: new Date().toISOString(),
    };

    // 템플릿 존재 확인
    console.log('  ⏳ 템플릿 확인 중...');
    const templateExists = await templateEngine.templateExists(projectDetails.template);
    if (!templateExists) {
      throw new CLIError(`템플릿을 찾을 수 없습니다: ${projectDetails.template}`);
    }

    // 템플릿 적용
    console.log('  ⏳ AI 설정 파일 생성 중...');
    await templateEngine.applyTemplate(
      projectDetails.template,
      targetDir,
      templateVariables,
      {
        overwrite: true, // 사용자가 이미 선택했으므로 덮어쓰기 허용
        skipExisting: false,
      }
    );

    // Git 초기화
    if (projectDetails.gitInit) {
      console.log('  ⏳ Git 저장소 초기화 중...');
      await initializeGitRepository(targetDir);
    }

    // 추가 도구 설치 (common-ai-settings 템플릿의 경우)
    if (projectDetails.installDependencies && projectDetails.template === 'common-ai-settings') {
      console.log('  ⏳ 개발 도구 설치 중...');
      await installDevelopmentTools(targetDir);
    }

    console.log(`\n${MESSAGES.SUCCESS}`);
    console.log(`\n📁 AI 개발 환경이 생성되었습니다: ${targetDir}`);
    
    // 생성된 파일 목록 표시
    await displayGeneratedFiles(targetDir, projectDetails.template);
    
    console.log('\n📝 다음 단계:');
    console.log(`  1. cd ${projectDetails.projectName}`);
    
    // 템플릿별 안내 메시지
    switch (projectDetails.template) {
      case 'cursor-rules':
        console.log('  2. Cursor 에디터에서 프로젝트를 열어 AI 규칙을 활용하세요');
        console.log('  3. .cursor/rules/ 폴더의 규칙들을 필요에 따라 커스터마이징하세요');
        break;
      case 'claude-prompts':
        console.log('  2. claude/ 폴더의 프롬프트 템플릿을 사용하여 Claude와 효율적으로 작업하세요');
        console.log('  3. 각 프롬프트 파일을 프로젝트에 맞게 수정하세요');
        break;
      case 'common-ai-settings':
        console.log('  2. VSCode에서 프로젝트를 열어 AI 확장 프로그램들을 설정하세요');
        console.log('  3. .ai/config.json 파일을 통해 AI 도구 설정을 관리하세요');
        break;
    }
    
  } catch (error) {
    if (error instanceof Error) {
      throw new CLIError(`AI 개발 환경 생성 실패: ${error.message}`);
    }
    throw error;
  }
}

/**
 * 기존 파일 목록을 가져옵니다
 */
async function getExistingFiles(targetDir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(targetDir);
    return files.filter(file => !file.startsWith('.'));
  } catch {
    return [];
  }
}

/**
 * Git 저장소를 초기화합니다
 */
async function initializeGitRepository(targetDir: string): Promise<void> {
  try {
    const originalCwd = process.cwd();
    process.chdir(targetDir);
    
    execSync('git init', { stdio: 'ignore' });
    
    // .gitignore 파일 생성
    const gitignoreContent = [
      '# Dependencies',
      'node_modules/',
      '',
      '# Environment files',
      '.env',
      '.env.local',
      '.env.*.local',
      '',
      '# IDE files',
      '.vscode/settings.json',
      '.idea/',
      '',
      '# OS files',
      '.DS_Store',
      'Thumbs.db',
      '',
      '# Logs',
      '*.log',
      'logs/',
      '',
      '# Build outputs',
      'dist/',
      'build/',
      '*.tsbuildinfo',
    ].join('\n');
    
    await fs.writeFile(path.join(targetDir, '.gitignore'), gitignoreContent);
    
    process.chdir(originalCwd);
  } catch (error) {
    throw new CLIError(`Git 초기화 실패: ${error}`);
  }
}

/**
 * 개발 도구를 설치합니다
 */
async function installDevelopmentTools(targetDir: string): Promise<void> {
  try {
    const originalCwd = process.cwd();
    process.chdir(targetDir);

    // package.json이 없는 경우 생성
    const packageJsonPath = path.join(targetDir, 'package.json');
    if (!(await fs.pathExists(packageJsonPath))) {
      const packageJson = {
        name: path.basename(targetDir),
        version: '1.0.0',
        description: 'AI development environment',
        scripts: {
          lint: 'eslint .',
          format: 'prettier --write .',
        },
        devDependencies: {
          eslint: '^8.0.0',
          prettier: '^3.0.0',
          '@typescript-eslint/eslint-plugin': '^6.0.0',
          '@typescript-eslint/parser': '^6.0.0',
        },
      };
      await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
    }

    // npm install 실행
    execSync('npm install', { stdio: 'inherit' });
    
    process.chdir(originalCwd);
  } catch (error) {
    throw new CLIError(`개발 도구 설치 실패: ${error}`);
  }
}

/**
 * 생성된 파일 목록을 표시합니다
 */
async function displayGeneratedFiles(targetDir: string, _templateName: string): Promise<void> {
  try {
    console.log('\n📄 생성된 파일:');
    
    const files = await getGeneratedFilesList(targetDir, '');
    files.forEach(file => {
      console.log(`   ✅ ${file}`);
    });
    
  } catch (error) {
    // 파일 목록 표시 실패는 치명적이지 않음
    console.log('   📄 파일이 성공적으로 생성되었습니다.');
  }
}

/**
 * 재귀적으로 생성된 파일 목록을 가져옵니다
 */
async function getGeneratedFilesList(dir: string, prefix: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    
    if (entry.isDirectory()) {
      // 특정 디렉토리만 표시
      if (['.cursor', 'claude', '.vscode', '.ai'].includes(entry.name)) {
        const subFiles = await getGeneratedFilesList(fullPath, relativePath);
        files.push(...subFiles);
      }
    } else {
      files.push(relativePath);
    }
  }
  
  return files;
} 
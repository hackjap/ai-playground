import inquirer from 'inquirer';
import { ProjectPromptAnswers } from '../common/types';
import { SUPPORTED_TEMPLATES, TEMPLATE_DESCRIPTIONS, MESSAGES } from '../common/constants';
import { validateProjectName } from '../core/error-handler';

/**
 * 프로젝트 생성을 위한 대화형 프롬프트
 */
export async function promptProjectDetails(
  initialProjectName?: string,
  initialTemplate?: string,
  skipPrompts = false
): Promise<ProjectPromptAnswers> {
  
  // --yes 옵션으로 무인 설치
  if (skipPrompts) {
    return {
      projectName: initialProjectName || 'my-project',
      template: initialTemplate || SUPPORTED_TEMPLATES[0],
      installDependencies: false, // AI 템플릿은 패키지 설치 불필요
      gitInit: true,
      mainLanguage: 'typescript',
      taskDescription: 'AI 개발 환경 설정',
    };
  }

  console.log(`\n${MESSAGES.WELCOME}\n`);

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: '프로젝트 이름을 입력해주세요:',
      default: initialProjectName || 'my-ai-project',
      validate: (input: string) => {
        try {
          validateProjectName(input);
          return true;
        } catch (error) {
          return error instanceof Error ? error.message : '유효하지 않은 프로젝트 이름입니다.';
        }
      },
      when: !initialProjectName,
    },
    {
      type: 'list',
      name: 'template',
      message: '사용할 AI 템플릿을 선택해주세요:',
      choices: SUPPORTED_TEMPLATES.map(template => ({
        name: TEMPLATE_DESCRIPTIONS[template],
        value: template,
        short: template,
      })),
      default: initialTemplate || SUPPORTED_TEMPLATES[0],
      when: !initialTemplate,
    },
    {
      type: 'list',
      name: 'mainLanguage',
      message: '주요 개발 언어를 선택해주세요:',
      choices: [
        { name: '📘 TypeScript', value: 'typescript', short: 'TypeScript' },
        { name: '📙 JavaScript', value: 'javascript', short: 'JavaScript' },
        { name: '🐍 Python', value: 'python', short: 'Python' },
        { name: '☕ Java', value: 'java', short: 'Java' },
        { name: '⚛️ React/TSX', value: 'tsx', short: 'React/TSX' },
        { name: '🔥 Other', value: 'other', short: 'Other' },
      ],
      default: 'typescript',
    },
    {
      type: 'input',
      name: 'taskDescription', 
      message: '프로젝트의 주요 목적을 간단히 설명해주세요:',
      default: 'AI 도구를 활용한 효율적인 개발 환경 구축',
      validate: (input: string) => {
        if (input.trim().length < 5) {
          return '최소 5자 이상 입력해주세요.';
        }
        return true;
      },
    },
    {
      type: 'confirm',
      name: 'installDependencies',
      message: '추가 개발 도구를 설치하시겠습니까? (선택사항)',
      default: false,
      when: (answers) => {
        // AI 설정 템플릿의 경우 기본적으로 패키지 설치가 필요하지 않음
        return answers.template === 'common-ai-settings';
      },
    },
    {
      type: 'confirm',
      name: 'gitInit',
      message: 'Git 저장소를 초기화하시겠습니까?',
      default: true,
    },
  ]);

  // 응답에서 누락된 필드 보완
  return {
    projectName: answers.projectName || initialProjectName || 'my-ai-project',
    template: answers.template || initialTemplate || SUPPORTED_TEMPLATES[0],
    mainLanguage: answers.mainLanguage || 'typescript',
    taskDescription: answers.taskDescription || 'AI 개발 환경 설정',
    installDependencies: answers.installDependencies || false,
    gitInit: answers.gitInit !== false,
  };
}

/**
 * 템플릿 선택 프롬프트 (독립 실행용)
 */
export async function promptTemplateSelection(): Promise<string> {
  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'AI 템플릿을 선택해주세요:',
      choices: SUPPORTED_TEMPLATES.map(template => ({
        name: TEMPLATE_DESCRIPTIONS[template],
        value: template,
        short: template,
      })),
    },
  ]);

  return template;
}

/**
 * 파일 덮어쓰기 확인 프롬프트
 */
export async function promptOverwriteConfirmation(
  existingFiles: string[]
): Promise<'overwrite' | 'skip' | 'merge'> {
  console.log('\n⚠️  다음 파일들이 이미 존재합니다:');
  existingFiles.forEach(file => console.log(`   - ${file}`));

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: '어떻게 처리하시겠습니까?',
      choices: [
        { name: '📝 덮어쓰기 (기존 파일 교체)', value: 'overwrite' },
        { name: '⏭️  건너뛰기 (기존 파일 유지)', value: 'skip' },
        { name: '🔄 병합 (가능한 경우)', value: 'merge' },
      ],
      default: 'skip',
    },
  ]);

  return action;
}

/**
 * 설정 병합 확인 프롬프트
 */
export async function promptMergeConfiguration(
  configType: string
): Promise<'overwrite' | 'merge' | 'skip'> {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: `기존 ${configType} 설정이 발견되었습니다. 어떻게 처리하시겠습니까?`,
      choices: [
        {
          name: '🔄 병합 - 기존 설정과 새 설정을 병합',
          value: 'merge',
          short: '병합',
        },
        {
          name: '📝 덮어쓰기 - 새 설정으로 완전히 교체',
          value: 'overwrite',
          short: '덮어쓰기',
        },
        {
          name: '⏭️  건너뛰기 - 기존 설정 유지',
          value: 'skip',
          short: '건너뛰기',
        },
      ],
      default: 'merge',
    },
  ]);

  return answer.action;
} 
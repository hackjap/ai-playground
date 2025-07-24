import inquirer from 'inquirer';
import { ProjectPromptAnswers } from '../common/types';
import { SUPPORTED_TEMPLATES, MESSAGES } from '../common/constants';
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
      installDependencies: true,
      gitInit: true,
    };
  }

  console.log(`\n${MESSAGES.WELCOME}\n`);

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: '프로젝트 이름을 입력해주세요:',
      default: initialProjectName || 'my-project',
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
      message: '사용할 템플릿을 선택해주세요:',
      choices: [
        {
          name: '📦 Node.js Basic - 기본 Node.js 프로젝트',
          value: 'node-basic',
          short: 'Node.js Basic',
        },
        {
          name: '⚛️  React Basic - 기본 React 프로젝트',
          value: 'react-basic', 
          short: 'React Basic',
        },
      ],
      default: initialTemplate || SUPPORTED_TEMPLATES[0],
      when: !initialTemplate,
    },
    {
      type: 'confirm',
      name: 'installDependencies',
      message: '의존성을 자동으로 설치하시겠습니까?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'gitInit',
      message: 'Git 저장소를 초기화하시겠습니까?',
      default: true,
    },
  ]);

  // 명령어 인자로 제공된 값들을 병합
  return {
    projectName: initialProjectName || answers.projectName,
    template: initialTemplate || answers.template,
    installDependencies: answers.installDependencies,
    gitInit: answers.gitInit,
  };
}

/**
 * 기존 파일 덮어쓰기 확인 프롬프트
 */
export async function promptOverwriteConfirmation(
  fileName: string
): Promise<boolean> {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'overwrite',
      message: `${fileName} 파일이 이미 존재합니다. 덮어쓰시겠습니까?`,
      default: false,
    },
  ]);

  return answer.overwrite;
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
import { CliOptions } from '../common/types';
import { CLIError } from './error-handler';
import { MESSAGES } from '../common/constants';
import { promptProjectDetails } from '../tui/prompts';

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
    console.log(`  의존성 설치: ${projectDetails.installDependencies ? '예' : '아니오'}`);
    console.log(`  Git 초기화: ${projectDetails.gitInit ? '예' : '아니오'}`);

    // TODO: T-004에서 실제 템플릿 엔진 구현
    console.log('\n🔧 프로젝트 생성 중...');
    console.log('  ⏳ 디렉터리 생성...');
    console.log('  ⏳ 템플릿 파일 복사...');
    console.log('  ⏳ 설정 파일 생성...');
    
    if (projectDetails.installDependencies) {
      console.log('  ⏳ 의존성 설치...');
    }
    
    if (projectDetails.gitInit) {
      console.log('  ⏳ Git 저장소 초기화...');
    }

    console.log(`\n${MESSAGES.SUCCESS}`);
    console.log(`\n📁 프로젝트 경로: ./${projectDetails.projectName}`);
    console.log('\n📝 다음 단계:');
    console.log(`  1. cd ${projectDetails.projectName}`);
    console.log('  2. npm start (또는 npm run dev)');
    
  } catch (error) {
    if (error instanceof Error) {
      throw new CLIError(`프로젝트 생성 실패: ${error.message}`);
    }
    throw error;
  }
} 
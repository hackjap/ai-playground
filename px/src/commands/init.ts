import { Command } from 'commander';
import { CliOptions } from '../common/types';

export function createInitCommand(): Command {
  const init = new Command('init');
  
  init
    .description('새로운 프로젝트를 생성합니다')
    .argument('[project-name]', '프로젝트 이름')
    .option('-t, --template <template>', '사용할 템플릿 지정')
    .option('-y, --yes', '모든 질문에 자동으로 yes 응답')
    .option('--skip-install', '패키지 설치 건너뛰기')
    .action(async (projectName: string, options: CliOptions) => {
      // Dynamic import for performance
      const { initProject } = await import('../core/init-handler');
      await initProject(projectName, options);
    });

  return init;
} 
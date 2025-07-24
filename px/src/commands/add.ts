import { Command } from 'commander';
import { CliOptions } from '../common/types';

export function createAddCommand(): Command {
  const add = new Command('add');
  
  add
    .description('플러그인을 프로젝트에 추가합니다')
    .argument('<plugin>', '추가할 플러그인 이름')
    .option('-y, --yes', '모든 질문에 자동으로 yes 응답')
    .option('--dev', '개발 의존성으로 설치')
    .action(async (plugin: string, options: CliOptions) => {
      // Dynamic import for performance
      const { addPlugin } = await import('../core/add-handler');
      await addPlugin(plugin, options);
    });

  return add;
} 
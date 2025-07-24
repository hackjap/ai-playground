import { Command } from 'commander';

export function createSlashCommand(): Command {
  const slash = new Command('/');
  
  slash
    .description('단축 명령어 실행')
    .argument('<command>', '실행할 단축 명령어 (lint, test, format 등)')
    .argument('[...args]', '추가 인자들')
    .action(async (command: string, args: string[]) => {
      // Dynamic import for performance
      const { executeSlashCommand } = await import('../core/slash-handler');
      await executeSlashCommand(command, args);
    });

  return slash;
}

// 개별 슬래시 커맨드들을 위한 헬퍼 함수
export function registerSlashCommands(program: Command): void {
  // /lint 커맨드
  program
    .command('/lint')
    .description('린트 검사 및 수정')
    .option('--fix', '자동으로 수정 가능한 문제들을 수정')
    .action(async (options) => {
      const { executeLintCommand } = await import('../core/slash-handler');
      await executeLintCommand(options);
    });

  // /test 커맨드  
  program
    .command('/test')
    .description('테스트 실행')
    .option('--watch', '파일 변경 감지하여 테스트 재실행')
    .action(async (options) => {
      const { executeTestCommand } = await import('../core/slash-handler');
      await executeTestCommand(options);
    });

  // /format 커맨드
  program
    .command('/format')
    .description('코드 포맷팅')
    .action(async () => {
      const { executeFormatCommand } = await import('../core/slash-handler');
      await executeFormatCommand();
    });
} 
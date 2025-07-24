import { CLIError } from './error-handler';

export async function executeSlashCommand(
  command: string,
  args: string[]
): Promise<void> {
  console.log(`Executing slash command: /${command}`);
  console.log('Arguments:', args);
  
  // TODO: 슬래시 커맨드 시스템 구현
  
  throw new CLIError(
    `슬래시 커맨드 /${command}는 아직 구현되지 않았습니다.`,
    'NOT_IMPLEMENTED',
    0
  );
}

export async function executeLintCommand(options: any): Promise<void> {
  console.log('Executing lint command with options:', options);
  
  // TODO: 린트 명령어 구현
  
  throw new CLIError(
    '/lint 명령어는 아직 구현되지 않았습니다.',
    'NOT_IMPLEMENTED', 
    0
  );
}

export async function executeTestCommand(options: any): Promise<void> {
  console.log('Executing test command with options:', options);
  
  // TODO: 테스트 명령어 구현
  
  throw new CLIError(
    '/test 명령어는 아직 구현되지 않았습니다.',
    'NOT_IMPLEMENTED',
    0
  );
}

export async function executeFormatCommand(): Promise<void> {
  console.log('Executing format command');
  
  // TODO: 포맷 명령어 구현
  
  throw new CLIError(
    '/format 명령어는 아직 구현되지 않았습니다.',
    'NOT_IMPLEMENTED',
    0
  );
} 
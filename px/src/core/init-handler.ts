import { CliOptions } from '../common/types';
import { CLIError } from './error-handler';
import { MESSAGES } from '../common/constants';

export async function initProject(
  projectName: string,
  options: CliOptions
): Promise<void> {
  console.log(`${MESSAGES.WELCOME}`);
  console.log(`Creating project: ${projectName || 'untitled-project'}`);
  console.log('Options:', options);
  
  // TODO: T-003에서 TUI 구현
  // TODO: T-004에서 템플릿 엔진 구현
  
  throw new CLIError(
    'init 명령어는 아직 구현되지 않았습니다. T-003, T-004 태스크에서 구현 예정입니다.',
    'NOT_IMPLEMENTED',
    0
  );
} 
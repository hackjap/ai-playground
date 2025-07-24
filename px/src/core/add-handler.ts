import { CliOptions } from '../common/types';
import { CLIError } from './error-handler';
import { MESSAGES } from '../common/constants';

export async function addPlugin(
  plugin: string,
  options: CliOptions
): Promise<void> {
  console.log(`${MESSAGES.WELCOME}`);
  console.log(`Adding plugin: ${plugin}`);
  console.log('Options:', options);
  
  // TODO: 플러그인 시스템은 Phase 2에서 구현 예정
  
  throw new CLIError(
    'add 명령어는 아직 구현되지 않았습니다. Phase 2에서 구현 예정입니다.',
    'NOT_IMPLEMENTED',
    0
  );
} 
#!/usr/bin/env node

import { Command } from 'commander';
import { version } from '../../package.json';
import { setupGlobalErrorHandler, handleError } from '../core/error-handler';

// 글로벌 에러 핸들러 설정
setupGlobalErrorHandler();

const program = new Command();

program
  .name('px')
  .description('Project Starter CLI - TypeScript 기반 프로젝트 초기 설정 자동화 도구')
  .version(version);

// 명령어 등록 (Dynamic imports for performance)
async function registerCommands(): Promise<void> {
  try {
    // init 명령어 등록
    const { createInitCommand } = await import('../commands/init');
    program.addCommand(createInitCommand());

    // add 명령어 등록
    const { createAddCommand } = await import('../commands/add');
    program.addCommand(createAddCommand());

    // 슬래시 커맨드 등록
    const { registerSlashCommands } = await import('../commands/slash');
    registerSlashCommands(program);

    // 명령어 파싱 및 실행
    await program.parseAsync();
  } catch (error) {
    handleError(error);
  }
}

// CLI 실행
registerCommands().catch(handleError); 
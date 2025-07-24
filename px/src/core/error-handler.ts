import { MESSAGES } from '../common/constants';

export class CLIError extends Error {
  constructor(
    message: string,
    public code: string = 'CLI_ERROR',
    public exitCode: number = 1
  ) {
    super(message);
    this.name = 'CLIError';
  }
}

export function handleError(error: unknown): void {
  if (error instanceof CLIError) {
    console.error(`${MESSAGES.ERROR} ${error.message}`);
    process.exit(error.exitCode);
  } else if (error instanceof Error) {
    console.error(`${MESSAGES.ERROR} ${error.message}`);
    process.exit(1);
  } else {
    console.error(`${MESSAGES.ERROR} 알 수 없는 오류가 발생했습니다.`);
    process.exit(1);
  }
}

export function setupGlobalErrorHandler(): void {
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
}

export function validateProjectName(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new CLIError('프로젝트 이름을 입력해주세요.');
  }

  // 유효한 npm 패키지 이름 검증
  const validNameRegex = /^[a-z0-9]([a-z0-9-_.])*$/;
  if (!validNameRegex.test(name)) {
    throw new CLIError(
      '프로젝트 이름은 소문자, 숫자, 하이픈(-), 밑줄(_), 점(.)만 포함할 수 있습니다.'
    );
  }

  if (name.length > 214) {
    throw new CLIError('프로젝트 이름은 214자를 초과할 수 없습니다.');
  }
} 
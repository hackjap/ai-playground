#!/usr/bin/env node

import { Command } from 'commander';
import { version } from '../../package.json';

const program = new Command();

program
  .name('px')
  .description('Project Starter CLI - TypeScript 기반 프로젝트 초기 설정 자동화 도구')
  .version(version);

// TODO: 명령어들을 추가할 예정 (init, add 등)

program.parse(); 
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Command } from 'commander';
import { createInitCommand } from '../../src/commands/init';
import { createAddCommand } from '../../src/commands/add';
import { CLIError, validateProjectName } from '../../src/core/error-handler';

describe('CLI Commands', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Init Command', () => {
    it('should create init command with correct configuration', () => {
      const initCommand = createInitCommand();
      
      expect(initCommand).toBeInstanceOf(Command);
      expect(initCommand.name()).toBe('init');
      expect(initCommand.description()).toBe('새로운 프로젝트를 생성합니다');
    });

    it('should have correct options', () => {
      const initCommand = createInitCommand();
      const options = initCommand.options;
      
      const templateOption = options.find(opt => opt.short === '-t');
      const yesOption = options.find(opt => opt.short === '-y');
      const skipInstallOption = options.find(opt => opt.long === '--skip-install');
      
      expect(templateOption).toBeDefined();
      expect(yesOption).toBeDefined();
      expect(skipInstallOption).toBeDefined();
    });
  });

  describe('Add Command', () => {
    it('should create add command with correct configuration', () => {
      const addCommand = createAddCommand();
      
      expect(addCommand).toBeInstanceOf(Command);
      expect(addCommand.name()).toBe('add');
      expect(addCommand.description()).toBe('플러그인을 프로젝트에 추가합니다');
    });

    it('should have correct options', () => {
      const addCommand = createAddCommand();
      const options = addCommand.options;
      
      const yesOption = options.find(opt => opt.short === '-y');
      const devOption = options.find(opt => opt.long === '--dev');
      
      expect(yesOption).toBeDefined();
      expect(devOption).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should create CLIError with correct properties', () => {
      const error = new CLIError('Test error', 'TEST_ERROR', 2);
      
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.exitCode).toBe(2);
      expect(error.name).toBe('CLIError');
    });

    it('should validate project names correctly', () => {
      // Valid names
      expect(() => validateProjectName('my-project')).not.toThrow();
      expect(() => validateProjectName('my_project')).not.toThrow();
      expect(() => validateProjectName('myproject123')).not.toThrow();

      // Invalid names
      expect(() => validateProjectName('')).toThrow('프로젝트 이름을 입력해주세요.');
      expect(() => validateProjectName('My-Project')).toThrow();
      expect(() => validateProjectName('my project')).toThrow();
      expect(() => validateProjectName('a'.repeat(215))).toThrow();
    });
  });
}); 
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { promptProjectDetails } from '../../src/tui/prompts';

// inquirer 모킹
vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(),
  },
}));

describe('TUI Prompts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('promptProjectDetails', () => {
    it('should return default values when skipPrompts is true', async () => {
      const result = await promptProjectDetails(
        'test-project',
        'node-basic',
        true // skipPrompts
      );

      expect(result).toEqual({
        projectName: 'test-project',
        template: 'node-basic',
        installDependencies: true,
        gitInit: true,
      });
    });

    it('should use default project name when skipPrompts is true and no name provided', async () => {
      const result = await promptProjectDetails(
        undefined,
        undefined,
        true // skipPrompts
      );

      expect(result).toEqual({
        projectName: 'my-project',
        template: 'node-basic',
        installDependencies: true,
        gitInit: true,
      });
    });

    it('should merge provided values with prompt results', async () => {
      // inquirer.prompt 모킹
      const inquirer = await import('inquirer');
      vi.mocked(inquirer.default.prompt).mockResolvedValue({
        installDependencies: false,
        gitInit: true,
      });

      const result = await promptProjectDetails(
        'provided-name',
        'react-basic',
        false // skipPrompts
      );

      expect(result.projectName).toBe('provided-name');
      expect(result.template).toBe('react-basic');
      expect(result.installDependencies).toBe(false);
      expect(result.gitInit).toBe(true);
    });

    it('should prompt for missing values', async () => {
      const inquirer = await import('inquirer');
      vi.mocked(inquirer.default.prompt).mockResolvedValue({
        projectName: 'prompted-name',
        template: 'node-basic',
        installDependencies: true,
        gitInit: false,
      });

      const result = await promptProjectDetails(
        undefined,
        undefined,
        false // skipPrompts
      );

      expect(result).toEqual({
        projectName: 'prompted-name',
        template: 'node-basic',
        installDependencies: true,
        gitInit: false,
      });

      expect(inquirer.default.prompt).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'projectName',
            type: 'input',
          }),
          expect.objectContaining({
            name: 'template',
            type: 'list',
          }),
        ])
      );
    });
  });
}); 
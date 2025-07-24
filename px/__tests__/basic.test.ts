import { describe, it, expect } from 'vitest';

describe('Project Setup', () => {
  it('should have basic constants defined', () => {
    const projectName = 'px';
    expect(projectName).toBe('px');
  });

  it('should have Node.js environment', () => {
    expect(process.version).toBeDefined();
    expect(process.version.startsWith('v')).toBe(true);
  });
}); 
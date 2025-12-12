import { describe, expect, it, vi } from 'vitest';

import * as commandsModule from '../../../src/commands/index.js';
import { parseArguments } from '../../../src/utils/arg-parser.js';

vi.mock('../../../src/commands/index.js', async () => {
  const actual = await vi.importActual<typeof commandsModule>('../../../src/commands/index.js');
  return {
    ...actual,
    runCommand: vi.fn(),
  };
});

describe('arg-parser', () => {
  describe('parseArguments', () => {
    it('should return false for empty arguments (continue to interactive mode)', async () => {
      const result = await parseArguments([]);
      expect(result).toBe(false);
    });

    it('should return false for non-command arguments', async () => {
      const result = await parseArguments(['some', 'random', 'args']);
      expect(result).toBe(false);
    });

    it('should handle --version flag', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      await parseArguments(['--version']);

      expect(logSpy).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(0);

      exitSpy.mockRestore();
      logSpy.mockRestore();
    });

    it('should handle -v flag', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      await parseArguments(['-v']);

      expect(logSpy).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(0);

      exitSpy.mockRestore();
      logSpy.mockRestore();
    });

    it('should handle --commands flag', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      await parseArguments(['--commands']);

      expect(logSpy).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(0);

      exitSpy.mockRestore();
      logSpy.mockRestore();
    });

    it('should handle --help flag', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      await parseArguments(['--help']);

      expect(logSpy).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(0);

      exitSpy.mockRestore();
      logSpy.mockRestore();
    });

    it('should handle -h flag', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      await parseArguments(['-h']);

      expect(logSpy).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(0);

      exitSpy.mockRestore();
      logSpy.mockRestore();
    });

    it('should handle command-specific help (command -h)', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      await parseArguments(['test-connection', '-h']);

      expect(logSpy).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(0);

      exitSpy.mockRestore();
      logSpy.mockRestore();
    });

    it('should display help when command name is invalid', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      await parseArguments(['invalid-command', '-h']);

      expect(logSpy).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(0);

      exitSpy.mockRestore();
      logSpy.mockRestore();
    });

    it('should recognize valid Sentry commands', async () => {
      const validCommands = [
        'list-project-events',
        'list-project-issues',
        'list-org-issues',
        'get-issue',
        'update-issue',
        'list-issue-events',
        'get-event',
        'get-issue-event',
        'get-tag-details',
        'list-tag-values',
        'list-issue-hashes',
        'debug-source-maps',
        'test-connection',
      ];

      // Test that these commands are recognized (would trigger headless execution)
      for (const cmd of validCommands) {
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

        try {
          await parseArguments([cmd]);
        } catch {
          // Expected when mocking process.exit
        }

        expect(exitSpy).toHaveBeenCalledWith(0);
        exitSpy.mockRestore();
      }
    });
  });
});

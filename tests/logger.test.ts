import { logger } from '../src/core/logger.js';

describe('Logger Module', () => {
    it('should have info, warn, and error methods', () => {
        expect(typeof logger.info).toBe('function');
        expect(typeof logger.warn).toBe('function');
        expect(typeof logger.error).toBe('function');
    });
});

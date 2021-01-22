import { HashService } from './services/hash.service';

describe('HashService', () => {
  let hashService: HashService;

  beforeAll(async () => {
    hashService = new HashService();
  });

  describe('root', () => {
    it('should encrypt password', async () => {
      const hash = await hashService.generateHash('12345678');
      const compareHash = await hashService.compareHash('12345678', hash);

      expect(compareHash).toBe(true);
    });
  });
});

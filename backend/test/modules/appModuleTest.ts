import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../src/modules/app.module';

export default async function appModuleTest(): Promise<TestingModule> {
  const moduleTest: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  return moduleTest;
}

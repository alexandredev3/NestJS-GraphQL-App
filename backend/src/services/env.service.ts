import * as dotenv from 'dotenv';
import * as fs from 'fs';

interface IEnvData {
  NODE_ENV: string;

  TYPEORM_TYPE: 'postgres';
  TYPEORM_HOST: string;
  TYPEORM_PORT: number;
  TYPEORM_NAME: string;
  TYPEORM_PASSWORD: string;
  TYPEORM_DATABASE: string;
}

interface IGetOrmConfig {
  TYPEORM_TYPE: 'postgres';
  TYPEORM_HOST: string;
  TYPEORM_PORT: number;
  TYPEORM_NAME: string;
  TYPEORM_PASSWORD: string;
  TYPEORM_DATABASE: string;
}

export class EnvService {
  private data: IEnvData;

  constructor() {
    const environment = process.env.NODE_ENV;
    const envData: any = dotenv.parse(fs.readFileSync(`.${environment}.env`));

    envData.NODE_ENV = environment;
    envData.TYPEORM_PORT = Number(envData.TYPEORM_PORT);

    this.data = envData;
  }

  public getOrmConfig(): IGetOrmConfig {
    const {
      TYPEORM_DATABASE,
      TYPEORM_TYPE,
      TYPEORM_NAME,
      TYPEORM_PORT,
      TYPEORM_PASSWORD,
      TYPEORM_HOST,
    } = this.data;

    return {
      TYPEORM_HOST,
      TYPEORM_DATABASE,
      TYPEORM_TYPE,
      TYPEORM_NAME,
      TYPEORM_PORT,
      TYPEORM_PASSWORD,
    };
  }

  public getPort(): number {
    return 3333;
  }
}

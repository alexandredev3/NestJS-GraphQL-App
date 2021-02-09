/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
const { resolve } = require('path');

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.test.env' : '.dev.env',
});

module.exports = {
  type: process.env.TYPEORM_TYPE,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_NAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  logging: true,
  migrations: [resolve(__dirname, 'src', 'database', 'migrations', '*.ts')],
  entities: [resolve(__dirname, 'src', 'entities', '*.ts')],
  cli: {
    migrationsDir: resolve(__dirname, 'src', 'database', 'migrations'),
  },
};

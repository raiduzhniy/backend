import * as fs from 'fs';

const environment = process.argv[2];

const readFile = (env) => {
  const envFile = `.env.${env}`;
  let fileData;

  try {
    fileData = fs.readFileSync(envFile, 'utf8');
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `Can not read environment file ${envFile}`);
  }

  return fileData;
}

const createEnvironmentFile = (fileData) => {
  try {
    fs.writeFileSync('.env', fileData);
    console.warn('\x1b[32m%s\x1b[0m', `Created .env file with ${environment} environment`);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `Can not create .env file`);
  }
}

const switchEnvironment = () => {
  console.warn('\x1b[34m%s\x1b[0m', `Creating .env file...`);

  const fileData = readFile(environment);
  if (!fileData) {
    return;
  }

  createEnvironmentFile(fileData);
}

switchEnvironment();

import * as fs from 'fs';

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
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `Can not create .env file`);
  }
}

const switchEnvironment = () => {
  const env = process.argv[2];

  const fileData = readFile(env);
  if (!fileData) {
    return;
  }

  createEnvironmentFile(fileData);
}

switchEnvironment();

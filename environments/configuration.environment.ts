import development from './development.environment';

const ENVIRONMENT_MAPPER = {
  development,
};

export default () => ENVIRONMENT_MAPPER[process.env.ENVIRONMENT]();

import development from './development.environment';
import production from './production.environment';

const ENVIRONMENT_MAPPER = {
  development,
  production,
};

export default () => ENVIRONMENT_MAPPER[process.env.ENVIRONMENT]();

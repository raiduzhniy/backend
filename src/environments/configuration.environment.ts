import { Environment } from './environment.interface';

export default (): Environment => ({
  port: 3333,
  apiUrl: '/v1',
  jwtSecret: process.env.JWT_SECRET,
});

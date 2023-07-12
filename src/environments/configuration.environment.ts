import { Environment } from './environment.interface';

export default (): Environment => ({
  port: 3333,
  apiUrl: '/api/v1',
  connectionString:
    'mongodb+srv://Komoff:gPlm6HQbZWUhtu0I@development.wsztxbu.mongodb.net/osbb?retryWrites=true&w=majority',
  jwtSecret: process.env.JWT_SECRET,
  firebaseConfig: {
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    projectId: process.env.FB_PROJECT_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
    appId: process.env.FB_APP_ID,
  },
  serviceAccount: {
    projectId: process.env.FB_PROJECT_ID,
    clientEmail: process.env.FB_CLIENT_EMAIL,
    privateKey: process.env.FB_PRIVATE_KEY,
  },
});

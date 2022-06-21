declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEO4J_URI: string;
      NEO4J_USER: string;
      NEO4J_PASSWORD: string;
      ACCESS_JWT_SECRET: string;
      REFRESH_JWT_SECRET: string;
      EMAIL_USERNAME: string;
      EMAIL_PASSWORD: string;
    }
  }
}

export {};

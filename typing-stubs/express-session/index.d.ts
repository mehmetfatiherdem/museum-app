declare module "express-session" {
    interface Session {
      user: string;
    }
  }
export const PORT = process.env.PORT || 9090;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const THINKY = {
  host: process.env.THINKY_HOST || 'localhost',
  port: process.env.THINKY_PORT || 28015,
  db: process.env.THINKY_DB || 'test'
};
export const JWT_SECRET = process.env.JWT_SECRET || 'test';

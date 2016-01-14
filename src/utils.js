import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';

const createToken = (objToSign) => {
  return jwt.sign(
    objToSign,
    JWT_SECRET
  );
};

export { createToken };

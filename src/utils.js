import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';

const signToken = (objToSign) => {
  return jwt.sign(
    objToSign,
    JWT_SECRET
  );
};

const verifyToken = (token) => {
  return new Promise(function promise(resolve, reject) {
    jwt.verify(token, JWT_SECRET, function callback(err, decoded) {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

export { signToken, verifyToken };

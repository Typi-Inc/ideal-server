import thinkyConstructor from 'thinky';
// import validator from 'validator';
import { THINKY as config } from '../config';
// import { compare } from '../utils/bcrypt';

// const thinky = thinkyConstructor(THINKY);
const thinky = thinkyConstructor(config);
export const { type, r, Query } = thinky;
const createModel = thinky.createModel;

thinky.createModel = (name, schema, options) => {
  schema.id = type.string();
  schema.createdAt = type.date().default(r.now());
  schema.updatedAt = type.date();
  const model = createModel.call(thinky, name, schema, options);
  model.docOn('saving', (doc) => {
    if (doc.id) {
      doc.updatedAt = new Date();
    }
  });
  return model;
};

// thinky.createUserModel = function createUserModel(name, schema, options) {
//   schema.local = {
//     email: type.string().required(),
//     // email: type.string().required().validator(validator.isEmail),
//     password: type.string().required().validator(function isLength(pass) {
//       return validator.isLength(pass, 4, 100);
//     }),
//   };
//   const model = thinky.createModel(name, schema, options);
//   model.define('validatePassword', async function validatePassword(password) {
//     return await compare(password, this.local.password);
//   });
//   return model;
// };

export default thinky;

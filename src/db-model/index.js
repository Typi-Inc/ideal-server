// export { default as Business } from './business';
import Business from './business';
// import Certificate from './certificate';
import Comment from './comment';
import Deal from './deal';
// import Like from './like';
// import Notification from './notification';
// import Tag from './tag';
// import User from './user';
import thinky, { r } from './thinky';

console.log(thinky.models);

const model = {
  r,
  Business,
  // Certificate,
  Comment,
  Deal
  // Like,
  // Notification,
  // Tag,
  // User
};

export default model;

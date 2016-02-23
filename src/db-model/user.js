import thinky, { type } from './thinky';

const User = thinky.createModel('User', {
  name: type.string(),
  image: type.string(),
  email: type.string(),
  balance: type.number(),
  isBusiness: type.boolean(),
  city: type.string()
});

User.plural = 'users';

User.ready().then(() => {
  User.hasMany(thinky.models.Business, 'businesses', 'id', 'idAdmin');
  User.hasAndBelongsToMany(thinky.models.Certificate, 'boughtCertificates', 'id', 'id');
  User.hasMany(thinky.models.Like, 'likes', 'id', 'idLiker');
  // User.hasAndBelongsToMany(thinky.models.Deal, 'likedDeals', 'id', 'id');
  User.hasAndBelongsToMany(thinky.models.Deal, 'referredDeals', 'id', 'id');
  User.hasAndBelongsToMany(thinky.models.Deal, 'soldDeals', 'id', 'id');
  User.hasMany(thinky.models.Notification, 'receivedNotifications', 'id', 'idReceiver');
  User.hasMany(thinky.models.Notification, 'sentNotifications', 'id', 'idSender');
  User.hasAndBelongsToMany(thinky.models.Tag, 'watchedTags', 'id', 'id');
});

export default User;

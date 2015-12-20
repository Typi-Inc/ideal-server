import thinky, { type } from './thinky';

const User = thinky.createModel('User', {
  image: type.string(),
  email: type.string(),
  balance: type.number(),
  city: type.string()
});

User.plural = 'users';

User.ready().then(() => {
  User.hasMany(thinky.models.Business, 'businesses', 'id', 'idAdmin');
  User.hasAndBelongsToMany(thinky.models.Certificate, 'boughtCertificates', 'id', 'id');
  User.hasAndBelongsToMany(thinky.models.Deal, 'likedDeals', 'id', 'id');
  User.hasAndBelongsToMany(thinky.models.Deal, 'referredDeals', 'id', 'id');
  User.hasAndBelongsToMany(thinky.models.Deal, 'soldDeals', 'id', 'id');
  User.hasMany(thinky.models.Notification, 'receivedNotifications', 'id', 'idReceiver');
  User.hasMany(thinky.models.Notification, 'sentNotifications', 'id', 'idSender');
});

export default User;

import thinky, { type } from './thinky';

const User = thinky.createModel('User', {
  image: type.string(),
  email: type.string(),
  balance: type.number(),
  city: type.string()
});

module.exports = User;

const Business = require('./business');
const Certificate = require('./certificate');
const Deal = require('./deal');
const Notification = require('./notification');

User.hasAndBelongsToMany(Deal, 'likedDeals', 'id', 'id');
User.hasAndBelongsToMany(Deal, 'referredDeals', 'id', 'id');
User.hasAndBelongsToMany(Deal, 'soldDeals', 'id', 'id');
User.hasAndBelongsToMany(Certificate, 'boughtCertificates', 'id', 'id');
User.hasMany(Business, 'businesses', 'id', 'idAdmin');
User.hasMany(Notification, 'receivedNotifications', 'id', 'idReceiver');
User.hasMany(Notification, 'sentNotifications', 'id', 'idSender');

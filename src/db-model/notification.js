import thinky, { type } from './thinky';

const Notification = thinky.createModel('Notification', {
  type: type.string(),
  text: type.string(),
  idDeal: type.string(),
  idReceiver: type.string(),
  idSender: type.string()
});

module.exports = Notification;

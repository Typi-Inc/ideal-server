import thinky, { type } from './thinky';

const Deal = thinky.createModel('Deal', {
  title: type.string(),
  images: type.array(), // urls
  description: type.string(),
  highlights: type.string(),
  endDate: type.date(),
  watchCount: type.number().default(0),
  payout: type.number(),
  discount: type.number(),
  idLike: type.number(),
  idBusiness: type.string()
});

module.exports = Deal;

const Comment = require('./comment');
const Business = require('./business');
// Deal.hasAndBelongsToMany(Tag,'tags','id','id')
Deal.belongsTo(Business, 'business', 'idBusiness', 'id');
// Deal.hasMany(Like,'likes','id','idDeal')
Deal.hasMany(Comment, 'comments', 'id', 'idDeal');
// Deal.hasMany(Certificate,'certificates','id','idDeal')

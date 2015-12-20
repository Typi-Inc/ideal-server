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

Deal.plural = 'deals';

Deal.ready().then(() => {
  Deal.belongsTo(thinky.models.Business, 'business', 'idBusiness', 'id');
  Deal.hasMany(thinky.models.Certificate, 'certificates', 'id', 'idDeal');
  Deal.hasMany(thinky.models.Comment, 'comments', 'id', 'idDeal');
  Deal.hasMany(thinky.models.Like, 'likes', 'id', 'idDeal');
  Deal.hasAndBelongsToMany(thinky.models.Tag, 'tags', 'id', 'id');
});

export default Deal;

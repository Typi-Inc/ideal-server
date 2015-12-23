import thinky, { type } from './thinky';

const Certificate = thinky.createModel('Certificate', {
  title: type.string(),
  totalCount: type.number(),
  oldPrice: type.number(),
  newPrice: type.number(),
  idDeal: type.string()
});

Certificate.plural = 'certificates';

Certificate.ready().then(() => {
  Certificate.hasAndBelongsToMany(thinky.models.User, 'buyers', 'id', 'id');
});

export default Certificate;

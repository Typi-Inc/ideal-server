import thinky, { type } from './thinky';

const Certificate = thinky.createModel('Certificate', {
  title: type.string(),
  boughtCount: type.number().default(0),
  totalCount: type.number(),
  oldPrice: type.number(),
  newPrice: type.number(),
  idDeal: type.string()
});

module.exports = Certificate;

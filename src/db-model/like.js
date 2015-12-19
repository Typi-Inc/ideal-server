import thinky, { type } from './thinky';

const Like = thinky.createModel('Like', {
  idDeal: type.string(),
  idUser: type.string()
});

module.exports = Like;

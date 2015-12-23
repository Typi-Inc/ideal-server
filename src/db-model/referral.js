import thinky, { type } from './thinky';
const Referral = thinky.createModel('Referral', {
  token: type.string(),
  idReferree: type.string(),
  idDeal: type.string()
});
Referral.plural = 'referrals';
Referral.ready().then(() => {
  Referral.belongsTo(thinky.models.Deal, 'deal', 'idDeal', 'id');
  Referral.belongsTo(thinky.models.User, 'referree', 'idReferree', 'id');
  Referral.hasAndBelongsToMany(thinky.models.User, 'clickers', 'id', 'id');
});
export default Referral;

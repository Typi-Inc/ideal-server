import thinky, { type } from './thinky';
import { signToken } from '../utils';
import { HOME_URL } from '../config';
const Referral = thinky.createModel('Referral', {
  url: type.virtual().default(function generateToken() {
    const token = signToken({
      idDeal: this.idDeal,
      idReferree: this.idReferree
    });
    return `${HOME_URL}/token/${token}`;
  }),
  idReferree: type.string(),
  idDeal: type.string()
});
Referral.plural = 'referrals';
Referral.ready().then(() => {
  Referral.belongsTo(thinky.models.Deal, 'deal', 'idDeal', 'id');
  Referral.belongsTo(thinky.models.User, 'referree', 'idReferree', 'id');
  Referral.hasAndBelongsToMany(thinky.models.User, 'clickers', 'id', 'id');
  Referral.hasAndBelongsToMany(thinky.models.User, 'buyers', 'id', 'id');
});

export default Referral;

import { expect } from 'chai';
import falcor from 'falcor';
import ServerRouter from '../../src/server-model/server-router';
import db from '../../src/db-model';
import { HOME_URL } from '../../src/config';
import { verifyToken } from '../../src/utils';

describe('referral.create', function describe() {
  let model;
  let deal;
  let referree;
  before(function before() {
    model = new falcor.Model({
      source: new ServerRouter(),
      maxSize: 0
    });
    deal = new db.models.Deal({
      title: 'ho'
    });
    referree = new db.models.User({
      email: 'test@gmail.com'
    });
    return deal.save().then(() => referree.save());
  });
  after(function after() {
    deal.deleteAll().then(() => referree.delete());
  });
  it(`referral.create`, function test() {
    const args = {
      idDeal: deal.id,
      idReferree: referree.id
    };
    return model.call(
      ['referral', 'create'],
      [args],
      ['url', 'idDeal', 'idReferree']
    ).
    then(function success(res) {
      const token = res.json.referral.url.replace(`${HOME_URL}/token/`, '');
      return verifyToken(token);
    }).then(function success(decoded) {
      expect(decoded.idDeal).to.equal(deal.id);
      expect(decoded.idReferree).to.equal(referree.id);
    });
  });
});

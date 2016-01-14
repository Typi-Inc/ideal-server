import { expect } from 'chai';
import falcor from 'falcor';
import jwt from 'jsonwebtoken';
import { HOME_URL, JWT_SECRET } from '../../src/config';
import ServerRouter from '../../src/server-model/server-router';
import db from '../../src/db-model';

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
    deal.delete().then(() => referree.delete());
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
      return new Promise(function promise(resolve, reject) {
        jwt.verify(token, JWT_SECRET, function callback(err, decoded) {
          if (err) return reject(err);
          resolve(decoded);
        });
      });
    }).then(function success(decoded) {
      expect(decoded.idDeal).to.equal(deal.id);
      expect(decoded.idReferree).to.equal(referree.id);
    });
  });
});

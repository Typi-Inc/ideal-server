import { expect } from 'chai';
import falcor from 'falcor';
// import _ from 'lodash';
import ServerRouter from '../../src/server-model/server-router';
import db from '../../src/db-model';

describe('call test with like', function describe() {
  let model;
  let deal;
  let user;
  before(function before() {
    model = new falcor.Model({
      source: new ServerRouter(),
      maxSize: 0
    });
    deal = new db.models.Deal({
      title: 'yo'
    });
    user = new db.models.User({
      name: 'test'
    });
    return deal.save(() => user.save());
  });
  after(function after() {
    return deal.delete(() => user.deleteAll());
  });
  it(`like.toggle`, function test() {
    return model.call(
      ['like', 'toggle'],
      [deal.id, user.id]
    ).
    then(res => {
      expect(res.json.dealsById[deal.id].likedByUser['{{me}}']).to.equal(1);
    });
  });
});

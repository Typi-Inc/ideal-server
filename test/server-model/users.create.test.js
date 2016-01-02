import { expect } from 'chai';
import falcor from 'falcor';
// import _ from 'lodash';
import ServerRouter from '../../src/server-model/server-router';
// import db from '../../src/db-model';

describe('call test', function describe() {
  let model;
  before(function before() {
    model = new falcor.Model({
      source: new ServerRouter(),
      maxSize: 0
    });
  });
  it(`users.create`, function test() {
    const args = {
      email: 'test@gmail.com',
      name: 'Almas',
      image: 'https://besmart.kz/media/events/images/249/124782.jpg.292x171_q100_crop-smart.jpg',
      social: 'facebook|123123123123'
    };
    return model.call(
      ['users', 'create'],
      [args],
      [['email']]
      // [['featuredDeals', { from: 0, to: 1 }, 'title']]
    ).
    then(res => {
      const usersById = res.json.usersById;
      expect(usersById[Object.keys(usersById)[0]].email).to.equal('test@gmail.com');
    });
  });
});

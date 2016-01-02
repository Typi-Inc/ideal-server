import { expect } from 'chai';
import falcor from 'falcor';
// import _ from 'lodash';
import ServerRouter from '../../src/server-model/server-router';
// import db from '../../src/db-model';

describe('call test with deal', function describe() {
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
      picture: 'https://besmart.kz/media/events/images/249/124782.jpg.292x171_q100_crop-smart.jpg',
      userId: 'facebook|123123123123'
    };
    return model.call(
      ['users', 'create'],
      [args],
      ['email']
    ).
    then(res => {
      expect(res.json.users.new.email).to.equal('test@gmail.com');
    });
  });
});

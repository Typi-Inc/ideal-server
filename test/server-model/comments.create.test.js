import { expect } from 'chai';
import falcor from 'falcor';
import ServerRouter from '../../src/server-model/server-router';

describe('call test with comment', function describe() {
  let model;
  before(function before() {
    model = new falcor.Model({
      source: new ServerRouter(),
      maxSize: 0
    });
  });
  it(`comments.create`, function test() {
    const args = {
      text: 'Hello',
      idDeal: '1',
      idAuthor: '2'
    };
    return model.call(
      ['comments', 'create'],
      [args],
      ['text']
    ).
    then(res => {
      expect(res.json.comments.new.text).to.equal('Hello');
    });
  });
});

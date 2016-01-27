import { expect } from 'chai';
import falcor from 'falcor';
import _ from 'lodash';
import ServerRouter from '../../src/server-model/server-router';
import db from '../../src/db-model';

describe('dealsByTags serverModel', function describe() {
  let model;
  let testTag1;
  let testTag2;
  let testTag3;
  let testDeal1;
  let testDeal2;
  let testDeal3;
  let testDeal4;
  before(function before() {
    model = new falcor.Model({
      source: new ServerRouter(),
      maxSize: 0
    });
    testTag1 = new db.models.Tag({
      text: 'pop'
    });
    testTag2 = new db.models.Tag({
      text: 'travel'
    });
    testTag3 = new db.models.Tag({
      text: 'adventure'
    });
    testDeal1 = new db.models.Deal({
      title: 'deal1',
      payout: 9,
      discount: 9
    });
    testDeal1.tags = [testTag1];
    testDeal2 = new db.models.Deal({
      title: 'deal2',
      payout: 10,
      discount: 10
    });
    testDeal2.tags = [testTag1, testTag2];
    testDeal3 = new db.models.Deal({
      title: 'deal3',
      payout: 11,
      discount: 11
    });
    testDeal3.tags = [testTag2, testTag3];
    testDeal4 = new db.models.Deal({
      title: 'deal4',
      payout: 12,
      discount: 12
    });
    testDeal4.tags = [testTag1, testTag2, testTag3];
    return testDeal1.saveAll({ tags: true }).then(() =>
      testDeal2.saveAll({ tags: true }).then(() =>
        testDeal3.saveAll({ tags: true }).then(() =>
          testDeal4.saveAll({ tags: true })
        )
      )
    );
  });
  after(function after() {
    return testDeal1.deleteAll({ tags: true }).then(() =>
      testDeal2.deleteAll({ tags: true }).then(() =>
        testDeal3.deleteAll({ tags: true }).then(() =>
          testDeal4.deleteAll({ tags: true })
        )
      )
    );
  });
  it(`dealsByTags['fasfasdfa12312sdf&asdfsadfas231df'][0..20]`, function test() {
    return model.get(['dealsByTags', [testTag2.id, testTag3.id].join(','), { from: 0, to: 20 }]).
    then(res => {
      const query = [testTag2.id, testTag3.id].join(',');
      const result = _.values(res.json.dealsByTags[query]);
      expect(result.length).to.equal(4); // - $__path
      expect(result[0][1]).to.equal(testDeal4.id);
      expect(result[1][1]).to.equal(testDeal3.id);
      expect(result[2][1]).to.equal(testDeal2.id);
    });
  });
});

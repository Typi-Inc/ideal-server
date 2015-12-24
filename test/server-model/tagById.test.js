import { expect } from 'chai';
import falcor from 'falcor';
import ServerRouter from '../../src/server-model/server-router';
import db from '../../src/db-model';

describe('tagsById', () => {
  let model;
  let testTag1;
  let testTag2;
  before(() => {
    model = new falcor.Model({
      source: new ServerRouter(),
      maxSize: 0
    });
    testTag1 = new db.models.Tag({
      text: 'coffee'
    });
    testTag2 = new db.models.Tag({
      text: 'bar'
    });
    return testTag1.save().then(
        testTag2.save()
    );
  });
  after(() => {
    return testTag1.delete().then(
      testTag2.delete()
    );
  });
  it(`tagsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].text`, () =>
    model.get(['tagsById', testTag1.id, 'text']).
    then(res => {
      expect(
        res.json.tagsById[testTag1.id].text
      ).to.equal(testTag1.text);
    })
  );
  it(`tagsById[{keys:tagIds}].text`, () =>
    model.get([
      'tagsById',
      [testTag1.id, testTag2.id],
      'text'
    ]).
    then(res => {
      expect(
        res.json.tagsById[testTag1.id].text
      ).to.equal(testTag1.text);
      expect(
        res.json.tagsById[testTag2.id].text
      ).to.equal(testTag2.text);
    })
  );
  // TODO test errors
});

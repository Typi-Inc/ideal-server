import { expect } from 'chai';
import falcor from 'falcor';
import _ from 'lodash';
import ServerRouter from '../../src/server-model/server-router';
import dbModel from '../../src/db-model';

describe('dealsById', () => {
  let model;
  let testDeal1;
  let testDeal2;
  let comment1;
  let comment2;
  let comment3;
  before(() => {
    model = new falcor.Model({
      source: new ServerRouter(dbModel),
      maxSize: 0
    });
    testDeal1 = new dbModel.Deal({
      title: 'test'
    });
    testDeal2 = new dbModel.Deal({
      title: 'test2'
    });
    comment1 = new dbModel.Comment({
      text: 'hey',
      createdAt: dbModel.r.time(
        2013, dbModel.r.august, 9, 18, 53, 15.012, '-07:00')
    });
    comment2 = new dbModel.Comment({
      text: 'ho',
      createdAt: dbModel.r.time(
        2014, dbModel.r.august, 9, 18, 53, 15.012, '-07:00')
    });
    comment3 = new dbModel.Comment({
      text: 'cho'
    });
    testDeal1.comments = [comment1, comment2, comment3];
    return testDeal1.saveAll().then(
      testDeal2.saveAll()
    );
  });
  after(() => {
    return testDeal1.deleteAll().then(
      testDeal2.deleteAll()
    );
  });
  it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].title`, () =>
    model.get(['dealsById', testDeal1.id, 'title']).
    then(res => {
      expect(
        res.json.dealsById[testDeal1.id].title
      ).to.equal(testDeal1.title);
    })
  );
  it(`dealsById[{keys:dealIds}].title`, () =>
    model.get([
      'dealsById',
      [testDeal1.id, testDeal2.id],
      'title'
    ]).
    then(res => {
      expect(
        res.json.dealsById[testDeal1.id].title
      ).to.equal(testDeal1.title);
      expect(
        res.json.dealsById[testDeal2.id].title
      ).to.equal(testDeal2.title);
    })
  );
  it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
    comments.edges[0]`, () =>
    model.get(['dealsById', testDeal1.id, 'comments', 'edges', 0]).
    then(res => {
      const edges = res.json.dealsById[testDeal1.id].comments.edges;
      expect(_.values(edges).length).to.equal(1);
      expect(edges[0][0]).to.equal('commentsById');
      expect(edges[0][1]).to.equal(comment3.id);
      expect(edges[0].length).to.equal(2);
    })
  );
  it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
    comments.edges[0..1]`, () =>
    model.get(['dealsById', testDeal1.id, 'comments', 'edges', { from: 0, to: 1 }]).
    then(res => {
      const edges = res.json.dealsById[testDeal1.id].comments.edges;
      expect(_.values(edges).length).to.equal(2);
      expect(edges[0][0]).to.equal('commentsById');
      expect(edges[0][1]).to.equal(comment3.id);
      expect(edges[0].length).to.equal(2);
      expect(edges[1][0]).to.equal('commentsById');
      expect(edges[1][1]).to.equal(comment2.id);
      expect(edges[1].length).to.equal(2);
    })
  );
  it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
    comments.edges[1..2]`, () =>
    model.get(['dealsById', testDeal1.id, 'comments', 'edges', { from: 1, to: 2 }]).
    then(res => {
      const edges = res.json.dealsById[testDeal1.id].comments.edges;
      expect(_.values(edges).length).to.equal(2);
      expect(edges[1][0]).to.equal('commentsById');
      expect(edges[1][1]).to.equal(comment2.id);
      expect(edges[1].length).to.equal(2);
      expect(edges[2][0]).to.equal('commentsById');
      expect(edges[2][1]).to.equal(comment1.id);
      expect(edges[2].length).to.equal(2);
    })
  );
  it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
    comments.edges[0] when there are no comments`, () =>
    model.get([
      'dealsById',
      testDeal2.id,
      'comments',
      'edges',
      { from: 1, to: 2 }
    ]).
    then(res => {
      expect(res).to.be.undefined; // eslint-disable-line
    })
  );
  it(`dealsById[
    '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
    '2f6527f3-c99d-4ff0-b31f-09cb793b966f'
  ].comments.edges[1..2] both undefined and normal`, () =>
    model.get([
      'dealsById',
      [testDeal1.id, testDeal2.id],
      'comments',
      'edges',
      { from: 1, to: 2 }
    ]).
    then(res => {
      expect(res.json.dealsById[testDeal2.id]).to.be.undefined; // eslint-disable-line
      const edges = res.json.dealsById[testDeal1.id].comments.edges;
      expect(_.values(edges).length).to.equal(2);
      expect(edges[1][0]).to.equal('commentsById');
      expect(edges[1][1]).to.equal(comment2.id);
      expect(edges[1].length).to.equal(2);
      expect(edges[2][0]).to.equal('commentsById');
      expect(edges[2][1]).to.equal(comment1.id);
      expect(edges[2].length).to.equal(2);
    })
  );
  it(`dealsById[
    '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
    '2f6527f3-c99d-4ff0-b31f-09cb793b966f'
  ].comments.count`, () =>
    model.get([
      'dealsById',
      [testDeal1.id, testDeal2.id],
      'comments',
      'count'
    ]).
    then(res => {
      expect(res.json.dealsById[testDeal2.id].comments.count).to.equal(0); // eslint-disable-line
      const count = res.json.dealsById[testDeal1.id].comments.count;
      expect(count).to.equal(3);
    })
  );
});

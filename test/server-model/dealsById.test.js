import { expect } from 'chai';
import falcor from 'falcor';
import _ from 'lodash';
import ServerRouter from '../../src/server-model/server-router';
import db from '../../src/db-model';

describe('dealsById', () => {
  let model;
  let testDeal1;
  let testDeal2;
  let testDealFiltersAndSorts;
  let comment1;
  let comment2;
  let comment3;
  let business1;
  let commentFiltersAndSorts1;
  let commentFiltersAndSorts2;
  let commentFiltersAndSorts3;
  let commentFiltersAndSorts4;
  before(() => {
    model = new falcor.Model({
      source: new ServerRouter(),
      maxSize: 0
    });
    testDeal1 = new db.models.Deal({
      title: 'test'
    });
    testDeal2 = new db.models.Deal({
      title: 'test2'
    });
    comment1 = new db.models.Comment({
      text: 'hey',
      createdAt: db.r.time(
        2013, db.r.august, 9, 18, 53, 15.012, '-07:00')
    });
    comment2 = new db.models.Comment({
      text: 'ho',
      createdAt: db.r.time(
        2014, db.r.august, 9, 18, 53, 15.012, '-07:00'
      )
    });
    comment3 = new db.models.Comment({
      text: 'cho'
    });
    business1 = new db.models.Business({
      name: 'IDeal'
    });
    testDealFiltersAndSorts = new db.models.Deal({
      title: 'test3'
    });
    commentFiltersAndSorts1 = new db.models.Comment({
      text: 'yo',
      idAuthor: '1',
      createdAt: db.r.time(
        2014, db.r.august, 9, 18, 53, 15.012, '-07:00'
      )
    });
    commentFiltersAndSorts2 = new db.models.Comment({
      text: 'yo',
      idAuthor: '1',
      createdAt: db.r.time(
        2013, db.r.august, 9, 18, 53, 15.012, '-07:00'
      )
    });
    commentFiltersAndSorts3 = new db.models.Comment({
      text: 'yo',
      idAuthor: '2'
    });
    commentFiltersAndSorts4 = new db.models.Comment({
      text: 'cho'
    });
    testDeal1.comments = [comment1, comment2, comment3];
    testDeal1.business = business1;
    testDealFiltersAndSorts.comments = [
      commentFiltersAndSorts1,
      commentFiltersAndSorts2,
      commentFiltersAndSorts3,
      commentFiltersAndSorts4
    ];
    return testDeal1.saveAll({ business: true, comments: true }).then(
      testDeal2.saveAll().then(
        testDealFiltersAndSorts.saveAll({ comments: true })
      )
    );
  });
  after(() => {
    return testDeal1.deleteAll({ business: true, comments: true }).then(
      testDeal2.deleteAll().then(
        testDealFiltersAndSorts.deleteAll({ comments: true })
      )
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
    comments['sort:createdAt=desc'].edges[0]`, () =>
    model.get([
      'dealsById',
      testDeal1.id,
      'comments',
      'sort:createdAt=desc',
      'edges',
      0
    ]).
    then(res => {
      const edges =
        res.json.dealsById[testDeal1.id].comments['sort:createdAt=desc'].edges;
      expect(_.values(edges).length).to.equal(1);
      expect(edges[0][0]).to.equal('commentsById');
      expect(edges[0][1]).to.equal(comment3.id);
      expect(edges[0].length).to.equal(2);
    })
  );
  // it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
  //   comments.edges[0]`, () =>
  //   model.get([
  //     'dealsById',
  //     testDeal1.id,
  //     'comments',
  //     'edges',
  //     0
  //   ]).
  //   then(res => {
  //     const edges = res.json.dealsById[testDeal1.id].comments.edges;
  //     expect(_.values(edges).length).to.equal(1);
  //     expect(edges[0][0]).to.equal('commentsById');
  //     expect(edges[0][1]).to.equal(comment3.id);
  //     expect(edges[0].length).to.equal(2);
  //   })
  // );
  it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
    comments['sort:createdAt=desc'].edges[0..1]`, () =>
    model.get([
      'dealsById',
      testDeal1.id,
      'comments',
      'sort:createdAt=desc',
      'edges',
      { from: 0, to: 1 }]
    ).
    then(res => {
      const edges =
        res.json.dealsById[testDeal1.id].comments['sort:createdAt=desc'].edges;
      expect(_.values(edges).length).to.equal(2);
      expect(edges[0][0]).to.equal('commentsById');
      expect(edges[0][1]).to.equal(comment3.id);
      expect(edges[0].length).to.equal(2);
      expect(edges[1][0]).to.equal('commentsById');
      expect(edges[1][1]).to.equal(comment2.id);
      expect(edges[1].length).to.equal(2);
    })
  );
  // it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
  //   comments.edges[0..1]`, () =>
  //   model.get(['dealsById', testDeal1.id, 'comments', 'edges', { from: 0, to: 1 }]).
  //   then(res => {
  //     const edges = res.json.dealsById[testDeal1.id].comments.edges;
  //     expect(_.values(edges).length).to.equal(2);
  //     expect(edges[0][0]).to.equal('commentsById');
  //     expect(edges[0][1]).to.equal(comment3.id);
  //     expect(edges[0].length).to.equal(2);
  //     expect(edges[1][0]).to.equal('commentsById');
  //     expect(edges[1][1]).to.equal(comment2.id);
  //     expect(edges[1].length).to.equal(2);
  //   })
  // );
  it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
    comments['sort:createdAt=desc'].edges[1..2]`, () =>
    model.get([
      'dealsById',
      testDeal1.id,
      'comments',
      'sort:createdAt=desc',
      'edges',
      { from: 1, to: 2 }]
    ).
    then(res => {
      const edges =
        res.json.dealsById[testDeal1.id].comments['sort:createdAt=desc'].edges;
      expect(_.values(edges).length).to.equal(2);
      expect(edges[1][0]).to.equal('commentsById');
      expect(edges[1][1]).to.equal(comment2.id);
      expect(edges[1].length).to.equal(2);
      expect(edges[2][0]).to.equal('commentsById');
      expect(edges[2][1]).to.equal(comment1.id);
      expect(edges[2].length).to.equal(2);
    })
  );
  // it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
  //   comments['sort:createdAt=desc'].edges[1..2]`, () =>
  //   model.get(['dealsById', testDeal1.id, 'comments', 'edges', { from: 1, to: 2 }]).
  //   then(res => {
  //     const edges = res.json.dealsById[testDeal1.id].comments.edges;
  //     expect(_.values(edges).length).to.equal(2);
  //     expect(edges[1][0]).to.equal('commentsById');
  //     expect(edges[1][1]).to.equal(comment2.id);
  //     expect(edges[1].length).to.equal(2);
  //     expect(edges[2][0]).to.equal('commentsById');
  //     expect(edges[2][1]).to.equal(comment1.id);
  //     expect(edges[2].length).to.equal(2);
  //   })
  // );
  it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
    comments['sort:createdAt=desc'].edges[0] when there are no comments`, () =>
    model.get([
      'dealsById',
      testDeal2.id,
      'comments',
      'sort:createdAt=desc',
      'edges',
      { from: 1, to: 2 }
    ]).
    then(res => {
      expect(res).to.be.undefined; // eslint-disable-line
    })
  );
  // it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
  //   comments.edges[0] when there are no comments`, () =>
  //   model.get([
  //     'dealsById',
  //     testDeal2.id,
  //     'comments',
  //     'edges',
  //     { from: 1, to: 2 }
  //   ]).
  //   then(res => {
  //     expect(res).to.be.undefined; // eslint-disable-line
  //   })
  // );
  it(`dealsById[
    '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
    '2f6527f3-c99d-4ff0-b31f-09cb793b966f'
  ].comments['sort:createdAt=desc'].edges[1..2] both undefined and normal`, () =>
    model.get([
      'dealsById',
      [testDeal1.id, testDeal2.id],
      'comments',
      'sort:createdAt=desc',
      'edges',
      { from: 1, to: 2 }
    ]).
    then(res => {
      expect(res.json.dealsById[testDeal2.id]).to.be.undefined; // eslint-disable-line
      const edges =
        res.json.dealsById[testDeal1.id].comments['sort:createdAt=desc'].edges;
      expect(_.values(edges).length).to.equal(2);
      expect(edges[1][0]).to.equal('commentsById');
      expect(edges[1][1]).to.equal(comment2.id);
      expect(edges[1].length).to.equal(2);
      expect(edges[2][0]).to.equal('commentsById');
      expect(edges[2][1]).to.equal(comment1.id);
      expect(edges[2].length).to.equal(2);
    })
  );
  // it(`dealsById[
  //   '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
  //   '2f6527f3-c99d-4ff0-b31f-09cb793b966f'
  // ].comments.edges[1..2] both undefined and normal`, () =>
  //   model.get([
  //     'dealsById',
  //     [testDeal1.id, testDeal2.id],
  //     'comments',
  //     'edges',
  //     { from: 1, to: 2 }
  //   ]).
  //   then(res => {
  //     expect(res.json.dealsById[testDeal2.id]).to.be.undefined; // eslint-disable-line
  //     const edges = res.json.dealsById[testDeal1.id].comments.edges;
  //     expect(_.values(edges).length).to.equal(2);
  //     expect(edges[1][0]).to.equal('commentsById');
  //     expect(edges[1][1]).to.equal(comment2.id);
  //     expect(edges[1].length).to.equal(2);
  //     expect(edges[2][0]).to.equal('commentsById');
  //     expect(edges[2][1]).to.equal(comment1.id);
  //     expect(edges[2].length).to.equal(2);
  //   })
  // );
  it(`dealsById[
    '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
    '2f6527f3-c99d-4ff0-b31f-09cb793b966f'
  ].comments['sort:createdAt=desc'].count`, () =>
    model.get([
      'dealsById',
      [testDeal1.id, testDeal2.id],
      'comments',
      'sort:createdAt=desc',
      'count'
    ]).
    then(res => {
      expect(
        res.json.dealsById[testDeal2.id].comments['sort:createdAt=desc'].count
      ).to.equal(0);
      const count =
        res.json.dealsById[testDeal1.id].comments['sort:createdAt=desc'].count;
      expect(count).to.equal(3);
    })
  );
  // it(`dealsById[
  //   '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
  //   '2f6527f3-c99d-4ff0-b31f-09cb793b966f'
  // ].comments.count`, () =>
  //   model.get([
  //     'dealsById',
  //     [testDeal1.id, testDeal2.id],
  //     'comments',
  //     'count'
  //   ]).
  //   then(res => {
  //     expect(res.json.dealsById[testDeal2.id].comments.count).to.equal(0); // eslint-disable-line
  //     const count = res.json.dealsById[testDeal1.id].comments.count;
  //     expect(count).to.equal(3);
  //   })
  // );
  it(`dealsById[
    '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
    '2f6527f3-c99d-4ff0-b31f-09cb793b966f'
  ].business`, () =>
    model.get([
      'dealsById',
      [testDeal1.id, testDeal2.id],
      'business'
    ]).
    then(res => {
      const business = res.json.
        dealsById[testDeal1.id].business;
      expect(res.json.dealsById[testDeal2.id]).to.be.undefined; // eslint-disable-line
      expect(business.length).to.equal(2);
      expect(business[0]).to.equal('businessesById');
      expect(business[1]).to.equal(business1.id);
    })
  );
  it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
    comments['where:text=yo&sort:createdAt=desc'].edges[0..5]`, () =>
    model.get([
      'dealsById',
      testDealFiltersAndSorts.id,
      'comments',
      'where:text=yo&sort:createdAt=desc',
      'edges',
      { from: 0, to: 5 }
    ]).
    then(res => {
      const edges = res.json.dealsById[testDealFiltersAndSorts.id].
        comments['where:text=yo&sort:createdAt=desc'].edges;
      expect(_.values(edges).length).to.equal(3);
      expect(edges[0][0]).to.equal('commentsById');
      expect(edges[0][1]).to.equal(commentFiltersAndSorts3.id);
      expect(edges[0].length).to.equal(2);
      expect(edges[1][0]).to.equal('commentsById');
      expect(edges[1][1]).to.equal(commentFiltersAndSorts1.id);
      expect(edges[1].length).to.equal(2);
      expect(edges[2][0]).to.equal('commentsById');
      expect(edges[2][1]).to.equal(commentFiltersAndSorts2.id);
      expect(edges[2].length).to.equal(2);
    })
  );
  it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
    comments['where:text=yo,idAuthor=1&sort:createdAt=desc'].edges[0..5]`, () =>
    model.get([
      'dealsById',
      testDealFiltersAndSorts.id,
      'comments',
      'where:text=yo,idAuthor=1&sort:createdAt=desc',
      'edges',
      { from: 0, to: 5 }
    ]).
    then(res => {
      const edges = res.json.dealsById[testDealFiltersAndSorts.id].
        comments['where:text=yo,idAuthor=1&sort:createdAt=desc'].edges;
      expect(_.values(edges).length).to.equal(2);
      expect(edges[0][0]).to.equal('commentsById');
      expect(edges[0][1]).to.equal(commentFiltersAndSorts1.id);
      expect(edges[0].length).to.equal(2);
      expect(edges[1][0]).to.equal('commentsById');
      expect(edges[1][1]).to.equal(commentFiltersAndSorts2.id);
      expect(edges[1].length).to.equal(2);
    })
  );
  it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
    comments['where:text=yo,idAuthor=5&sort:createdAt=desc'].edges[0..5]`, () =>
    model.get([
      'dealsById',
      testDealFiltersAndSorts.id,
      'comments',
      'where:text=yo,idAuthor=5&sort:createdAt=desc',
      'edges',
      { from: 0, to: 5 }
    ]).
    then(res => {
      expect(res).to.be.undefined; // eslint-disable-line
    })
  );
  it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
    comments[
      'where:text=yo,idAuthor=1&sort:createdAt=desc',
      'where:text=yo,idAuthor=1&sort:createdAt=asc',
    ].edges[0..5]`, () =>
    model.get([
      'dealsById',
      testDealFiltersAndSorts.id,
      'comments',
      [
        'where:text=yo,idAuthor=1&sort:createdAt=desc',
        'where:text=yo,idAuthor=1&sort:createdAt=asc'
      ],
      'edges',
      { from: 0, to: 5 }
    ]).
    then(res => {
      const edges0 = res.json.dealsById[testDealFiltersAndSorts.id].
        comments['where:text=yo,idAuthor=1&sort:createdAt=desc'].edges;
      expect(_.values(edges0).length).to.equal(2);
      expect(edges0[0][0]).to.equal('commentsById');
      expect(edges0[0][1]).to.equal(commentFiltersAndSorts1.id);
      expect(edges0[0].length).to.equal(2);
      expect(edges0[1][0]).to.equal('commentsById');
      expect(edges0[1][1]).to.equal(commentFiltersAndSorts2.id);
      expect(edges0[1].length).to.equal(2);
      const edges1 = res.json.dealsById[testDealFiltersAndSorts.id].
        comments['where:text=yo,idAuthor=1&sort:createdAt=asc'].edges;
      expect(_.values(edges1).length).to.equal(2);
      expect(edges1[0][0]).to.equal('commentsById');
      expect(edges1[0][1]).to.equal(commentFiltersAndSorts2.id);
      expect(edges1[0].length).to.equal(2);
      expect(edges1[1][0]).to.equal('commentsById');
      expect(edges1[1][1]).to.equal(commentFiltersAndSorts1.id);
      expect(edges1[1].length).to.equal(2);
    })
  );
  it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f',].comments[
    'where:text=yo,idAuthor=1&sort:createdAt=desc',
    'where:text=yo,idAuthor=1&sort:createdAt=asc',
  ].count`, () =>
    model.get([
      'dealsById',
      testDealFiltersAndSorts.id,
      'comments',
      [
        'where:text=yo,idAuthor=1&sort:createdAt=desc',
        'where:text=yo,idAuthor=1&sort:createdAt=asc'
      ],
      'count'
    ]).
    then(res => {
      const count0 = res.json.dealsById[testDealFiltersAndSorts.id].
        comments['where:text=yo,idAuthor=1&sort:createdAt=desc'].count;
      expect(count0).to.equal(2);
      const count1 = res.json.dealsById[testDealFiltersAndSorts.id].
        comments['where:text=yo,idAuthor=1&sort:createdAt=asc'].count;
      expect(count1).to.equal(2);
    })
  );
  // TODO test errors
});

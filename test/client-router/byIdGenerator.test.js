import { expect } from 'chai';
import falcor from 'falcor';
import _ from 'lodash';
import ClientRouter from '../../src/client-router/index';

const $ref = falcor.Model.ref;

describe('byIdGenerator test by dealsById', () => {
  let model;
  before(() => {
    const serverModel = new falcor.Model({
      cache: {
        dealsById: {
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f': {
            title: 'hello',
            business: $ref(['businessesById', '99bca56f-7fb4-469b-8815-1edfd557d244']),
            comments: {
              'sort:createdAt=desc': {
                count: 2,
                edges: {
                  '0': $ref(['commentsById', '26bca56f-7fb4-469b-8815-1edfd557d244']),
                  '1': $ref(['commentsById', '36bca56f-7fb4-469b-8815-1edfd557d244'])
                }
              }
            }
          },
          '2f6527f3-c99d-4ff0-b31f-09cb793b966f': {
            title: 'good day',
            comments: {
              'sort:createdAt=desc': {
                count: 2,
                edges: {
                  '0': $ref(['commentsById', '26bca56f-7fb4-469b-8815-1edfd557d244']),
                  '1': $ref(['commentsById', '36bca56f-7fb4-469b-8815-1edfd557d244'])
                }
              }
            }
          },
          '16bca56f-7fb4-469b-8815-1edfd557d244': {
            title: 'world',
            comments: {
              hasData: 0,
              edges: undefined
            }
          }
        },
        businessesById: {
          '99bca56f-7fb4-469b-8815-1edfd557d244': {
            name: 'IDeal'
          }
        },
        commentsById: {
          '26bca56f-7fb4-469b-8815-1edfd557d244': {
            text: 'hey'
          },
          '36bca56f-7fb4-469b-8815-1edfd557d244': {
            text: 'ho'
          }
        }
      }
    });
    const router = new ClientRouter(serverModel);
    model = new falcor.Model({
      source: router,
      maxSize: 0
    });
  });
  it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].title`, () =>
    model.
      get([
        'dealsById',
        [
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f'
        ],
        [
          'title'
        ]
      ]).
      then(res => {
        expect(
          res.json.dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].title
        ).to.equal('hello');
      })
  );
  it(`dealsById[
    '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
    '16bca56f-7fb4-469b-8815-1edfd557d244'
  ].title`, () =>
    model.
      get([
        'dealsById',
        [
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
          '16bca56f-7fb4-469b-8815-1edfd557d244'
        ],
        'title'
      ]).
      then(res => {
        expect(
          res.json.dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].title
        ).to.equal('hello');
        expect(
          res.json.dealsById['16bca56f-7fb4-469b-8815-1edfd557d244'].title
        ).to.equal('world');
      })
  );
  it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
    comments['sort:createdAt=desc'].edges[0]
    completes with path to other part of JSONG`, () =>
    model.
      get([
        'dealsById',
        [
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f'
        ],
        'comments',
        'sort:createdAt=desc',
        'edges',
        '0'
      ]).
      then(res => {
        const comment = res.json.
          dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
          comments['sort:createdAt=desc'].edges[0];
        expect(comment[0]).to.equal('commentsById');
        expect(comment[1]).to.equal('26bca56f-7fb4-469b-8815-1edfd557d244');
        expect(comment.length).to.equal(2);
      })
  );
  // it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
  //   comments.edges[0]
  //   completes with path to other part of JSONG`, () =>
  //   model.
  //     get([
  //       'dealsById',
  //       [
  //         '1f6527f3-c99d-4ff0-b31f-09cb793b966f'
  //       ],
  //       'comments',
  //       'edges',
  //       '0'
  //     ]).
  //     then(res => {
  //       const comment = res.json.
  //         dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].comments.edges[0];
  //       expect(comment[0]).to.equal('commentsById');
  //       expect(comment[1]).to.equal('26bca56f-7fb4-469b-8815-1edfd557d244');
  //       expect(comment.length).to.equal(2);
  //     })
  // );
  it(`dealsById['16bca56f-7fb4-469b-8815-1edfd557d244'].
    comments['sort:createdAt=desc'].edges[0]
    completes with undefined without error`, () =>
    model.
      get([
        'dealsById',
        [
          '16bca56f-7fb4-469b-8815-1edfd557d244'
        ],
        'comments',
        'sort:createdAt=desc',
        'edges',
        '0'
      ]).
      then(res => {
        expect(res).to.be.undefined; // eslint-disable-line
      })
  );
  // it(`dealsById['16bca56f-7fb4-469b-8815-1edfd557d244'].
  //   comments.edges[0]
  //   completes with undefined without error`, () =>
  //   model.
  //     get([
  //       'dealsById',
  //       [
  //         '16bca56f-7fb4-469b-8815-1edfd557d244'
  //       ],
  //       'comments',
  //       'edges',
  //       '0'
  //     ]).
  //     then(res => {
  //       expect(res).to.be.undefined; // eslint-disable-line
  //     })
  // );
  it(`dealsById[
    '16bca56f-7fb4-469b-8815-1edfd557d244',
    '1f6527f3-c99d-4ff0-b31f-09cb793b966f'
  ].comments['sort:createdAt=desc'].edges[0]
  completes with undefined and path`, () =>
    model.
      get([
        'dealsById',
        [
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
          '16bca56f-7fb4-469b-8815-1edfd557d244'
        ],
        'comments',
        'sort:createdAt=desc',
        'edges',
        '0'
      ]).
      then(res => {
        const comment = res.json.
          dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
          comments['sort:createdAt=desc'].edges[0];
        expect(comment[0]).to.equal('commentsById');
        expect(comment[1]).to.equal('26bca56f-7fb4-469b-8815-1edfd557d244');
        expect(comment.length).to.equal(2);
        expect(res.json.dealsById['16bca56f-7fb4-469b-8815-1edfd557d244']). // eslint-disable-line
          to.be.undefined;
      })
  );
  // it(`dealsById[
  //   '16bca56f-7fb4-469b-8815-1edfd557d244',
  //   '1f6527f3-c99d-4ff0-b31f-09cb793b966f'
  // ].comments.edges[0] completes with undefined and path`, () =>
  //   model.
  //     get([
  //       'dealsById',
  //       [
  //         '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
  //         '16bca56f-7fb4-469b-8815-1edfd557d244'
  //       ],
  //       'comments',
  //       'edges',
  //       '0'
  //     ]).
  //     then(res => {
  //       const comment = res.json.
  //         dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].comments.edges[0];
  //       expect(comment[0]).to.equal('commentsById');
  //       expect(comment[1]).to.equal('26bca56f-7fb4-469b-8815-1edfd557d244');
  //       expect(comment.length).to.equal(2);
  //       expect(res.json.dealsById['16bca56f-7fb4-469b-8815-1edfd557d244']). // eslint-disable-line
  //         to.be.undefined;
  //     })
  // );
  it(`dealsById[
    '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
    '16bca56f-7fb4-469b-8815-1edfd557d244',
    '2f6527f3-c99d-4ff0-b31f-09cb793b966f'
  ].comments['sort:createdAt=desc'].edges[0..9]
  completes with path only for the latter id`, () =>
    model.
      get([
        'dealsById',
        [
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
          '2f6527f3-c99d-4ff0-b31f-09cb793b966f',
          '16bca56f-7fb4-469b-8815-1edfd557d244'
        ],
        'comments',
        'sort:createdAt=desc',
        'edges',
        { from: 0, to: 9 }
      ]).
      then(res => {
        const comments1 = res.json.
          dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
          comments['sort:createdAt=desc'].edges;
        const comments2 = res.json.
          dealsById['2f6527f3-c99d-4ff0-b31f-09cb793b966f'].
          comments['sort:createdAt=desc'].edges;
        expect(_.values(comments1).length).to.equal(2);
        expect(_.values(comments2).length).to.equal(2);
        expect(comments1[0][0]).to.equal('commentsById');
        expect(comments1[0][1]).to.equal('26bca56f-7fb4-469b-8815-1edfd557d244');
        expect(comments1[1][0]).to.equal('commentsById');
        expect(comments1[1][1]).to.equal('36bca56f-7fb4-469b-8815-1edfd557d244');
        expect(comments2[0][0]).to.equal('commentsById');
        expect(comments2[0][1]).to.equal('26bca56f-7fb4-469b-8815-1edfd557d244');
        expect(comments2[1][0]).to.equal('commentsById');
        expect(comments2[1][1]).to.equal('36bca56f-7fb4-469b-8815-1edfd557d244');
        expect(res.json.dealsById['16bca56f-7fb4-469b-8815-1edfd557d244']). // eslint-disable-line
          to.be.undefined;
      })
  );
  // it(`dealsById[
  //   '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
  //   '16bca56f-7fb4-469b-8815-1edfd557d244',
  //   '2f6527f3-c99d-4ff0-b31f-09cb793b966f'
  // ].comments.edges[0..9] completes with path only for the latter id`, () =>
  //   model.
  //     get([
  //       'dealsById',
  //       [
  //         '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
  //         '2f6527f3-c99d-4ff0-b31f-09cb793b966f',
  //         '16bca56f-7fb4-469b-8815-1edfd557d244'
  //       ],
  //       'comments',
  //       'edges',
  //       { from: 0, to: 9 }
  //     ]).
  //     then(res => {
  //       const comments1 = res.json.
  //         dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].comments.edges;
  //       const comments2 = res.json.
  //         dealsById['2f6527f3-c99d-4ff0-b31f-09cb793b966f'].comments.edges;
  //       expect(_.values(comments1).length).to.equal(2);
  //       expect(_.values(comments2).length).to.equal(2);
  //       expect(comments1[0][0]).to.equal('commentsById');
  //       expect(comments1[0][1]).to.equal('26bca56f-7fb4-469b-8815-1edfd557d244');
  //       expect(comments1[1][0]).to.equal('commentsById');
  //       expect(comments1[1][1]).to.equal('36bca56f-7fb4-469b-8815-1edfd557d244');
  //       expect(comments2[0][0]).to.equal('commentsById');
  //       expect(comments2[0][1]).to.equal('26bca56f-7fb4-469b-8815-1edfd557d244');
  //       expect(comments2[1][0]).to.equal('commentsById');
  //       expect(comments2[1][1]).to.equal('36bca56f-7fb4-469b-8815-1edfd557d244');
  //       expect(res.json.dealsById['16bca56f-7fb4-469b-8815-1edfd557d244']). // eslint-disable-line
  //         to.be.undefined;
  //     })
  // );
  it(`dealsById[
    '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
    '2f6527f3-c99d-4ff0-b31f-09cb793b966f'
  ].business completes well`, () => // TODO rename to business
    model.
      get([
        'dealsById',
        [
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
          '2f6527f3-c99d-4ff0-b31f-09cb793b966f'
        ],
        'business'
      ]).
      then(res => {
        console.log(res);
        const business = res.json.
          dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].business;
        expect(business.length).to.equal(2);
        expect(business[0]).to.equal('businessesById');
        expect(business[1]).to.equal('99bca56f-7fb4-469b-8815-1edfd557d244');
        expect(res.json.dealsById['2f6527f3-c99d-4ff0-b31f-09cb793b966f']). // eslint-disable-line
          to.be.undefined;
      })
  );
});

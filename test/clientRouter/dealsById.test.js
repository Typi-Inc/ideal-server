import { expect } from 'chai';
import falcor from 'falcor';
import _ from 'lodash';
import ClientRouter from '../../src/client-router/index';

const $ref = falcor.Model.ref;

describe('dealsById falcor routes', () => {
  let model;
  before(() => {
    const serverModel = new falcor.Model({
      cache: {
        dealsById: {
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f': {
            title: 'hello',
            company: $ref(['companiesById', '99bca56f-7fb4-469b-8815-1edfd557d244']),
            comments: {
              count: 2,
              edges: {
                '0': $ref(['commentsById', '26bca56f-7fb4-469b-8815-1edfd557d244']),
                '1': $ref(['commentsById', '36bca56f-7fb4-469b-8815-1edfd557d244'])
              }
            }
          },
          '2f6527f3-c99d-4ff0-b31f-09cb793b966f': {
            title: 'good day',
            comments: {
              count: 2,
              edges: {
                '0': $ref(['commentsById', '26bca56f-7fb4-469b-8815-1edfd557d244']),
                '1': $ref(['commentsById', '36bca56f-7fb4-469b-8815-1edfd557d244'])
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
        companiesById: {
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
      source: router
    });
  });
  it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].title`, done => {
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
      subscribe(res => {
        expect(
          res.json.dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].title
        ).to.deep.equal('hello');
      }, err => done(err), done);
  });
  it(`dealsById[{keys:dealIds}].title`, done => {
    model.
      get([
        'dealsById',
        [
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
          '16bca56f-7fb4-469b-8815-1edfd557d244'
        ],
        'title'
      ]).
      subscribe(res => {
        expect(
          res.json.dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].title
        ).to.equal('hello');
        expect(
          res.json.dealsById['16bca56f-7fb4-469b-8815-1edfd557d244'].title
        ).to.equal('world');
      }, err => done(err), done);
  });
  it(`dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].
    comments.edges[0]
    completes with path to other part of JSONG`, done => {
    model.
      get([
        'dealsById',
        [
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f'
        ],
        'comments',
        'edges',
        '0'
      ]).
      subscribe(res => {
        const comment = res.json.
          dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].comments.edges[0];
        expect(comment[0]).to.equal('commentsById');
        expect(comment[1]).to.equal('26bca56f-7fb4-469b-8815-1edfd557d244');
        expect(comment.length).to.equal(2);
      }, err => done(err), done);
  });
  it(`dealsById[{keys:dealIds}].
    comments.edges['16bca56f-7fb4-469b-8815-1edfd557d244']
    completes with undefined without error`, done => {
    model.
      get([
        'dealsById',
        [
          '16bca56f-7fb4-469b-8815-1edfd557d244'
        ],
        'comments',
        'edges',
        '0'
      ]).
      subscribe(res => {
        expect(res).to.be.undefined; // eslint-disable-line
      }, err => done(err), done);
  });
  it(`dealsById[
    '16bca56f-7fb4-469b-8815-1edfd557d244',
    '1f6527f3-c99d-4ff0-b31f-09cb793b966f'
  ].comments.edges[0] completes with undefined and path`, done => {
    model.
      get([
        'dealsById',
        [
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
          '16bca56f-7fb4-469b-8815-1edfd557d244'
        ],
        'comments',
        'edges',
        '0'
      ]).
      subscribe(res => {
        const comment = res.json.
          dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].comments.edges[0];
        expect(comment[0]).to.equal('commentsById');
        expect(comment[1]).to.equal('26bca56f-7fb4-469b-8815-1edfd557d244');
        expect(comment.length).to.equal(2);
        expect(res.json.dealsById['16bca56f-7fb4-469b-8815-1edfd557d244']). // eslint-disable-line
          to.be.undefined;
      }, err => done(err), done);
  });
  it(`dealsById[
    '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
    '16bca56f-7fb4-469b-8815-1edfd557d244',
    '2f6527f3-c99d-4ff0-b31f-09cb793b966f'
  ].comments.edges[0..9] completes with path only for the latter id`, done => {
    model.
      get([
        'dealsById',
        [
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
          '2f6527f3-c99d-4ff0-b31f-09cb793b966f',
          '16bca56f-7fb4-469b-8815-1edfd557d244'
        ],
        'comments',
        'edges',
        { from: 0, to: 9 }
      ]).
      subscribe(res => {
        const comments1 = res.json.
          dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].comments.edges;
        const comments2 = res.json.
          dealsById['2f6527f3-c99d-4ff0-b31f-09cb793b966f'].comments.edges;
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
      }, err => done(err), done);
  });
  it(`dealsById[
    '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
    '2f6527f3-c99d-4ff0-b31f-09cb793b966f'
  ].company.name completes well`, done => {
    model.
      get([
        'dealsById',
        [
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
          '2f6527f3-c99d-4ff0-b31f-09cb793b966f'
        ],
        'company'
      ]).
      subscribe(res => {
        const company = res.json.
          dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].company;
        expect(company.length).to.equal(2);
        expect(company[0]).to.equal('companiesById');
        expect(company[1]).to.equal('99bca56f-7fb4-469b-8815-1edfd557d244');
        expect(res.json.dealsById['2f6527f3-c99d-4ff0-b31f-09cb793b966f']). // eslint-disable-line
          to.be.undefined;
      }, err => done(err), done);
  });
});

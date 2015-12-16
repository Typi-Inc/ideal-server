import { expect } from 'chai';
import falcor from 'falcor';
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
            comments: {
              '0': $ref(['commentsById', '26bca56f-7fb4-469b-8815-1edfd557d244']),
              '1': $ref(['commentsById', '36bca56f-7fb4-469b-8815-1edfd557d244'])
            }
          },
          '16bca56f-7fb4-469b-8815-1edfd557d244': {
            title: 'world'
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
      then(res => {
        expect(
          res.json.dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].title
        ).to.deep.equal('hello');
        done();
      }, done);
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
      then(res => {
        expect(
          res.json.dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].title
        ).to.equal('hello');
        expect(
          res.json.dealsById['16bca56f-7fb4-469b-8815-1edfd557d244'].title
        ).to.equal('world');
        done();
      }, done);
  });
  it(`dealsById[{keys:dealIds}].
    comments['1f6527f3-c99d-4ff0-b31f-09cb793b966f'
    completes with path to other part of JSONG`, done => {
    model.
      get([
        'dealsById',
        [
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f'
          // '16bca56f-7fb4-469b-8815-1edfd557d244'
        ],
        'comments',
        '0'
      ]).
      then(res => {
        const comment = res.json.
          dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].comments[0];
        expect(comment[0]).to.equal('commentsById');
        expect(comment[1]).to.equal('26bca56f-7fb4-469b-8815-1edfd557d244');
        expect(comment.length).to.equal(2);
        done();
      }, done);
  });
  it(`dealsById[{keys:dealIds}].
    comments['16bca56f-7fb4-469b-8815-1edfd557d244']
    completes with undefined without error`, done => {
    model.
      get([
        'dealsById',
        [
          '16bca56f-7fb4-469b-8815-1edfd557d244'
        ],
        'comments',
        '0'
      ]).
      then(res => {
        expect(res).to.be.undefined; // eslint-disable-line
        done();
      }, done);
  });
  it(`dealsById[{keys:dealIds}].
    comments[
      '16bca56f-7fb4-469b-8815-1edfd557d244',
      '1f6527f3-c99d-4ff0-b31f-09cb793b966f'
    ] completes with path only for the latter id`, done => {
    model.
      get([
        'dealsById',
        [
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f'
          // '16bca56f-7fb4-469b-8815-1edfd557d244'
        ],
        'comments',
        '0'
      ]).
      then(res => {
        const comment = res.json.
          dealsById['1f6527f3-c99d-4ff0-b31f-09cb793b966f'].comments[0];
        expect(comment[0]).to.equal('commentsById');
        expect(comment[1]).to.equal('26bca56f-7fb4-469b-8815-1edfd557d244');
        expect(comment.length).to.equal(2);
        done();
      }, done);
  });
});

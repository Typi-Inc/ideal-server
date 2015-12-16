import { expect } from 'chai';
import falcor from 'falcor';
import toPathValues from '../../src/client-router/toPathValues';

const $ref = falcor.Model.ref;

describe('toPathValues', () => {
  it('works with an object with no siblings', () => {
    const json = {
      json: {
        dealsById: {
          '\u001ekey': 'dealsById',
          '\u001eparent': null,
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f': {
            title: 'hello'
          }
        }
      }
    };
    const expected = [
      {
        path: ['dealsById', '1f6527f3-c99d-4ff0-b31f-09cb793b966f', 'title'],
        value: 'hello'
      }
    ];
    const result = toPathValues(json);
    expect(result[0]).to.deep.equal(expected[0]);
    expect(result.length).to.equal(expected.length);
  });
  it('works with an object with siblings', () => {
    const json = {
      json: {
        dealsById: {
          '\u001ekey': 'dealsById',
          '\u001eparent': null,
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f': {
            title: 'value1'
          },
          '1f6527f3-c99d-4ff0-b31f-09cb793b9sda': {
            title: 'value2'
          },
          '1f6527f3-c99d-4ff0-b31f-09cb793b9sad': {
            title: 'value3'
          }
        },
        commentsById: {
          '\u001ekey': 'dealsById',
          '\u001eparent': null,
          '1f6527f3-c99d-4ff0-b31f-09cb793basdd': {
            text: 'comment1'
          },
          '1f6527f3-c99d-4ff0-b31f-09cb79asdffs': {
            text: 'comment2'
          },
          '1f6527f3-c99d-4ff0-b31f-asda793b9sad': {
            text: 'comment3'
          }
        }
      }
    };
    const expected = [
      {
        path: ['dealsById', '1f6527f3-c99d-4ff0-b31f-09cb793b966f', 'title'],
        value: 'value1'
      },
      {
        path: ['dealsById', '1f6527f3-c99d-4ff0-b31f-09cb793b9sda', 'title'],
        value: 'value2'
      },
      {
        path: ['dealsById', '1f6527f3-c99d-4ff0-b31f-09cb793b9sad', 'title'],
        value: 'value3'
      },
      {
        path: ['commentsById', '1f6527f3-c99d-4ff0-b31f-09cb793basdd', 'text'],
        value: 'comment1'
      },
      {
        path: ['commentsById', '1f6527f3-c99d-4ff0-b31f-09cb79asdffs', 'text'],
        value: 'comment2'
      },
      {
        path: ['commentsById', '1f6527f3-c99d-4ff0-b31f-asda793b9sad', 'text'],
        value: 'comment3'
      }
    ];
    const result = toPathValues(json);
    expect(result.length).to.equal(expected.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).to.deep.equal(expected[i]);
    }
  });
  it('should work with object that contains circular references', () => {
    const json = {
      json: {
        dealsById: {
          '\u001ekey': 'dealsById',
          '\u001eparent': null,
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f': {
            '\u001ekey': '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
            '\u001eparent': {
              '\u001ekey': 'dealsById',
              '\u001eparent': null,
              '1f6527f3-c99d-4ff0-b31f-09cb793b966f': ['Circular'],
              'c3202ba8-2896-4633-838f-aac2d08dbcae': {
                '\u001ekey': 'c3202ba8-2896-4633-838f-aac2d08dbcae',
                '\u001eparent': ['Circular'],
                title: 'third deal today'
              },
              'cce23b62-5b13-46ee-9d93-3a0b5df741db': {
                '\u001ekey': 'cce23b62-5b13-46ee-9d93-3a0b5df741db',
                '\u001eparent': ['Circular'],
                title: 'go to awesome stack, kill relay for good'
              }
            },
            title: 'Buy trip to Miami with 20% discount'
          },
          'c3202ba8-2896-4633-838f-aac2d08dbcae': {
            '\u001ekey': 'c3202ba8-2896-4633-838f-aac2d08dbcae',
            '\u001eparent': {
              '\u001ekey': 'dealsById',
              '\u001eparent': null,
              '1f6527f3-c99d-4ff0-b31f-09cb793b966f': {
                '\u001ekey': '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
                '\u001eparent': ['Circular'],
                title: 'Buy trip to Miami with 20% discount'
              },
              'c3202ba8-2896-4633-838f-aac2d08dbcae': ['Circular'],
              'cce23b62-5b13-46ee-9d93-3a0b5df741db': {
                '\u001ekey': 'cce23b62-5b13-46ee-9d93-3a0b5df741db',
                '\u001eparent': ['Circular'],
                title: 'go to awesome stack, kill relay for good'
              }
            },
            title: 'third deal today'
          },
          'cce23b62-5b13-46ee-9d93-3a0b5df741db': {
            '\u001ekey': 'cce23b62-5b13-46ee-9d93-3a0b5df741db',
            '\u001eparent': {
              '\u001ekey': 'dealsById',
              '\u001eparent': null,
              '1f6527f3-c99d-4ff0-b31f-09cb793b966f': {
                '\u001ekey': '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
                '\u001eparent': ['Circular'],
                title: 'Buy trip to Miami with 20% discount'
              },
              'c3202ba8-2896-4633-838f-aac2d08dbcae': {
                '\u001ekey': 'c3202ba8-2896-4633-838f-aac2d08dbcae',
                '\u001eparent': ['Circular'],
                title: 'third deal today'
              },
              'cce23b62-5b13-46ee-9d93-3a0b5df741db': ['Circular']
            },
            title: 'go to awesome stack, kill relay for good'
          }
        }
      }
    };
    const expected = [
      {
        path: ['dealsById', '1f6527f3-c99d-4ff0-b31f-09cb793b966f', 'title'],
        value: 'Buy trip to Miami with 20% discount'
      },
      {
        path: ['dealsById', 'c3202ba8-2896-4633-838f-aac2d08dbcae', 'title'],
        value: 'third deal today'
      },
      {
        path: ['dealsById', 'cce23b62-5b13-46ee-9d93-3a0b5df741db', 'title'],
        value: 'go to awesome stack, kill relay for good'
      }
    ];
    const result = toPathValues(json);
    expect(result.length).to.equal(expected.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).to.deep.equal(expected[i]);
    }
  });
  it('works with an object with one sibling inside nest', () => {
    const json = {
      json: {
        dealsById: {
          '16bca56f-7fb4-469b-8815-1edfd557d244': {
            title: 'world'
          },
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f': {
            title: 'hello'
          }
        }
      }
    };
    const expected = [
      {
        path: ['dealsById', '16bca56f-7fb4-469b-8815-1edfd557d244', 'title'],
        value: 'world'
      },
      {
        path: ['dealsById', '1f6527f3-c99d-4ff0-b31f-09cb793b966f', 'title'],
        value: 'hello'
      }
    ];
    const result = toPathValues(json);
    expect(result.length).to.equal(expected.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).to.deep.equal(expected[i]);
    }
  });
  it('works with refs', () => {
    const json = {
      json: {
        dealsById: {
          '\u001ekey': 'dealsById',
          '\u001eparent': null,
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f': {
            '\u001ekey': '1f6527f3-c99d-4ff0-b31f-09cb793b966f',
            '\u001eparent': {},
            comments: {
              '0': {
                '\u001epath': ['commentsById', 'be27b66e-31c0-4b8c-a866-f0dcb02e3781'],
                text: 'hello Iam second comment here as well'
              },
              '1': {
                '\u001epath': ['commentsById', '5f427605-01dd-4051-bfa0-a895abf0459e'],
                text: 'hello Iam first comment'
              },
              '\u001ekey': 'comments',
              '\u001eparent': {}
            }
          }
        }
      }
    };
    const expected = [
      {
        path: ['dealsById', '1f6527f3-c99d-4ff0-b31f-09cb793b966f', 'comments', '0'],
        value: $ref(['commentsById', 'be27b66e-31c0-4b8c-a866-f0dcb02e3781'])
      },
      {
        path: ['dealsById', '1f6527f3-c99d-4ff0-b31f-09cb793b966f', 'comments', '1'],
        value: $ref(['commentsById', '5f427605-01dd-4051-bfa0-a895abf0459e'])
      }
    ];
    const result = toPathValues(json);
    expect(result.length).to.equal(expected.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).to.deep.equal(expected[i]);
    }
  });
  it('works with refs from serverModel', () => {
    const json = {
      json: {
        dealsById: {
          '1f6527f3-c99d-4ff0-b31f-09cb793b966f': {
            comments: {
              '0': [
                'commentsById',
                '26bca56f-7fb4-469b-8815-1edfd557d244'
              ]
            }
          }
        }
      }
    };
    const expected = [
      {
        path: ['dealsById', '1f6527f3-c99d-4ff0-b31f-09cb793b966f', 'comments', '0'],
        value: $ref(['commentsById', '26bca56f-7fb4-469b-8815-1edfd557d244'])
      }
    ];
    const result = toPathValues(json);
    expect(result.length).to.equal(expected.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).to.deep.equal(expected[i]);
    }
  });
  // TODO json should be ignored if tackled
});

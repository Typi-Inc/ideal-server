import { expect } from 'chai';
import falcor from 'falcor';
import toPathValues from '../../src/client-router/toPathValues';

const $ref = falcor.Model.ref;
const $atom = falcor.Model.atom;

describe('toPathValues', function describe() {
  it('works with an pathSet with no arrays', function test() {
    const json = {
      'json': {
        'dealsById': {
          '$__path': [
            'dealsById'
          ],
          '4086d154-c4a0-4bb1-b34a-040867ab0539': {
            '$__path': [
              'dealsById',
              '4086d154-c4a0-4bb1-b34a-040867ab0539'
            ],
            'title': 'test'
          },
        }
      }
    };
    const pathSet = ['dealsById', '4086d154-c4a0-4bb1-b34a-040867ab0539', 'title']
    const expected = [
      {
        path: ['dealsById', '4086d154-c4a0-4bb1-b34a-040867ab0539', 'title'],
        value: 'test'
      }
    ];
    const result = toPathValues(json, pathSet);
    expect(result[0]).to.deep.equal(expected[0]);
    expect(result.length).to.equal(expected.length);
  });
  it('works with an pathSet with both arrays and strings', function test() {
    const json = {
      'json': {
        'dealsById': {
          '$__path': [
            'dealsById'
          ],
          '4086d154-c4a0-4bb1-b34a-040867ab0539': {
            '$__path': [
              'dealsById',
              '4086d154-c4a0-4bb1-b34a-040867ab0539'
            ],
            'title': 'value1'
          },
          '4086d154-c4a0-4bb1-b34a-040867ab0540': {
            '$__path': [
              'dealsById',
              '4086d154-c4a0-4bb1-b34a-040867ab0540'
            ],
            'title': 'value2'
          },
          '4086d154-c4a0-4bb1-b34a-040867ab0541': {
            '$__path': [
              'dealsById',
              '4086d154-c4a0-4bb1-b34a-040867ab0541'
            ],
            'title': 'value3'
          },
        }
      }
    };
    const pathSet = [
      'dealsById',
      [
        '4086d154-c4a0-4bb1-b34a-040867ab0539',
        '4086d154-c4a0-4bb1-b34a-040867ab0540',
        '4086d154-c4a0-4bb1-b34a-040867ab0541'
      ],
      'title'
    ];
    const expected = [
      {
        path: ['dealsById', '4086d154-c4a0-4bb1-b34a-040867ab0539', 'title'],
        value: 'value1'
      },
      {
        path: ['dealsById', '4086d154-c4a0-4bb1-b34a-040867ab0540', 'title'],
        value: 'value2'
      },
      {
        path: ['dealsById', '4086d154-c4a0-4bb1-b34a-040867ab0541', 'title'],
        value: 'value3'
      }
    ];
    const result = toPathValues(json, pathSet);
    expect(result.length).to.equal(expected.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).to.deep.equal(expected[i]);
    }
  });
  it('works with an pathSet with arrays in two consecutive levels', function test() {
    const json = {
      'json': {
        'dealsById': {
          '$__path': [
            'dealsById'
          ],
          '4086d154-c4a0-4bb1-b34a-040867ab0539': {
            '$__path': [
              'dealsById',
              '4086d154-c4a0-4bb1-b34a-040867ab0539'
            ],
            'title': 'value1',
            'id': '4086d154-c4a0-4bb1-b34a-040867ab0539'
          },
          '4086d154-c4a0-4bb1-b34a-040867ab0540': {
            '$__path': [
              'dealsById',
              '4086d154-c4a0-4bb1-b34a-040867ab0540'
            ],
            'title': 'value2',
            'id': '4086d154-c4a0-4bb1-b34a-040867ab0540'
          },
          '4086d154-c4a0-4bb1-b34a-040867ab0541': {
            '$__path': [
              'dealsById',
              '4086d154-c4a0-4bb1-b34a-040867ab0541'
            ],
            'title': 'value3',
            'id': '4086d154-c4a0-4bb1-b34a-040867ab0541'
          },
        }
      }
    };
    const pathSet = [
      'dealsById',
      [
        '4086d154-c4a0-4bb1-b34a-040867ab0539',
        '4086d154-c4a0-4bb1-b34a-040867ab0540',
        '4086d154-c4a0-4bb1-b34a-040867ab0541'
      ],
      [
        'title',
        'id'
      ]
    ];
    const expected = [
      {
        path: ['dealsById', '4086d154-c4a0-4bb1-b34a-040867ab0539', 'title'],
        value: 'value1'
      },
      {
        path: ['dealsById', '4086d154-c4a0-4bb1-b34a-040867ab0539', 'id'],
        value: '4086d154-c4a0-4bb1-b34a-040867ab0539'
      },
      {
        path: ['dealsById', '4086d154-c4a0-4bb1-b34a-040867ab0540', 'title'],
        value: 'value2'
      },
      {
        path: ['dealsById', '4086d154-c4a0-4bb1-b34a-040867ab0540', 'id'],
        value: '4086d154-c4a0-4bb1-b34a-040867ab0540'
      },
      {
        path: ['dealsById', '4086d154-c4a0-4bb1-b34a-040867ab0541', 'title'],
        value: 'value3'
      },
      {
        path: ['dealsById', '4086d154-c4a0-4bb1-b34a-040867ab0541', 'id'],
        value: '4086d154-c4a0-4bb1-b34a-040867ab0541'
      }
    ];
    const result = toPathValues(json, pathSet);
    expect(result.length).to.equal(expected.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).to.deep.equal(expected[i]);
    }
  });
  it('should work with ranges and refs', function test() {
    const json = {
      'json': {
        'featuredDeals': {
          '0': [
            'dealsById',
            '4086d154-c4a0-4bb1-b34a-040867ab0539'
          ],
          '1': [
            'dealsById',
            '4086d154-c4a0-4bb1-b34a-040867ab0540'
          ],
          '$__path': [
            'featuredDeals'
          ]
        }
      }
    };
    const pathSet = [
      'featuredDeals',
      {from: 0, to: 1}
    ];
    const expected = [
      {
        path: ['featuredDeals', 0],
        value: $ref([
          'dealsById',
          '4086d154-c4a0-4bb1-b34a-040867ab0539'
        ])
      },
      {
        path: ['featuredDeals', 1],
        value: $ref([
          'dealsById',
          '4086d154-c4a0-4bb1-b34a-040867ab0540'
        ])
      }
    ];
    const result = toPathValues(json, pathSet);
    expect(result.length).to.equal(expected.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).to.deep.equal(expected[i]);
    }
  });
  it('should work with atom', () => {
    const json = {
      'json': {
        'phones': [
          '123123',
          '321321'
        ]
      }
    };
    const pathSet = [
      'phones'
    ];
    const expected = [
      {
        path: ['phones'],
        value: $atom([
          '123123',
          '321321'
        ])
      }
    ];
    const result = toPathValues(json, pathSet);
    console.log(result);
    expect(result).to.deep.equal(expected)
  })
});

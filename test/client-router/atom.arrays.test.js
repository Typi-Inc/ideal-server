import { expect } from 'chai';
import falcor from 'falcor';
import ClientRouter from '../../src/client-router/index';

const $atom = falcor.Model.atom;

describe('atoms test client router', () => {
  let model;
  before(() => {
    const serverModel = new falcor.Model({
      cache: {
        businessesById: {
          '99bca56f-7fb4-469b-8815-1edfd557d244': {
            name: 'Ideal',
            city: 'Almaty',
            street: 'Satpayeva 30a',
            phones: $atom([
              '885-223-1683 x742',
              '776-985-2102 x483',
              '1-425-105-1578',
              '1-149-951-2218 x88014'
            ]),
            schedule: $atom([
              'Пн-Пт 8:00-19:00',
              'Сб 10:00-16:00',
              'Вс Выходной'
            ])
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
  it(`businessessById['1f6527f3-c99d-4ff0-b31f-09cb793b966f']['phones', 'schedule']`, () =>
    model.get([
      'businessesById',
      '99bca56f-7fb4-469b-8815-1edfd557d244',
      ['phones', 'schedule']
    ]).
    then(res => {
      const expectedPhones = [
        '885-223-1683 x742',
        '776-985-2102 x483',
        '1-425-105-1578',
        '1-149-951-2218 x88014'
      ];
      const expectedSchedule = [
        'Пн-Пт 8:00-19:00',
        'Сб 10:00-16:00',
        'Вс Выходной'
      ];
      const {
        phones,
        schedule
      } = res.json.businessesById['99bca56f-7fb4-469b-8815-1edfd557d244'];
      expect(phones.length).to.equal(expectedPhones.length);
      for (let i = 0; i < phones.length; i++) {
        expect(phones[i]).to.equal(expectedPhones[i]);
      }
      expect(schedule.length).to.equal(expectedSchedule.length);
      for (let i = 0; i < schedule.length; i++) {
        expect(schedule[i]).to.equal(expectedSchedule[i]);
      }
    })
  );
});

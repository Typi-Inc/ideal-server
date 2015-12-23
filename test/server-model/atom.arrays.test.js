import { expect } from 'chai';
import falcor from 'falcor';
import ServerRouter from '../../src/server-model/server-router';
import db from '../../src/db-model';

describe('atoms test serverModel', () => {
  let model;
  let business;
  before(() => {
    model = new falcor.Model({
      source: new ServerRouter(),
      maxSize: 0
    });
    business = new db.models.Business({
      name: 'Ideal',
      city: 'Almaty',
      street: 'Satpayeva 30a',
      phones: [
        '885-223-1683 x742',
        '776-985-2102 x483',
        '1-425-105-1578',
        '1-149-951-2218 x88014'
      ],
      schedule: [
        'Пн-Пт 8:00-19:00',
        'Сб 10:00-16:00',
        'Вс Выходной'
      ]
    });
    return business.save();
  });
  after(() => {
    return business.delete();
  });
  it(`businessessById['1f6527f3-c99d-4ff0-b31f-09cb793b966f']['phones', 'schedule']`, () =>
    model.get(['businessesById', business.id, ['phones', 'schedule']]).
    then(res => {
      const { phones, schedule } = res.json.businessesById[business.id];
      expect(phones.length).to.equal(business.phones.length);
      for (let i = 0; i < phones.length; i++) {
        expect(phones[i]).to.equal(business.phones[i]);
      }
      expect(schedule.length).to.equal(business.schedule.length);
      for (let i = 0; i < schedule.length; i++) {
        expect(schedule[i]).to.equal(business.schedule[i]);
      }
    })
  );
});

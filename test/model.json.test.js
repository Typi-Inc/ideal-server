import { expect } from 'chai';
import express from 'express';
import falcor from 'falcor';
import HttpDataSource from 'falcor-http-datasource';
import routes from '../src/express-routes';
import db from '../src/db-model';

describe('model.json Falcor requests', function describe() {
  let server;
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
  before(function before() {
    const app = express();
    app.use(routes);
    model = new falcor.Model({
      source: new HttpDataSource('http://localhost:1337/model.json')
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
    return testDeal1.saveAll({ business: true, comments: true }).then(() =>
      testDeal2.saveAll().then(() =>
        testDealFiltersAndSorts.saveAll({ comments: true }).then(() =>
          new Promise((resolve, reject) => {
            server = app.listen(1337, err => {
              if (err) {
                reject(err);
                return;
              }
              resolve();
            });
          })
        )
      )
    );
  });
  after(function after() {
    server.close();
    return testDeal1.deleteAll({ business: true, comments: true }).then(() =>
      testDeal2.deleteAll().then(() =>
        testDealFiltersAndSorts.deleteAll({ comments: true })
      )
    );
  });
  it('should retrieve deals', function test() {
    return model.get(['dealsById', testDeal1.id, 'title']).
    then(res => {
      expect(
        res.json.dealsById[testDeal1.id].title
      ).to.equal(testDeal1.title);
    });
  });
  it('should not throw on special characters: +', function test() {
    return model.get(['tagsByText', '+', 'title']).
    then(res => {
      expect(res).to.be.undefined; // eslint-disable-line
    });
  });
  it('should not throw on special characters: []', function test() {
    return model.get(['tagsByText', '[', { from: 0, to: 20 }]).
    then(res => {
      expect(res).to.be.undefined; // eslint-disable-line
    });
  });
  it('should not throw on numbers: 0-9', function test() {
    return model.get(['tagsByText', '0', { from: 0, to: 20 }]).
    then(res => {
      expect(res).to.be.undefined; // eslint-disable-line
    });
  });
  it('is fine when special characters or numbers are inside the string', function test() {
    return model.get(['tagsByText', '+0', { from: 0, to: 20 }]).
    then(res => {
      expect(res).to.be.undefined; // eslint-disable-line
    });
  });
  it('should create a user with a call function and return its values', function test() {
    const args = {
      email: 'almas.akchabayev@gmail.com',
      name: 'Almas',
      image: 'https://besmart.kz/media/events/images/249/124782.jpg.292x171_q100_crop-smart.jpg',
      social: 'facebook|123123123123'
    };
    return model.call(
      ['users', 'create'],
      [args],
      [['email'], ['id']]
    ).
    then(res => {
      console.log(res, 'response');
      const usersById = res.json.usersById;
      expect(usersById[Object.keys(usersById)[0]].email).to.equal('test@gmail.com');
    });
  });
});

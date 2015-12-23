import thinky from '../src/db-model';
import faker from 'faker';
import { Observable } from 'rx';

const images = [
  'https://besmart.kz/media/events/images/249/124782.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/253/126602.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/253/126772.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/250/125202.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/253/126712.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/245/122732.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/248/124382.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/253/126982.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/253/126962.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/207/103912.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/236/118132.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/254/127022.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/254/127022.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/253/126552.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/254/127002.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/253/126502.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/243/121602.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/207/103732.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/252/126232.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/247/123852.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/241/120642.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/244/122322.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/209/104512.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/251/125882.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/218/109302.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/252/126062.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/251/125692.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/253/126772.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/223/111842.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/249/124932.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/245/122672.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/252/126322.jpg.292x171_q100_crop-smart.jpg',
  'https://besmart.kz/media/events/images/252/126422.jpg.292x171_q100_crop-smart.jpg'
];

function getRandomPic() {
  return images[Math.floor(Math.random() * images.length)];
}

function getRandomLengthArray() {
  const length = Math.floor(Math.random() * 100);
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(i);
  }
  return result;
}


const userWatchedTag1 = new thinky.models.Tag({
  text: faker.hacker.noun()
});
const userWatchedTag2 = new thinky.models.Tag({
  text: faker.hacker.noun()
});
const userWatchedTag3 = new thinky.models.Tag({
  text: faker.hacker.noun()
});
const userWatchedTag4 = new thinky.models.Tag({
  text: faker.hacker.noun()
});
const userWatchedTag5 = new thinky.models.Tag({
  text: faker.hacker.noun()
});
const userWatchedTag6 = new thinky.models.Tag({
  text: faker.hacker.noun()
});

Observable.fromPromise(userWatchedTag1.save()).
flatMap(() => userWatchedTag2.save()).
flatMap(() => userWatchedTag3.save()).
flatMap(() => userWatchedTag4.save()).
flatMap(() => userWatchedTag5.save()).
flatMap(() => userWatchedTag6.save()).
flatMap(() => Observable.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])).
flatMap(() => Observable.fromPromise(
	thinky.models.Like.save(
		getRandomLengthArray().map(() => new thinky.models.Like({}))
	)
)).
flatMap(likes => {
  const user = new thinky.models.User({
    name: faker.name.findName(),
    image: faker.image.avatar(),
    email: faker.internet.email(),
    balance: 0,
    city: 'Almaty'
  });
  user.watchedTags = [
    userWatchedTag1,
    userWatchedTag2,
    userWatchedTag3,
    userWatchedTag4,
    userWatchedTag5,
    userWatchedTag6
  ];
  user.likes = likes;
  return Observable.fromPromise(user.saveAll());
}).
flatMap(user => {
  const deal1 = new thinky.models.Deal({
    title: faker.company.catchPhrase(),
    image: getRandomPic(),
    city: 'Almaty',
    conditions: faker.lorem.paragraphs(),
    highlights: faker.lorem.paragraph(),
    endDate: faker.date.future(),
    payout: Math.round(Math.random() * 20, 0),
    discount: Math.round(Math.random() * 100, 0)
  });
  const business1 = new thinky.models.Business({
    name: faker.company.companyName(),
    city: 'Almaty',
    street: faker.address.streetAddress(),
    image: getRandomPic()
  });
  deal1.business = business1;
  deal1.likes = user.likes.splice(0, Math.floor(user.likes.length / 4));
  deal1.tags = [
    userWatchedTag1,
    userWatchedTag2,
    userWatchedTag3
  ];
  const deal2 = new thinky.models.Deal({
    title: faker.company.catchPhrase(),
    image: getRandomPic(),
    city: 'Almaty',
    conditions: faker.lorem.paragraphs(),
    highlights: faker.lorem.paragraph(),
    endDate: faker.date.future(),
    payout: Math.round(Math.random() * 20, 0),
    discount: Math.round(Math.random() * 100, 0)
  });
  const business2 = new thinky.models.Business({
    name: faker.company.companyName(),
    city: 'Almaty',
    street: faker.address.streetAddress(),
    image: getRandomPic()
  });
  deal2.business = business2;
  deal2.likes = user.likes.splice(
		Math.floor(user.likes.length / 4) + 1,
		Math.floor(2 * user.likes.length / 4)
	);
  deal2.tags = [
    userWatchedTag2,
    userWatchedTag3,
    userWatchedTag4
  ];
  const deal3 = new thinky.models.Deal({
    title: faker.company.catchPhrase(),
    image: getRandomPic(),
    city: 'Almaty',
    conditions: faker.lorem.paragraphs(),
    highlights: faker.lorem.paragraph(),
    endDate: faker.date.future(),
    payout: Math.round(Math.random() * 20, 0),
    discount: Math.round(Math.random() * 100, 0)
  });
  const business3 = new thinky.models.Business({
    name: faker.company.companyName(),
    city: 'Almaty',
    street: faker.address.streetAddress(),
    image: getRandomPic()
  });
  deal3.business = business3;
  deal3.likes = user.likes.splice(
		Math.floor(2 * user.likes.length / 4) + 1,
		Math.floor(3 * user.likes.length / 4)
	);
  deal3.tags = [
    userWatchedTag3,
    userWatchedTag4,
    userWatchedTag5
  ];
  const deal4 = new thinky.models.Deal({
    title: faker.company.catchPhrase(),
    image: getRandomPic(),
    city: 'Almaty',
    conditions: faker.lorem.paragraphs(),
    highlights: faker.lorem.paragraph(),
    endDate: faker.date.future(),
    payout: Math.round(Math.random() * 20, 0),
    discount: Math.round(Math.random() * 100, 0)
  });
  const business4 = new thinky.models.Business({
    name: faker.company.companyName(),
    city: 'Almaty',
    street: faker.address.streetAddress(),
    image: getRandomPic()
  });
  deal4.business = business4;
  deal4.likes = user.likes.splice(
		Math.floor(3 * user.likes.length / 4) + 1,
		user.likes.length
	);
  deal4.tags = [
    userWatchedTag4,
    userWatchedTag1,
    userWatchedTag6
  ];
  return Promise.all([
    deal1.saveAll(),
    deal2.saveAll(),
    deal3.saveAll(),
    deal4.saveAll()
  ]);
}).subscribe(console.log);

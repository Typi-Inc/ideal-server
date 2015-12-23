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

function getRandomLengthArray(maxLength, startFrom = 0) {
  const length = Math.floor(Math.random() * maxLength + startFrom);
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(i);
  }
  return result;
}

const tagsToSave = [
  'Маникюр',
  'Диагностика',
  'Стрижка',
  'Красота',
  'Здоровье',
  'Медцентр',
  'Обследование',
  'Йога',
  'Тренировки',
  'Спорт',
  'Машина',
  'Замена масла',
  'Toyota'
];

Observable.fromPromise(
	thinky.models.Tag.save(
    tagsToSave.map(text => new thinky.models.Tag({
      text
    }))
	)
).
flatMap(tags =>
	Observable.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).map(() => tags)
).
flatMap(tags =>
	Observable.fromPromise(
		thinky.models.Like.save(
			getRandomLengthArray(100).map(() => new thinky.models.Like({}))
		)
	).map(likes => ({ likes, tags }))
).
flatMap(({ likes, tags }) => {
  const userToSave = new thinky.models.User({
    name: faker.name.findName(),
    image: faker.image.avatar(),
    email: faker.internet.email(),
    balance: 0,
    city: 'Almaty'
  });
  // userToSave.watchedTags = tags;
  userToSave.likes = likes;
  return Observable.fromPromise(userToSave.saveAll()).map(user => ({ user, tags }));
}).
flatMap(({ user, tags }) => {
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
  deal1.likes = user.likes.slice(
		0,
		Math.floor(user.likes.length / 4)
	);
  deal1.tags = tags.slice(
		0,
		Math.floor(tags.length / 4)
	);
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
  deal2.likes = user.likes.slice(
		Math.floor(user.likes.length / 4),
		Math.floor(2 * user.likes.length / 4)
	);
  deal2.tags = tags.slice(
		Math.floor(tags.length / 4),
		Math.floor(2 * tags.length / 4)
	);
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
  deal3.likes = user.likes.slice(
		Math.floor(2 * user.likes.length / 4),
		Math.floor(3 * user.likes.length / 4)
	);
  deal3.tags = tags.slice(
		Math.floor(2 * tags.length / 4),
		Math.floor(3 * tags.length / 4)
	);
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
  deal4.likes = user.likes.slice(
		Math.floor(3 * user.likes.length / 4),
		user.likes.length
	);
  deal4.tags = tags.slice(
		Math.floor(3 * tags.length / 4),
		tags.length
	);
  return Observable.fromPromise(Promise.all([
    deal1.saveAll(),
    deal2.saveAll(),
    deal3.saveAll(),
    deal4.saveAll()
  ])).map(deals => ({ deals, user }));
}).
flatMap(({ deals, user }) =>
	Observable.from(deals).map(deal => ({ deal, user }))
).
flatMap(({ deal, user }) =>
  Observable.fromPromise(
		thinky.models.Comment.save(
      getRandomLengthArray(30).map(() => new thinky.models.Comment({
        text: faker.lorem.sentence(),
        idAuthor: user.id
      }))
		)
  ).
  flatMap(comments => {
    deal.comments = comments;
    return Observable.fromPromise(deal.saveAll());
  })
	.map(dealWithComment => ({ dealWithComment, user }))
).
flatMap(({ dealWithComment }) =>
	Observable.fromPromise(
		thinky.models.Certificate.save(
      getRandomLengthArray(30).map(() => new thinky.models.Certificate({
        title: faker.hacker.noun(),
        totalCount: Math.round(Math.random() * 100, 0),
        oldPrice: Math.round(Math.random() * 10000 + 500, 0),
        newPrice: Math.round(Math.random() * 5000 + 500, 0)
      }))
		)
  ).
  flatMap(certificates => {
    dealWithComment.certificates = certificates;
    return Observable.fromPromise(dealWithComment.saveAll());
  })
).subscribe(console.log);

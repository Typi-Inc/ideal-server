import thinky from '../src/db-model';
import faker from 'faker';
import { Observable } from 'rx';

const userWatchedTag1 = new thinky.models.Tag({
	text: faker.hacker.noun(),
});
const userWatchedTag2 = new thinky.models.Tag({
	text: faker.hacker.noun(),
});
const userWatchedTag3 = new thinky.models.Tag({
	text: faker.hacker.noun(),
});
const userWatchedTag4 = new thinky.models.Tag({
	text: faker.hacker.noun(),
});
const userWatchedTag5 = new thinky.models.Tag({
	text: faker.hacker.noun(),
});
const userWatchedTag6 = new thinky.models.Tag({
	text: faker.hacker.noun(),
});

Observable.fromPromise(userWatchedTag1.save()).
flatMap(_ => userWatchedTag2.save()).
flatMap(_ => userWatchedTag3.save()).
flatMap(_ => userWatchedTag4.save()).
flatMap(_ => userWatchedTag5.save()).
flatMap(_ => userWatchedTag6.save()).
flatMap(_ => Observable.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])).
flatMap(i => {
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
	const deal1 = new thinky.models.Deal({
		title: faker.company.catchPhrase(),
		image: faker.image.business(),
		city:'Almaty',
		conditions: faker.lorem.paragraphs(),
		highlights: faker.lorem.paragraph(),
		endDate: faker.date.future(),
		payout: Math.round(Math.random() * 20, 0),
		discount: Math.round(Math.random() * 100, 0)
	});
	deal1.tags = [
		userWatchedTag1,
		userWatchedTag2,
		userWatchedTag3
	]
	const deal2 = new thinky.models.Deal({
		title: faker.company.catchPhrase(),
		image: faker.image.business(),
		city:'Almaty',
		conditions: faker.lorem.paragraphs(),
		highlights: faker.lorem.paragraph(),
		endDate: faker.date.future(),
		payout: Math.round(Math.random() * 20, 0),
		discount: Math.round(Math.random() * 100, 0)
	});
	deal2.tags = [
		userWatchedTag2,
		userWatchedTag3,
		userWatchedTag4
	]
	const deal3 = new thinky.models.Deal({
		title: faker.company.catchPhrase(),
		image: faker.image.business(),
		city:'Almaty',
		conditions: faker.lorem.paragraphs(),
		highlights: faker.lorem.paragraph(),
		endDate: faker.date.future(),
		payout: Math.round(Math.random() * 20, 0),
		discount: Math.round(Math.random() * 100, 0)
	});
	deal3.tags = [
		userWatchedTag3,
		userWatchedTag4,
		userWatchedTag5
	]
	const deal4 = new thinky.models.Deal({
		title: faker.company.catchPhrase(),
		image: faker.image.business(),
		city:'Almaty',
		conditions: faker.lorem.paragraphs(),
		highlights: faker.lorem.paragraph(),
		endDate: faker.date.future(),
		payout: Math.round(Math.random() * 20, 0),
		discount: Math.round(Math.random() * 100, 0)
	});
	deal4.tags = [
		userWatchedTag4,
		userWatchedTag1,
		userWatchedTag6
	]
	return Promise.all([
		user.saveAll({watchedTags: true}),
		deal1.saveAll({tags: true}),
		deal2.saveAll({tags: true}),
		deal3.saveAll({tags: true}),
		deal4.saveAll({tags: true}),
	])
}).subscribe(console.log);
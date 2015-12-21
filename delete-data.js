import thinky from '../src/db-model';
	
thinky.models.User.then(users => users.forEach(user => user.delete().then(console.log)));
thinky.models.Deal.then(deals => deals.forEach(deal => deal.delete().then(console.log)));
thinky.models.Tag.then(tags => tags.forEach(tag => tag.delete().then(console.log)))
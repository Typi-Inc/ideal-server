import thinky from '../src/db-model';

thinky.models.Deal.orderBy(thinky.r.desc(row =>
  row('payout').add(row('discount')).div(row('watchCount').add(thinky.r.expr(1)))
)).pluck('discount', 'payout').slice(0, 10).then(console.log);

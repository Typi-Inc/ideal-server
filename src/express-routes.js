import { Router } from 'express';
import falcorExpress from 'falcor-express';
import jwt from 'express-jwt';
import thinky from './db-model';
import ClientRouter from './client-router';
import serverModel from './server-model';
import { JWT_SECRET, AUDIENCE } from './config';

const router = Router(); // eslint-disable-line

const authenticate = jwt({ // eslint-disable-line
  secret: new Buffer(JWT_SECRET, 'base64'),
  // TODO move audience to config
  audience: AUDIENCE,
  credentialsRequired: false
});

const Client = thinky.createModel('Client', {
  email: thinky.type.string()
});

router.post('/client', (req, res, next) => {
  const client = new Client({
    email: req.body.subscription
  });
  client.save().then(console.log);
});

router.all(
  '/model.json',
  authenticate,
  falcorExpress.dataSourceRoute(req => new ClientRouter(serverModel, req.user ? req.user.sub : null))
);

export default router;

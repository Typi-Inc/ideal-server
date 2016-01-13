import { Router } from 'express';
import falcorExpress from 'falcor-express';
import jwt from 'express-jwt';
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

router.all(
  '/model.json',
  authenticate,
  falcorExpress.dataSourceRoute(req => new ClientRouter(serverModel, req.user ? req.user.sub : null))
);

export default router;

import { Router } from 'express';
import falcorExpress from 'falcor-express';
import jwt from 'express-jwt';
import ClientRouter from './client-router';
import serverModel from './server-model';
import { JWT_SECRET } from './config';

const router = Router(); // eslint-disable-line

const authenticate = jwt({ // eslint-disable-line
  secret: new Buffer('4YjZ0ezrE-4uLf2YcCHv-WJqppF0W0HynNzmNdG_bnkeQuGBet7h-9Rj5x6w00zt', 'base64'),
  // TODO move audience to config
  audience: 'TWpDN8HdEaplEXJYemOcNYSXi64oQmf8',
  credentialsRequired: false
});

router.all(
  '/model.json',
  authenticate,
  falcorExpress.dataSourceRoute(req => new ClientRouter(serverModel, req.user.sub))
);

export default router;

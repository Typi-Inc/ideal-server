import { Router } from 'express';
import falcorExpress from 'falcor-express';
import ClientRouter from './client-router';
import serverModel from './server-model';

const router = Router(); // eslint-disable-line

router.all(
  '/model.json',
  falcorExpress.dataSourceRoute(() => new ClientRouter(serverModel))
);

export default router;

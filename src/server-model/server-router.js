import Router from 'falcor-router';
import dealsById from './dealsById';

const ServerRouter = Router.createClass([
  ...dealsById
]);

export default ServerRouter;

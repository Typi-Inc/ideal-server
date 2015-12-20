import Router from 'falcor-router';
import { routesFromModels } from './generator';
import thinky from '../db-model';

export default Router.createClass([
  ...routesFromModels(thinky)
]);

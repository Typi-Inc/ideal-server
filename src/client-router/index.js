import Router from 'falcor-router';
import { clientRoutesFromModels } from './generator';
import thinky from '../db-model';

class ClientRouter extends Router.createClass([
  ...clientRoutesFromModels(thinky)
]) {
  constructor(serverModel) {
    super();
    this.serverModel = serverModel;
    // TODO this.userId = userId;
  }
}

export default ClientRouter;

import Router from 'falcor-router';
import generator from './byIdGenerator';

class ClientRouter extends Router.createClass([
  ...generator('deals')
]) {
  constructor(serverModel) {
    super();
    this.serverModel = serverModel;
    // TODO this.userId = userId;
  }
}

export default ClientRouter;

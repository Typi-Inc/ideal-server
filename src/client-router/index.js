import Router from 'falcor-router';
import dealsById from './dealsById';

class ClientRouter extends Router.createClass([
  ...dealsById
]) {
  constructor(serverModel) {
    super();
    this.serverModel = serverModel;
    // TODO this.userId = userId;
  }
}

export default ClientRouter;

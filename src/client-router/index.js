import Router from 'falcor-router';
import { clientRoutesFromModels } from './generator';
import falcor from 'falcor';
import forward from './forwardToServerModel';
import thinky from '../db-model';

const $ref = falcor.Model.ref;
const $error = falcor.Model.error;

class ClientRouter extends Router.createClass([
  ...clientRoutesFromModels(thinky),
  // TODO do i need to invalidate this path?
  {
    route: 'user',
    get() {
      if (this.user) {
        return {
          path: ['user'],
          value: $ref(['usersById', this.user.id])
        };
      }
      return {
        path: ['user'],
        // TODO treatErrorsasValues? https://github.com/Netflix/falcor/issues/633
        // value: $error({ unathorized: true })
        value: $error('user is not logged in')
      };
    }
  },
  {
    route: 'featuredDeals[{integers:range}]',
    get(pathSet) {
      return forward.call(this, pathSet);
    }
  },
  {
    route: 'tagsByText[{keys:text}][{integers:range}]',
    get(pathSet) {
      return forward.call(this, pathSet);
    }
  },
  {
    route: 'dealsByTags[{keys:tagIds}][{integers:range}]',
    get(pathSet) {
      return forward.call(this, pathSet);
    }
  }
]) {
  constructor(serverModel, user) {
    super();
    this.serverModel = serverModel;
    this.user = user;
  }
}

export default ClientRouter;

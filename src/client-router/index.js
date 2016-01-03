import Router from 'falcor-router';
import { clientRoutesFromModels } from './generator';
import { Observable } from 'rx';
import falcor from 'falcor';
import forward from './forwardToServerModel';
import thinky from '../db-model';
import toPathValues from './toPathValues';

const $ref = falcor.Model.ref;
const $error = falcor.Model.error;

class ClientRouter extends Router.createClass([
  ...clientRoutesFromModels(thinky),
  // TODO do i need to invalidate this path?
  {
    route: 'user',
    get() {
      if (this.userId) {
        return {
          path: ['user'],
          value: $ref(['usersById', this.userId])
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
      if (String(pathSet.text[0]).match(/^[\[|\]|\+|0-9]/)) {
        return Observable.empty();
      }
      return forward.call(this, pathSet);
    }
  },
  {
    route: 'dealsByTags[{keys:tagIds}][{integers:range}]',
    get(pathSet) {
      return forward.call(this, pathSet);
    }
  },
  {
    route: 'users.create',
    call(...args) {
      // TODO for now it is ok, as call returns undeined,
      // but when refPaths will start working, will have to rewrite
      return this.serverModel.
        call(...args).
        map(json => toPathValues(json));
    }
  },
  {
    route: 'like.toggle',
    call(...args) {
      args[1].push(this.userId);
      return this.serverModel.
        call(...args).
        map(json => toPathValues(json).concat([{
          path: ['dealsById', args[1][0]],
          invalidated: true
        }]));
    }
  }
]) {
  constructor(serverModel, userId) {
    super();
    this.serverModel = serverModel;
    this.userId = userId;
  }
}

export default ClientRouter;

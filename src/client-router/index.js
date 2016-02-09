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
  {
    route: 'me',
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
    call(callPath, args, refPaths, thisPaths) {
      // TODO for now it is ok, as call returns undefined,
      // but when refPaths will start working, will have to rewrite
      return this.serverModel.
        call(callPath, args, refPaths, thisPaths).
        then(json => toPathValues(json, [['users', 'new', refPaths]]));
    }
  },
  {
    route: 'comments.create',
    call(callPath, args, refPaths, thisPaths) {
      if (!this.userId) {
        return {
          path: 'comments.new',
          value: $error('user must be logged in')
        };
      }
      args[0].idAuthor = this.userId;
      return this.serverModel.
        call(callPath, args, refPaths, thisPaths).
        then(json => toPathValues(json, [['comments', 'new', refPaths]]));
    }
  },
  {
    route: 'like.toggle',
    call(...args) {
      if (!this.userId) {
        return [
          {
            path: ['like'],
            value: $error('User is not loggen in')
          }
        ];
      }
      args[1].push(this.userId);
      return this.serverModel.
        call(...args).
        map(json => toPathValues(json).concat([{
          path: ['dealsById', args[1][0]],
          invalidated: true
        }]));
    }
  },
  {
    route: 'dealsById[{keys:dealIds}].likedByMe',
    get(pathSet) {
      if (!this.userId) {
        return Observable.
          fromArray(pathSet.dealIds).
          map(id => ({
            path: ['dealsById', id, 'likedByMe'],
            value: 0
          }));
      }
      return Observable.
        fromArray(pathSet.dealIds).
        map(id => ({
          path: ['dealsById', id, 'likedByMe'],
          value: $ref(['dealsById', id, 'likedByUser', this.userId])
        }));
    }
  },
  {
    route: 'dealsById[{keys:dealIds}].likedByUser[{keys:userIds}]',
    get(pathSet) {
      return forward.call(this, pathSet);
    }
  },
  {
    route: 'referral.create',
    call(...args) {
      // TODO for now it is ok, as call returns undeined,
      // but when refPaths will start working, will have to rewrite
      if (!this.userId) {
        return [
          {
            path: ['referral'],
            value: $error('User is not loggen in')
          }
        ];
      }
      args[1][0].idReferree = this.userId;
      return this.serverModel.
        call(...args).
        map(json => toPathValues(json));
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

import Router from 'falcor-router';
import dealsById from './dealsById';

class ServerRouter extends Router.createClass([
  ...dealsById
]) {
  constructor(model) {
    super();
    Object.assign(this, model);
    // this.Deal = model.Deal;
  }
}

export default ServerRouter;

import Router from 'falcor-router';
import generator from './byIdRoutesFromModel';

class ServerRouter extends Router.createClass([
  ...generator.call(this, {
    name: 'deals',
    modelName: 'Deal',
    belongsTo: {
      business: 'businesses'
    }
  })
]) {
  constructor(model) {
    super();
    Object.assign(this, model);
  }
}

export default ServerRouter;

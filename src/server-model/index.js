import falcor from 'falcor';
import ServerRouter from './server-router';
import model from '../db-model';

const serverModel = new falcor.Model({
  source: new ServerRouter(model)
});

export default serverModel;

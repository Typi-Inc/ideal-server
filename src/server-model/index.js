import falcor from 'falcor';
import ServerRouter from './server-router';

const serverModel = new falcor.Model({
  source: new ServerRouter(),
});

export default serverModel;

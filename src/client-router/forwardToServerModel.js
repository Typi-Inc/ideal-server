// import { Observable } from 'rxjs/Rx.KitchenSink';
// import { Observable } from 'rx';
import toPathValues from './toPathValues';

function forwardToServerModel(pathSet) {
  return this.serverModel.
    get([...pathSet]).
    map(json => toPathValues(json));
}

export default forwardToServerModel;

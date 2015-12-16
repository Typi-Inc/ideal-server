import toPathValues from './toPathValues';

function forwardToServerModel(pathSet) {
  return this.serverModel.
    get([...pathSet]).
    map(json => toPathValues(json));
}

export default forwardToServerModel;

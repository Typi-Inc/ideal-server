import toPathValues from './toPathValues';

function forwardToServerModel(pathSet) {
  return this.serverModel.
    get([...pathSet]).
    // TODO catch error
    then(json => toPathValues(json, pathSet));
}

export default forwardToServerModel;

import { Observable } from 'rxjs/Observable';
import toPathValues from 'falcor-to-path-values';

export const dealsByIdRoutes = [
  {
    route: 'dealsById[{keys:dealIds}][{keys:fields}]',
    get: pathSet => Observable.fromPromise(
      this.serverModel.get([pathSet[0], pathSet[1], pathSet[2]]) // use function
    ).map(json => toPathValues(json))
  }
];

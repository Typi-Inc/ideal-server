import { Observable } from 'rx';

export function byIdFields(name, modelName) {
  return {
    // deal's fields
    route: `${name}ById[{keys:ids}][{keys:fields}]`,
    get({ ids, fields }) {
      return Observable.fromPromise(
        this[modelName].getAll(...ids).pluck(...fields.concat('id'))
      ).flatMap(docs =>
        Observable.from(docs)
      ).map(doc =>
        fields.map(field => ({
          path: ['dealsById', doc.id, field],
          value: doc[field]
        }))
      );
    }
  };
}

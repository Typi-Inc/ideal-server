import { Observable } from 'rx';
import falcor from 'falcor';
import {
  arrayToFalcorString,
  getJoinInfo,
  parseFilterAndSort
} from './helpers';

const $ref = falcor.Model.ref;

function modelFieldsToRoute(model) {
  const name = model.plural;
  const fields = arrayToFalcorString(Object.keys(model._schema._schema));
  return {
    route: `${name}ById[{keys:ids}][${fields}]`,
    get(pathSet) {
      const { ids } = pathSet;
      return Observable.fromPromise(
        model.getAll(...ids).pluck(...pathSet[2].concat('id'))
      ).
      flatMap(docs =>
        Observable.from(docs)
      ).
      map(doc =>
        pathSet[2].map(field => ({
          path: [`${name}ById`, doc.id, field],
          value: doc[field]
        }))
      );
    }
  };
}

function modelHasOneAndBelongsToJoinsToRoute(model, models) {
  const name = model.plural;
  const getPluralName = (joinName) => {
    const capedJoinName = joinName.charAt(0).toUpperCase() + joinName.slice(1);
    return models[capedJoinName].plural;
  };
  return {
    route: `${name}ById[{keys:ids}][{keys:fields}]`,
    get(pathSet) {
      const {
        joinNames,
        joinThinkyObject
      } = getJoinInfo(pathSet, seq => seq.pluck('id'), true);
      const { ids } = pathSet;
      return Observable.fromPromise(
        model.getAll(...ids).
          getJoin(joinThinkyObject).pluck('id', ...joinNames)
      ).flatMap(docs =>
        Observable.from(docs)
      ).flatMap(doc =>
        Observable.from(joinNames).
          map(joinName => ({
            docId: doc.id,
            joinedDoc: doc[joinName],
            joinName
          }))
      ).filter(({ joinedDoc }) => joinedDoc).
      map(({ docId, joinedDoc, joinName }) => ({
        path: [`${name}ById`, docId, joinName],
        value: $ref([`${getPluralName(joinName)}ById`, joinedDoc.id])
      }));
    }
  };
}

function modelHasManyAndHasAndBelongsToManyJoinsToRoutes(model, r) {
  const name = model.plural;
  return [
    {
    // deal's hasMany (and hasAndBelongsToMany) relations with sorting and filtering
      route: `${name}ById[{keys:ids}][{keys:hasManyFields}][{keys:filtersAndSorts}].edges[{integers:range}]`,
      get(pathSet) {
        const { ids, filtersAndSorts, range } = pathSet;
        return Observable.from(filtersAndSorts).
          map(filterAndSortString => {
            const { filter, sort } = parseFilterAndSort(filterAndSortString);
            return { filter, sort, filterAndSortString };
          }).
          map(({ filter, sort, filterAndSortString }) => {
            const {
              joinNames, joinThinkyObject
            } = getJoinInfo(
              pathSet,
              seq => {
                const filteredSeq = filter ? seq.filter(filter) : seq;
                const orderedAndFilteredSeq = sort ?
                  filteredSeq.orderBy(r[sort.order](sort.field)) :
                  filteredSeq;
                return orderedAndFilteredSeq.
                  slice(
                    Number.parseInt(range[0], 10),
                    Number.parseInt(range[range.length - 1], 10) + 1
                  ).
                  pluck('id');
              },
              true
            );
            return { joinNames, joinThinkyObject, filterAndSortString };
          }).
          flatMap(({ joinNames, joinThinkyObject, filterAndSortString }) =>
            Observable.fromPromise(
              model.
                getAll(...ids).
                pluck('id').
                getJoin(joinThinkyObject)
            ).
            map(docs => ({ docs, joinNames, filterAndSortString }))
          ).
          flatMap(({ docs, joinNames, filterAndSortString }) =>
            Observable.from(docs).map(doc => ({ doc, joinNames, filterAndSortString }))
          ).
          flatMap(({ doc, joinNames, filterAndSortString }) =>
            Observable.from(joinNames).
              map(joinName => ({
                docId: doc.id,
                joinedDocs: doc[joinName],
                joinName,
                filterAndSortString
              }))
          ).
          flatMap(({ docId, joinedDocs, joinName, filterAndSortString }) =>
            Observable.from(joinedDocs).map((joinedDoc, i) => ({
              docId, joinedDoc, joinName, index: i, filterAndSortString
            }))
          ).
          map(({ docId, joinedDoc, joinName, index, filterAndSortString }) => ({
            path: [`${name}ById`, docId, joinName, filterAndSortString, 'edges', range[index]],
            value: $ref([`${joinedDoc.constructor.plural}ById`, joinedDoc.id])
          }));
      }
    },
    {
      // deal's hasMany (and hasAndBelongsToMany) relations with sorting and filtering
      route: `${name}ById[{keys:ids}][{keys:hasManyFields}][{keys:filtersAndSorts}].count`,
      get(pathSet) {
        const { ids, filtersAndSorts } = pathSet;
        return Observable.from(filtersAndSorts).
          map(filterAndSortString => {
            const { filter, sort } = parseFilterAndSort(filterAndSortString);
            return { filter, sort, filterAndSortString };
          }).
          map(({ filter, sort, filterAndSortString }) => {
            const {
              joinNames, joinThinkyObject
            } = getJoinInfo(
              pathSet,
              seq => {
                const filteredSeq = filter ? seq.filter(filter) : seq;
                const orderedAndFilteredSeq = sort ?
                  filteredSeq.orderBy(r[sort.order](sort.field)) :
                  filteredSeq;
                return orderedAndFilteredSeq.count();
              },
              false
            );
            return { joinNames, joinThinkyObject, filterAndSortString };
          }).
          flatMap(({ joinNames, joinThinkyObject, filterAndSortString }) =>
            Observable.fromPromise(
              model.
                getAll(...ids).
                pluck('id').
                getJoin(joinThinkyObject)
            ).
            map(docs => ({ docs, joinNames, filterAndSortString }))
          ).
          flatMap(({ docs, joinNames, filterAndSortString }) =>
            Observable.from(docs).map(doc => ({ doc, joinNames, filterAndSortString }))
          ).
          flatMap(({ doc, joinNames, filterAndSortString }) =>
            Observable.from(joinNames).
              map(joinName => ({
                docId: doc.id,
                joinedCount: doc[joinName],
                joinName,
                filterAndSortString
              }))
          ).
          map(({ docId, joinedCount, joinName, filterAndSortString }) => ({
            path: [`${name}ById`, docId, joinName, filterAndSortString, 'count'],
            value: joinedCount
          }));
      }
    }
  ];
}

export function routesFromModels(thinky) {
  const result = [];
  const { models, r } = thinky;
  for (const modelName in models) {
    // eliminate join tables
    if (!modelName.includes('_')) {
      const model = models[modelName];
      result.push(
        modelFieldsToRoute(model),
        modelHasOneAndBelongsToJoinsToRoute(model, models),
        ...modelHasManyAndHasAndBelongsToManyJoinsToRoutes(model, r)
      );
    }
  }
  return result;
}

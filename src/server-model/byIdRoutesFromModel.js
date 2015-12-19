import { Observable } from 'rx';
import falcor from 'falcor';
import {
  arrayToFalcorString,
  parseFilterAndSort,
  getJoinInfo
} from './helpers';

const $ref = falcor.Model.ref;

function byIdRoutesFromModel({ name, modelName, belongsTo }) {
  const belongsToJoinFields = Object.keys(belongsTo);
  const falcorArrayString = arrayToFalcorString(belongsToJoinFields);
  return [
    {
      // deal's fields
      route: `${name}ById[{keys:ids}][{keys:fields}]`,
      get({ ids, fields }) {
        console.log(ids, fields);
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
    },
    {
      // deal's belongsTo/ManyToOne relations
      route: `${name}ById[{keys:ids}][${falcorArrayString}]`,
      get(pathSet) {
        const {
          joinNames,
          joinThinkyObject
        } = getJoinInfo(pathSet, seq => seq.pluck('id'), true);
        const { ids } = pathSet;
        return Observable.fromPromise(
          this[modelName].getAll(...ids).
            getJoin(joinThinkyObject).pluck('id', ...joinNames)
        ).flatMap(docs =>
          Observable.from(docs)
        ).flatMap(doc =>
          Observable.from(joinNames).
            map(joinName => ({
              docId: doc.id,
              joinedObject: doc[joinName],
              joinName
            }))
        ).filter(({ joinedObject }) => joinedObject).
        map(({ docId, joinedObject, joinName }) => ({
          path: [`${name}ById`, docId, joinName],
          value: $ref([`${belongsTo[joinName]}ById`, joinedObject.id])
        }));
      }
    },
    // {
    //   // deal's hasMany (and hasAndBelongsToMany) relations
    //   // TODO redirect https://github.com/Netflix/falcor/issues/672
    //   route: `${name}ById[{keys:ids}][{keys:hasManyFields}].edges[{integers:range}]`,
    //   get(pathSet) {
    //     const { ids, range } = pathSet;
    //     const {
    //       joinNames,
    //       joinThinkyObject
    //     } = getJoinInfo(
    //       pathSet,
    //       seq => seq.
    //         orderBy(this.r.desc('createdAt')). // default sorting by createdAt
    //         slice(
    //           Number.parseInt(range[0], 10),
    //           Number.parseInt(range[range.length - 1], 10) + 1
    //         ).
    //         pluck('id'),
    //       true
    //     );
    //     return Observable.fromPromise(
    //       this[modelName].
    //         getAll(...ids).
    //         pluck('id').
    //         getJoin(joinThinkyObject)
    //     ).flatMap(docs =>
    //       Observable.from(docs)
    //     ).
    //     flatMap(doc =>
    //       Observable.from(joinNames).
    //         map(joinName => ({
    //           docId: doc.id,
    //           joinedDocs: doc[joinName],
    //           joinName
    //         }))
    //     ).
    //     flatMap(({ docId, joinedDocs, joinName }) =>
    //       Observable.from(joinedDocs).map((joinedDoc, i) => ({ docId, joinedDoc, joinName, index: i }))
    //     ).map(({ docId, joinedDoc, joinName, index }) => ({
    //       path: [`${name}ById`, docId, joinName, 'edges', range[index]],
    //       value: $ref([`${joinName}ById`, joinedDoc.id])
    //     }));
    //   }
    // },
    // {
    //   // deal's hasMany (and hasAndBelongsToMany) relations defaults to
    //   // descending ordering over createdAt field
    //   route: `${name}ById[{keys:ids}].comments`,
    //   get(pathSet) {
    //     const { ids } = pathSet;
    //     const joinedNames = getJoinNames(pathSet[2]);
    //     return Observable.from(ids).
    //       flatMap(id => Observable.from(joinedNames).
    //         map(joinedName => ({ id, joinedName }))
    //       ).
    //       map(({ id, joinedName }) => ({
    //         path: [`${name}ById`, id, joinedName],
    //         value: $ref([`${name}ById`, id, joinedName, 'sort:createdAt=desc'])
    //       }));
    //     // const {
    //     //   joinNames,
    //     //   joinThinkyObject
    //     // } = getJoinInfo(pathSet, seq => seq.count(), false);
    //     // const { ids } = pathSet;
    //     // return Observable.fromPromise(
    //     //   this[modelName].
    //     //     getAll(...ids).
    //     //     pluck('id').
    //     //     getJoin(joinThinkyObject)
    //     // ).flatMap(docs => Observable.from(docs)).
    //     // flatMap(doc =>
    //     //   Observable.from(joinNames).
    //     //     map(joinName => ({
    //     //       docId: doc.id,
    //     //       count: doc[joinName],
    //     //       joinName
    //     //     }))
    //     // ).
    //     // map(({ docId, count, joinName }) => ({
    //     //   path: [`${name}ById`, docId, joinName, 'count'],
    //     //   value: count
    //     // }));
    //   }
    // },
    {
      // deal's hasMany (and hasAndBelongsToMany) relations with sorting and filtering
      route: `${name}ById[{keys:ids}][{keys:hasManyFields}][{keys:filtersAndSorts}].edges[{integers:range}]`,
      get(pathSet) {
        const { ids, range, filtersAndSorts } = pathSet;
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
                  filteredSeq.orderBy(this.r[sort.order](sort.field)) :
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
              this[modelName].
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
            value: $ref([`${joinName}ById`, joinedDoc.id])
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
                  filteredSeq.orderBy(this.r[sort.order](sort.field)) :
                  filteredSeq;
                return orderedAndFilteredSeq.count();
              },
              false
            );
            return { joinNames, joinThinkyObject, filterAndSortString };
          }).
          flatMap(({ joinNames, joinThinkyObject, filterAndSortString }) =>
            Observable.fromPromise(
              this[modelName].
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

export default byIdRoutesFromModel;

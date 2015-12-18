// import { Observable } from 'rx';
// import falcor from 'falcor';
//
// const $ref = falcor.Model.ref;
//
// const dealsById = [
//   {
//     // deal's fields
//     route: 'dealsById[{keys:ids}][{keys:fields}]',
//     get({ ids, fields }) {
//       return Observable.fromPromise(
//         this.Deal.getAll(...ids).pluck(...fields.concat('id'))
//       ).flatMap(deals =>
//         Observable.from(deals)
//       ).map(deal =>
//         fields.map(field => ({
//           path: ['dealsById', deal.id, field],
//           value: deal[field]
//         }))
//       );
//     }
//   },
//   {
//     // deal's belongsTo/ManyToOne relations
//     route: `dealsById[{keys:ids}][${business}]`,
//     get(pathSet) {
//       const { ids } = pathSet;
//       const belongsTo = pathSet[2];
//       console.log(pathSet);
//       const getJoinQueryObject = {};
//       getJoinQueryObject[belongsTo] = {
//         _apply: seq => seq.pluck('id')
//       };
//       console.log(getJoinQueryObject);
//       return Observable.fromPromise(
//         this.Deal.getAll(...ids).
//           getJoin(getJoinQueryObject).pluck('id', 'business')
//       ).flatMap(deals =>
//         Observable.from(deals)
//       ).filter(deal => deal.business).
//       map(deal => ({
//         path: ['dealsById', deal.id, belongsTo],
//         value: $ref(['businessesById', deal[belongsTo].id])
//       }));
//     }
//   },
//   {
//     // deal's hasMany (and hasAndBelongsToMany) relations
//     route: 'dealsById[{keys:ids}].comments.edges[{integers:range}]',
//     get({ ids, range }) {
//       return Observable.fromPromise(
//         this.Deal.
//           getAll(...ids).
//           getJoin({
//             comments: {
//               _apply: seq => seq.
//                 orderBy(this.r.desc('createdAt')).
//                 slice(
//                   Number.parseInt(range[0], 10),
//                   Number.parseInt(range[range.length - 1], 10) + 1
//                 ).
//                 pluck('id')
//             }
//           }).pluck('id', 'comments')
//       ).flatMap(deals =>
//         Observable.from(deals).map(deal => ({ id: deal.id, comments: deal.comments }))
//       ).flatMap(({ id, comments }) =>
//         Observable.from(comments).map((comment, i) => ({ id, comment, index: i }))
//       ).map(({ id, comment, index }) => ({
//         path: ['dealsById', id, 'comments', 'edges', range[index]],
//         value: $ref(['commentsById', comment.id])
//       }));
//     }
//   }
//   {
//     // deal's hasMany (and hasAndBelongsToMany) relations
//     route: 'dealsById[{keys:ids}].comments.count',
//     get({ ids }) {
//       return Observable.fromPromise(
//         this.Deal.
//           getAll(...ids).
//           getJoin({
//             comments: {
//               _apply: seq => seq.count(),
//               _array: false
//             }
//           }).pluck('id', 'comments')
//       ).flatMap(deals => Observable.from(deals)).
//       map(deal => ({
//         path: ['dealsById', deal.id, 'comments', 'count'],
//         value: deal.comments
//       }));
//     }
//   }
// ];
//
// export default dealsById;

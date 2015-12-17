import { Observable } from 'rx';
// import falcor from 'falcor';

// const $ref = falcor.Model.ref;

const commentsById = [
  {
    // deal's fields
    route: 'commentsById[{keys:ids}][{keys:fields}]',
    get({ ids, fields }) {
      return Observable.fromPromise(
        this.Comment.getAll(...ids).pluck(...fields.concat('id'))
      ).flatMap(comments =>
        Observable.from(comments)
      ).map(comment =>
        fields.map(field => ({
          path: ['dealsById', comment.id, field],
          value: comment[field]
        }))
      );
    }
  }
  // {
  //   // deal's belongsTo/ManyToOne relations
  //   route: `dealsById[{keys:ids}]['business']`,
  //   get({ ids, fields }) {
  //     return Observable.fromPromise(
  //       this.Deal.getAll(...ids).pluck(...fields.concat('id'))
  //     ).flatMap(deals =>
  //       Observable.from(deals)
  //     ).map(deal =>
  //       fields.map(field => ({
  //         path: ['dealsById', deal.id, field],
  //         value: deal[field]
  //       }))
  //     );
  //   }
  // },
  // {
  //   // deal's hasMany (and hasAndBelongsToMany) relations
  //   route: 'dealsById[{keys:ids}].comments.edges[{integers:range}]',
  //   get({ ids, range }) {
  //     return Observable.fromPromise(
  //       this.Deal.
  //         getAll(...ids).
  //         getJoin({
  //           comments: {
  //             _apply: seq => seq.
  //               orderBy(this.r.desc('createdAt')).
  //               slice(range[0], range[range.length - 1] + 1).
  //               pluck('id')
  //           }
  //         })
  //     ).flatMap(deals =>
  //       Observable.from(deals).map(deal => ({ id: deal.id, comments: deal.comments }))
  //     ).flatMap(({ id, comments }) =>
  //       Observable.from(comments).map((comment, i) => ({ id, comment, index: i }))
  //     ).map(({ id, comment, index }) => ({
  //       path: ['dealsById', id, 'comments', 'edges', index],
  //       value: $ref('commentsById', comment.id)
  //     }));
  //   }
  // }
];

export default commentsById;

import Router from 'falcor-router';
import { Observable } from 'rx';
import { routesFromModels } from './generator';
import _ from 'lodash';
import { capitalise } from './helpers';
import thinky from '../db-model';
import falcor from 'falcor';

const $ref = falcor.Model.ref;
// const $atom = falcor.Model.atom;
const $error = falcor.Model.error;

export default Router.createClass([
  ...routesFromModels(thinky),
  {
    route: 'featuredDeals[{integers:range}]',
    get({ range }) {
      return Observable.fromPromise(
        thinky.models.Deal.orderBy(
          thinky.r.desc(row => {
            return row('payout').add(row('discount')).div(row('watchCount').add(thinky.r.expr(1)));
          })
        ).pluck('id').skip(range[0]).limit(range[range.length - 1] + 1)
      ).
      flatMap(docs =>
        Observable.from(docs.map((doc, i) =>
          ({ doc, i }))
        )
      ).
      map(({ doc, i }) => ({
        path: ['featuredDeals', range[i]],
        value: $ref(['dealsById', doc.id])
      }));
    }
  },
  {
    route: 'tagsByText[{keys:text}][{integers:range}]',
    get({ text, range }) {
      // TODO do I need multiple texts? text[0]
      // TODO orderBy rank/number of deals
      const lower = text[0].toLowerCase();
      const cap = capitalise(text[0]);
      return Observable.fromPromise(
        thinky.models.Tag.filter(doc =>
          doc('text').match(cap).or(doc('text').match(lower))
        ).
          skip(range[0]).limit(range[range.length - 1] + 1)
      ).flatMap(docs =>
        Observable.from(_.sortBy(docs, doc => {
          const index = doc.text.toLowerCase().indexOf(lower);
          if (doc.text.toLowerCase() === lower) {
            return -1;
          }
          return index;
        })).
          map((doc, i) =>
            ({ doc, i })
          )
      ).
      map(({ doc, i }) => ({
        path: ['tagsByText', text[0], range[i]],
        value: $ref(['tagsById', doc.id])
      }));
    }
  },
  {
    route: 'dealsByTags[{keys:tagIdsString}][{integers:range}]',
    get({ tagIdsString, range }) {
      // TODO work with multiple tagIds in case of batching operators
      const tagIds = tagIdsString[0].split(',');
      return Observable.fromPromise(
        thinky.models.Deal.getJoin({ tags: true }).
        filter(doc =>
          doc('tags').filter(tag =>
            thinky.r.expr(tagIds).contains(tag('id'))
          ).isEmpty().not()
        ).orderBy(thinky.r.desc(row =>
            row('tags').count(tag =>
              thinky.r.expr(tagIds).contains(tag('id'))
            )
          )
        ).orderBy(thinky.r.desc(row =>
             row('payout').add(row('discount')).div(row('watchCount').add(thinky.r.expr(1)))
          )
        ).skip(range[0]).limit(range[range.length - 1] + 1)
      ).
      flatMap(docs =>
        Observable.from(docs)
      ).
      map((doc, i) => ({
        path: ['dealsByTags', tagIdsString[0], range[i]],
        value: $ref(['dealsById', doc.id])
      }));
    }
  },
  {
    route: 'users.create',
    call(callPath, args) {
      const user = new thinky.models.User({
        id: args[0].user_id,
        email: args[0].email,
        name: args[0].name,
        image: args[0].picture
        // TODO city
      });
      return Observable.fromPromise(thinky.models.User.filter({ id: args[0].user_id }).then(docs => {
        if (_.isEmpty(docs)) {
          return user.save();
        }
        return new Promise(resolve => {
          resolve(docs[0]);
        });
      })).
        map(doc => [
          {
            // TODO refPaths, thisPaths not working https://github.com/Netflix/falcor/issues/681
            path: ['users', 'new'],
            value: $ref(['usersById', doc.id])
          }
        ]);
    }
  },
  {
    route: 'comments.create',
    call(callPath, args) {
      const comment = new thinky.models.Comment({
        text: args[0].text,
        idDeal: args[0].idDeal,
        idAuthor: args[0].idAuthor
      });
      return Observable.fromPromise(thinky.models.User.filter({ id: args[0].idAuthor }).then(docs => {
        if (_.isEmpty(docs)) {
          return new Promise(resolve => {
            resolve({ error: 'user with this is was not found in the database' });
          });
        }
        return comment.save();
      })).
        map(doc => doc.error ? [
          {
            path: ['comments', 'new'],
            value: $error(doc.error)
          }
        ] : [
          {
            // TODO refPaths, thisPaths not working https://github.com/Netflix/falcor/issues/681
            path: ['comments', 'new'],
            value: $ref(['commentsById', doc.id])
          },
          {
            path: ['dealsById', args[0].idDeal, 'comments'],
            invalidated: true
          }
        ]);
    }
  },
  {
    route: 'like.toggle',
    call(callPath, args) {
      let deleted;
      return Observable.fromPromise(
        thinky.models.Like.filter({ idDeal: args[0], idLiker: args[1] }).
          then(docs => {
            if (!_.isEmpty(docs)) {
              deleted = true;
              return docs[0].delete();
            }
            const like = new thinky.models.Like({
              idDeal: args[0],
              idLiker: args[1]
            });
            return like.save();
          })
      ).
      flatMap(() => {
        return Observable.fromPromise(
          thinky.models.Deal.get(args[0]).getJoin({
            likes: {
              _apply: seq => seq.count(),
              _array: false
            }
          })
        );
      }).
      map(doc => [
        {
          path: ['dealsById', args[0], 'likes', 'sort:createdAt=desc', 'count'],
          value: doc.likes
        },
        {
          path: ['dealsById', args[0], 'likedByUser', '{{me}}'],
          value: deleted ? 0 : 1
        },
        {
          path: ['dealsById', args[0]],
          invalidated: true
        }
      ]);
    }
  },
  {
    route: 'dealsById[{keys:dealIds}].likedByUser[{keys:userIds}]',
    get(pathSet) {
      // TODO what if several userIds?
      const { dealIds, userIds } = pathSet;
      return Observable.fromPromise(
          thinky.models.Deal.getAll(...dealIds).pluck('id').getJoin({
            likes: {
              _apply: seq => seq.filter({ idLiker: userIds[0] }).count(),
              _array: false
            }
          })
        ).flatMap(docs =>
          Observable.from(docs)
        ).map(doc => ({
          path: ['dealsById', doc.id, 'likedByUser', userIds[0]],
          value: doc.likes
        }));
    }
  },
  {
    route: 'referral.create',
    call(callPath, args) {
      const referral = new thinky.models.Referral({
        idReferree: args[0].idReferree,
        idDeal: args[0].idDeal
      });
      return Observable.fromPromise(
        thinky.models.Referral.filter({ idReferree: args[0].idReferree }).then(docs => {
          if (_.isEmpty(docs)) {
            return referral.save();
          }
          return new Promise(resolve => {
            resolve(docs[0]);
          });
        })
      ).
        map(doc => [
          {
            // TODO refPaths, thisPaths not working https://github.com/Netflix/falcor/issues/681
            path: ['referral'],
            value: $ref(['referralsById', doc.id])
          }
        ]);
    }
  }
]);

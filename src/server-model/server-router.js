import Router from 'falcor-router';
import { Observable } from 'rx';
import { routesFromModels } from './generator';
import _ from 'lodash';
import { capitalise } from './helpers';
import thinky from '../db-model';
import falcor from 'falcor';

const $ref = falcor.Model.ref;

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
        email: args[0].email,
        name: args[0].name,
        image: args[0].picture,
        social: args[0].userId
        // TODO city
      });
      return Observable.fromPromise(user.save()).
        map(() => [
          {
            // TODO refPaths, thisPaths not working https://github.com/Netflix/falcor/issues/681
            path: ['users', 'new'],
            value: $ref(['usersById', user.id])
          }
        ]);
    }
  }
]);

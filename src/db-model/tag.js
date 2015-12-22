import thinky, { type } from './thinky';

const Tag = thinky.createModel('Tag', {
  text: type.string()
});

Tag.plural = 'tags';

Tag.ready().then(() => {
  Tag.hasAndBelongsToMany(thinky.models.Deal, 'deals', 'id', 'id');
});

export default Tag;

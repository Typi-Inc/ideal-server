import thinky, { type } from './thinky';

const Tag = thinky.createModel('Tag', {
  text: type.string()
});

Tag.plural = 'tags';

export default Tag;

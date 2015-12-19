import thinky, { type } from './thinky';

const Tag = thinky.createModel('Tag', {
  text: type.string()
});

module.exports = Tag;

import thinky, { type } from './thinky';

const Comment = thinky.createModel('Comment', {
  text: type.string(),
  idDeal: type.string(),
  idAuthor: type.string()
});

module.exports = Comment;
// Comment.belongsTo(User,'author','id','idAuthor')

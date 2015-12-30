import thinky, { type } from './thinky';

const Comment = thinky.createModel('Comment', {
  text: type.string(),
  idDeal: type.string(),
  idAuthor: type.string()
});

Comment.plural = 'comments';
Comment.ready().then(() => {

	Comment.belongsTo(thinky.models.User, 'author', 'idAuthor', 'id');
});
export default Comment;

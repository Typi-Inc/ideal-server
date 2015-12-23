import thinky, { type } from './thinky';

const Like = thinky.createModel('Like', {
  idDeal: type.string(),
  idLiker: type.string()
});

Like.plural = 'likes';

Like.ready().then(() => {
  Like.belongsTo(thinky.models.User, 'liker', 'idLiker', 'id');
});

export default Like;

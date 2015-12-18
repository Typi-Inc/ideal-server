import thinky, { type } from './thinky';

const Business = thinky.createModel('Business', {
  name: type.string(),
  city: type.string(),
  street: type.string(),
  phones: type.array(),
  image: type.string(),
  idAdmin: type.string()
});

module.exports = Business;
// Comment.belongsTo(User,'author','id','idAuthor')

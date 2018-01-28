const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config();
}

const url = process.env.MONGODB_URL;

mongoose.connect(url);
mongoose.Promise = global.Promise;

const PersonSchema = mongoose.Schema({
  name: String,
  number: String
})

PersonSchema.statics.format = function(note) {
  return {
    name: note.name,
    number: note.number,
    id: note._id
  }
}

const Person = mongoose.model('Person', PersonSchema)

module.exports = Person;
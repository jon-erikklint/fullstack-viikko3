const mongoose = require('mongoose')

const url = 'mongodb://fullstack:jek-taysikasa@ds117158.mlab.com:17158/jek-fullstack';

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
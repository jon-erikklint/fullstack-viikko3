const mongoose = require('mongoose')

const url = 'mongodb://fullstack:jek-taysikasa@ds117158.mlab.com:17158/jek-fullstack';

mongoose.connect(url);
mongoose.Promise = global.Promise;

const Numero = mongoose.model('Numero', {
  name: String,
  number: String
})

let arg = process.argv

if(arg.length > 2 && arg.length < 5) {
  const numero = new Numero({
    name: arg[2],
    number: arg[3]
  })
  
  numero.save().then(result => {
    console.log('lisätään henkilö '+result.name+' numero '+result.number+' puhelinluetteloon');
    mongoose.connection.close();
  })
} else {
  Numero.find({}).then(result => {
    console.log('puhelinluettelo:');
    result.forEach(numero => console.log(numero.name+' '+numero.number))
    mongoose.connection.close();
  })
}
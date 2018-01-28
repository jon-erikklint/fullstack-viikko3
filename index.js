const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');

morgan.token('body-json', (request, response) => {
  return JSON.stringify(request.body);
})

app.use(express.static('build'))
app.use(cors());
app.use(bodyParser.json());
app.use(morgan(':method :url :body-json :status :res[content-length] - :response-time ms'));

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => response.json(result.map(Person.format)));
})

app.get('/api/persons/:id', (request, response) => {
  let id = request.params.id;

  Person.findById(id)
    .then(result => {
      if(result) {
        response.json(Person.format(result));
      } else {
        response.sendStatus(404).end();
      }
    })
    .catch(error => {
      console.log(error);
      response.sendStatus(400).end();
    })
})

app.get('/info', (request, response) => {
  Person.find({})
    .then(result => {
      response.send(
        `<p>
          puhelinluettelossa ${result.length} henkilön tiedot
        </p>
        <p>
          ${new Date()}
        </p>`
      );
    })
    .catch(error => {
      console.log(error);
      response.sendStatus(500).end();
    })
})

app.delete('/api/persons/:id', (request, response) => {
  let id = request.params.id;

  Person.findByIdAndRemove(id)
    .then(result => response.sendStatus(204).end())
    .catch(error => {
      console.log(error);
      response.statusCode(400)
    })
})

app.post('/api/persons', (request, response) => {
  let body = request.body;

  let person = new Person({
    name: body.name,
    number: body.number
  });

  let errors = [];
  if(person.name == null || person.name === "") {
    errors.push('name required')
  }
  if(person.number == null || person.number === "") {
    errors.push('number required')
  }

  if (errors.length > 0) {
    response.status(400).json(errors.map(errorMessage => ({error: errorMessage}) ))
  } else {
    Person.findOne({name: body.name})
      .then(result => {
        if(result) {
          throw {error: "nimi jo puhelinluettelossa"}
        } else {
          return person.save();
        }
      })
      .then(result => {
        response.json(Person.format(person))
      })
      .catch(error => {
        console.log(error);
        response.status(400).json(error);
      });
  }
})

app.put('/api/persons/:id', (request, response) => {
  let id = request.params.id;
  let body = request.body;

  Person.findByIdAndUpdate(id, {name: body.name, number: body.number}, {new: true})
    .then(result => {
      response.json(Person.format(result))})
    .catch(error => {
      console.log(error);
      response.sendStatus(400).end();
    });
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const morgan = require('morgan');
morgan.token('body-json', (request, response) => {
  return JSON.stringify(request.body);
})

app.use(bodyParser.json());
app.use(morgan(':method :url :body-json :status :res[content-length] - :response-time ms'));

let persons = [
  {
    name: "Matti Manhanen",
    number: "050-0500500",
    id: 1
  },
  {
    name: "Sauli Siinistö",
    number: "040-0400400",
    id: 2
  },
  {
    name: "Pekka Paavisto",
    number: "030-0300300",
    id: 3
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id);

  let person = persons.find(person => person.id === id);

  if(person) {
    response.json(person);
  } else {
    response.sendStatus(404).end()
  }
})

app.get('/info', (request, response) => {
  response.send(
    `<p>
      puhelinluettelossa ${persons.length} henkilön tiedot
    </p>
    <p>
      ${new Date()}
    </p>`
  );
})

app.delete('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id);

  persons = persons.filter(person => person.id !== id);

  response.sendStatus(204).end();
})

app.post('/api/persons', (request, response) => {
  let body = request.body;

  let person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000000)
  };

  let errors = [];
  if(person.name == null) {
    errors.push('name required')
  }
  if(person.number == null) {
    errors.push('number required')
  }
  if(persons.find(existing => existing.name === person.name)) {
    errors.push('person already exists')
  }

  if (errors.length > 0) {
    response.status(400).json(errors.map(errorMessage => ({error: errorMessage}) ));
  } else {
    persons.push(person);
    response.json(person);
  }
})

app.listen(3001, () => {
  console.log('app started');
})
const express = require('express')
const app = express();


require('dotenv').config()



// MongoDB connection
const Persons = require('./models/phonebook')

// Middleware
app.use(express.json())
app.use(express.static('dist'))

const morgan = require('morgan')
morgan.token('body', (request, response) => {
  return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/info', async (request, response) => {
  const count = await Persons.countDocuments({})
  response.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
})

app.get("/api/persons", (request, response,next) => {
  Persons.find({})
    .then(res => {
      response.json(res)
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response,next) => {
  Persons.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})



app.delete('/api/persons/:id', (request, response,next) => {
  Persons.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const person = request.body
  Person.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response,next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or Number is missing'
    })
  }

  Persons.find({}).then(persons => {
    if (persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
  })

  const person = new Persons({
    name: body.name,
    number: body.number,
  })
  person.save().then(res => {
    response.json(res)
  })



})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`)
})
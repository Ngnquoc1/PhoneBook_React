const express=require('express')
const app= express();
app.use(express.json())

const morgan=require('morgan')
morgan.token('body',(request,response)=>{
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist'))

let persons=[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons",(request,response)=>{
    response.json(persons)
})


app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  
  const person = persons.find(person => Number(person.id) === id)

  console.log(`person: ${person}`)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people<p>${new Date()}`)
})

app.delete('/api/persons/:id',(request,response)=>{
    const id=Number(request.params.id)
    persons=persons.filter(person=> Number(person.id)===id)
    response.status(204).end()
})



const generateId = () => {
  return Math.floor(Math.random() * 99999)
}

app.post('/api/persons', (request,response)=>{
    const body=request.body
    
    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'Name or Number is missing'
        })
    }
    
    if (persons.find(person=>person.name.toLowerCase()===body.name.toLowerCase())){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person={
        id: generateId(),
        name:body.name,
        number: body.number,
    }
    persons=persons.concat(person)
    response.json(person)
})

const PORT=3001

app.listen(PORT,()=>{
    console.log(`Server is running on Port: ${PORT}`)
})
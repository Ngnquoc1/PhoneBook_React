const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://nhuquoc1104:${password}@cluster0.90kblpn.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

const name = process.argv[3]
const number = process.argv[4]


if (password) {
  mongoose.connect(url)
    .then(() => {
      //define schema
      const personSchema = new mongoose.Schema({
        name: String,
        number: String,
      })
      //define Model
      const Person = mongoose.model('person', personSchema)
      if (name && number) {
        const newPerson = new Person({
          name: name,
          number: number
        })

        newPerson.save().then(result => {
          console.log(`Added ${name} number ${number} to phonebook`)
          mongoose.connection.close()
        })
      }
      else {
        Person.find({})
          .then(result => {
            console.log("Phonebook:")
            result.forEach(p => console.log(`${p.name} ${p.number}`));
            mongoose.connection.close()
          })
      }
    })
    .catch(error => {
      console.error('Error:', error.message)
      mongoose.connection.close()
    })
}
else {
  onsole.log('Please provide password as argument: node mongo.js <password>')
  process.exit(1)
}
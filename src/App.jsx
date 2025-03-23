import { useState, useEffect } from 'react'
import axios from 'axios'
import backend from './backend'

const ShowPersons = ({persons, filter, click}) => {
  return (

    <div>
      <h1>Numbers</h1>
      <ul>
        {persons.map((person) => {
        if (person.name.toLowerCase().includes(filter.toLowerCase())) {
          return <li key={person.id}>{person.name} {person.number} <button id= {person.id}onClick={click}>Delete entry</button></li>
        }
      })}
      </ul>
    </div>
  )

}

const Notification = ({message}) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}



const App = () => {
  const [persons, setPersons] = useState([]) 

  useEffect(() => {

    const eventHandler = response => {
      console.log('promise done')
      setPersons(response.data)
    }

    axios
      .get('http://localhost:5001/api/persons')
      .then(eventHandler)
    
  console.log('I fire once')
  }, [])

  const [newFilter, setNewFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  const HandleFilterChange = (event) => {
    const addFilter = event.target.value
    setNewFilter(addFilter)
    console.log(addFilter)
  }

  const Handlechange = (event) => {
    const addName = event.target.value
    setNewName(addName)
    console.log(addName)
  }

  const Handlephone = (event) => {
    const addphone = event.target.value
    setNewPhone(addphone)
    console.log(addphone)
  }

const Handleclick = (event) => {
  event.preventDefault()
  console.log('button clicked', event.target)
  let isinbook = persons.some(person => newName === person.name)
  console.log(isinbook)
  if (isinbook) {
    if(window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
      const change_phone_user = (persons.findIndex(person => person.name === newName))

      const samepersonObject = {
        name: newName,
        number: newPhone,
        id: persons[change_phone_user].id
      }
      backend.update(persons[change_phone_user].id,samepersonObject)
      setNewName("")
      setNewPhone("")

      setPersons(persons.map(person => persons[change_phone_user].id === person.id ? samepersonObject : person ))
      
    } else {return null}

  } else {

    const personObject = {
    name: newName,
    number: newPhone,
    id: ((parseInt(persons[persons.length - 1].id)) + 1).toString()
  }
  const updatedPersons = persons.concat(personObject)
  backend.create(personObject)
    .then(response => { 
      setPersons(persons.concat(response.data))
    })
  setNewName('')
  setNewPhone('')
  console.log(updatedPersons)
}

}


const RemovePerson = (event) => {
  console.log('button clicked', event.target.id)
  const entry_id = event.target.id
  console.log(entry_id)

  if (window.confirm("Do you want to delete this?")) {

    const NewPersons = persons.filter(person => person.id !== entry_id)

    backend.remove(entry_id)
    .then(response => {
      setPersons(NewPersons)
      console.log(persons)
    }
    )
    console.log(NewPersons)

  }
  
}



  return (
    <div>
      <h2>Phonebook</h2>
      <div>Filter show with <input value={newFilter} onChange={HandleFilterChange}/></div>
      <br></br>
      <form>
        <div>
          name: <input value={newName} onChange={Handlechange} />
          <br></br>
          phone: <input value ={newPhone} onChange={Handlephone} />
        </div>
        <div>
          <button type="submit" onClick={Handleclick}>add</button>
        </div>
      </form>
      <ShowPersons persons={persons} filter={newFilter} click={RemovePerson} />
    </div>
  )
}

export default App
import { useEffect, useState } from 'react'
import Note from './components/Note'
import Footer from './components/Footer'
import noteService from './services/notes'




const App = (props) => {
	const [ notes, setNotes ] = useState([])
	const [ newNote, setNewNote ] = useState('a new note...')
	const [showAll, setShowAll] = useState(true)
	const [ errorMessage, setErrorMessage ] = useState('Some error happend');

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])


  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

	const deleteNote = (event, id) => {
		event.preventDefault()

		noteService 
			.remove(id)
			.then(() => {
				const newNotes = notes.filter(note => note.id !== id)
				setNotes(newNotes)
			})

	}

	const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

	const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

	const toggleImportantNotes = () => {
		setShowAll(!showAll)
		console.log(showAll);
	}

	const notesToShow = showAll
	? notes
	: notes.filter(note => note.important === true)

  return (
		<div>
			<h1>Notes</h1>
			<div>
        <button onClick={toggleImportantNotes}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
            <Note 
							key={note.id} 
							note={note}
							toggleImportance={() => toggleImportanceOf(note.id)}
							deleteNote={(event) => deleteNote(event, note.id)}
							 />
        )}
      </ul>
			<form onSubmit={addNote}>
			<input value={newNote} 
			 onChange={handleNoteChange}	
			/>
				<button type="submit">save</button>
			</form>
			<Footer />
		</div>
  );
}

export default App;

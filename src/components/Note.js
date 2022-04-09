const Note = ({ note, toggleImportance, deleteNote}) => {
  const label = note.important
    ? 'make not important' : 'make important'

		const NoteStyle = {
			color: 'grey',
			paddingTop: 5,
			fontSize: 15,
		}

  return (
    <li style={NoteStyle}>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
			<button onClick={deleteNote}>Delete</button>
    </li>
  )
}

export default Note


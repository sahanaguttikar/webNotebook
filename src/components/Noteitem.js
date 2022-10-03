import React from 'react'
import { useContext } from 'react';
import NoteContext from '../contexts/notes/NoteContext'

const Noteitem = (props) => {
  const contexts=useContext(NoteContext);
  const {deleteNote}=contexts;
    const {note,editNote}=props;
  return (
    <div className="col md-3">
        <div className="card  my-3">
  <div className="card-body">
    <h5 className="card-title">{note.title}</h5>
    <p className="card-text">{note.description}</p>
    <i className="fa-solid fa-trash mx-2" onClick={()=>{deleteNote(note._id);props.showAlert("deleted successfully","success");}}></i>
    <i className="fa-solid fa-pen-to-square mx-2" onClick={()=>{editNote(note)}}></i> 
  </div>
</div>
        </div>
  )
}

export default Noteitem
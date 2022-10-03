import React,{useState} from "react";
import NoteContext from "./NoteContext";

const NotesState=(props)=>{
  const host="http://localhost:5000"
    const notesInitial=[]    
    
    const [notes,setNotes]=useState(notesInitial)    
    //get notes
     const getNotes=async()=>{
       //api call
       const response = await fetch(`${host}/api/notes/fetchnotes`, {
         method: 'GET', 
         headers: {
           'Content-Type': 'application/json',
           "auth-token":localStorage.getItem('token')
          
         }
       });
       const json=await response.json();
       console.log(json);       
       setNotes(json);

    }
    
    //Add note
    const addNote=async(title,description,tag)=>{
      //api call
      const response = await fetch(`${host}/api/notes/addnotes`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          "auth-token":localStorage.getItem('token')
          
        },
        body: JSON.stringify({title,description,tag})
      });
      const note=await response.json();
      setNotes(notes.concat(note))
      

    }

    //delete
    const deleteNote=async(id)=>{
      //api call
      const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
          "auth-token":localStorage.getItem('token')
          
        }
      });

      const json=await response.json();
      console.log(json);
      console.log("deleteing note with id"+id);
        const newNotes=notes.filter((note)=>{return note._id!==id});
        setNotes(newNotes);
    }

    //update
    const updateNote=async(id,title,description,tag)=>{
      //api call
      const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          "auth-token":localStorage.getItem('token')
          
        },
        body: JSON.stringify({title,description,tag})
      });

      const json=await response.json();
      console.log(json);

      let newNote=JSON.parse(JSON.stringify(notes))
      //edit client      
      for (let index = 0; index < newNote.length; index++) {
        const element = newNote[index];
        if(element._id===id){
          newNote[index].title=title;
          newNote[index].description=description;
          newNote[index].tag=tag;
          break;
        }
        
      }
      setNotes(newNote);
      
    }
    
    return(
        <NoteContext.Provider value={{notes,addNote,deleteNote,updateNote,getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )

}

export default NotesState;
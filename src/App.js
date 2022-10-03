import './App.css';
import NotesState from './contexts/notes/NotesState';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';
import { useState } from 'react';

function App() {
  const [alert,setAlert]=useState(null);
  const showAlert=(message,type)=>{
    setAlert({
      meg:message,
      type:type
    })
    setTimeout(()=>{
      setAlert(null);      
    },1500);
  }
  return (
    <>
    <NotesState>
    <Router>
    <Navbar/>
    <Alert alert={alert}/>
    <div className="container">    
    <Routes>
          <Route exact path="/"element={<Home showAlert={showAlert}/>}></Route>         
          <Route  exact path="/about"element={<About/>}></Route>
          <Route  exact path="/login"element={<Login showAlert={showAlert}/>}></Route>
          <Route  exact path="/signup"element={<Signup showAlert={showAlert}/>}></Route>  
        </Routes>
        </div>
        </Router>
        </NotesState>
    </>
  );
}

export default App;
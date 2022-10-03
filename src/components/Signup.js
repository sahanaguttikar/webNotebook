import React ,{useState} from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {
  const [credentials, setCredentials] = useState({name:"",email:"",password:"",cpassword:""})
    let navigate=useNavigate();
    

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const {name,email,password}=credentials;
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json'
              
            },
            body: JSON.stringify({name,email,password})
          });          
          const json=await response.json();
          console.log(json);
          
          if(json.success){
             //redirect
             localStorage.setItem('token',json.token);
             navigate('/');
             props.showAlert("account has been created successfully","success");
          }
          else{
            props.showAlert("invalid credentials","danger");
          }
           
         
          
    }
    const onChange=(e)=>{
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    
      }
  return (
    <div className='mt-2'>
      <h2>Please create an account to secure your notes</h2>
    <form  onSubmit={handleSubmit}>
    <div className="mb-3">
            <label htmlFor="name" className='form-label'>Enter your name </label>
            <input type="text" className="form-control" onChange={onChange}  id="name" name='name'/>
            </div>
        <div className="mb-3">
            <label htmlFor="email" className='form-label'>Email address</label>
            <input type="email" className="form-control" onChange={onChange}  id="email" name='email' />
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group">
            <label htmlFor="password" className='form-label'>Password</label>
            <input type="password" className="form-control"  onChange={onChange} id="password" name='password'minLength={5} required />
        </div>
        <div className="form-group">
            <label htmlFor="cpassword" className='form-label'>confirm Password</label>
            <input type="password" className="form-control"  onChange={onChange} id="cpassword" name='cpassword' minLength={5} required />
        </div>
        <button type="submit" className="btn btn-primary my-2">Submit</button>
    </form>
</div>
  )
}

export default Signup
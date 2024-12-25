import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import toast from 'react-hot-toast';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let navigate = useNavigate();
  const location = useLocation();
  
  const fromSignup = location.state && location.state.fromSignup;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password })
    });
    
    const json = await response.json();
    if (json.success) {
      // Store email and token in localStorage
      localStorage.setItem('userEmail', credentials.email);
      localStorage.setItem('token', json.authToken);

      toast.success('Successfully Logged-In');
      navigate("/");
    } else {
      toast.error("Enter Valid Credentials");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ backgroundImage: 'url("https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', height: '100vh', backgroundSize: 'cover' }}>
      <NavBar hideHomeButton={true} hideExtraButtons={fromSignup} />
      <div className='container d-flex justify-content-center align-items-center' style={{position:"relative", top:"115px"}}>
        <form className='w-50 border bg-dark border-success rounded' style={{height:"306px"}} onSubmit={handleSubmit}>
          <div className="m-3">
            <label htmlFor="email" className="form-label text-light" style={{marginTop:"10px"}}>Email Address</label>
            <input type="email" className="form-control" name='email' value={credentials.email} onChange={onChange} aria-describedby="emailHelp" />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone.</div>
          </div>
          <div className="m-3">
            <label htmlFor="password" className="form-label text-light">Password</label>
            <input type="password" className="form-control" value={credentials.password} onChange={onChange} name='password' />
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="m-3 btn btn-success" style={{fontWeight:'bold'}}>LOGIN</button>
            <Link to="/signup" className="m-3 mx-1 btn btn-danger"  style={{fontWeight:'bold'}}>NEW USER</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

